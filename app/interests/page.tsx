import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { INTERESTS } from "@/data/interests";

export default function InterestsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl border-b border-warm-ivory/10 pb-8">
          <span className="text-xs uppercase tracking-widest text-champagne font-mono">
            Cultural Taxonomies
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
            Browse by Passion
          </h1>
          <p className="text-muted-stone text-base font-light leading-relaxed">
            From multi-course avant-garde gastronomy to raw underground comedy basements—explore curated realms of culture.
          </p>
        </div>

        {/* Interests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INTERESTS.map((interest) => (
            <Link
              key={interest.id}
              href={`/interests/${interest.slug}`}
              className="group relative block aspect-[4/3] rounded-sm overflow-hidden glass-card"
            >
              <Image
                src={interest.image}
                alt={interest.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.55] group-hover:brightness-[0.7]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

              <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-obsidian/70 backdrop-blur-md border border-warm-ivory/20 flex items-center justify-center text-warm-ivory group-hover:text-champagne group-hover:border-champagne transition-all">
                <ArrowUpRight className="w-4 h-4" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 z-10 space-y-2">
                <span className="text-[10px] uppercase tracking-widest text-champagne font-mono">
                  Category
                </span>
                <h2 className="font-editorial text-3xl text-warm-ivory group-hover:text-champagne transition-colors">
                  {interest.name}
                </h2>
                <p className="text-xs text-muted-stone line-clamp-2 font-light">
                  {interest.tagline}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
