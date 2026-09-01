"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Copy, Check, Share2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

function ReferralContent() {
  const searchParams = useSearchParams();
  const codeParam = searchParams.get("code") || "ENCORE-VIP";

  const [referralData, setReferralData] = useState({
    code: codeParam,
    userName: "Member",
    referralCount: 0,
    currentTier: "Explorer",
    nextTier: "Priority Access",
    targetReferrals: 1,
    progressPercent: 0,
    shareUrl: typeof window !== "undefined" ? `${window.location.origin}/early-access?ref=${codeParam}` : "",
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchReferralStats() {
      if (!codeParam || codeParam === "ENCORE-VIP") return;

      try {
        const res = await fetch(`/api/referrals/${encodeURIComponent(codeParam)}`);
        const result = await res.json();

        if (res.ok && result.success) {
          setReferralData(result.data);
        }
      } catch (e: unknown) {
        console.error("Error loading referral stats:", e);
      }
    }

    fetchReferralStats();
  }, [codeParam]);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralData.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Encoreats — Private Cultural Experiences",
          text: "Join me on the Encoreats waitlist for secret dining tables and vinyl listening sanctuaries.",
          url: referralData.shareUrl,
        })
        .catch(() => {});
    } else {
      handleCopy();
    }
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory relative overflow-hidden flex items-center justify-center">
      {/* Background Soft Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-champagne/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-2xl mx-auto px-6 text-center space-y-10 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-xs uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Invitation Circle</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light leading-tight">
            Extend the secret table.
          </h1>

          <p className="text-muted-stone text-base font-light max-w-lg mx-auto leading-relaxed">
            Invite friends to join the Encoreats waitlist. Members who curate their personal circle unlock priority table reservations and private host tastings.
          </p>
        </div>

        {/* Sophisticated Referral Card */}
        <div className="glass-panel p-8 rounded-sm space-y-6 max-w-lg mx-auto border-champagne/20">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-stone font-mono">
              <span>Your Personal Access Code</span>
              <span className="text-champagne flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                {referralData.currentTier} Tier
              </span>
            </div>

            <div className="flex items-center justify-between bg-deep-onyx p-4 rounded-xs border border-warm-ivory/15 font-mono text-sm tracking-wider text-warm-ivory">
              <span className="text-champagne font-semibold">{referralData.code}</span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs text-warm-ivory hover:text-champagne transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2 text-left pt-2 border-t border-warm-ivory/10">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-muted-stone">Circle Progress:</span>
              <span className="text-warm-ivory font-semibold">
                {referralData.referralCount} Members Joined
              </span>
            </div>

            <div className="w-full h-2 bg-deep-onyx rounded-full overflow-hidden border border-warm-ivory/10">
              <div
                className="h-full bg-gradient-to-r from-champagne to-champagne-light transition-all duration-700"
                style={{ width: `${referralData.progressPercent}%` }}
              />
            </div>

            <p className="text-[11px] text-muted-stone font-light pt-1">
              Next Milestone: <span className="text-warm-ivory">{referralData.nextTier}</span> ({referralData.referralCount}/{referralData.targetReferrals} referrals)
            </p>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-full py-3.5 text-xs font-semibold uppercase tracking-widest bg-warm-ivory text-obsidian hover:bg-champagne transition-all duration-300 rounded-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share Invitation Link</span>
          </button>
        </div>

        {/* Back Link */}
        <div>
          <Link
            href="/experiences"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-stone hover:text-champagne transition-colors font-mono"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ReferralPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-24 text-center text-muted-stone font-mono uppercase text-xs">Loading Invitation Circle...</div>}>
      <ReferralContent />
    </Suspense>
  );
}
