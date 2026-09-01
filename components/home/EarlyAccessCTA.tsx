"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export default function EarlyAccessCTA() {
  return (
    <section className="py-28 md:py-36 bg-obsidian relative overflow-hidden border-t border-warm-ivory/10">
      {/* Background Soft Ambient Lights */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-burgundy/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-champagne/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 lg:px-12 text-center space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-xs uppercase tracking-widest font-mono"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Membership Waitlist Open</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="font-editorial text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-warm-ivory leading-[1.1] font-light"
        >
          Be first to enter <br />
          <span className="italic text-champagne">the secret table.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-base sm:text-lg text-muted-stone max-w-xl mx-auto font-light leading-relaxed"
        >
          Encoreats invitations are released in limited seasonal batches. Request early access to secure priority reservations and private invitations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/early-access"
            className="group inline-flex items-center justify-center gap-3 px-9 py-4 text-xs font-semibold uppercase tracking-widest bg-warm-ivory text-obsidian hover:bg-champagne transition-all duration-300 rounded-sm shadow-xl w-full sm:w-auto"
          >
            <span>Apply for Early Access</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/experiences"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs font-medium uppercase tracking-widest border border-warm-ivory/20 text-warm-ivory hover:border-champagne hover:text-champagne transition-all duration-300 rounded-sm w-full sm:w-auto"
          >
            <span>Browse Catalog</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
