import { useState, useCallback, useMemo, useEffect } from "react";
import { tarotCards } from "@/data/tarot-cards";
import { SPREAD_TYPES } from "@/data/spreads";
import { getRandomOracleCard } from "@/data/oracle-decks";
import { getAmbientPlayer, getAmbientForCards } from "@/utils/ambientAudio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import {
  fetchWithCache,
  queueReadingForSync,
  syncPendingReadings,
  CACHE_KEYS,
} from "@/utils/offlineCache";

function getMoonPhaseWeights(phaseName) {
  const p = (phaseName || "").toLowerCase();
  if (p.includes("new moon"))
    return (c) => (c.arcana === "major" || c.id.includes("ace") ? 4 : 1);
  if (p.includes("waxing crescent")) return (c) => (c.suit === "wands" ? 3 : 1);
  if (p.includes("first quarter"))
    return (c) => (c.suit === "wands" || c.suit === "pentacles" ? 2 : 1);
  if (p.includes("waxing gibbous"))
    return (c) => (c.arcana === "major" ? 2 : 1);
  if (p.includes("full moon")) return (c) => (c.suit === "cups" ? 4 : 1);
  if (p.includes("waning gibbous")) return (c) => (c.suit === "cups" ? 2 : 1);
  if (p.includes("last quarter") || p.includes("third quarter"))
    return (c) => (c.suit === "swords" ? 3 : 1);
  if (p.includes("waning crescent"))
    return (c) =>
      [
        "the_hermit",
        "the_moon",
        "the_hanged_man",
        "the_high_priestess",
      ].includes(c.id) || c.suit === "swords"
        ? 4
        : 1;
  return () => 1;
}

export function useReadingState() {
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [mode, setMode] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [currentAmbient, setCurrentAmbient] = useState(null);
  const [spreadFilter, setSpreadFilter] = useState("all");
  const [deckType, setDeckType] = useState("tarot");
  const [selectedOracleDeck, setSelectedOracleDeck] = useState(null);
  const [oracleResult, setOracleResult] = useState(null);
  const [moonPhaseName, setMoonPhaseName] = useState(null);
  const [allowReversals, setAllowReversals] = useState(true);

  // Load reversals preference
  useEffect(() => {
    AsyncStorage.getItem("tarot_allow_reversals")
      .then((val) => {
        if (val !== null) setAllowReversals(val === "true");
      })
      .catch(() => {});
  }, []);

  const toggleReversals = useCallback(async (val) => {
    setAllowReversals(val);
    try {
      await AsyncStorage.setItem("tarot_allow_reversals", String(val));
    } catch {}
  }, []);

  // Fetch moon phase at mount (with offline cache)
  useEffect(() => {
    fetchWithCache("/api/moon", CACHE_KEYS.MOON_DATA)
      .then(({ data }) => {
        if (data?.current?.name) setMoonPhaseName(data.current.name);
      })
      .catch(() => {});
  }, []);

  // Try to sync pending readings on mount
  useEffect(() => {
    syncPendingReadings()
      .then((result) => {
        if (result.synced > 0)
          console.log(`Synced ${result.synced} pending readings`);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (showResults && drawnCards.length > 0) {
      const recommended = getAmbientForCards(drawnCards.map((d) => d.card));
      setCurrentAmbient(recommended);
      if (ambientEnabled) {
        const player = getAmbientPlayer();
        player?.play(recommended, 0.3);
      }
    }
  }, [showResults, drawnCards, ambientEnabled]);

  const currentSpread = useMemo(
    () => SPREAD_TYPES.find((s) => s.id === selectedSpread),
    [selectedSpread],
  );

  const drawRandom = useCallback(() => {
    if (!currentSpread) return;
    setIsDrawing(true);
    setShowResults(false);

    // Haptic shuffle feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    // Moon-phase weighted draw for daily card
    let cardPool = [...tarotCards];
    if (currentSpread.id === "daily" && moonPhaseName) {
      const weightFn = getMoonPhaseWeights(moonPhaseName);
      cardPool = cardPool.flatMap((card) => Array(weightFn(card)).fill(card));
    }

    const drawn = cardPool
      .sort(() => Math.random() - 0.5)
      .slice(0, currentSpread.positions.length)
      .map((card) => ({
        card,
        isReversed: allowReversals ? Math.random() > 0.5 : false,
      }));
    setTimeout(() => {
      setDrawnCards(drawn);
      setIsDrawing(false);
      setShowResults(true);
      // Haptic feedback when cards are ready
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 900);
  }, [currentSpread, moonPhaseName, allowReversals]);

  const handleManualConfirm = (cards) => {
    setDrawnCards(cards);
    setMode("random");
    setShowResults(true);
  };

  const saveReading = useCallback(async () => {
    if (saving || savedId || !currentSpread) return;
    setSaving(true);
    setSaveError(null);
    try {
      const payload = {
        spread_id: currentSpread.id,
        spread_name: currentSpread.name,
        cards: drawnCards.map((d, i) => ({
          card: { id: d.card.id, name: d.card.name },
          isReversed: d.isReversed,
          position: currentSpread.positions[i]?.name,
        })),
      };
      const res = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      setSavedId(saved.id);
    } catch (e) {
      console.warn("Online save failed, queuing for sync:", e.message);
      const payload = {
        spread_id: currentSpread.id,
        spread_name: currentSpread.name,
        cards: drawnCards.map((d, i) => ({
          card: { id: d.card.id, name: d.card.name },
          isReversed: d.isReversed,
          position: currentSpread.positions[i]?.name,
        })),
      };
      const queued = await queueReadingForSync(payload);
      if (queued) {
        setSavedId("queued");
        setSaveError(null);
      } else {
        setSaveError("Could not save");
      }
    } finally {
      setSaving(false);
    }
  }, [saving, savedId, currentSpread, drawnCards]);

  const resetReading = useCallback(async () => {
    const player = getAmbientPlayer();
    await player?.stop();
    setAmbientEnabled(false);
    setDrawnCards([]);
    setShowResults(false);
    setSelectedSpread(null);
    setMode(null);
    setSavedId(null);
    setSaving(false);
    setSaveError(null);
  }, []);

  const toggleAmbient = async () => {
    const player = getAmbientPlayer();
    if (!player) return;

    if (ambientEnabled) {
      await player.stop();
      setAmbientEnabled(false);
    } else {
      if (currentAmbient) {
        await player.play(currentAmbient, 0.3);
      }
      setAmbientEnabled(true);
    }
  };

  const drawOracleCard = useCallback(
    (deckId) => {
      const targetDeck = deckId || selectedOracleDeck;
      if (!targetDeck) return;
      setSelectedOracleDeck(targetDeck);
      setOracleResult(null);
      setTimeout(() => {
        const card = getRandomOracleCard(targetDeck);
        setOracleResult(card);
      }, 600);
    },
    [selectedOracleDeck],
  );

  const resetOracle = () => {
    setOracleResult(null);
    setSelectedOracleDeck(null);
  };

  return {
    selectedSpread,
    setSelectedSpread,
    mode,
    setMode,
    drawnCards,
    setDrawnCards,
    isDrawing,
    showResults,
    setShowResults,
    savedId,
    saving,
    saveError,
    ambientEnabled,
    currentAmbient,
    spreadFilter,
    setSpreadFilter,
    deckType,
    setDeckType,
    selectedOracleDeck,
    oracleResult,
    currentSpread,
    drawRandom,
    handleManualConfirm,
    saveReading,
    resetReading,
    toggleAmbient,
    drawOracleCard,
    resetOracle,
    moonPhaseName,
    allowReversals,
    toggleReversals,
  };
}
