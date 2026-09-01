"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Compass, ShieldCheck } from "lucide-react";

function ApplySuccessContent() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type") || "partner";
  const name = searchParams.get("name") || "Partner";

  const isArtist = type === "artist";

  return (
    <div className="max-w-2xl mx-auto px-6 text-center space-y-8 relative z-10">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-20 h-20 mx-auto rounded-full bg-champagne/10 border border-champagne/40 flex items-center justify-center text-champagne"
      >
        <CheckCircle2 className="w-10 h-10" />
      </motion.div>

      <div className="space-y-3">
        <span className="text-xs uppercase tracking-widest text-champagne font-mono">
          Submission Status: Under Review
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
          Application received.
        </h1>
        <p className="text-muted-stone text-base font-light max-w-lg mx-auto leading-relaxed">
          Thank you, <strong className="text-warm-ivory font-medium">{name}</strong>. The Encoreats cultural committee has received your {isArtist ? "artist residency" : "venue partnership"} dossier.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-sm text-left max-w-md mx-auto space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-warm-ivory/10 pb-2">
          <span className="text-muted-stone">Application Type:</span>
          <span className="text-champagne uppercase font-semibold">
            {isArtist ? "Artist / Creator" : "Venue Host"}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-warm-ivory/10 pb-2">
          <span className="text-muted-stone">Review Period:</span>
          <span className="text-warm-ivory">2 – 3 Business Days</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-stone">Direct Contact:</span>
          <span className="text-warm-ivory">atelier@encoreats.com</span>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/partner"
          className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-semibold uppercase tracking-widest bg-warm-ivory text-obsidian hover:bg-champagne transition-all duration-300 rounded-sm shadow-xl w-full sm:w-auto"
        >
          <span>Back to Partner Portal</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="/experiences"
          className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-medium uppercase tracking-widest border border-warm-ivory/20 text-warm-ivory hover:border-champagne hover:text-champagne transition-all duration-300 rounded-sm w-full sm:w-auto"
        >
          <Compass className="w-4 h-4" />
          <span>Explore Experiences</span>
        </Link>
      </div>
    </div>
  );
}

export default function ApplySuccessPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

      <Suspense fallback={
        <div className="text-center text-muted-stone text-xs font-mono uppercase tracking-widest animate-pulse">
          Loading Submission Dossier...
        </div>
      }>
        <ApplySuccessContent />
      </Suspense>
    </div>
  );
}
