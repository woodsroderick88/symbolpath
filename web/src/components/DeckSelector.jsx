"use client";

import { useState } from "react";
import { oracleDecks } from "@/data/oracle-decks";
import { Sparkles } from "lucide-react";

export default function DeckSelector({ onSelectDeck, currentDeck = "tarot" }) {
  const [isOpen, setIsOpen] = useState(false);

  const allDecks = [
    {
      id: "tarot",
      name: "Classic Tarot",
      description: "Traditional 78-card Rider-Waite deck",
      theme: "classic",
    },
    ...oracleDecks,
  ];

  const selectedDeck =
    allDecks.find((d) => d.id === currentDeck) || allDecks[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#1a1a2e] hover:bg-[#2a2a4e] px-4 py-2 rounded-lg border border-purple-600 transition"
      >
        <Sparkles size={18} className="text-purple-400" />
        <span className="text-white font-semibold">{selectedDeck.name}</span>
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 left-0 bg-[#1a1a2e] border border-purple-600 rounded-lg shadow-xl z-20 min-w-[300px] max-h-96 overflow-y-auto">
            {allDecks.map((deck) => (
              <button
                key={deck.id}
                onClick={() => {
                  onSelectDeck(deck.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-[#2a2a4e] transition border-b border-[#2a2a4e] last:border-b-0 ${
                  currentDeck === deck.id ? "bg-purple-600 bg-opacity-20" : ""
                }`}
              >
                <div className="font-semibold text-white mb-1">{deck.name}</div>
                <div className="text-sm text-gray-400">{deck.description}</div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
