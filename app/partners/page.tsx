"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Building2, UserCheck, Users, ShieldCheck, Compass, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";

export default function PartnersHubPage() {
  const scrollToPaths = () => {
    const el = document.getElementById("partnership-paths");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory font-sans selection:bg-champagne selection:text-obsidian">
      <Navbar />

      {/* 1. Cinematic Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-32 pb-20 overflow-hidden border-b border-warm-ivory/10">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=90"
            alt="Encoreats Cultural Partnership"
            fill
            priority
            className="object-cover object-center filter brightness-[0.22] contrast-[1.15]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/80 to-obsidian/40" />
          <div className="absolute inset-0 bg-noise opacity-30 mix-blend-overlay" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-12 w-full text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-warm-ivory/10 border border-warm-ivory/20 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-champagne" />
              <span className="text-xs uppercase tracking-widest text-warm-ivory font-mono">
                Encoreats Partnership Atelier
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="font-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-warm-ivory leading-[1.05] font-light"
            >
              Your world deserves <br />
              the <span className="italic text-gradient-champagne font-normal">right audience.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-muted-stone max-w-2xl mx-auto leading-relaxed font-light"
            >
              Bring your craft, architectural space, or cultural perspective into the Encoreats ecosystem. We co-create gatherings built on artistic intention and mutual reverence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            >
              <button
                onClick={scrollToPaths}
                className="w-full sm:w-auto px-8 py-4 text-xs font-semibold uppercase tracking-widest bg-champagne text-obsidian hover:bg-champagne-light transition-all rounded-lg shadow-2xl flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Become a Partner</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToPaths}
                className="w-full sm:w-auto px-8 py-4 text-xs font-mono uppercase tracking-widest border border-warm-ivory/20 text-warm-ivory hover:border-champagne hover:text-champagne transition-all rounded-lg cursor-pointer"
              >
                Explore Partnership Paths
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Why Partner With Encoreats */}
      <section className="py-24 md:py-32 bg-deep-onyx border-b border-warm-ivory/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          <div className="max-w-3xl border-b border-warm-ivory/10 pb-8">
            <span className="text-xs uppercase tracking-widest text-champagne font-mono block mb-2">
              Strategic Advantages
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
              Why Partner with Encoreats?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                num: "01",
                title: "Curated Audience",
                desc: "Connect with guests who genuinely value culinary craft, acoustic sanctuaries, and artistic storytelling.",
              },
              {
                num: "02",
                title: "Premium Production",
                desc: "Encoreats supports experience design, guest management, spatial production, and concierge ticketing.",
              },
              {
                num: "03",
                title: "Meaningful Revenue",
                desc: "Monetize non-peak hours or private craft with high-tier ticketed cultural experiences.",
              },
              {
                num: "04",
                title: "Brand Positioning",
                desc: "Elevate your reputation by taking part in an exclusive international cultural roster.",
              },
            ].map((item, idx) => (
              <motion.div
                key={item.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="glass-panel p-8 rounded-xl space-y-4 border-l-2 border-l-champagne/60 hover:border-l-champagne transition-all"
              >
                <span className="text-xs font-mono text-champagne">{item.num}.</span>
                <h3 className="font-editorial text-2xl text-warm-ivory">{item.title}</h3>
                <p className="text-xs text-muted-stone leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Partnership Paths */}
      <section id="partnership-paths" className="py-24 md:py-32 bg-obsidian border-b border-warm-ivory/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-champagne font-mono block">
              Collaboration Categories
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
              Choose Your Partnership Path
            </h2>
            <p className="text-xs md:text-sm text-muted-stone">
              We offer bespoke collaboration tracks customized for artists, spaces, and experience directors.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Path 1: Artists & Creators */}
            <div className="glass-card p-8 rounded-xl border border-warm-ivory/15 flex flex-col justify-between hover:border-champagne/40 transition-all group">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-lg bg-warm-ivory/5 border border-warm-ivory/10 flex items-center justify-center text-champagne">
                  <UserCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-champagne tracking-wider">
                    Creative Discipline
                  </span>
                  <h3 className="font-editorial text-3xl text-warm-ivory mt-1">Artists & Creators</h3>
                </div>
                <p className="text-xs text-muted-stone leading-relaxed">
                  For chefs, mixologists, musicians, DJs, storytellers, comedians, visual artists, and immersive performers seeking intimate, attentive audiences.
                </p>
              </div>

              <div className="pt-8 border-t border-warm-ivory/10 space-y-3 mt-8">
                <Link
                  href="/apply/artist"
                  className="w-full py-3.5 px-4 bg-champagne text-obsidian font-mono text-xs uppercase tracking-wider rounded-lg font-medium hover:bg-champagne-light transition-all flex items-center justify-center gap-2"
                >
                  <span>Apply as Artist</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/partner/artists"
                  className="block text-center text-xs font-mono uppercase tracking-wider text-muted-stone hover:text-warm-ivory py-2 transition-colors"
                >
                  Explore Artist Atelier
                </Link>
              </div>
            </div>

            {/* Path 2: Venues & Spaces */}
            <div className="glass-card p-8 rounded-xl border border-warm-ivory/15 flex flex-col justify-between hover:border-champagne/40 transition-all group">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-lg bg-warm-ivory/5 border border-warm-ivory/10 flex items-center justify-center text-champagne">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-champagne tracking-wider">
                    Architectural Assets
                  </span>
                  <h3 className="font-editorial text-3xl text-warm-ivory mt-1">Venues & Spaces</h3>
                </div>
                <p className="text-xs text-muted-stone leading-relaxed">
                  For heritage properties, rooftops, galleries, recording studios, secret dining rooms, and private residences with unique architectural character.
                </p>
              </div>

              <div className="pt-8 border-t border-warm-ivory/10 space-y-3 mt-8">
                <Link
                  href="/apply/venue"
                  className="w-full py-3.5 px-4 bg-warm-ivory text-obsidian font-mono text-xs uppercase tracking-wider rounded-lg font-medium hover:bg-champagne transition-all flex items-center justify-center gap-2"
                >
                  <span>Apply as Venue</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/partner/venues"
                  className="block text-center text-xs font-mono uppercase tracking-wider text-muted-stone hover:text-warm-ivory py-2 transition-colors"
                >
                  Explore Venue Guidelines
                </Link>
              </div>
            </div>

            {/* Path 3: Experience Hosts */}
            <div className="glass-card p-8 rounded-xl border border-warm-ivory/15 flex flex-col justify-between hover:border-champagne/40 transition-all group">
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-lg bg-warm-ivory/5 border border-warm-ivory/10 flex items-center justify-center text-champagne">
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-mono uppercase text-champagne tracking-wider">
                    Curation & Community
                  </span>
                  <h3 className="font-editorial text-3xl text-warm-ivory mt-1">Experience Hosts</h3>
                </div>
                <p className="text-xs text-muted-stone leading-relaxed">
                  For cultural curators, salon hosts, and community builders who design, host, and curate multi-disciplinary gatherings.
                </p>
              </div>

              <div className="pt-8 border-t border-warm-ivory/10 space-y-3 mt-8">
                <Link
                  href="/apply/host"
                  className="w-full py-3.5 px-4 bg-deep-onyx border border-champagne text-champagne font-mono text-xs uppercase tracking-wider rounded-lg font-medium hover:bg-champagne hover:text-obsidian transition-all flex items-center justify-center gap-2"
                >
                  <span>Apply as Host</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/partners/hosts"
                  className="block text-center text-xs font-mono uppercase tracking-wider text-muted-stone hover:text-warm-ivory py-2 transition-colors"
                >
                  Explore Host Program
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How Partnership Works (5-Step Timeline) */}
      <section className="py-24 md:py-32 bg-deep-onyx border-b border-warm-ivory/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          <div className="max-w-3xl border-b border-warm-ivory/10 pb-8">
            <span className="text-xs uppercase tracking-widest text-champagne font-mono block mb-2">
              Execution Roadmap
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
              How Partnership Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              { step: "01", title: "Apply", desc: "Submit application & portfolio." },
              { step: "02", title: "Discovery", desc: "Consultation with curation team." },
              { step: "03", title: "Design", desc: "Co-design spatial & ticket model." },
              { step: "04", title: "Production", desc: "Encoreats handles marketing & ops." },
              { step: "05", title: "Launch", desc: "Host experience for curated audience." },
            ].map((st) => (
              <div key={st.step} className="glass-panel p-6 rounded-xl space-y-3 relative">
                <span className="text-3xl font-editorial text-champagne font-light block">{st.step}</span>
                <h3 className="font-mono text-xs uppercase tracking-wider text-warm-ivory">{st.title}</h3>
                <p className="text-xs text-muted-stone">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Final Cinematic Call-to-Action */}
      <section className="py-28 bg-obsidian text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 relative z-10 space-y-6">
          <h2 className="font-editorial text-4xl sm:text-5xl text-warm-ivory">
            There is an audience waiting for your world.
          </h2>
          <p className="text-xs sm:text-sm text-muted-stone max-w-lg mx-auto">
            Submit your portfolio or venue proposal today for review by the Encoreats Curation Board.
          </p>
          <div className="pt-4">
            <Link
              href="/apply/artist"
              className="inline-flex items-center gap-2 px-8 py-4 bg-champagne text-obsidian font-mono text-xs uppercase tracking-widest rounded-lg font-medium hover:bg-champagne-light transition-all shadow-xl"
            >
              <span>Begin Partnership Application</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
