import Link from "next/link";
import Image from "next/image";
import { Sparkles, Compass, ShieldCheck, HeartHandshake, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      title: "Intentionality Over Scale",
      desc: "We refuse the race to commodify culture. Every gathering is capped at intimate capacities where genuine conversation thrives.",
    },
    {
      title: "Reverence for Craft",
      desc: "Whether a 12-course hyper-seasonal tasting menu or a vinyl listening session on vintage vacuum tube amplifiers, we honor the creator's vision.",
    },
    {
      title: "Architectural Soul",
      desc: "Spaces matter. We curate heritage wadas, subterranean vaults, rooftop observatories, and private galleries.",
    },
    {
      title: "Unplugged Presence",
      desc: "We protect the sanctity of the room. Select gatherings encourage guests to disconnect from digital distraction.",
    },
  ];

  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-24">
        {/* Header / Hero Manifesto */}
        <div className="max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 border border-champagne/20 text-champagne text-xs uppercase tracking-widest font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier Manifesto</span>
          </div>
          <h1 className="font-editorial text-5xl sm:text-6xl lg:text-7xl text-warm-ivory font-light leading-[1.08]">
            We build experiences for those who refuse the <span className="italic text-champagne">ordinary.</span>
          </h1>
          <p className="text-muted-stone text-lg md:text-xl font-light leading-relaxed">
            Encoreats was born out of a shared frustration with commercial event directories—oversold venues, generic crowds, and commodified dining. We exist to restore magic, mystery, and intimate human connection to nocturnal culture.
          </p>
        </div>

        {/* The Problem & Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center border-t border-warm-ivory/10 pt-16">
          <div className="lg:col-span-6 relative aspect-[4/3] rounded-sm overflow-hidden glass-panel">
            <Image
              src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80"
              alt="Intimate Secret Table"
              fill
              className="object-cover filter brightness-[0.6] contrast-[1.1]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest text-champagne font-mono">
              The Urban Cultural Dilemma
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-warm-ivory font-light">
              Better Reasons to Leave Home
            </h2>

            <div className="space-y-4 text-xs text-muted-stone font-light leading-relaxed">
              <p>
                Modern cities are filled with world-class chefs, vinyl collectors, acoustic musicians, and extraordinary spaces. Yet discovering these moments remains fragmented across social media whispers and transactional ticketing websites.
              </p>
              <p>
                Encoreats acts as a curated bridge: a private atelier connecting discerning guests with creators who view hospitality and art as an unrepeatable nocturnal performance.
              </p>
            </div>
          </div>
        </div>

        {/* Core Values Grid */}
        <div className="space-y-12 border-t border-warm-ivory/10 pt-16">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-champagne font-mono">Our Pillars</span>
            <h2 className="font-editorial text-4xl text-warm-ivory font-light">Company Values</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {values.map((v) => (
              <div key={v.title} className="p-8 glass-panel rounded-sm space-y-3 border-l-2 border-l-champagne">
                <h3 className="font-editorial text-2xl text-warm-ivory">{v.title}</h3>
                <p className="text-xs text-muted-stone font-light leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-12 glass-panel rounded-sm text-center space-y-6 max-w-3xl mx-auto border-champagne/20">
          <h2 className="font-editorial text-3xl sm:text-4xl text-warm-ivory">
            Join us at the secret table.
          </h2>
          <p className="text-xs text-muted-stone max-w-md mx-auto leading-relaxed">
            Apply for membership or request early access to seasonal invitations in your city.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/early-access"
              className="px-8 py-3.5 text-xs uppercase tracking-widest font-semibold bg-champagne text-obsidian rounded-xs hover:bg-warm-ivory transition-colors"
            >
              Apply for Early Access
            </Link>
            <Link
              href="/partners"
              className="px-8 py-3.5 text-xs uppercase tracking-widest font-medium border border-warm-ivory/20 text-warm-ivory hover:border-champagne hover:text-champagne transition-colors"
            >
              Partner Atelier
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
