"use client";

import Link from "next/link";
import Image from "next/image";
import { Compass, ArrowRight, Sparkles, UserCheck, ShieldCheck, HeartHandshake } from "lucide-react";

export default function PartnerHostsPage() {
  const hostCategories = [
    {
      title: "Culinary & Secret Suppers",
      desc: "Private multi-course tasting menus, foraging suppers, and pop-up dining tables.",
    },
    {
      title: "Analogue Vinyl & Sound",
      desc: "Hi-Fi listening sessions, ambient sound baths, and acoustic string performances.",
    },
    {
      title: "Cultural Salons & Storytelling",
      desc: "Intimate monologues, spoken word, philosophy, and private gallery walkthroughs.",
    },
    {
      title: "Botanical Craft & Workshops",
      desc: "Low-intervention wine tastings, botanical cocktail crafting, and artisan workshops.",
    },
  ];

  return (
    <div className="pt-28 pb-24 min-h-screen bg-obsidian text-warm-ivory">
      {/* Hero */}
      <section className="relative min-h-[80vh] flex items-center justify-center py-20 overflow-hidden bg-obsidian border-b border-warm-ivory/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=2000&q=90"
            alt="Experience Host Atelier"
            fill
            priority
            className="object-cover object-center filter brightness-[0.25] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/75 to-obsidian/40" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full">
          <div className="max-w-3xl space-y-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-xs uppercase tracking-widest font-mono">
              <Compass className="w-3.5 h-3.5" />
              <span>Experience Hosts</span>
            </div>

            <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-warm-ivory leading-[1.05] font-light">
              Turn your passion into <br />
              curated <span className="italic text-gradient-champagne">gatherings.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-stone max-w-2xl leading-relaxed font-light">
              As an Encoreats Experience Host, you bring the narrative and expertise. We handle guest curation, spatial matching, and ticketing architecture.
            </p>

            <div className="pt-4">
              <Link
                href="/apply/host"
                className="px-8 py-4 text-xs font-semibold uppercase tracking-widest bg-champagne text-obsidian hover:bg-warm-ivory transition-all duration-300 rounded-sm shadow-xl inline-flex items-center gap-2"
              >
                <span>Apply as Experience Host</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-deep-onyx border-b border-warm-ivory/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-champagne font-mono">Host Formats</span>
            <h2 className="font-editorial text-4xl sm:text-5xl text-warm-ivory font-light">What You Can Host</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hostCategories.map((c) => (
              <div key={c.title} className="p-8 glass-panel rounded-sm space-y-3 border-l-2 border-l-champagne">
                <h3 className="font-editorial text-2xl text-warm-ivory">{c.title}</h3>
                <p className="text-xs text-muted-stone font-light leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
