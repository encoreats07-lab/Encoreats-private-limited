"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Share2, Compass } from "lucide-react";
import { CITIES } from "@/data/cities";

function SuccessContent() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Friend";
  const citySlug = searchParams.get("city") || "mumbai";
  const rawInterests = searchParams.get("interests") || "";
  const selectedInterests = rawInterests ? rawInterests.split(",") : [];

  const city = CITIES.find((c) => c.slug === citySlug);

  return (
    <div className="max-w-2xl mx-auto px-6 text-center space-y-8 relative z-10">
      {/* Animated Check Emblem */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-20 h-20 mx-auto rounded-full bg-champagne/10 border border-champagne/40 flex items-center justify-center text-champagne"
      >
        <CheckCircle2 className="w-10 h-10" />
      </motion.div>

      {/* Headline & Confirmation */}
      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-champagne font-mono">
          Invitation Status: Reserved
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
          You&apos;re on the list, {name}.
        </h1>
        <p className="text-muted-stone text-base font-light max-w-lg mx-auto">
          Your application has been received by our membership concierge. You will receive private seasonal drops prior to public availability.
        </p>
      </div>

      {/* Selected Preferences Summary Box */}
      <div className="glass-panel p-6 rounded-sm text-left max-w-md mx-auto space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-warm-ivory/10 pb-2">
          <span className="text-muted-stone">Selected City:</span>
          <span className="text-warm-ivory uppercase font-semibold">
            {city ? city.name : citySlug}
          </span>
        </div>

        <div className="space-y-1 pt-1">
          <span className="text-muted-stone block">Curated Passions:</span>
          <div className="flex flex-wrap gap-2 pt-1">
            {selectedInterests.length > 0 ? (
              selectedInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 rounded-xs bg-warm-ivory/10 border border-warm-ivory/15 text-warm-ivory capitalize"
                >
                  {interest}
                </span>
              ))
            ) : (
              <span className="text-warm-ivory">All Cultural Categories</span>
            )}
          </div>
        </div>
      </div>

      {/* CTAs: Invite Friends & Continue Exploring */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/referral"
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-widest bg-champagne text-obsidian hover:bg-warm-ivory transition-all duration-300 rounded-sm shadow-xl w-full sm:w-auto"
        >
          <Share2 className="w-4 h-4" />
          <span>Invite Friends</span>
        </Link>

        <Link
          href="/experiences"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-medium uppercase tracking-widest border border-warm-ivory/20 text-warm-ivory hover:border-champagne hover:text-champagne transition-all duration-300 rounded-sm w-full sm:w-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Continue Exploring</span>
        </Link>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory relative overflow-hidden flex items-center justify-center">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

      <Suspense fallback={
        <div className="text-center text-muted-stone text-xs font-mono uppercase tracking-widest animate-pulse">
          Loading Reservation Pass...
        </div>
      }>
        <SuccessContent />
      </Suspense>
    </div>
  );
}
