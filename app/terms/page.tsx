import { ShieldCheck } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-4xl mx-auto px-6 lg:px-12 space-y-8 w-full">
        <div className="space-y-3 border-b border-warm-ivory/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 text-champagne text-[10px] uppercase font-mono tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal Terms of Service</span>
          </div>
          <h1 className="font-editorial text-4xl text-warm-ivory">Terms of Membership</h1>
          <p className="text-xs text-muted-stone font-mono">Last updated: August 2026</p>
        </div>

        <div className="space-y-6 text-xs text-muted-stone font-light leading-relaxed">
          <p>
            Welcome to <strong>Encoreats</strong>. By requesting early access, participating in our referral program, or applying as a partner host or artist, you agree to abide by these Terms of Service.
          </p>

          <h2 className="font-editorial text-xl text-warm-ivory pt-4">1. Membership & Curation Discretion</h2>
          <p>
            Encoreats operates as a private, curated cultural platform. Early access registration or referral status does not guarantee admission to any specific limited-capacity drop or secret supper.
          </p>

          <h2 className="font-editorial text-xl text-warm-ivory pt-4">2. Guest Code of Conduct</h2>
          <p>
            Guests attending private gatherings are expected to honor host house rules, spatial respect, acoustic privacy, and unannounced location confidentiality. Repeated non-compliance will result in invitation revocation.
          </p>

          <h2 className="font-editorial text-xl text-warm-ivory pt-4">3. Partner Atelier Submissions</h2>
          <p>
            Artists and venue applicants retain full intellectual property and ownership over their creative works and physical properties. Submission grants Encoreats authorization to review provided materials for seasonal curation programming.
          </p>

          <h2 className="font-editorial text-xl text-warm-ivory pt-4">4. Inquiries</h2>
          <p>
            Direct inquiries to <a href="mailto:concierge@encoreats.com" className="text-champagne underline">concierge@encoreats.com</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
