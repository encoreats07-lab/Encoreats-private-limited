"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { EXPERIENCES } from "@/data/experiences";
import { CITIES } from "@/data/cities";
import { INTERESTS } from "@/data/interests";
import ExperienceCard from "@/components/experiences/ExperienceCard";

export default function ExperiencesPage() {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedInterest, setSelectedInterest] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredExperiences = useMemo(() => {
    return EXPERIENCES.filter((exp) => {
      const matchesCity = selectedCity === "all" || exp.citySlug === selectedCity;
      const matchesInterest =
        selectedInterest === "all" || exp.categorySlug === selectedInterest;
      const matchesSearch =
        searchQuery === "" ||
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.venue.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCity && matchesInterest && matchesSearch;
    });
  }, [selectedCity, selectedInterest, searchQuery]);

  return (
    <div className="pt-32 pb-24 min-h-screen bg-obsidian text-warm-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        {/* Page Header */}
        <div className="space-y-4 max-w-3xl border-b border-warm-ivory/10 pb-8">
          <span className="text-xs uppercase tracking-widest text-champagne font-mono">
            Curated Experience Catalog
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-warm-ivory font-light">
            Discover Exceptional Gatherings
          </h1>
          <p className="text-muted-stone text-base font-light leading-relaxed">
            From secret subterranean dining vaults to analogue vinyl listening sanctuaries—explore limited seasonal reservations.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass-panel p-6 rounded-sm">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-stone" />
            <input
              type="text"
              placeholder="Search experiences, venues, chefs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-deep-onyx border border-warm-ivory/15 rounded-xs pl-10 pr-4 py-2.5 text-xs text-warm-ivory placeholder:text-muted-stone/60 focus:outline-none focus:border-champagne transition-colors"
            />
          </div>

          {/* City & Interest Filters */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-champagne" />
              <span className="text-muted-stone uppercase">City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-deep-onyx border border-warm-ivory/15 rounded-xs px-3 py-2 text-warm-ivory focus:outline-none focus:border-champagne"
              >
                <option value="all">All Cities ({CITIES.length})</option>
                {CITIES.map((city) => (
                  <option key={city.id} value={city.slug}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-champagne" />
              <span className="text-muted-stone uppercase">Interest:</span>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="bg-deep-onyx border border-warm-ivory/15 rounded-xs px-3 py-2 text-warm-ivory focus:outline-none focus:border-champagne"
              >
                <option value="all">All Interests ({INTERESTS.length})</option>
                {INTERESTS.map((int) => (
                  <option key={int.id} value={int.slug}>
                    {int.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-stone font-mono">
          <span>
            Showing <strong className="text-warm-ivory">{filteredExperiences.length}</strong> curated experiences
          </span>
          {(selectedCity !== "all" || selectedInterest !== "all" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCity("all");
                setSelectedInterest("all");
                setSearchQuery("");
              }}
              className="text-champagne hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Editorial Masonry Grid */}
        {filteredExperiences.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredExperiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <ExperienceCard experience={exp} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center glass-panel rounded-sm space-y-4 max-w-md mx-auto">
            <p className="text-muted-stone text-sm">
              No curated experiences found matching your selection.
            </p>
            <button
              onClick={() => {
                setSelectedCity("all");
                setSelectedInterest("all");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 text-xs font-semibold uppercase tracking-widest bg-champagne text-obsidian rounded-xs hover:bg-warm-ivory transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
