"use client";

import { useState, useEffect } from "react";

const MOON_VIDEO_URL =
  "https://raw.createusercontent.com/0b3125a2-10a7-415b-a8e7-31227ec12edd/";

export default function MoonPage() {
  const [moonData, setMoonData] = useState(null);
  const [rituals, setRituals] = useState([]);
  const [intentions, setIntentions] = useState([]);
  const [showRitualForm, setShowRitualForm] = useState(false);
  const [showIntentionForm, setShowIntentionForm] = useState(false);
  const [ritualTitle, setRitualTitle] = useState("");
  const [ritualDescription, setRitualDescription] = useState("");
  const [intentionText, setIntentionText] = useState("");

  useEffect(() => {
    fetchMoonData();
    fetchRituals();
    fetchIntentions();
  }, []);

  const fetchMoonData = async () => {
    try {
      const response = await fetch("/api/moon");
      if (!response.ok) throw new Error("Failed to fetch moon data");
      const data = await response.json();
      setMoonData(data);
    } catch (error) {
      console.error("Error fetching moon data:", error);
    }
  };

  const fetchRituals = async () => {
    try {
      const response = await fetch("/api/rituals");
      if (!response.ok) throw new Error("Failed to fetch rituals");
      const data = await response.json();
      setRituals(data.rituals || []);
    } catch (error) {
      console.error("Error fetching rituals:", error);
    }
  };

  const fetchIntentions = async () => {
    try {
      const response = await fetch("/api/intentions");
      if (!response.ok) throw new Error("Failed to fetch intentions");
      const data = await response.json();
      setIntentions(data.intentions || []);
    } catch (error) {
      console.error("Error fetching intentions:", error);
    }
  };

  const createRitual = async () => {
    if (!ritualTitle || !moonData) return;

    try {
      const response = await fetch("/api/rituals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moon_phase: moonData.current.name,
          title: ritualTitle,
          description: ritualDescription,
        }),
      });

      if (!response.ok) throw new Error("Failed to create ritual");

      setRitualTitle("");
      setRitualDescription("");
      setShowRitualForm(false);
      fetchRituals();
    } catch (error) {
      console.error("Error creating ritual:", error);
    }
  };

  const createIntention = async () => {
    if (!intentionText || !moonData) return;

    try {
      const response = await fetch("/api/intentions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          moon_phase: moonData.current.name,
          intention: intentionText,
        }),
      });

      if (!response.ok) throw new Error("Failed to create intention");

      setIntentionText("");
      setShowIntentionForm(false);
      fetchIntentions();
    } catch (error) {
      console.error("Error creating intention:", error);
    }
  };

  const deleteRitual = async (id) => {
    try {
      const response = await fetch(`/api/rituals/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete ritual");
      fetchRituals();
    } catch (error) {
      console.error("Error deleting ritual:", error);
    }
  };

  const toggleIntention = async (intention) => {
    try {
      const response = await fetch(`/api/intentions/${intention.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !intention.completed }),
      });
      if (!response.ok) throw new Error("Failed to update intention");
      fetchIntentions();
    } catch (error) {
      console.error("Error updating intention:", error);
    }
  };

  const startMoonReading = () => {
    if (moonData?.recommendedSpread) {
      const params = new URLSearchParams({
        spreadId: moonData.recommendedSpread.spreadId,
        spreadName: moonData.recommendedSpread.spreadName,
        positions: JSON.stringify(moonData.recommendedSpread.positions),
      });
      window.location.href = `/reading?${params.toString()}`;
    }
  };

  if (!moonData) {
    return (
      <div className="min-h-screen bg-[#0F0A1E] flex items-center justify-center">
        <p className="text-[#C084FC] text-lg">Loading lunar data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0A1E] text-white">
      {/* Navigation */}
      <nav className="bg-[#1F1535] border-b border-[#7C3AED] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#C084FC]">Lunar Journey</h1>
          <div className="flex gap-6">
            <a
              href="/"
              className="text-gray-300 hover:text-[#C084FC] transition-colors"
            >
              Readings
            </a>
            <a href="/moon" className="text-[#C084FC] font-semibold">
              Moon
            </a>
            <a
              href="/astrology"
              className="text-gray-300 hover:text-[#C084FC] transition-colors"
            >
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
        {/* Moon Phase Display with Video Background */}
        <div
          className="relative mb-12 rounded-2xl overflow-hidden"
          style={{ minHeight: 320 }}
        >
          {/* Video background */}
          <video
            src={MOON_VIDEO_URL}
            autoPlay
            loop
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
              zIndex: 0,
            }}
          />
          {/* Gradient overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(15,10,30,0.3) 0%, rgba(15,10,30,0.7) 60%, rgba(15,10,30,1) 100%)",
              zIndex: 1,
            }}
          />
          {/* Content */}
          <div
            className="relative text-center py-16 px-4"
            style={{ zIndex: 2 }}
          >
            <div className="text-8xl mb-4">{moonData.current.emoji}</div>
            <h2 className="text-4xl font-bold text-[#C084FC] mb-2">
              {moonData.current.name}
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {moonData.current.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Moon Reading Recommendation */}
          <div className="bg-[#1F1535] border border-[#7C3AED] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#C084FC] mb-4">
              Recommended Reading
            </h3>
            <h4 className="text-xl text-white mb-2">
              {moonData.recommendedSpread.spreadName}
            </h4>
            <p className="text-gray-400 mb-6">
              {moonData.recommendedSpread.theme}
            </p>
            <button
              onClick={startMoonReading}
              className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              Begin Moon Reading
            </button>
          </div>

          {/* Upcoming Moon Phases */}
          <div className="bg-[#1F1535] rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-[#C084FC] mb-4">
              Upcoming Phases
            </h3>
            <div className="space-y-3">
              {moonData.upcoming.map((phase, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-[#0F0A1E] rounded-xl p-4"
                >
                  <div className="text-4xl">{phase.emoji}</div>
                  <div className="flex-1">
                    <p className="font-bold text-white">{phase.name}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(phase.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Intentions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-[#C084FC]">Intentions</h3>
              <button
                onClick={() => setShowIntentionForm(!showIntentionForm)}
                className="text-[#C084FC] hover:text-[#A855F7] text-2xl"
              >
                +
              </button>
            </div>

            {showIntentionForm && (
              <div className="bg-[#1F1535] rounded-xl p-6 mb-4">
                <textarea
                  placeholder="Set your intention..."
                  value={intentionText}
                  onChange={(e) => setIntentionText(e.target.value)}
                  className="w-full bg-[#0F0A1E] text-white rounded-lg p-3 mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
                <button
                  onClick={createIntention}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Set Intention
                </button>
              </div>
            )}

            <div className="space-y-3">
              {intentions.map((intention) => (
                <div
                  key={intention.id}
                  onClick={() => toggleIntention(intention)}
                  className={`bg-[#1F1535] rounded-xl p-4 cursor-pointer hover:bg-[#2A1F47] transition-colors ${
                    intention.completed ? "opacity-60" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#C084FC] mb-1">
                        {intention.moon_phase}
                      </p>
                      <p
                        className={`text-white ${intention.completed ? "line-through" : ""}`}
                      >
                        {intention.intention}
                      </p>
                    </div>
                    <div className="text-2xl">
                      {intention.completed ? "✓" : "○"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rituals Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-[#C084FC]">Ritual Log</h3>
              <button
                onClick={() => setShowRitualForm(!showRitualForm)}
                className="text-[#C084FC] hover:text-[#A855F7] text-2xl"
              >
                +
              </button>
            </div>

            {showRitualForm && (
              <div className="bg-[#1F1535] rounded-xl p-6 mb-4">
                <input
                  placeholder="Ritual title..."
                  value={ritualTitle}
                  onChange={(e) => setRitualTitle(e.target.value)}
                  className="w-full bg-[#0F0A1E] text-white rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
                <textarea
                  placeholder="Description..."
                  value={ritualDescription}
                  onChange={(e) => setRitualDescription(e.target.value)}
                  className="w-full bg-[#0F0A1E] text-white rounded-lg p-3 mb-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                />
                <button
                  onClick={createRitual}
                  className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-bold py-2 px-4 rounded-lg transition-colors"
                >
                  Save Ritual
                </button>
              </div>
            )}

            <div className="space-y-3">
              {rituals.map((ritual) => (
                <div key={ritual.id} className="bg-[#1F1535] rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-xs text-[#C084FC] mb-1">
                        {ritual.moon_phase}
                      </p>
                      <h4 className="font-bold text-white mb-2">
                        {ritual.title}
                      </h4>
                      {ritual.description && (
                        <p className="text-gray-400 text-sm">
                          {ritual.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteRitual(ritual.id)}
                      className="text-red-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
