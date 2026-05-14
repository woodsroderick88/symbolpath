import { useEffect } from "react";
import useAuth from "@/utils/useAuth";
import { Sparkles, LogOut } from "lucide-react";

export default function LogoutPage() {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/", redirect: true });
  };

  // Auto sign out after a short delay
  useEffect(() => {
    const timer = setTimeout(handleSignOut, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.18) 0%, transparent 60%)",
        }}
      />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            boxShadow: "0 0 32px rgba(124,58,237,0.4)",
          }}
        >
          <LogOut size={24} color="rgba(255,255,255,0.85)" />
        </div>
        <h1
          style={{
            margin: "0 0 8px",
            fontSize: 24,
            fontWeight: 700,
            color: "#E9D5FF",
          }}
        >
          Signing you out…
        </h1>
        <p style={{ margin: 0, color: "#9B7FD4", fontSize: 14 }}>
          Until next time ✦
        </p>
        <button
          onClick={handleSignOut}
          style={{
            marginTop: 24,
            background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Sign Out Now
        </button>
      </div>
    </div>
  );
}
