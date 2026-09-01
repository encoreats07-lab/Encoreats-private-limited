"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"login" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [otpSentMsg, setOtpSentMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (tab === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, rememberMe }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error?.message || "Invalid credentials. Please try again.");
          setLoading(false);
          return;
        }

        if (data.user?.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        // OTP Tab Verification
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otpCode, purpose: "EMAIL_VERIFICATION" }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.error?.message || "Invalid 6-digit passcode.");
          setLoading(false);
          return;
        }

        router.push("/dashboard");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address to receive a passcode.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "EMAIL_VERIFICATION" }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || "Failed to send passcode.");
      } else {
        setOtpSentMsg(data.devCode ? `Passcode sent! (Dev code: ${data.devCode})` : "Passcode sent to your email!");
        setTab("otp");
      }
    } catch (err) {
      setError("Failed to request passcode.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const demoGoogleUser = {
        googleId: `google_${Date.now()}`,
        email: email || "member.google@encoreats.com",
        name: email ? email.split("@")[0] : "Google Member",
      };

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoGoogleUser),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error?.message || "Google authentication failed.");
        setGoogleLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Google authentication error.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory flex flex-col font-sans selection:bg-champagne selection:text-obsidian">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24 relative overflow-hidden bg-noise">
        {/* Ambient luxury glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-champagne/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-[10px] uppercase tracking-widest font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Private Access Portal</span>
            </div>
            <h1 className="font-editorial text-3xl md:text-4xl text-warm-ivory tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-muted-stone tracking-wide max-w-xs mx-auto">
              Enter your credentials or passcode to access your private cultural invitations.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-xl border border-warm-ivory/10 shadow-2xl relative space-y-6">
            {/* Google Authentication Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={googleLoading}
              className="w-full py-3 px-4 bg-deep-onyx border border-warm-ivory/20 hover:border-champagne text-warm-ivory text-xs font-mono uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-3 shadow-md hover:bg-champagne/10 disabled:opacity-50 cursor-pointer"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-champagne" />
              ) : (
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12.5s.7 2.8 1.9 5.2l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 17C3.7 20.7 7.5 24 12 24z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-warm-ivory/10 w-full" />
              <span className="bg-obsidian px-3 text-[10px] uppercase font-mono text-muted-stone absolute">
                or email access
              </span>
            </div>

            {/* Sub-tab selection */}
            <div className="flex border-b border-warm-ivory/10 pb-2 gap-4 text-xs font-mono">
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`pb-1 uppercase tracking-wider transition-all cursor-pointer ${
                  tab === "login"
                    ? "text-champagne border-b-2 border-champagne font-semibold"
                    : "text-muted-stone hover:text-warm-ivory"
                }`}
              >
                Password Login
              </button>
              <button
                type="button"
                onClick={() => setTab("otp")}
                className={`pb-1 uppercase tracking-wider transition-all cursor-pointer ${
                  tab === "otp"
                    ? "text-champagne border-b-2 border-champagne font-semibold"
                    : "text-muted-stone hover:text-warm-ivory"
                }`}
              >
                OTP Passcode
              </button>
            </div>

            {error && (
              <div className="p-4 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-start gap-3 text-rose-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {otpSentMsg && (
              <div className="p-3 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                {otpSentMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="concierge@encoreats.com"
                    className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-4 text-sm text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne transition-colors"
                  />
                </div>
              </div>

              {tab === "login" ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] uppercase tracking-wider text-muted-stone font-mono">
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-xs text-champagne hover:underline transition-all"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-10 text-sm text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-stone hover:text-warm-ivory transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-[11px] uppercase tracking-wider text-muted-stone font-mono">
                      6-Digit Passcode
                    </label>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      className="text-xs text-champagne hover:underline transition-all font-mono cursor-pointer"
                    >
                      Send Code
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 px-4 text-center text-lg font-mono tracking-widest text-champagne focus:outline-none focus:border-champagne transition-colors"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-muted-stone py-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-warm-ivory/20 bg-deep-onyx text-champagne focus:ring-champagne focus:ring-offset-obsidian"
                  />
                  <span>Remember session</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-champagne text-obsidian font-medium text-xs tracking-widest uppercase rounded-lg hover:bg-champagne-light transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-muted-stone">
            Don&apos;t have a member profile yet?{" "}
            <Link href="/register" className="text-champagne hover:underline font-medium">
              Apply for Access
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
