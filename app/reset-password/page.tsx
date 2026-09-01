"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Lock, ArrowRight, AlertCircle, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";
  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [token, setToken] = useState(tokenFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password, confirmPassword }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Password reset failed.");
        return;
      }

      setSuccess(true);
    } catch (err: unknown) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-8 rounded-xl border border-warm-ivory/10 shadow-2xl relative">
      {success ? (
        <div className="text-center py-4 space-y-4">
          <CheckCircle2 className="w-12 h-12 text-champagne mx-auto" />
          <h3 className="font-editorial text-2xl text-warm-ivory">Password Restored</h3>
          <p className="text-xs text-muted-stone leading-relaxed max-w-xs mx-auto">
            Your password has been updated securely. You can now log into your portal with your new credentials.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-champagne text-obsidian font-mono text-xs tracking-widest uppercase rounded-lg font-medium hover:bg-champagne-light transition-all shadow-lg"
          >
            Proceed to Login <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-500/40 flex items-start gap-2 text-rose-200 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
              Account Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="concierge@encoreats.com"
              className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 px-4 text-sm text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
              6-Digit Passcode / Reset Token
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
              <input
                type="text"
                required
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter 6-digit code"
                className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-4 text-sm font-mono tracking-widest text-champagne focus:outline-none focus:border-champagne transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-4 text-sm text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
              <input
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-4 text-sm text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-champagne text-obsidian font-medium text-xs tracking-widest uppercase rounded-lg hover:bg-champagne-light transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
                <span>Updating Credentials...</span>
              </>
            ) : (
              <>
                <span>Update Password</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory flex flex-col font-sans selection:bg-champagne selection:text-obsidian">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24 relative overflow-hidden bg-noise">
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-champagne font-mono block mb-2">
              Credentials Renewal
            </span>
            <h1 className="font-editorial text-3xl md:text-4xl text-warm-ivory tracking-tight mb-2">
              Set New Password
            </h1>
            <p className="text-xs text-muted-stone tracking-wide">
              Enter your passcode and new password to restore access to your account.
            </p>
          </div>

          <Suspense fallback={
            <div className="glass-panel p-8 text-center text-xs font-mono uppercase text-muted-stone animate-pulse">
              Loading Restoration Portal...
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
