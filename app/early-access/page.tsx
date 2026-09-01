"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Check, AlertCircle, ArrowRight } from "lucide-react";
import { CITIES } from "@/data/cities";
import { INTERESTS } from "@/data/interests";

function EarlyAccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRefCode = searchParams.get("ref") || "";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "mumbai",
    selectedInterests: [] as string[],
    referralCode: initialRefCode,
    honeypot: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    if (initialRefCode) {
      setFormData((prev) => ({ ...prev, referralCode: initialRefCode }));
    }
  }, [initialRefCode]);

  const toggleInterest = (interestSlug: string) => {
    setFormData((prev) => {
      const exists = prev.selectedInterests.includes(interestSlug);
      const updated = exists
        ? prev.selectedInterests.filter((i) => i !== interestSlug)
        : [...prev.selectedInterests, interestSlug];
      return { ...prev, selectedInterests: updated };
    });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.selectedInterests.length === 0) {
      newErrors.interests = "Please select at least one cultural interest";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          interests: formData.selectedInterests,
          referralCode: formData.referralCode,
          honeypot: formData.honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error?.message || "Failed to submit early access request.");
        setIsSubmitting(false);
        return;
      }

      // Redirect to referral page with user's generated code
      const code = data.referralCode;
      router.push(`/referral?code=${encodeURIComponent(code)}`);
    } catch (err: any) {
      console.error("Early access submit error:", err);
      setServerError("Network error. Please check your connection and try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory relative overflow-hidden">
      {/* Background Soft Glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-champagne/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Editorial Statement */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-xs uppercase tracking-widest font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Membership Curation</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory leading-[1.08] font-light">
              Request early access to <br />
              <span className="italic text-gradient-champagne">the vault.</span>
            </h1>

            <p className="text-muted-stone text-base leading-relaxed font-light">
              Encoreats invitations are released in limited seasonal batches. As an early member, you gain priority access to blind tasting tables, secret sound rooms, and private host invitations.
            </p>

            <div className="space-y-4 pt-4 border-t border-warm-ivory/10 text-xs text-muted-stone font-light">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-champagne" />
                <span>Zero public seat listings for signature pop-ups</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-champagne" />
                <span>Personalized concierge notification by city & passion</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-champagne" />
                <span>Complimentary invitation pass for guest sharing</span>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="space-y-8 glass-panel p-8 sm:p-10 rounded-sm">
              {serverError && (
                <div className="p-4 bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs rounded-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Honeypot hidden input */}
              <input
                type="text"
                name="honeypot"
                value={formData.honeypot}
                onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                  Full Name <span className="text-champagne">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kabir Merchant"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className={`w-full bg-deep-onyx border ${errors.fullName ? "border-rose-500" : "border-warm-ivory/20"
                    } rounded-xs px-4 py-3.5 text-sm text-warm-ivory placeholder:text-muted-stone/50 focus:outline-none focus:border-champagne transition-colors`}
                />
                {errors.fullName && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                    Email Address <span className="text-champagne">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full bg-deep-onyx border ${errors.email ? "border-rose-500" : "border-warm-ivory/20"
                      } rounded-xs px-4 py-3.5 text-sm text-warm-ivory placeholder:text-muted-stone/50 focus:outline-none focus:border-champagne transition-colors`}
                  />
                  {errors.email && (
                    <p className="text-xs text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                    Phone Number <span className="text-muted-stone">(Optional)</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3.5 text-sm text-warm-ivory placeholder:text-muted-stone/50 focus:outline-none focus:border-champagne transition-colors"
                  />
                </div>
              </div>

              {/* City & Optional Referral Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                    Primary Preferred City <span className="text-champagne">*</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3.5 text-sm text-warm-ivory focus:outline-none focus:border-champagne"
                  >
                    {CITIES.map((c) => (
                      <option key={c.id} value={c.slug}>
                        {c.name} — {c.tagline}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                    Invitation / Ref Code <span className="text-muted-stone">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ENCORE-XXXXXX"
                    value={formData.referralCode}
                    onChange={(e) =>
                      setFormData({ ...formData, referralCode: e.target.value.toUpperCase() })
                    }
                    className="w-full bg-deep-onyx border border-warm-ivory/20 rounded-xs px-4 py-3.5 text-sm text-warm-ivory font-mono uppercase placeholder:text-muted-stone/50 focus:outline-none focus:border-champagne transition-colors"
                  />
                </div>
              </div>

              {/* Cultural Interests Selector */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-widest text-warm-ivory font-mono block">
                    Cultural Passions <span className="text-champagne">*</span>
                  </label>
                  <span className="text-[11px] text-muted-stone font-mono">
                    Select all that apply
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {INTERESTS.map((interest) => {
                    const selected = formData.selectedInterests.includes(
                      interest.slug
                    );
                    return (
                      <button
                        type="button"
                        key={interest.id}
                        onClick={() => toggleInterest(interest.slug)}
                        className={`p-3.5 rounded-xs text-left transition-all duration-200 flex items-center justify-between border ${selected
                            ? "bg-warm-ivory/10 border-champagne text-warm-ivory"
                            : "bg-deep-onyx border-warm-ivory/15 text-muted-stone hover:border-warm-ivory/30"
                          }`}
                      >
                        <span className="text-xs font-mono">{interest.name}</span>
                        {selected && <Check className="w-3.5 h-3.5 text-champagne" />}
                      </button>
                    );
                  })}
                </div>
                {errors.interests && (
                  <p className="text-xs text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.interests}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xs font-semibold uppercase tracking-widest bg-warm-ivory text-obsidian hover:bg-champagne transition-all duration-300 rounded-sm shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Curating Your Pass...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Submit Membership Application</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EarlyAccessPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-24 text-center text-muted-stone">Loading Atelier...</div>}>
      <EarlyAccessContent />
    </Suspense>
  );
}
