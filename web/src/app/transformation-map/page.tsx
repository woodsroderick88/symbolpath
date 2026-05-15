"use client";
import { useState, useEffect } from "react";
import {
  Sparkles,
  Globe,
  Compass as CompassIcon,
  Droplet,
  Heart,
} from "lucide-react";

export default function TransformationMapPage() {
  const [traditions, setTraditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTradition, setSelectedTradition] = useState(null);

  useEffect(() => {
    loadTransformations();
  }, []);

  const loadTransformations = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/traditions?userId=anonymous");
      if (!response.ok) throw new Error("Failed to load transformation map");
      const data = await response.json();
      setTraditions(data.traditions);
      if (data.traditions.length > 0) {
        setSelectedTradition(data.traditions[0]);
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getTraditionIcon = (slug) => {
    switch (slug) {
      case "western":
        return Sparkles;
      case "ubuntu":
        return Heart;
      case "medicine_wheel":
        return CompassIcon;
      case "neidan":
        return Droplet;
      case "sufi_nafs":
        return Globe;
      default:
        return Sparkles;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your transformation map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Map
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={loadTransformations}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-white border-b border-purple-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Transformation Map
              </h1>
              <p className="text-gray-600 mt-1">
                Your journey across five wisdom traditions
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Sparkles className="w-4 h-4" />
              <span>Last 90 days</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tradition Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {traditions.map((tradition) => {
            const Icon = getTraditionIcon(tradition.slug);
            const isSelected = selectedTradition?.id === tradition.id;
            const hasData = tradition.userPosition.totalEvents > 0;

            return (
              <button
                key={tradition.id}
                onClick={() => setSelectedTradition(tradition)}
                className={`p-6 rounded-2xl text-center transition-all duration-300 ${
                  isSelected
                    ? "bg-white shadow-2xl scale-105 ring-2 ring-purple-500"
                    : "bg-white/70 hover:bg-white hover:shadow-lg"
                }`}
              >
                <Icon
                  className={`w-8 h-8 mx-auto mb-3 ${isSelected ? "text-purple-600" : "text-gray-400"}`}
                />
                <h3
                  className={`font-bold text-sm mb-1 ${isSelected ? "text-gray-900" : "text-gray-600"}`}
                >
                  {tradition.name}
                </h3>
                {hasData && (
                  <div className="text-xs text-purple-600 font-semibold">
                    {tradition.userPosition.totalEvents} events
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Tradition Detail */}
        {selectedTradition && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Tradition Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">
                    {selectedTradition.name}
                  </h2>
                  <p className="text-purple-100 text-lg mb-4">
                    {selectedTradition.description}
                  </p>
                  {selectedTradition.metadata?.origin && (
                    <div className="text-sm text-purple-200">
                      Origin: {selectedTradition.metadata.origin}
                    </div>
                  )}
                </div>
                {selectedTradition.userPosition.dominantStageData && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 ml-6 min-w-[240px]">
                    <div className="text-xs uppercase tracking-wide text-purple-200 mb-1">
                      Your Current Position
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {selectedTradition.userPosition.dominantStageData.name}
                    </div>
                    <div className="text-sm text-purple-100">
                      {
                        selectedTradition.userPosition.dominantStageData
                          .description
                      }
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Stage Journey */}
            <div className="p-8">
              {selectedTradition.userPosition.totalEvents === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🌱</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No Journey Data Yet
                  </h3>
                  <p className="text-gray-600">
                    Complete tarot readings, astrology charts, or other
                    experiences to see your position in this tradition.
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Stage Progression */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-6">
                      {selectedTradition.metadata?.structure ===
                      "Cyclical, not hierarchical"
                        ? "Directional Distribution"
                        : "Stage Progression"}
                    </h3>
                    <div className="space-y-4">
                      {selectedTradition.stages.map((stage, index) => {
                        const distribution =
                          selectedTradition.userPosition.stageDistribution[
                            stage.key
                          ];
                        const count = distribution?.count || 0;
                        const percentage = distribution?.percentage || 0;
                        const isActive = count > 0;
                        const isDominant =
                          selectedTradition.userPosition.dominantStage ===
                          stage.key;

                        return (
                          <div
                            key={stage.key}
                            className={`relative p-5 rounded-xl border-2 transition-all ${
                              isDominant
                                ? "border-purple-500 bg-purple-50"
                                : isActive
                                  ? "border-gray-300 bg-gray-50"
                                  : "border-gray-200 bg-white"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-4 h-4 rounded-full"
                                  style={{ backgroundColor: stage.color }}
                                ></div>
                                <div>
                                  <h4 className="font-bold text-gray-900">
                                    {stage.name}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {stage.description}
                                  </p>
                                </div>
                              </div>
                              {isActive && (
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-purple-600">
                                    {percentage}%
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {count} symbols
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Progress bar */}
                            {isActive && (
                              <div className="mt-3">
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            )}

                            {/* Stage Symbols */}
                            {distribution?.symbols &&
                              distribution.symbols.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {distribution.symbols
                                    .slice(0, 6)
                                    .map((symbolData, idx) => (
                                      <div
                                        key={idx}
                                        className="px-3 py-1 bg-white rounded-full text-xs text-gray-700 border border-gray-200"
                                      >
                                        {symbolData.symbol}
                                      </div>
                                    ))}
                                  {distribution.symbols.length > 6 && (
                                    <div className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-500">
                                      +{distribution.symbols.length - 6} more
                                    </div>
                                  )}
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Symbols */}
                  {selectedTradition.userPosition.recentSymbols.length > 0 && (
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Recent Symbol Events
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedTradition.userPosition.recentSymbols.map(
                          (symbol, idx) => (
                            <div
                              key={idx}
                              className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100"
                            >
                              <div className="font-bold text-gray-900 mb-1">
                                {symbol.symbol}
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(symbol.date).toLocaleDateString()}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Each tradition offers a unique lens on your symbolic journey.</p>
          <p className="mt-1">
            The same experiences interpreted through different wisdom
            frameworks.
          </p>
        </div>
      </div>
    </div>
  );
}
