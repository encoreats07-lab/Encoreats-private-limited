import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight } from "lucide-react";
import { CITIES } from "@/data/cities";

export default function CitiesPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        {/* Header */}
        <div className="space-y-4 max-w-3xl border-b border-warm-ivory/10 pb-8">
          <span className="text-xs uppercase tracking-widest text-champagne font-mono">
            Curated City Archives
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
            Destinations of Distinction
          </h1>
          <p className="text-muted-stone text-base font-light leading-relaxed">
            Each city possesses its own secret architectural sanctuaries, heritage courtyard tables, and audiophile sound rooms.
          </p>
        </div>

        {/* Cities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CITIES.map((city) => (
            <Link
              key={city.id}
              href={`/cities/${city.slug}`}
              className="group relative block aspect-[4/5] rounded-sm overflow-hidden glass-card"
            >
              <Image
                src={city.image}
                alt={city.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.55] group-hover:brightness-[0.7]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 text-[10px] uppercase tracking-widest bg-obsidian/70 backdrop-blur-md text-warm-ivory border border-warm-ivory/20 rounded-xs font-mono">
                  {city.experienceCount} Active Experiences
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 z-10 space-y-2">
                <div className="flex items-center gap-2 text-champagne text-xs uppercase tracking-widest font-mono">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>City Guide</span>
                </div>

                <h2 className="font-editorial text-3xl sm:text-4xl text-warm-ivory group-hover:text-champagne transition-colors duration-300">
                  {city.name}
                </h2>

                <p className="text-xs text-muted-stone/90 line-clamp-2 leading-relaxed font-light">
                  {city.description}
                </p>

                <div className="pt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-warm-ivory group-hover:text-champagne transition-colors">
                  <span>Explore {city.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
