import { useState } from "react";
import { Sparkles } from "lucide-react";
import ParticleRevealEffect from "@/components/ParticleRevealEffect";
import { TAROT_IMAGES } from "@/data/tarot-images";

export function FlipCard({
  card,
  isReversed,
  position,
  size = "md",
  extraRotate = 0,
}) {
  const [flipped, setFlipped] = useState(false);
  const [showFront, setShowFront] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const imageUrl = TAROT_IMAGES[card.id];
  const w = size === "sm" ? 80 : 96;
  const h = size === "sm" ? 128 : 152;

  const handleFlip = () => {
    if (flipped) return;
    setShowParticles(true);
    setTimeout(() => setShowFront(true), 210);
    setFlipped(true);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={handleFlip}
        style={{
          width: w,
          height: h,
          perspective: 1000,
          cursor: flipped ? "default" : "pointer",
          transform: `rotate(${extraRotate}deg)`,
          position: "relative",
        }}
      >
        {/* Particle burst on reveal */}
        <ParticleRevealEffect
          active={showParticles}
          duration={2000}
          color="#A78BFA"
        />

        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            transition: "transform 0.42s ease",
            transformStyle: "preserve-3d",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Back */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                border: "2px solid rgba(255,255,255,0.15)",
              }}
            >
              <Sparkles style={{ color: "rgba(255,255,255,0.4)" }} size={24} />
              {!flipped && (
                <span
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 10,
                    fontWeight: 500,
                  }}
                >
                  Click to reveal
                </span>
              )}
            </div>
          </div>
          {/* Front */}
          <div
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              borderRadius: 12,
              overflow: "hidden",
              boxShadow: flipped
                ? "0 0 22px 6px rgba(139,92,246,0.55), 0 0 50px 12px rgba(109,40,217,0.25)"
                : "none",
              transition: "box-shadow 0.4s ease",
            }}
          >
            {showFront && (
              <img
                src={imageUrl}
                alt={card.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transform: isReversed ? "rotate(180deg)" : "none",
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Label */}
      {position && (
        <div style={{ textAlign: "center", maxWidth: w + 12 }}>
          <p
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#C4B5FD",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            {position.name}
          </p>
          {flipped && isReversed && (
            <span
              style={{
                fontSize: 9,
                backgroundColor: "#78350F",
                color: "#FCD34D",
                padding: "1px 6px",
                borderRadius: 6,
              }}
            >
              Reversed
            </span>
          )}
        </div>
      )}
    </div>
  );
}
