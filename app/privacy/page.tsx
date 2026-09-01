import { ShieldCheck } from "lucide-react";
import Navbar from "@/components/navigation/Navbar";
import Footer from "@/components/shared/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-obsidian text-warm-ivory flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 pt-32 pb-24 max-w-4xl mx-auto px-6 lg:px-12 space-y-8 w-full">
        <div className="space-y-3 border-b border-warm-ivory/10 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne/10 text-champagne text-[10px] uppercase font-mono tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Legal Privacy Policy</span>
          </div>
          <h1 className="font-editorial text-4xl text-warm-ivory">Privacy Policy</h1>
          <p className="text-xs text-muted-stone font-mono">Last updated: August 2026</p>
        </div>

        <div className="space-y-6 text-xs text-muted-stone font-light leading-relaxed">
          <p>
            At <strong>Encoreats</strong> (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;), we are committed to respecting your privacy and protecting personal data collected through our early access list, partner applications, and curated experience platform.
          </p>

          <h2 className="font-editorial text-xl text-warm-ivory pt-4">1. Information We Collect</h2>
          <p>
            We collect personal details provided voluntarily when you request early access or apply to partner with us, including full name, email address, contact phone number, city of preference, cultural interests, and partner portfolio materials.
          </p>

          <h2 className="font-editorial text-xl text-warm-ivory pt-4">2. Use of Information</h2>
          <p>
            Your information is used strictly to curate relevant invitation drops, calculate referral progress, review partner suitability, dispatch transactional membership communications, and facilitate concierge reservations. We do not sell your personal data.
          </p>

          <h2 className="font-editorial text-xl text-warm-ivory pt-4">3. Data Security & Storage</h2>
          <p>
            Data is stored in encrypted, industry-standard database environments with strict access controls. Uploaded portfolio materials are hosted securely via cloud storage infrastructure.
          </p>

          <h2 className="font-editorial text-xl text-warm-ivory pt-4">4. Contact Concierge</h2>
          <p>
            If you have questions regarding data privacy or wish to update your dossier, contact our team at <a href="mailto:concierge@encoreats.com" className="text-champagne underline">concierge@encoreats.com</a>.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
