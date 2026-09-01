import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  return (
    <footer className="bg-deep-onyx border-t border-warm-ivory/10 pt-20 pb-12 text-warm-ivory relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-champagne/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-warm-ivory/10">
          {/* Brand Manifesto Column */}
          <div className="md:col-span-5 flex flex-col justify-between space-y-6">
            <div>
              <div className="mb-4">
                <Logo variant="full" size="lg" />
              </div>
              <p className="text-muted-stone text-sm max-w-sm leading-relaxed font-light">
                A curated cultural experience platform connecting discerning individuals with secret dining tables, analogue listening rooms, rooftop viewports, and private gallery salons.
              </p>
            </div>
            <div className="text-xs uppercase tracking-widest text-champagne/80 font-mono">
              Experiences Worth Showing Up For.
            </div>
          </div>

          {/* Navigation Links Column */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-muted-stone font-mono">
              Discovery
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/experiences" className="hover:text-champagne transition-colors duration-200">
                  Featured Experiences
                </Link>
              </li>
              <li>
                <Link href="/cities" className="hover:text-champagne transition-colors duration-200">
                  Curated Cities
                </Link>
              </li>
              <li>
                <Link href="/interests" className="hover:text-champagne transition-colors duration-200">
                  Browse by Interest
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-champagne transition-colors duration-200">
                  Our Manifesto
                </Link>
              </li>
              <li>
                <Link href="/early-access" className="hover:text-champagne transition-colors duration-200">
                  Join Waitlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Creators & Partners Column */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-muted-stone font-mono">
              Curators & Partners
            </h4>
            <p className="text-xs text-muted-stone leading-relaxed font-light">
              Are you an executive chef, secret room host, analogue audiophile, or unique venue owner?
            </p>
            <div className="pt-2 flex flex-col space-y-2">
              <Link
                href="/apply/artist"
                className="inline-flex items-center gap-1 text-xs text-champagne hover:underline"
              >
                <span>Apply for Chef & Artist Residency</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/apply/venue"
                className="inline-flex items-center gap-1 text-xs text-champagne hover:underline"
              >
                <span>Submit a Unique Venue Location</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-stone/70 font-light gap-4">
          <p>© {new Date().getFullYear()} Encoreats Platform Inc. All rights reserved.</p>
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-warm-ivory transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-warm-ivory transition-colors">Terms of Curation</Link>
            <Link href="/contact" className="hover:text-warm-ivory transition-colors">Contact Atelier</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
