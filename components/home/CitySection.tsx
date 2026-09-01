"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";
import { CITIES } from "@/data/cities";

export default function CitySection() {
  return (
    <section className="py-24 md:py-32 bg-obsidian relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-warm-ivory/10 pb-8">
          <div>
            <span className="text-xs uppercase tracking-widest text-champagne font-mono">
              Curated Destinations
            </span>
            <h2 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light mt-2">
              Discover by City
            </h2>
          </div>
          <p className="text-sm text-muted-stone max-w-md font-light">
            Each city possesses its own nocturnal character and secret architectural sanctuaries.
          </p>
        </div>

        {/* City Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CITIES.map((city, idx) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
            >
              <Link
                href={`/cities/${city.slug}`}
                className="group relative block aspect-[4/5] rounded-sm overflow-hidden glass-card"
              >
                {/* Background Image */}
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-[0.55] group-hover:brightness-[0.7]"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

                {/* Badge Header */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 text-[10px] uppercase tracking-widest bg-obsidian/70 backdrop-blur-md text-warm-ivory border border-warm-ivory/20 rounded-xs font-mono">
                    {city.experienceCount} Curated Tables
                  </span>
                </div>

                {/* Content Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-8 z-10 space-y-2">
                  <div className="flex items-center gap-2 text-champagne text-xs uppercase tracking-widest font-mono">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Destination</span>
                  </div>

                  <h3 className="font-editorial text-3xl sm:text-4xl text-warm-ivory group-hover:text-champagne transition-colors duration-300">
                    {city.name}
                  </h3>

                  <p className="text-xs text-muted-stone/90 line-clamp-2 leading-relaxed font-light">
                    {city.tagline}
                  </p>

                  <div className="pt-2 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-warm-ivory group-hover:text-champagne transition-colors">
                    <span>Explore {city.name}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
