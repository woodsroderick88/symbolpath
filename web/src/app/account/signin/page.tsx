import { useState } from "react";
import useAuth from "@/utils/useAuth";
import { Sparkles, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { signInWithCredentials } = useAuth();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      await signInWithCredentials({
        email,
        password,
        callbackUrl: "/",
        redirect: true,
      });
    } catch (err) {
      const errorMessages = {
        CredentialsSignin: "Incorrect email or password. Please try again.",
        AccessDenied: "You don't have permission to sign in.",
        Configuration:
          "Sign-in isn't working right now. Please try again later.",
      };
      setError(
        errorMessages[err?.message] ||
          "Something went wrong. Please try again.",
      );
      setLoading(false);
    }
  };

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
            "radial-gradient(ellipse at 50% 0%, rgba(109,40,217,0.18) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(79,70,229,0.12) 0%, transparent 50%)",
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: 420,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 0 32px rgba(124,58,237,0.5)",
            }}
          >
            <Sparkles size={26} color="rgba(255,255,255,0.85)" />
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: 28,
              fontWeight: 700,
              color: "#E9D5FF",
            }}
          >
            Welcome Back
          </h1>
          <p style={{ margin: "8px 0 0", color: "#9B7FD4", fontSize: 14 }}>
            The cards await your return
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={onSubmit}
          noValidate
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(139,92,246,0.3)",
            borderRadius: 20,
            padding: "32px 28px",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Email */}
          <div style={{ marginBottom: 18 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#C4B5FD",
                marginBottom: 8,
                letterSpacing: "0.04em",
              }}
            >
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(139,92,246,0.35)",
                borderRadius: 12,
                padding: "12px 16px",
                color: "#E9D5FF",
                fontSize: 15,
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "inherit",
              }}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 24 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#C4B5FD",
                marginBottom: 8,
                letterSpacing: "0.04em",
              }}
            >
              PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                style={{
                  width: "100%",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(139,92,246,0.35)",
                  borderRadius: 12,
                  padding: "12px 44px 12px 16px",
                  color: "#E9D5FF",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                  fontFamily: "inherit",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#9B7FD4",
                  padding: 0,
                  display: "flex",
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: "10px 14px",
                marginBottom: 18,
                fontSize: 13,
                color: "#FCA5A5",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              background: loading
                ? "rgba(124,58,237,0.4)"
                : "linear-gradient(135deg,#4F46E5,#7C3AED)",
              color: "#fff",
              border: "none",
              borderRadius: 12,
              padding: "14px",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 4px 20px rgba(124,58,237,0.4)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          {/* Sign up link */}
          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 14,
              color: "#9B7FD4",
            }}
          >
            Don't have an account?{" "}
            <a
              href={`/account/signup${typeof window !== "undefined" ? window.location.search : ""}`}
              style={{
                color: "#C4B5FD",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign up
            </a>
          </p>
        </form>

        <p style={{ textAlign: "center", marginTop: 20 }}>
          <a
            href="/"
            style={{ color: "#6B7280", fontSize: 13, textDecoration: "none" }}
          >
            ← Back to the Archive
          </a>
        </p>
      </div>
    </div>
  );
}
