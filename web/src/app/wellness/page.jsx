"use client";

import { useState, useEffect } from "react";
import { Heart, Wind, Smile, Sparkles, Play, Pause } from "lucide-react";

export default function WellnessPage() {
  const [affirmation, setAffirmation] = useState("");
  const [breathingExercise, setBreathingExercise] = useState(null);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState(0);
  const [moodBefore, setMoodBefore] = useState("");
  const [moodAfter, setMoodAfter] = useState("");
  const [notes, setNotes] = useState("");
  const [breathScale, setBreathScale] = useState(1);

  useEffect(() => {
    loadDailyAffirmation();
    loadBreathingExercise();
  }, []);

  useEffect(() => {
    if (isBreathing && breathingExercise) {
      runBreathingCycle();
    }
  }, [isBreathing, breathPhase]);

  const loadDailyAffirmation = async () => {
    try {
      const response = await fetch("/api/wellness/affirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardName: "The Star",
          cardMeaning: "Hope, inspiration, and spiritual guidance",
        }),
      });
      const data = await response.json();
      setAffirmation(data.affirmation);
    } catch (error) {
      console.error("Error loading affirmation:", error);
      setAffirmation("I am open to the wisdom of the universe.");
    }
  };

  const loadBreathingExercise = async () => {
    try {
      const response = await fetch("/api/wellness/breathing?cardName=The Star");
      const data = await response.json();
      setBreathingExercise(data);
    } catch (error) {
      console.error("Error loading breathing exercise:", error);
    }
  };

  const runBreathingCycle = () => {
    if (!breathingExercise || !isBreathing) return;

    const currentPhase =
      breathingExercise.pattern[breathPhase % breathingExercise.pattern.length];

    const targetScale =
      currentPhase.phase === "inhale"
        ? 1.3
        : currentPhase.phase === "exhale"
          ? 0.8
          : 1;
    setBreathScale(targetScale);

    setTimeout(() => {
      if (isBreathing) {
        setBreathPhase((prev) => prev + 1);
      }
    }, currentPhase.duration * 1000);
  };

  const toggleBreathing = () => {
    setIsBreathing(!isBreathing);
    if (!isBreathing) {
      setBreathPhase(0);
    } else {
      setBreathScale(1);
    }
  };

  const speakAffirmation = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(affirmation);
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(affirmation);
    }
  };

  const saveMoodLog = async () => {
    try {
      await fetch("/api/mood-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "anonymous",
          moodBefore,
          moodAfter,
          affirmation,
          notes,
        }),
      });

      setMoodBefore("");
      setMoodAfter("");
      setNotes("");
      alert("Mood logged successfully!");
    } catch (error) {
      console.error("Error saving mood log:", error);
    }
  };

  const getCurrentInstruction = () => {
    if (!breathingExercise || !isBreathing) return "Click play to begin";
    const currentPhase =
      breathingExercise.pattern[breathPhase % breathingExercise.pattern.length];
    return currentPhase.instruction;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Wellness</h1>
          <p className="text-gray-400">Mindfulness and self-care practices</p>
        </div>

        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-purple-600 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles size={28} className="text-yellow-500" />
            <h2 className="text-2xl font-semibold text-white">
              Daily Affirmation
            </h2>
          </div>

          <p className="text-gray-200 text-lg italic mb-6 leading-relaxed">
            "{affirmation}"
          </p>

          <button
            onClick={speakAffirmation}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            🔊 Listen to Affirmation
          </button>
        </div>

        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4e] mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Wind size={28} className="text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">
              Breathing Exercise
            </h2>
          </div>

          {breathingExercise && (
            <>
              <p className="text-gray-400 mb-6">
                {breathingExercise.description}
              </p>

              <div className="flex flex-col items-center my-8">
                <div
                  className="w-40 h-40 rounded-full bg-purple-600 flex items-center justify-center mb-6 transition-transform duration-1000"
                  style={{ transform: `scale(${breathScale})` }}
                >
                  <Wind size={64} className="text-white" />
                </div>

                <p className="text-white text-xl font-semibold mb-6">
                  {getCurrentInstruction()}
                </p>
              </div>

              <button
                onClick={toggleBreathing}
                className={`w-full ${
                  isBreathing
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white px-6 py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2`}
              >
                {isBreathing ? <Pause size={20} /> : <Play size={20} />}
                {isBreathing ? "Stop" : "Start"} Exercise
              </button>
            </>
          )}
        </div>

        <div className="bg-[#1a1a2e] rounded-xl p-6 border border-[#2a2a4e]">
          <div className="flex items-center gap-3 mb-4">
            <Smile size={28} className="text-purple-400" />
            <h2 className="text-2xl font-semibold text-white">Mood Tracker</h2>
          </div>

          <p className="text-gray-400 mb-4">How are you feeling?</p>

          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm block mb-2">
                Before Practice
              </label>
              <input
                type="text"
                value={moodBefore}
                onChange={(e) => setMoodBefore(e.target.value)}
                placeholder="e.g., Anxious, Scattered"
                className="w-full bg-[#0a0a0f] text-white px-4 py-3 rounded-lg border border-[#2a2a4e] focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-2">
                After Practice
              </label>
              <input
                type="text"
                value={moodAfter}
                onChange={(e) => setMoodAfter(e.target.value)}
                placeholder="e.g., Calm, Centered"
                className="w-full bg-[#0a0a0f] text-white px-4 py-3 rounded-lg border border-[#2a2a4e] focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-300 text-sm block mb-2">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any insights or reflections..."
                rows={4}
                className="w-full bg-[#0a0a0f] text-white px-4 py-3 rounded-lg border border-[#2a2a4e] focus:border-purple-600 focus:outline-none resize-none"
              />
            </div>

            <button
              onClick={saveMoodLog}
              disabled={!moodBefore && !moodAfter}
              className={`w-full ${
                !moodBefore && !moodAfter
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              } text-white px-6 py-3 rounded-xl font-semibold transition`}
            >
              Log Mood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
