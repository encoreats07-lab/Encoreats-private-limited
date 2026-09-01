"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Eye, Sparkles, Users } from "lucide-react";

export default function WhyEncoreats() {
  const pillars = [
    {
      icon: Eye,
      title: "Strict Curation",
      description: "Every experience is vetted by our cultural board. No tourist traps, no mass crowds—only intimate, exceptional artistry.",
    },
    {
      icon: Sparkles,
      title: "Secret Locations",
      description: "Uncover subterranean banking vaults, private residential attics, and high-altitude observatory viewports.",
    },
    {
      icon: Users,
      title: "Discerning Community",
      description: "Gather with fellow gourmands, audiophiles, collectors, and creators who value depth over volume.",
    },
    {
      icon: ShieldCheck,
      title: "Unmatched Privacy",
      description: "No camera phones inside select rooms. Complete discretion and sensory focus for every guest.",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-deep-onyx border-t border-warm-ivory/10 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs uppercase tracking-widest text-champagne font-mono">
            The Encoreats Standard
          </span>
          <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
            Why Encoreats?
          </h2>
          <p className="text-muted-stone text-base font-light">
            Built for people who view dining, music, and art as cultural rituals worth showing up for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-sm space-y-4 hover:border-champagne/40 transition-colors group"
              >
                <div className="w-12 h-12 rounded-sm bg-warm-ivory/5 border border-warm-ivory/10 flex items-center justify-center text-champagne group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-editorial text-2xl text-warm-ivory group-hover:text-champagne transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-muted-stone leading-relaxed font-light">
                  {pillar.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
