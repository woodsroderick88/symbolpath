"use client";

import { useState, useEffect } from "react";
import {
  Compass,
  Sparkles,
  Brain,
  Activity,
  Clock,
  Heart,
  Map,
} from "lucide-react";
import LifeTimeline from "@/components/SymbolPath/LifeTimeline";
import RelationshipCompass from "@/components/SymbolPath/RelationshipCompass";
import SymbolMap from "@/components/SymbolPath/SymbolMap";
import { PageHeader } from "./components/PageHeader";
import { TabNavigation } from "./components/TabNavigation";
import { EmptyState } from "./components/EmptyState";
import { PathTimeline } from "./components/PathTimeline";
import { CompassTab } from "./components/CompassTab/CompassTab";
import { PatternsTab } from "./components/PatternsTab/PatternsTab";
import { InsightsTab } from "./components/InsightsTab/InsightsTab";
import { LogEventModal } from "./components/LogEventModal/LogEventModal";
import { useSymbolPathData } from "./hooks/useSymbolPathData";

function SkeletonPulse({ width, height, radius = 8, style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius: radius,
        background:
          "linear-gradient(90deg, rgba(139,92,246,0.04) 0%, rgba(139,92,246,0.1) 50%, rgba(139,92,246,0.04) 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ padding: "40px 0", opacity: 1 }}>
      {/* Hero card skeleton */}
      <div
        style={{
          padding: "32px 28px",
          borderRadius: 20,
          background: "rgba(139,92,246,0.03)",
          border: "1px solid rgba(139,92,246,0.08)",
          marginBottom: 24,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <SkeletonPulse width={64} height={64} radius={16} />
          <div style={{ flex: 1 }}>
            <SkeletonPulse
              width={140}
              height={20}
              style={{ marginBottom: 8 }}
            />
            <SkeletonPulse
              width={100}
              height={14}
              style={{ marginBottom: 8 }}
            />
            <SkeletonPulse width="80%" height={12} />
          </div>
        </div>
      </div>
      {/* Cards row skeleton */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[0, 1].map((i) => (
          <div
            key={i}
            style={{
              padding: "20px",
              borderRadius: 14,
              background: "rgba(139,92,246,0.02)",
              border: "1px solid rgba(139,92,246,0.06)",
            }}
          >
            <SkeletonPulse
              width={80}
              height={10}
              style={{ marginBottom: 12 }}
            />
            <SkeletonPulse
              width="60%"
              height={16}
              style={{ marginBottom: 8 }}
            />
            <SkeletonPulse width="90%" height={12} />
          </div>
        ))}
      </div>
      {/* List skeleton */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            padding: "16px 20px",
            borderRadius: 12,
            marginBottom: 8,
            background: "rgba(139,92,246,0.02)",
            border: "1px solid rgba(139,92,246,0.05)",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <SkeletonPulse width={32} height={32} radius={10} />
          <div style={{ flex: 1 }}>
            <SkeletonPulse
              width={120}
              height={12}
              style={{ marginBottom: 6 }}
            />
            <SkeletonPulse width={80} height={10} />
          </div>
        </div>
      ))}
    </div>
  );
}

function FadeIn({ children, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.4s ease, transform 0.4s ease",
      }}
    >
      {children}
    </div>
  );
}

export default function SymbolPathPage() {
  const [activeTab, setActiveTab] = useState("compass");
  const [showLogModal, setShowLogModal] = useState(false);

  const {
    compass,
    patterns,
    insights,
    events,
    symbols,
    loading,
    needsMore,
    reload,
  } = useSymbolPathData();

  const tabs = [
    { id: "compass", label: "Compass", icon: Compass },
    { id: "path", label: "Path", icon: Activity },
    { id: "patterns", label: "Patterns", icon: Brain },
    { id: "insights", label: "Insights", icon: Sparkles },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "relationships", label: "Relationships", icon: Heart },
    { id: "map", label: "Map", icon: Map },
  ];

  // Determine ambient glow based on current stage
  const currentStage = compass?.currentStage;
  const ambientColor =
    currentStage === "Awakening"
      ? "96,165,250"
      : currentStage === "Growth"
        ? "52,211,153"
        : currentStage === "Crisis"
          ? "248,113,113"
          : currentStage === "Mastery"
            ? "251,191,36"
            : "167,139,250";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0614",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      {/* Ambient atmospheric glow — responds to current stage */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "40vh",
          background: `radial-gradient(ellipse at 50% 0%, rgba(${ambientColor},0.06) 0%, transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
          transition: "background 2s ease",
        }}
      />

      {/* Sticky header */}
      <div
        style={{
          background:
            "linear-gradient(180deg,rgba(76,29,149,0.45),transparent)",
          borderBottom: "1px solid rgba(139,92,246,0.15)",
          padding: "0 24px",
          position: "sticky",
          top: 0,
          zIndex: 50,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <PageHeader onLogSymbol={() => setShowLogModal(true)} />
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          maxWidth: 680,
          margin: "0 auto",
          padding: "28px 24px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {loading ? (
          <LoadingSkeleton />
        ) : needsMore && activeTab !== "path" && activeTab !== "insights" ? (
          <FadeIn>
            <EmptyState onLogSymbol={() => setShowLogModal(true)} />
          </FadeIn>
        ) : (
          <FadeIn key={activeTab}>
            {activeTab === "compass" && <CompassTab compass={compass} />}
            {activeTab === "path" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 20,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        color: "#E9D5FF",
                        fontSize: 18,
                        fontWeight: 700,
                      }}
                    >
                      Symbol Stream
                    </h2>
                    <p
                      style={{
                        margin: "4px 0 0",
                        color: "#9B7FD4",
                        fontSize: 13,
                      }}
                    >
                      {events.length} events recorded
                    </p>
                  </div>
                </div>
                <PathTimeline events={events} />
              </div>
            )}
            {activeTab === "patterns" && <PatternsTab patterns={patterns} />}
            {activeTab === "insights" && <InsightsTab insights={insights} />}
            {activeTab === "timeline" && <LifeTimeline symbols={symbols} />}
            {activeTab === "relationships" && (
              <RelationshipCompass symbols={symbols} />
            )}
            {activeTab === "map" && <SymbolMap />}
          </FadeIn>
        )}
      </div>

      {showLogModal && (
        <LogEventModal
          symbols={symbols}
          onClose={() => setShowLogModal(false)}
          onSave={() => {
            setShowLogModal(false);
            reload();
          }}
        />
      )}

      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 4px; }
      `}</style>
    </div>
  );
}
