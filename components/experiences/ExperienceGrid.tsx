import { Experience } from "@/data/experiences";
import ExperienceCard from "./ExperienceCard";

interface ExperienceGridProps {
  experiences: Experience[];
  limit?: number;
}

export default function ExperienceGrid({ experiences, limit }: ExperienceGridProps) {
  const displayExperiences = limit ? experiences.slice(0, limit) : experiences;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
      {displayExperiences.map((exp, index) => {
        // Vary aspect ratios for editorial feel
        const isFeatured = index === 0 || index === 3;
        const colSpan = isFeatured ? "md:col-span-2 lg:col-span-2" : "col-span-1";
        const aspectRatio = isFeatured ? "landscape" : index % 2 === 0 ? "tall" : "portrait";

        return (
          <div key={exp.id} className={colSpan}>
            <ExperienceCard experience={exp} aspectRatio={aspectRatio} />
          </div>
        );
      })}
    </div>
  );
}
