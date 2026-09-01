"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Building2, ArrowRight, ShieldCheck, Sparkles, MapPin } from "lucide-react";

export default function PartnerVenuesPage() {
  const venueTypes = [
    { title: "Heritage Wadas & Vaults", desc: "18th-century courtyards, subterranean banking vaults, and historic stone arches." },
    { title: "Rooftop Observatories", desc: "Unobstructed high-elevation urban viewports with stargazing capabilities." },
    { title: "Art Ateliers & Galleries", desc: "High-ceilinged studio lofts, private exhibition spaces, and sculpture gardens." },
    { title: "Vinyl Listening Lounges", desc: "Acoustically insulated rooms designed for warmth, wood tone, and Hi-Fi audio." },
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-obsidian text-warm-ivory">
      {/* Hero Banner */}
      <section className="relative min-h-[75vh] flex items-center justify-center py-20 overflow-hidden bg-obsidian border-b border-warm-ivory/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=90"
            alt="Encoreats Unique Venues"
            fill
            priority
            className="object-cover object-center filter brightness-[0.25] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/70 to-obsidian/40" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-3xl space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-xs uppercase tracking-widest font-mono"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Venue & Location Partnership</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-editorial text-5xl sm:text-6xl lg:text-7xl text-warm-ivory font-light leading-tight"
            >
              Turn your space into <br />
              an <span className="italic text-gradient-champagne">experience.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg text-muted-stone max-w-xl font-light leading-relaxed"
            >
              Transform off-peak hours, hidden rooms, and architectural gems into exclusive nocturnal gatherings for respectful, high-value guests.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="pt-4"
            >
              <Link
                href="/apply/venue"
                className="inline-flex items-center gap-3 px-8 py-4 text-xs font-semibold uppercase tracking-widest bg-champagne text-obsidian hover:bg-warm-ivory transition-all duration-300 rounded-sm shadow-xl"
              >
                <span>Apply as a Venue Host</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Look For */}
      <section className="py-24 bg-deep-onyx border-b border-warm-ivory/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          <div className="max-w-3xl space-y-4 border-b border-warm-ivory/10 pb-6">
            <span className="text-xs uppercase tracking-widest text-champagne font-mono">
              Architectural Selection
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-warm-ivory font-light">
              What We Look For in a Space
            </h2>
            <p className="text-muted-stone text-sm font-light">
              We seek locations with distinct atmospheric character, privacy, and architectural storytelling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {venueTypes.map((v, idx) => (
              <div key={v.title} className="glass-panel p-8 rounded-sm space-y-3">
                <span className="text-xs font-mono text-champagne">Category 0{idx + 1}</span>
                <h3 className="font-editorial text-2xl text-warm-ivory">{v.title}</h3>
                <p className="text-xs text-muted-stone leading-relaxed font-light">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="pt-6 text-center">
            <Link
              href="/apply/venue"
              className="inline-flex items-center gap-3 px-9 py-4 text-xs font-semibold uppercase tracking-widest bg-warm-ivory text-obsidian hover:bg-champagne transition-colors rounded-sm shadow-xl"
            >
              <span>Submit Venue Listing</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
