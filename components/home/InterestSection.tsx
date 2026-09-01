"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { INTERESTS } from "@/data/interests";

export default function InterestSection() {
  const [activeInterest, setActiveInterest] = useState(INTERESTS[0]);

  return (
    <section className="py-24 md:py-32 bg-deep-onyx border-t border-warm-ivory/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-warm-ivory/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-champagne font-mono">
              Cultural Taxonomies
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light mt-2">
              Discover by Interest
            </h2>
          </div>
          <p className="text-sm text-muted-stone max-w-md font-light">
            Filter your journey by passion—from avant-garde gastronomy to vintage vinyl listening rooms.
          </p>
        </div>

        {/* Interactive Editorial Category Selector Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography Category List */}
          <div className="lg:col-span-6 space-y-2">
            {INTERESTS.map((interest) => {
              const isSelected = activeInterest.id === interest.id;
              return (
                <div
                  key={interest.id}
                  onMouseEnter={() => setActiveInterest(interest)}
                  onClick={() => setActiveInterest(interest)}
                  className={`group cursor-pointer py-4 px-6 rounded-sm transition-all duration-300 flex items-center justify-between border-b border-warm-ivory/5 ${
                    isSelected
                      ? "bg-warm-ivory/5 border-l-2 border-l-champagne text-warm-ivory pl-8"
                      : "text-muted-stone hover:text-warm-ivory hover:pl-8"
                  }`}
                >
                  <div className="space-y-1">
                    <span className="font-editorial text-2xl sm:text-3xl lg:text-4xl block transition-colors group-hover:text-champagne">
                      {interest.name}
                    </span>
                    <span className="text-xs text-muted-stone/80 font-light block line-clamp-1">
                      {interest.tagline}
                    </span>
                  </div>
                  <Link
                    href={`/interests/${interest.slug}`}
                    className={`w-8 h-8 rounded-full border border-warm-ivory/20 flex items-center justify-center transition-all ${
                      isSelected
                        ? "text-champagne border-champagne opacity-100"
                        : "opacity-0 group-hover:opacity-100 text-warm-ivory"
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Right Column: Visual Preview Snippet */}
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-sm overflow-hidden glass-panel">
            {INTERESTS.map((interest) => (
              <motion.div
                key={interest.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: activeInterest.id === interest.id ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 z-0"
              >
                <Image
                  src={interest.image}
                  alt={interest.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover filter brightness-[0.6] contrast-[1.1]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8 z-10 space-y-3">
                  <span className="px-3 py-1 text-[10px] uppercase tracking-widest bg-champagne text-obsidian font-semibold rounded-xs">
                    {interest.name} Category
                  </span>
                  <p className="text-base text-warm-ivory font-light leading-relaxed">
                    {interest.description}
                  </p>
                  <Link
                    href={`/interests/${interest.slug}`}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-champagne hover:underline pt-2 font-medium"
                  >
                    <span>Browse {interest.name} Experiences</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
