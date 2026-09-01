"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Share2,
  Calendar,
  Lock,
  X,
  Loader2,
} from "lucide-react";
import { EXPERIENCES } from "@/data/experiences";

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const experience = EXPERIENCES.find((e) => e.slug === slug);

  const [isInterested, setIsInterested] = useState(false);
  const [loadingInterest, setLoadingInterest] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Check if user already registered interest for this experience
    async function checkInterest() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.bookings) {
            const hasBooking = data.bookings.some(
              (b: any) => b.experience?.slug === slug || b.experienceId === experience?.id
            );
            if (hasBooking) setIsInterested(true);
          }
        }
      } catch (err) {}
    }
    checkInterest();
  }, [slug, experience?.id]);

  if (!experience) {
    return (
      <div className="pt-36 pb-24 text-center text-warm-ivory max-w-lg mx-auto space-y-6">
        <h1 className="font-editorial text-4xl">Experience Not Found</h1>
        <p className="text-muted-stone text-sm">
          The curated gathering you are looking for does not exist or has concluded.
        </p>
        <Link
          href="/experiences"
          className="inline-block px-6 py-3 text-xs uppercase tracking-widest bg-champagne text-obsidian rounded-xs font-semibold"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleInterestToggle = async () => {
    setLoadingInterest(true);
    try {
      const res = await fetch("/api/experiences/interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experienceSlug: slug }),
      });

      const data = await res.json();

      if (res.status === 401 || data.requireAuth) {
        setShowAuthModal(true);
        setLoadingInterest(false);
        return;
      }

      if (res.ok && data.success) {
        setIsInterested(data.isInterested);
      }
    } catch (err) {
      console.error("Interest toggle error:", err);
    } finally {
      setLoadingInterest(false);
    }
  };

  return (
    <article className="pt-28 pb-24 min-h-screen bg-obsidian text-warm-ivory">
      {/* Back Link Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-6">
        <Link
          href="/experiences"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-stone hover:text-champagne transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Experiences</span>
        </Link>
      </div>

      {/* Hero Header Image Banner */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-sm overflow-hidden glass-panel">
          <Image
            src={experience.image}
            alt={experience.title}
            fill
            priority
            sizes="100vw"
            className="object-cover filter brightness-[0.6] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

          {/* Badges Overlay */}
          <div className="absolute top-6 left-6 z-10 flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 text-xs uppercase tracking-widest bg-champagne text-obsidian font-semibold rounded-xs">
              {experience.category}
            </span>
            <span className="px-3 py-1 text-xs uppercase tracking-widest bg-obsidian/70 backdrop-blur-md border border-warm-ivory/20 text-warm-ivory rounded-xs flex items-center gap-1.5 font-mono">
              <MapPin className="w-3.5 h-3.5 text-champagne" />
              {experience.city}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="absolute top-6 right-6 z-10 p-2.5 rounded-full bg-obsidian/70 backdrop-blur-md border border-warm-ivory/20 text-warm-ivory hover:text-champagne transition-colors cursor-pointer"
            title="Share Experience"
          >
            <Share2 className="w-4 h-4" />
            {copied && (
              <span className="absolute right-12 top-2 text-[10px] uppercase font-mono px-2 py-1 bg-champagne text-obsidian rounded-xs whitespace-nowrap">
                Link Copied
              </span>
            )}
          </button>

          {/* Main Title Overlay */}
          <div className="absolute bottom-8 left-8 right-8 z-10 space-y-2">
            <p className="text-xs uppercase tracking-widest text-champagne/90 font-mono">
              {experience.venue} • {experience.neighborhood}
            </p>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light leading-tight">
              {experience.title}
            </h1>
            <p className="text-base sm:text-lg text-muted-stone max-w-2xl font-light italic">
              {experience.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Narrative Story & Experience Details */}
        <div className="lg:col-span-8 space-y-12">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 glass-panel rounded-sm">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-stone font-mono block">
                Price
              </span>
              <span className="text-base font-editorial text-champagne font-semibold">
                {experience.price}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-stone font-mono block">
                Schedule
              </span>
              <span className="text-xs text-warm-ivory flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-champagne" />
                {experience.date}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-stone font-mono block">
                Duration
              </span>
              <span className="text-xs text-warm-ivory flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-champagne" />
                {experience.duration}
              </span>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-muted-stone font-mono block">
                Capacity
              </span>
              <span className="text-xs text-warm-ivory flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-champagne" />
                {experience.groupSize}
              </span>
            </div>
          </div>

          {/* Narrative Story */}
          <div className="space-y-4">
            <h2 className="font-editorial text-3xl text-warm-ivory border-b border-warm-ivory/10 pb-3">
              The Experience Narrative
            </h2>
            <p className="text-base text-muted-stone leading-relaxed font-light whitespace-pre-line">
              {experience.story}
            </p>
          </div>

          {/* Highlights */}
          <div className="space-y-4">
            <h3 className="font-editorial text-2xl text-warm-ivory">
              Curated Highlights
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {experience.highlights.map((highlight, idx) => (
                <li
                  key={idx}
                  className="p-4 glass-panel rounded-xs flex items-start gap-3 text-xs text-warm-ivory font-light"
                >
                  <Sparkles className="w-4 h-4 text-champagne shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What to Expect */}
          <div className="space-y-4">
            <h3 className="font-editorial text-2xl text-warm-ivory">
              What to Expect
            </h3>
            <div className="space-y-3">
              {experience.whatToExpect.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 border-l-2 border-champagne/40 bg-deep-onyx/60 text-xs text-muted-stone leading-relaxed"
                >
                  <span className="text-champagne font-mono text-xs font-semibold">
                    0{idx + 1}.
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Host / Chef Bio */}
          <div className="p-8 glass-panel rounded-sm flex flex-col sm:flex-row items-center gap-6 border-l-4 border-l-champagne">
            <div className="relative w-20 h-20 rounded-full overflow-hidden shrink-0 border border-champagne/30">
              <Image
                src={experience.chefOrHost.avatar}
                alt={experience.chefOrHost.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-widest text-champagne font-mono">
                Curator & Host
              </span>
              <h4 className="font-editorial text-2xl text-warm-ivory">
                {experience.chefOrHost.name}
              </h4>
              <p className="text-xs text-champagne/80 font-mono">
                {experience.chefOrHost.title}
              </p>
              <p className="text-xs text-muted-stone font-light leading-relaxed pt-1">
                {experience.chefOrHost.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Right Sticky Reservation Interest Widget */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 glass-panel p-8 rounded-sm space-y-6">
            <div className="space-y-2 border-b border-warm-ivory/10 pb-4">
              <span className="text-xs uppercase tracking-widest text-champagne font-mono">
                Curated Gathering
              </span>
              <div className="flex items-baseline justify-between">
                <span className="font-editorial text-3xl text-warm-ivory">
                  {experience.price}
                </span>
                <span className="text-xs text-muted-stone font-mono">
                  {experience.time}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-muted-stone font-light">
              <div className="flex items-center justify-between">
                <span>Location:</span>
                <span className="text-warm-ivory font-mono">{experience.venue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Date:</span>
                <span className="text-warm-ivory font-mono">{experience.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Access:</span>
                <span className="text-champagne font-mono">Limited Guest Pass</span>
              </div>
            </div>

            {/* DB-Backed Interest Toggle CTA */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={loadingInterest}
              onClick={handleInterestToggle}
              className={`w-full py-4 text-xs font-semibold uppercase tracking-widest rounded-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-xl cursor-pointer disabled:opacity-50 ${
                isInterested
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                  : "bg-warm-ivory text-obsidian hover:bg-champagne"
              }`}
            >
              {loadingInterest ? (
                <Loader2 className="w-4 h-4 animate-spin text-current" />
              ) : isInterested ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>YOU&apos;RE INTERESTED</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>I&apos;M INTERESTED</span>
                </>
              )}
            </motion.button>

            {isInterested && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xs bg-emerald-950/40 border border-emerald-500/20 text-center space-y-1"
              >
                <p className="text-xs text-emerald-300 font-medium">
                  Preference Recorded in PostgreSQL!
                </p>
                <p className="text-[11px] text-muted-stone font-light">
                  You will receive priority invitations in your member portal when seats open.
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Auth Prompt Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-panel p-8 rounded-xl border border-warm-ivory/20 max-w-sm w-full space-y-6 text-center relative"
            >
              <button
                onClick={() => setShowAuthModal(false)}
                className="absolute top-4 right-4 text-muted-stone hover:text-warm-ivory cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-full bg-champagne/15 border border-champagne/40 text-champagne mx-auto flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="font-editorial text-2xl text-warm-ivory">Authentication Required</h3>
                <p className="text-xs text-muted-stone leading-relaxed">
                  Please sign in or request early access to register your interest for {experience.title}.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Link
                  href="/login"
                  className="w-full block py-3.5 text-center text-xs uppercase tracking-widest font-semibold bg-champagne text-obsidian rounded-sm"
                >
                  Sign In to Account
                </Link>
                <Link
                  href="/register"
                  className="w-full block py-3 text-center text-xs uppercase tracking-widest font-mono border border-warm-ivory/20 text-warm-ivory rounded-sm"
                >
                  Create Member Profile
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </article>
  );
}
