"use client";
// Astrology page with cosmic insights
import { useState, useEffect } from "react";
import ZodiacWheel from "@/components/ZodiacWheel";

export default function AstrologyPage() {
  const [birthCharts, setBirthCharts] = useState([]);
  const [astroData, setAstroData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthLocation, setBirthLocation] = useState("");
  const [ingresses, setIngresses] = useState([]);
  const [emittedTransits, setEmittedTransits] = useState({});

  useEffect(() => {
    fetchBirthCharts();
    fetchTransits();
  }, []);

  const fetchBirthCharts = async () => {
    try {
      const response = await fetch("/api/birth-charts");
      if (!response.ok) throw new Error("Failed to fetch birth charts");
      const data = await response.json();
      setBirthCharts(data.charts || []);

      if (data.charts && data.charts.length > 0) {
        fetchAstroData(data.charts[0].birth_date);
      }
    } catch (error) {
      console.error("Error fetching birth charts:", error);
    }
  };

  const fetchTransits = async () => {
    try {
      const response = await fetch("/api/astrology");
      if (!response.ok) throw new Error("Failed to fetch transits");
      const data = await response.json();
      setAstroData(data);
      setIngresses(data.ingresses || []);
    } catch (error) {
      console.error("Error fetching transits:", error);
    }
  };

  const fetchAstroData = async (date) => {
    try {
      const response = await fetch(`/api/astrology?birthDate=${date}`);
      if (!response.ok) throw new Error("Failed to fetch astrology data");
      const data = await response.json();
      setAstroData(data);
    } catch (error) {
      console.error("Error fetching astrology data:", error);
    }
  };

  const createBirthChart = async () => {
    if (!birthDate) return;

    try {
      const response = await fetch("/api/birth-charts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          birth_date: birthDate,
          birth_time: birthTime || null,
          birth_location: birthLocation || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to create birth chart");

      setBirthDate("");
      setBirthTime("");
      setBirthLocation("");
      setShowForm(false);
      fetchBirthCharts();
    } catch (error) {
      console.error("Error creating birth chart:", error);
    }
  };

  const emitTransitEvent = async (ingress) => {
    try {
      const response = await fetch("/api/astrology", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planet: ingress.planet,
          type: ingress.type,
          fromSign: ingress.fromSign,
          toSign: ingress.toSign,
        }),
      });
      if (!response.ok) throw new Error("Failed to emit transit event");
      const data = await response.json();
      setEmittedTransits((prev) => ({ ...prev, [ingress.planet]: data.event }));
    } catch (error) {
      console.error("Error emitting transit event:", error);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white">
      {/* Navigation */}
      <nav className="bg-[#1F1535] border-b border-[#7C3AED] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#C084FC]">Cosmic Insights</h1>
          <div className="flex gap-6">
            <a
              href="/"
              className="text-gray-300 hover:text-[#C084FC] transition-colors"
            >
              Readings
            </a>
            <a
              href="/moon"
              className="text-gray-300 hover:text-[#C084FC] transition-colors"
            >
              Moon
            </a>
            <a href="/astrology" className="text-[#C084FC] font-semibold">
              Astrology
            </a>
            <a
              href="/journal"
              className="text-gray-300 hover:text-[#C084FC] transition-colors"
            >
              Journal
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8 py-8">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-4xl font-bold text-[#C084FC] mb-2">
            Cosmic Insights
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Align your readings with the stars
          </p>
        </div>

        {/* Interactive Zodiac Wheel */}
        <div className="max-w-3xl mx-auto mb-12">
          <h3 className="text-xl font-bold text-[#C084FC] mb-4 text-center">
            Your Zodiac Wheel
          </h3>
          <ZodiacWheel
            sunSign={astroData?.sunSign?.name || null}
            moonSign={astroData?.moonSign?.name || null}
            risingSign={null}
          />
          <p className="text-center text-gray-500 text-xs mt-3">
            {astroData?.sunSign
              ? "Your Sun and Moon signs are highlighted in gold"
              : "Add your birth chart to highlight your signs"}
          </p>
        </div>

        {/* Birth Chart Section */}
        {birthCharts.length === 0 ? (
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-[#1F1535] border border-[#7C3AED] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[#C084FC] mb-4">
                Create Your Birth Chart
              </h3>
              <p className="text-gray-400 mb-6">
                Enter your birth details to receive personalized astrological
                insights
              </p>

              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Get Started
                </button>
              ) : (
                <div>
                  <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-2">
                      Birth Date
                    </label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full bg-[#0F0A1E] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-300 mb-2">
                      Birth Time (Optional)
                    </label>
                    <input
                      type="time"
                      value={birthTime}
                      onChange={(e) => setBirthTime(e.target.value)}
                      className="w-full bg-[#0F0A1E] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm text-gray-300 mb-2">
                      Birth Location (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="New York, USA"
                      value={birthLocation}
                      onChange={(e) => setBirthLocation(e.target.value)}
                      className="w-full bg-[#0F0A1E] text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                    />
                  </div>

                  <button
                    onClick={createBirthChart}
                    className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-6 rounded-xl transition-colors"
                  >
                    Create Chart
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {astroData?.sunSign && (
              <>
                {/* Sun Sign */}
                <div className="bg-[#1F1535] border border-[#7C3AED] rounded-2xl p-8">
                  <p className="text-sm text-[#C084FC] mb-2">Sun Sign</p>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {astroData.sunSign.symbol} {astroData.sunSign.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Element: {astroData.sunSign.element}
                  </p>
                  {astroData.sunPersonality && (
                    <div>
                      <p className="text-white mb-3">
                        <span className="font-semibold">Traits:</span>{" "}
                        {astroData.sunPersonality.traits.join(", ")}
                      </p>
                      <p className="text-[#C084FC]">
                        <span className="font-semibold">Reading Focus:</span>{" "}
                        {astroData.sunPersonality.readingFocus}
                      </p>
                    </div>
                  )}
                </div>

                {/* Moon Sign */}
                <div className="bg-[#1F1535] rounded-2xl p-8">
                  <p className="text-sm text-[#C084FC] mb-2">Moon Sign</p>
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {astroData.moonSign.symbol} {astroData.moonSign.name}
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Element: {astroData.moonSign.element}
                  </p>
                  {astroData.moonPersonality && (
                    <div>
                      <p className="text-white mb-3">
                        <span className="font-semibold">Traits:</span>{" "}
                        {astroData.moonPersonality.traits.join(", ")}
                      </p>
                      <p className="text-[#C084FC]">
                        <span className="font-semibold">Emotional Focus:</span>{" "}
                        {astroData.moonPersonality.readingFocus}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* Current Transits */}
        {astroData?.transits && astroData.transits.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#C084FC] mb-6">
              Current Transits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {astroData.transits.map((transit, index) => (
                <div key={index} className="bg-[#1F1535] rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">⚠️</div>
                    <div>
                      <h4 className="font-bold text-white mb-1">
                        {transit.planet} Retrograde
                      </h4>
                      <p className="text-sm text-gray-400">
                        {transit.influence}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Planetary Ingresses */}
        {ingresses.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-[#C084FC] mb-6">
              Planetary Ingresses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ingresses.map((ingress, index) => (
                <div
                  key={index}
                  className="bg-[#1F1535] border border-[#7C3AED] rounded-xl p-6"
                >
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{ingress.visual}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-1">
                        {ingress.planet} enters {ingress.toSign}
                      </h4>
                      <p className="text-sm text-gray-400 mb-1">
                        From {ingress.fromSign} → {ingress.toSign} (
                        {ingress.element})
                      </p>
                      <p className="text-sm text-[#C084FC] mb-3">
                        {ingress.influence}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                        <span className="bg-[#0F0A1E] px-2 py-1 rounded">
                          Symbol: {ingress.symbol}
                        </span>
                        <span className="bg-[#0F0A1E] px-2 py-1 rounded">
                          Stage: {ingress.stage}
                        </span>
                      </div>
                      {emittedTransits[ingress.planet] ? (
                        <div className="text-xs text-green-400">
                          ✓ Symbol event recorded
                        </div>
                      ) : (
                        <button
                          onClick={() => emitTransitEvent(ingress)}
                          className="text-sm bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Record Transit Event
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Astrological Guidance */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#1F1535] border border-[#7C3AED] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#C084FC] mb-4">
              Reading Guidance
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Your cosmic blueprint influences how you interpret the cards. Pay
              attention to themes of{" "}
              <span className="text-[#C084FC] font-semibold">
                {astroData?.sunPersonality?.readingFocus || "self-discovery"}
              </span>{" "}
              in your readings. The stars guide your journey through the tarot.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
