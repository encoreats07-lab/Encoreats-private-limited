"use client";

import { motion } from "framer-motion";

export default function EditorialManifesto() {
  return (
    <section className="py-28 md:py-36 bg-deep-onyx border-y border-warm-ivory/10 relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-champagne/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 text-center space-y-10 relative z-10">
        <motion.span
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-xs uppercase tracking-widest text-champagne font-mono"
        >
          The Encoreats Manifesto
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-warm-ivory leading-[1.15] font-light"
        >
          “Not just places to go. <br className="hidden sm:inline" />
          <span className="italic text-champagne">Stories</span> to be part of.”
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto space-y-6 text-muted-stone text-base md:text-lg leading-relaxed font-light"
        >
          <p>
            We believe the night belongs to curiosity. In an era of algorithm-driven event lists and mass crowds, Encoreats curates quiet sanctuaries of exceptional craft.
          </p>
          <p>
            From blind dining in century-old banking vaults to intimate analogue vinyl sessions behind secret curtains—every experience is limited, intentional, and unforgettable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="pt-6 inline-flex items-center gap-3 text-xs uppercase tracking-widest text-warm-ivory font-medium"
        >
          <div className="w-12 h-[1px] bg-champagne" />
          <span>Curated by Master Artisans & Hosts</span>
          <div className="w-12 h-[1px] bg-champagne" />
        </motion.div>
      </div>
    </section>
  );
}
