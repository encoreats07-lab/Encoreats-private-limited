"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, AlertCircle, CheckCircle2, Loader2, KeyRound } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Unable to send reset passcode.");
        return;
      }

      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory flex flex-col font-sans selection:bg-champagne selection:text-obsidian">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-24 relative overflow-hidden bg-noise">
        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-champagne font-mono block mb-2">
              Security Assistance
            </span>
            <h1 className="font-editorial text-3xl md:text-4xl text-warm-ivory tracking-tight mb-2">
              Recover Password
            </h1>
            <p className="text-xs text-muted-stone tracking-wide max-w-xs mx-auto">
              Enter your registered email address to receive a 6-digit password restoration passcode.
            </p>
          </div>

          <div className="glass-panel p-8 rounded-xl border border-warm-ivory/10 shadow-2xl relative">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/40 flex items-start gap-2 text-red-200 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
                  Member Email Address
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 bg-champagne text-obsidian font-medium text-xs tracking-widest uppercase rounded-lg hover:bg-champagne-light transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
                    <span>Sending Passcode...</span>
                  </>
                ) : (
                  <>
                    <span>Send Passcode</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
