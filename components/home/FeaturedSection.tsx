"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { EXPERIENCES } from "@/data/experiences";
import ExperienceCard from "@/components/experiences/ExperienceCard";

export default function FeaturedSection() {
  const featured = EXPERIENCES.filter((e) => e.featured);

  return (
    <section className="py-24 md:py-32 bg-obsidian relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-warm-ivory/10 pb-8">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest text-champagne font-mono">
              Curated Edition 01
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
              Featured Experiences
            </h2>
          </div>
          <p className="text-sm text-muted-stone max-w-md font-light">
            Handpicked secret dining tables, analogue audiophile sanctuaries, and private nocturnal galas available this month.
          </p>
        </div>

        {/* Editorial Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Large Highlight Card */}
          {featured[0] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="md:col-span-12 lg:col-span-7"
            >
              <ExperienceCard experience={featured[0]} aspectRatio="landscape" />
            </motion.div>
          )}

          {/* Secondary Cards Column */}
          {featured[1] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="md:col-span-6 lg:col-span-5"
            >
              <ExperienceCard experience={featured[1]} aspectRatio="tall" />
            </motion.div>
          )}

          {/* Third & Fourth Cards */}
          {featured[2] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="md:col-span-6 lg:col-span-5"
            >
              <ExperienceCard experience={featured[2]} aspectRatio="tall" />
            </motion.div>
          )}

          {featured[3] && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="md:col-span-12 lg:col-span-7"
            >
              <ExperienceCard experience={featured[3]} aspectRatio="landscape" />
            </motion.div>
          )}
        </div>

        {/* View All CTA */}
        <div className="pt-8 text-center">
          <Link
            href="/experiences"
            className="inline-flex items-center gap-3 px-8 py-4 text-xs font-semibold uppercase tracking-widest border border-warm-ivory/20 text-warm-ivory hover:border-champagne hover:text-champagne transition-all duration-300 rounded-sm"
          >
            <span>View All Curated Experiences ({EXPERIENCES.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
