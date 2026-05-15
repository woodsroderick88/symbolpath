import React, { useState, useMemo, useEffect } from "react";
import { tarotCards } from "../../data/tarot-cards";
import {
  Search,
  Filter,
  Info,
  ArrowRight,
  X,
  LayoutGrid,
  List as ListIcon,
  Sparkles,
  Sun,
  RotateCcw,
  Compass,
  Layers,
  Moon,
} from "lucide-react";

const CardPill = ({ children, type = "outline" }) => {
  const styles = {
    outline:
      "bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 inline-flex items-center gap-1.5",
    soft: "bg-blue-50 text-blue-600 rounded-full px-3 py-1.5 text-sm font-medium inline-flex items-center gap-1.5",
    status:
      "bg-white border border-gray-200 rounded-full px-3 py-1 text-xs text-gray-700 inline-flex items-center gap-1.5",
  };
  return (
    <span className={styles[type]}>
      {type === "status" && (
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
      )}
      {children}
    </span>
  );
};

const TarotCard = ({ card, onClick, darkMode }) => (
  <div
    className={`group rounded-xl border p-6 transition-all cursor-pointer flex flex-col gap-4 ${
      darkMode
        ? "bg-[rgba(255,255,255,0.03)] border-[rgba(139,92,246,0.25)] hover:border-[#7C3AED]"
        : "bg-white border-gray-200 hover:border-gray-300"
    }`}
    onClick={() => onClick(card)}
  >
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <h3
          className={`text-lg font-semibold tracking-tight ${darkMode ? "text-[#E9D5FF]" : "text-gray-900"}`}
        >
          {card.name}
        </h3>
        <p
          className={`text-sm font-normal ${darkMode ? "text-[#9B7FD4]" : "text-gray-500"}`}
        >
          Card {card.number} ·{" "}
          {card.arcana.charAt(0).toUpperCase() + card.arcana.slice(1)} Arcana
        </p>
      </div>
      <div
        className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${
          darkMode
            ? "border-[rgba(139,92,246,0.3)] text-[#9B7FD4] group-hover:text-[#C4B5FD] group-hover:border-[#7C3AED] group-hover:bg-[rgba(124,58,237,0.15)]"
            : "border-gray-200 text-gray-400 group-hover:text-blue-600 group-hover:border-blue-100 group-hover:bg-blue-50"
        }`}
      >
        <ArrowRight size={18} />
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {card.upright.keywords.slice(0, 3).map((keyword, idx) => (
        <span
          key={idx}
          className={`rounded-full px-3 py-1 text-xs inline-flex items-center gap-1.5 ${
            darkMode
              ? "bg-[rgba(109,40,217,0.2)] text-[#A78BFA] border border-[rgba(139,92,246,0.2)]"
              : "bg-white border border-gray-200 text-gray-700"
          }`}
        >
          {keyword}
        </span>
      ))}
    </div>
    <p
      className={`text-sm line-clamp-2 leading-relaxed ${darkMode ? "text-[#D1D5DB]" : "text-gray-600"}`}
    >
      {card.upright.meaning}
    </p>
  </div>
);

const CardDetail = ({ card, onClose }) => {
  if (!card) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/10 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              {card.name}
            </h2>
            <p className="text-sm text-gray-500">
              Major Arcana · Card {card.number}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <CardPill type="soft">Upright</CardPill>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {card.upright.keywords.map((k, i) => (
                    <CardPill key={i}>{k}</CardPill>
                  ))}
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {card.upright.meaning}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <CardPill type="outline">Reversed</CardPill>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {card.reversed.keywords.map((k, i) => (
                    <CardPill key={i}>{k}</CardPill>
                  ))}
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {card.reversed.meaning}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-sm border border-gray-200 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-sm transition-colors">
            Add to Reading
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TarotArchivePage() {
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedCard, setSelectedCard] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  const [dailyCard, setDailyCard] = useState(null);
  const [dailyReversed, setDailyReversed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("tarot_dark_mode");
    if (stored !== null) setDarkMode(stored === "true");
    else
      setDarkMode(
        window.matchMedia?.("(prefers-color-scheme: dark)").matches || false,
      );
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (typeof window !== "undefined")
      localStorage.setItem("tarot_dark_mode", String(next));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const today = new Date().toISOString().split("T")[0];
    const stored = localStorage.getItem("cotd");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.date === today) {
          const card = tarotCards.find((c) => c.id === parsed.cardId);
          if (card) {
            setDailyCard(card);
            setDailyReversed(parsed.reversed);
            return;
          }
        }
      } catch {}
    }
    const idx = Math.floor(Math.random() * tarotCards.length);
    const card = tarotCards[idx];
    const reversed = Math.random() > 0.5;
    setDailyCard(card);
    setDailyReversed(reversed);
    localStorage.setItem(
      "cotd",
      JSON.stringify({ date: today, cardId: card.id, reversed }),
    );
  }, []);

  const redrawDaily = () => {
    if (typeof window === "undefined") return;
    const today = new Date().toISOString().split("T")[0];
    const idx = Math.floor(Math.random() * tarotCards.length);
    const card = tarotCards[idx];
    const reversed = Math.random() > 0.5;
    setDailyCard(card);
    setDailyReversed(reversed);
    localStorage.setItem(
      "cotd",
      JSON.stringify({ date: today, cardId: card.id, reversed }),
    );
  };

  const filteredCards = useMemo(() => {
    return tarotCards.filter((card) => {
      const matchesSearch =
        card.name.toLowerCase().includes(search.toLowerCase()) ||
        card.upright.keywords.some((k) =>
          k.toLowerCase().includes(search.toLowerCase()),
        );
      let matchesTab = true;
      if (selectedTab === "major") matchesTab = card.arcana === "major";
      else if (selectedTab === "minor") matchesTab = card.arcana === "minor";
      else if (selectedTab === "wands") matchesTab = card.suit === "wands";
      else if (selectedTab === "cups") matchesTab = card.suit === "cups";
      else if (selectedTab === "swords") matchesTab = card.suit === "swords";
      else if (selectedTab === "pentacles")
        matchesTab = card.suit === "pentacles";
      return matchesSearch && matchesTab;
    });
  }, [search, selectedTab]);

  const tabs = [
    { id: "all", label: "All Cards" },
    { id: "major", label: "Major Arcana" },
    { id: "wands", label: "🪄 Wands" },
    { id: "cups", label: "🏆 Cups" },
    { id: "swords", label: "⚔️ Swords" },
    { id: "pentacles", label: "🪙 Pentacles" },
  ];

  return (
    <div
      className={`min-h-screen font-sans ${darkMode ? "bg-[#0F0A1E]" : "bg-gray-50"} selection:bg-blue-100 selection:text-blue-900`}
    >
      <header
        className={`${darkMode ? "bg-[#1C1332] border-b border-[rgba(139,92,246,0.2)]" : "bg-white border-b border-gray-200"} pt-12`}
      >
        <div className="max-w-7xl mx-auto px-6 pb-0">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div className="flex flex-col gap-2">
              <h1
                className={`text-4xl font-semibold tracking-tight ${darkMode ? "text-[#E9D5FF]" : "text-gray-900"}`}
              >
                Tarot Archive
              </h1>
              <p
                className={`max-w-md ${darkMode ? "text-[#9B7FD4]" : "text-gray-500"}`}
              >
                Explore the wisdom of the cards. A directory of archetypes,
                meanings, and symbolic resonance.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg border transition-all ${darkMode ? "bg-[rgba(124,58,237,0.2)] border-[#7C3AED] text-[#C4B5FD]" : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                title={darkMode ? "Light mode" : "Dark mode"}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-all"
              >
                🏠 Home
              </a>
              <a
                href="/reading"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-all"
              >
                <Sparkles size={16} /> Start Reading
              </a>
              <a
                href="/symbolpath"
                className="flex items-center gap-2 px-4 py-2 bg-purple-700 text-white rounded-lg text-sm font-medium hover:bg-purple-800 transition-all"
              >
                🧭 SymbolPath
              </a>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search cards or keywords..."
                  className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 w-full md:w-64 transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex border border-gray-200 rounded-sm p-1 bg-gray-50">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-xs transition-colors ${viewMode === "grid" ? "bg-white shadow-xs text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <LayoutGrid size={16} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-xs transition-colors ${viewMode === "list" ? "bg-white shadow-xs text-gray-900" : "text-gray-400 hover:text-gray-600"}`}
                >
                  <ListIcon size={16} />
                </button>
              </div>
            </div>
          </div>
          <nav className="flex gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`pb-3 text-sm transition-all relative whitespace-nowrap ${selectedTab === tab.id ? `${darkMode ? "text-[#C4B5FD]" : "text-gray-900"} font-semibold border-b-2 ${darkMode ? "border-[#7C3AED]" : "border-blue-600"} -mb-[1px]` : `${darkMode ? "text-[#9B7FD4] hover:text-[#C4B5FD]" : "text-gray-500 hover:text-gray-700"} font-normal border-b-2 border-transparent`}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {dailyCard && (
          <div
            className={`mb-8 border rounded-xl p-6 ${darkMode ? "bg-[rgba(124,58,237,0.08)] border-[rgba(139,92,246,0.3)]" : "bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200"}`}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${darkMode ? "bg-[rgba(124,58,237,0.3)]" : "bg-indigo-100"}`}
                >
                  <Sun
                    size={24}
                    className={darkMode ? "text-[#C4B5FD]" : "text-indigo-600"}
                  />
                </div>
                <div>
                  <h3
                    className={`text-lg font-semibold ${darkMode ? "text-[#E9D5FF]" : "text-gray-900"}`}
                  >
                    Card of the Day
                  </h3>
                  <p
                    className={`text-xs ${darkMode ? "text-[#9B7FD4]" : "text-gray-500"}`}
                  >
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4
                    className={`text-xl font-bold ${darkMode ? "text-[#C4B5FD]" : "text-indigo-700"}`}
                  >
                    {dailyCard.name}
                  </h4>
                  {dailyReversed && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                      Reversed
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(dailyReversed
                    ? dailyCard.reversed
                    : dailyCard.upright
                  ).keywords.map((kw, i) => (
                    <span
                      key={i}
                      className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? "bg-[rgba(109,40,217,0.2)] text-[#A78BFA]" : "bg-white border border-indigo-200 text-indigo-600"}`}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                <p
                  className={`text-sm line-clamp-2 ${darkMode ? "text-[#D1D5DB]" : "text-gray-600"}`}
                >
                  {
                    (dailyReversed ? dailyCard.reversed : dailyCard.upright)
                      .meaning
                  }
                </p>
              </div>
              <button
                onClick={redrawDaily}
                className={`flex items-center gap-2 px-3 py-2 text-sm border rounded-lg transition-all ${darkMode ? "text-[#C4B5FD] border-[rgba(139,92,246,0.3)] hover:bg-[rgba(124,58,237,0.15)]" : "text-indigo-600 border-indigo-200 hover:bg-white"}`}
              >
                <RotateCcw size={14} /> Redraw
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <h2
            className={`text-lg font-semibold ${darkMode ? "text-[#E9D5FF]" : "text-gray-900"}`}
          >
            {selectedTab === "all"
              ? "All Archetypes"
              : `${selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Arcana`}
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({filteredCards.length} results)
            </span>
          </h2>
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sorted by Rank
            </span>
          </div>
        </div>

        {filteredCards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <TarotCard
                key={card.id}
                card={card}
                onClick={setSelectedCard}
                darkMode={darkMode}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-20 flex flex-col items-center justify-center text-center gap-4">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <Search size={32} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-semibold text-gray-900">
                No cards found
              </h3>
              <p className="text-sm text-gray-500 max-w-xs">
                Try a different keyword or filter.
              </p>
            </div>
            <button
              onClick={() => {
                setSearch("");
                setSelectedTab("all");
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 mt-2"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>

      {selectedCard && (
        <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
