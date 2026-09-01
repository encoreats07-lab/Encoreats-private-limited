"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import LuxurySculptureCanvas from "@/components/3d/LuxurySculptureCanvas";

export default function EditorialHero() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-obsidian">
      {/* Background Image Layer with Cinematic Darkness & Blur */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=90"
          alt="Encoreats Cinematic Ambiance"
          fill
          priority
          className="object-cover object-center filter brightness-[0.22] contrast-[1.1] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-transparent to-obsidian/80" />
        <div className="absolute inset-0 bg-noise opacity-40 mix-blend-overlay" />
      </div>

      {/* Interactive 3D Satin Sculpture (Desktop Only) */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[80%] z-10 hidden lg:block opacity-80 pointer-events-none">
        <LuxurySculptureCanvas />
      </div>

      {/* Main Editorial Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="max-w-3xl space-y-8">
          {/* Subtitle / Kicker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-warm-ivory/10 border border-warm-ivory/15 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-warm-ivory font-mono font-medium">
              Curated Cultural Experiences
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-warm-ivory leading-[1.05]"
          >
            Experiences worth <br className="hidden sm:inline" />
            <span className="italic font-normal text-gradient-champagne">showing up</span> for.
          </motion.h1>

          {/* Secondary Explanation Copy */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="text-base sm:text-lg md:text-xl text-muted-stone max-w-xl leading-relaxed font-light"
          >
            Secret chef tables, analogue vinyl sanctuaries, rooftop stargazing, and private gallery salons. Reserved for those who seek the extraordinary.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6"
          >
            <Link
              href="/experiences"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-xs font-semibold uppercase tracking-widest bg-warm-ivory text-obsidian hover:bg-champagne transition-all duration-300 rounded-sm shadow-xl"
            >
              <span>Explore Experiences</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/early-access"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-medium uppercase tracking-widest border border-warm-ivory/25 text-warm-ivory hover:border-champagne hover:text-champagne transition-all duration-300 rounded-sm backdrop-blur-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Join Early Access</span>
            </Link>
          </motion.div>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="pt-12 grid grid-cols-3 gap-6 max-w-lg border-t border-warm-ivory/10 text-warm-ivory"
          >
            <div>
              <div className="font-editorial text-2xl lg:text-3xl text-champagne font-light">6</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-stone mt-1">Curated Cities</div>
            </div>
            <div>
              <div className="font-editorial text-2xl lg:text-3xl text-champagne font-light">12+</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-stone mt-1">Weekly Tables</div>
            </div>
            <div>
              <div className="font-editorial text-2xl lg:text-3xl text-champagne font-light">100%</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-stone mt-1">Hand-Selected</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
