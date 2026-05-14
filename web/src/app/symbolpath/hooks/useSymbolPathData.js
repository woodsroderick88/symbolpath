import { useState, useEffect, useCallback } from "react";
import useUser from "@/utils/useUser";

export function useSymbolPathData() {
  const [compass, setCompass] = useState(null);
  const [patterns, setPatterns] = useState(null);
  const [insights, setInsights] = useState(null);
  const [events, setEvents] = useState([]);
  const [symbols, setSymbols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [needsMore, setNeedsMore] = useState(false);

  // Get authenticated user
  const { data: user, loading: userLoading } = useUser();

  const loadAll = useCallback(async () => {
    if (userLoading) return; // Wait for user data to load

    setLoading(true);
    try {
      const [compassRes, engineRes, insightsRes, symbolsRes] =
        await Promise.all([
          fetch("/api/symbolpath/compass"),
          fetch("/api/symbolpath/engine?limit=50"),
          fetch("/api/symbolpath/insights"),
          fetch("/api/archetypes"),
        ]);
      if (!compassRes.ok || !engineRes.ok) throw new Error("API error");
      const [compassData, engineData, insightsData, symbolsData] =
        await Promise.all([
          compassRes.json(),
          engineRes.json(),
          insightsRes.json(),
          symbolsRes.json(),
        ]);
      setCompass(compassData.compass);
      setNeedsMore(compassData.needsMore || engineData.needsMore);
      setPatterns(engineData.patterns);
      setEvents(engineData.events || []);
      setInsights(insightsData.insights);
      const rawSymbols = Array.isArray(symbolsData)
        ? symbolsData
        : symbolsData?.archetypes || [];
      setSymbols(rawSymbols);
    } catch (e) {
      console.error("SymbolPath load error:", e);
    } finally {
      setLoading(false);
    }
  }, [userLoading]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    compass,
    patterns,
    insights,
    events,
    symbols,
    loading: loading || userLoading,
    needsMore,
    reload: loadAll,
  };
}
