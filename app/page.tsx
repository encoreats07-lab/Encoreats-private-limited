import EditorialHero from "@/components/home/EditorialHero";
import EditorialManifesto from "@/components/home/EditorialManifesto";
import FeaturedSection from "@/components/home/FeaturedSection";
import InterestSection from "@/components/home/InterestSection";
import CitySection from "@/components/home/CitySection";
import WhyEncoreats from "@/components/home/WhyEncoreats";
import EarlyAccessCTA from "@/components/home/EarlyAccessCTA";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Full-screen Hero */}
      <EditorialHero />

      {/* 2. Editorial Introduction */}
      <EditorialManifesto />

      {/* 3. Featured Experiences */}
      <FeaturedSection />

      {/* 4. Discover by Interest */}
      <InterestSection />

      {/* 5. Discover by City */}
      <CitySection />

      {/* 6. Why Encoreats Standard */}
      <WhyEncoreats />

      {/* 7. Early Access CTA */}
      <EarlyAccessCTA />
    </div>
  );
}
