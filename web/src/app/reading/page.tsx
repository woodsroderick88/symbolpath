import { useState, useCallback, useMemo, useEffect } from "react";
import { tarotCards } from "@/data/tarot-cards";
import { SPREAD_TYPES } from "@/data/spreads";
import { getRandomOracleCard } from "@/data/oracle-decks";
import { getAmbientPlayer, getAmbientForCards } from "@/utils/ambientAudio";
import { getMoonPhaseWeights } from "@/data/tarot-images";
import { SpreadSelection } from "@/components/TarotReading/SpreadSelection";
import { DrawingScreen } from "@/components/TarotReading/DrawingScreen";
import { ManualPickModal } from "@/components/TarotReading/ManualPickModal";
import { ReadingResults } from "@/components/TarotReading/ReadingResults";
import { OracleDeckSelection } from "@/components/TarotReading/OracleDeckSelection";
import { OracleResult } from "@/components/TarotReading/OracleResult";

export default function TarotReadingPage() {
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showManualPick, setShowManualPick] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [ambientEnabled, setAmbientEnabled] = useState(false);
  const [currentAmbient, setCurrentAmbient] = useState(null);
  const [spreadFilter, setSpreadFilter] = useState("all");
  const [view3DCard, setView3DCard] = useState(null);
  const [deckType, setDeckType] = useState("tarot");
  const [selectedOracleDeck, setSelectedOracleDeck] = useState(null);
  const [oracleResult, setOracleResult] = useState(null);
  const [moonPhaseName, setMoonPhaseName] = useState(null);
  // ── NEW: community spread loaded from the Spreads tab ──
  const [communitySpread, setCommunitySpread] = useState(null);
  // ── Reversals preference ──
  const [allowReversals, setAllowReversals] = useState(true);

  // Load reversals pref from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("tarot_allow_reversals");
    if (stored !== null) setAllowReversals(stored === "true");
  }, []);

  // Save reversals pref
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("tarot_allow_reversals", String(allowReversals));
  }, [allowReversals]);

  // Fetch moon phase at mount for weighted daily card draws
  useEffect(() => {
    fetch("/api/moon")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.current?.name) setMoonPhaseName(data.current.name);
      })
      .catch(() => {});
  }, []);

  // Load community spread from sessionStorage when navigated from /community
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("community")) {
      try {
        const stored = sessionStorage.getItem("communitySpread");
        if (stored) {
          const parsed = JSON.parse(stored);
          setCommunitySpread(parsed);
          sessionStorage.removeItem("communitySpread");
        }
      } catch (e) {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && showResults && drawnCards.length > 0) {
      const recommended = getAmbientForCards(drawnCards.map((d) => d.card));
      setCurrentAmbient(recommended);
      if (ambientEnabled) {
        const player = getAmbientPlayer();
        player?.play(recommended, 0.3);
      }
    }
  }, [showResults, drawnCards, ambientEnabled]);

  const toggleAmbient = () => {
    if (typeof window === "undefined") return;
    const player = getAmbientPlayer();
    if (!player) return;
    if (ambientEnabled) {
      player.stop();
      setAmbientEnabled(false);
    } else {
      if (currentAmbient) player.play(currentAmbient, 0.3);
      setAmbientEnabled(true);
    }
  };

  const currentSpread = useMemo(() => {
    if (communitySpread && communitySpread.id === selectedSpread)
      return communitySpread;
    return SPREAD_TYPES.find((s) => s.id === selectedSpread);
  }, [selectedSpread, communitySpread]);

  const drawRandom = useCallback(() => {
    if (!currentSpread) return;
    setIsDrawing(true);
    setShowResults(false);

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
    }, 900);
  }, [currentSpread, moonPhaseName, allowReversals]);

  const handleManualConfirm = (cards) => {
    setShowManualPick(false);
    setDrawnCards(cards);
    setShowResults(true);
  };

  const resetReading = useCallback(() => {
    if (typeof window !== "undefined") {
      const player = getAmbientPlayer();
      player?.stop();
      setAmbientEnabled(false);
    }
    setDrawnCards([]);
    setShowResults(false);
    setSelectedSpread(null);
    setShowManualPick(false);
  }, []);

  const saveReading = useCallback(
    async (aiNarrative) => {
      if (saving || savedId) return;
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
          ai_narrative: aiNarrative || null,
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
        console.error(e);
        setSaveError("Could not save reading");
      } finally {
        setSaving(false);
      }
    },
    [saving, savedId, currentSpread, drawnCards],
  );

  const filteredSpreads = useMemo(() => {
    const base =
      spreadFilter === "all"
        ? SPREAD_TYPES
        : SPREAD_TYPES.filter((s) => s.category === spreadFilter);
    if (communitySpread) return [communitySpread, ...base];
    return base;
  }, [spreadFilter, communitySpread]);

  const drawOracleCard = useCallback(
    (deckId) => {
      const targetDeck = deckId || selectedOracleDeck;
      if (!targetDeck) return;
      setSelectedOracleDeck(targetDeck);
      setOracleResult(null);
      setTimeout(() => {
        const card = getRandomOracleCard(targetDeck);
        setOracleResult(card);
        // Auto-save oracle draw to symbol stream
        if (card) {
          fetch("/api/readings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              spread_id: "oracle-" + targetDeck,
              spread_name: card.deck || "Oracle Draw",
              cards: [
                {
                  card: { id: "oracle-" + card.name, name: card.name },
                  position: "Oracle Message",
                },
              ],
              ai_narrative: card.meaning,
              source_type: "oracle_draw",
            }),
          }).catch(() => {});
        }
      }, 800);
    },
    [selectedOracleDeck],
  );

  const resetOracle = () => {
    setOracleResult(null);
    setSelectedOracleDeck(null);
  };

  // ── Oracle Reading Results ──
  if (deckType === "oracle" && oracleResult) {
    return (
      <OracleResult
        result={oracleResult}
        onDrawAnother={() => drawOracleCard()}
        onSwitchToTarot={() => {
          setDeckType("tarot");
          resetOracle();
        }}
        onBack={resetOracle}
      />
    );
  }

  // ── Oracle Deck Selection ──
  if (deckType === "oracle" && !oracleResult) {
    return (
      <OracleDeckSelection
        onSelectDeck={drawOracleCard}
        onSwitchToTarot={() => setDeckType("tarot")}
      />
    );
  }

  // ── Spread Selection ──
  if (!selectedSpread) {
    return (
      <SpreadSelection
        onSelectSpread={setSelectedSpread}
        onSwitchToOracle={() => setDeckType("oracle")}
        spreadFilter={spreadFilter}
        setSpreadFilter={setSpreadFilter}
        filteredSpreads={filteredSpreads}
        communitySpread={communitySpread}
        allowReversals={allowReversals}
        setAllowReversals={setAllowReversals}
      />
    );
  }

  // ── Method / Drawing Screen ──
  if (!showResults) {
    return (
      <>
        <DrawingScreen
          currentSpread={currentSpread}
          isDrawing={isDrawing}
          onDrawRandom={drawRandom}
          onDrawManual={() => setShowManualPick(true)}
          onBack={resetReading}
        />
        {showManualPick && (
          <ManualPickModal
            spread={currentSpread}
            onConfirm={handleManualConfirm}
            onClose={() => setShowManualPick(false)}
          />
        )}
      </>
    );
  }

  // ── Results ──
  return (
    <ReadingResults
      currentSpread={currentSpread}
      drawnCards={drawnCards}
      ambientEnabled={ambientEnabled}
      onToggleAmbient={toggleAmbient}
      savedId={savedId}
      saving={saving}
      saveError={saveError}
      onSaveReading={saveReading}
      onResetReading={resetReading}
      view3DCard={view3DCard}
      setView3DCard={setView3DCard}
      onDrawAgain={() => {
        setDrawnCards([]);
        setShowResults(false);
      }}
      moonPhaseName={moonPhaseName}
    />
  );
}
