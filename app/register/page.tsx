"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Phone, MapPin, ArrowRight, AlertCircle, Loader2, CheckCircle2, KeyRound } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";

const CITIES = [
  "Mumbai",
  "Bengaluru",
  "Delhi NCR",
  "Goa",
  "Hyderabad",
  "Kolkata",
  "London",
  "Dubai",
  "New York",
];

const INTERESTS_OPTIONS = [
  "Secret Culinary & Fine Dining",
  "Jazz & Intimate Music Salons",
  "Contemporary Art & Private Viewings",
  "Mixology & Craft Spirits",
  "Heritage Architecture & Storytelling",
  "Performative & Immersive Theatre",
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refCodeFromUrl = searchParams.get("ref") || "";

  const [step, setStep] = useState<"details" | "otp">("details");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "Mumbai",
    referralCode: refCodeFromUrl,
  });

  const [otpCode, setOtpCode] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Secret Culinary & Fine Dining",
    "Jazz & Intimate Music Salons",
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          interests: selectedInterests,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Registration failed. Please check your information.");
        setLoading(false);
        return;
      }

      if (data.devCode) {
        setDevCode(data.devCode);
      }

      if (data.requireOtp) {
        setStep("otp");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otpCode,
          purpose: "EMAIL_VERIFICATION",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error?.message || "Invalid passcode. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Verification failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 md:p-10 rounded-xl border border-warm-ivory/10 shadow-2xl relative">
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-800/40 flex items-start gap-3 text-red-200 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {step === "details" ? (
        <form onSubmit={handleRegisterSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Victoria Vance"
                  className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-4 text-sm text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="victoria@domain.com"
                  className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-4 text-sm text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 8 characters"
                  className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-4 text-sm text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="Re-enter password"
                  className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-4 text-sm text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-4 text-sm text-warm-ivory placeholder:text-muted-stone/40 focus:outline-none focus:border-champagne transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
                Primary City *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone pointer-events-none" />
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-deep-onyx border border-warm-ivory/15 rounded-lg py-3 pl-10 pr-4 text-sm text-warm-ivory focus:outline-none focus:border-champagne transition-colors appearance-none cursor-pointer"
                >
                  {CITIES.map((city) => (
                    <option key={city} value={city} className="bg-obsidian text-warm-ivory">
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-3 font-mono">
              Cultural Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS_OPTIONS.map((interest) => {
                const selected = selectedInterests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer ${
                      selected
                        ? "bg-champagne/20 border border-champagne text-champagne"
                        : "bg-deep-onyx border border-warm-ivory/10 text-muted-stone hover:border-warm-ivory/30"
                    }`}
                  >
                    {selected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    <span>{interest}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
              Invitation / Referral Code (Optional)
            </label>
            <input
              type="text"
              value={formData.referralCode}
              onChange={(e) => setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })}
              placeholder="ENCORE-XXXXXX"
              className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3 px-4 text-sm text-champagne font-mono placeholder:text-muted-stone/30 uppercase focus:outline-none focus:border-champagne transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-champagne text-obsidian font-medium text-xs tracking-widest uppercase rounded-lg hover:bg-champagne-light transition-all flex items-center justify-center gap-2 group disabled:opacity-50 mt-4 cursor-pointer shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
                <span>Processing Application...</span>
              </>
            ) : (
              <>
                <span>Submit Membership Application</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      ) : (
        /* OTP Verification Step */
        <form onSubmit={handleOtpVerify} className="space-y-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full bg-champagne/15 border border-champagne/40 text-champagne mx-auto flex items-center justify-center">
              <KeyRound className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl text-warm-ivory">Verify Your Email Passcode</h3>
            <p className="text-xs text-muted-stone max-w-sm mx-auto">
              We sent a 6-digit confidential code to <span className="text-warm-ivory font-mono font-medium">{formData.email}</span>.
            </p>
            {devCode && (
              <p className="text-xs text-champagne font-mono bg-champagne/10 p-2 rounded border border-champagne/30">
                Development Code: {devCode}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-muted-stone mb-2 font-mono">
              6-Digit Passcode
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="123456"
              className="w-full bg-deep-onyx/80 border border-warm-ivory/15 rounded-lg py-3.5 px-4 text-center text-2xl font-mono tracking-widest text-champagne focus:outline-none focus:border-champagne transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-champagne text-obsidian font-medium text-xs tracking-widest uppercase rounded-lg hover:bg-champagne-light transition-all flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer shadow-lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-obsidian" />
                <span>Verifying Passcode...</span>
              </>
            ) : (
              <>
                <span>Activate Membership Account</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory flex flex-col font-sans selection:bg-champagne selection:text-obsidian">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-20 relative overflow-hidden bg-noise">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-champagne/5 rounded-full blur-[160px] pointer-events-none" />

        <div className="w-full max-w-xl relative z-10 my-8">
          <div className="text-center mb-8">
            <span className="text-[10px] tracking-[0.3em] uppercase text-champagne font-mono block mb-2">
              Membership Application
            </span>
            <h1 className="font-editorial text-3xl md:text-5xl text-warm-ivory tracking-tight mb-3">
              Request Your Pass
            </h1>
            <p className="text-xs md:text-sm text-muted-stone max-w-md mx-auto">
              Join the private circle of cultural connoisseurs, creators, and experience enthusiasts.
            </p>
          </div>

          <Suspense fallback={
            <div className="glass-panel p-12 text-center text-xs font-mono uppercase text-muted-stone animate-pulse">
              Loading Registration Portal...
            </div>
          }>
            <RegisterForm />
          </Suspense>

          <p className="text-center text-xs text-muted-stone mt-8">
            Already have a member profile?{" "}
            <Link href="/login" className="text-champagne hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
