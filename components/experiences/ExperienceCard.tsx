"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Clock, Users } from "lucide-react";
import { Experience } from "@/data/experiences";

interface ExperienceCardProps {
  experience: Experience;
  aspectRatio?: "portrait" | "landscape" | "square" | "tall";
  className?: string;
}

export default function ExperienceCard({
  experience,
  aspectRatio,
  className = "",
}: ExperienceCardProps) {
  // Determine aspect ratio based on cardSize if not explicitly passed
  const ratioClass =
    aspectRatio === "portrait"
      ? "aspect-[3/4]"
      : aspectRatio === "landscape"
      ? "aspect-[16/10]"
      : aspectRatio === "square"
      ? "aspect-square"
      : aspectRatio === "tall"
      ? "aspect-[4/5]"
      : experience.cardSize === "large"
      ? "aspect-[16/10] md:aspect-[16/9]"
      : experience.cardSize === "medium"
      ? "aspect-[4/5]"
      : "aspect-[4/3]";

  return (
    <Link
      href={`/experiences/${experience.slug}`}
      className={`group relative flex flex-col overflow-hidden glass-card rounded-sm transition-all duration-500 ${className}`}
    >
      {/* Image Container with Zoom & Gradient */}
      <div className={`relative w-full ${ratioClass} overflow-hidden bg-deep-onyx`}>
        <Image
          src={experience.image}
          alt={experience.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-80" />

        {/* Category & City Badges */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest bg-obsidian/80 backdrop-blur-md text-champagne border border-champagne/30 rounded-xs">
            {experience.category}
          </span>
          <span className="px-2.5 py-1 text-[10px] uppercase tracking-widest bg-obsidian/60 backdrop-blur-md text-warm-ivory border border-warm-ivory/15 rounded-xs flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5" />
            {experience.city}
          </span>
        </div>

        {/* Hover Arrow Icon */}
        <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-obsidian/70 backdrop-blur-md border border-warm-ivory/20 flex items-center justify-center text-warm-ivory opacity-0 transform translate-x-2 translate-y--2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300 group-hover:text-champagne group-hover:border-champagne/40">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-6 justify-between space-y-4 bg-gradient-to-b from-deep-onyx/40 to-obsidian">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-muted-stone font-mono">
            <span>{experience.venue}</span>
            <span className="text-champagne font-semibold">{experience.price}</span>
          </div>

          <h3 className="font-editorial text-2xl lg:text-3xl text-warm-ivory group-hover:text-champagne transition-colors duration-300 leading-tight">
            {experience.title}
          </h3>

          <p className="text-xs text-muted-stone/90 line-clamp-2 leading-relaxed font-light">
            {experience.shortDescription}
          </p>
        </div>

        {/* Card Footer Metadata */}
        <div className="pt-3 border-t border-warm-ivory/10 flex items-center justify-between text-[11px] text-muted-stone/70">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-champagne/80" />
            {experience.date}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-champagne/80" />
            {experience.groupSize}
          </span>
        </div>
      </div>
    </Link>
  );
}
