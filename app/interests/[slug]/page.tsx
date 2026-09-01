import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { INTERESTS } from "@/data/interests";
import { EXPERIENCES } from "@/data/experiences";
import ExperienceCard from "@/components/experiences/ExperienceCard";

export default async function InterestDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const interest = INTERESTS.find((i) => i.slug === slug);

  if (!interest) {
    return (
      <div className="pt-36 pb-24 text-center text-warm-ivory max-w-lg mx-auto space-y-6">
        <h1 className="font-editorial text-4xl">Category Not Found</h1>
        <p className="text-muted-stone text-sm">
          The requested cultural interest category does not exist.
        </p>
        <Link
          href="/interests"
          className="inline-block px-6 py-3 text-xs uppercase tracking-widest bg-champagne text-obsidian rounded-xs font-semibold"
        >
          View All Interests
        </Link>
      </div>
    );
  }

  const categoryExperiences = EXPERIENCES.filter(
    (e) => e.categorySlug === interest.slug
  );

  return (
    <div className="pt-28 pb-24 min-h-screen bg-obsidian text-warm-ivory">
      {/* Back Link */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-6">
        <Link
          href="/interests"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-stone hover:text-champagne transition-colors font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Interests</span>
        </Link>
      </div>

      {/* Hero Banner */}
      <section className="relative max-w-7xl mx-auto px-6 lg:px-12">
        <div className="relative aspect-[16/9] md:aspect-[21/8] rounded-sm overflow-hidden glass-panel">
          <Image
            src={interest.image}
            alt={interest.name}
            fill
            priority
            className="object-cover filter brightness-[0.5] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

          <div className="absolute bottom-8 left-8 right-8 z-10 space-y-2">
            <span className="text-xs uppercase tracking-widest text-champagne font-mono">
              Cultural Taxonomy
            </span>
            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
              {interest.name}
            </h1>
            <p className="text-base sm:text-lg text-muted-stone max-w-2xl font-light">
              {interest.description}
            </p>
          </div>
        </div>
      </section>

      {/* Experiences Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-16 space-y-8">
        <div className="border-b border-warm-ivory/10 pb-4 flex items-center justify-between">
          <h2 className="font-editorial text-3xl text-warm-ivory">
            {interest.name} Experiences ({categoryExperiences.length})
          </h2>
          <span className="text-xs uppercase tracking-widest text-champagne font-mono">
            Handpicked Curation
          </span>
        </div>

        {categoryExperiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categoryExperiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center glass-panel rounded-sm space-y-4">
            <p className="text-muted-stone text-sm">
              More curated {interest.name} experiences are currently being vetted by our cultural committee.
            </p>
            <Link
              href="/early-access"
              className="inline-block px-6 py-2.5 text-xs font-semibold uppercase tracking-widest bg-champagne text-obsidian rounded-xs"
            >
              Get Notified
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
