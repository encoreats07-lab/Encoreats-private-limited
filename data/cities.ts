
export interface City {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  experienceCount: number;
  featured: boolean;
}

export const CITIES: City[] = [
  {
    id: "city-mumbai",
    name: "Mumbai",
    slug: "mumbai",
    tagline:
      "Colonial heritage vaults, coastal twilight dining & secret jazz cellars.",
    description:
      "From historic banking vaults in Ballard Estate to high-rise sea-view sanctuaries in Bandra, Mumbai's night culture pulses with subterranean luxury and creative energy.",
    image: "/images/image1.avif",
    experienceCount: 14,
    featured: true,
  },
  {
    id: "city-delhi",
    name: "Delhi",
    slug: "delhi",
    tagline:
      "Lutyens' art galas, Mughal courtyard feasts & secret cocktail parlors.",
    description:
      "An architectural tapestry of ancient dynasties and modern fine dining. Discover private museum walkthroughs and rooftop culinary soirees across Lutyens and Hauz Khas.",
    image: "/images/image2.avif",
    experienceCount: 12,
    featured: true,
  },
  {
    id: "city-bangalore",
    name: "Bangalore",
    slug: "bangalore",
    tagline:
      "Vinyl listening sanctuaries, craft botanical labs & garden estate suppers.",
    description:
      "Where audiophile high-fidelity listening bars meet hidden leafy villa pop-ups. Experience Bangalore's sophisticated music and micro-batch mixology culture.",
    image: "/images/image3.avif",
    experienceCount: 16,
    featured: true,
  },
  {
    id: "city-hyderabad",
    name: "Hyderabad",
    slug: "hyderabad",
    tagline:
      "Nizami banquet secrets, rooftop stargazing & imperial high teas.",
    description:
      "Immerse in centuries of royal culinary artistry, high-elevation urban viewports, and intimate poetry sessions overlooking moonlit lakes.",
    image: "/images/image4.avif",
    experienceCount: 9,
    featured: true,
  },
  {
    id: "city-pune",
    name: "Pune",
    slug: "pune",
    tagline:
      "Maratha courtyard suppers, vineyard retreats & acoustic salons.",
    description:
      "A cultural oasis combining heritage wada courtyard dining, bespoke leathercraft workshops, and intimate acoustic gatherings in lush hillsides.",
    image: "/images/image5.avif",
    experienceCount: 8,
    featured: true,
  },
  {
    id: "city-bhubaneswar",
    name: "Bhubaneswar",
    slug: "bhubaneswar",
    tagline:
      "Temple courtyard music, artisanal terracotta ateliers & coastal gastronomy.",
    description:
      "Where ancient architectural splendor meets modern creative salons, subterranean comedy lofts, and artisanal culinary showcases.",
    image: "/images/image6.avif",
    experienceCount: 6,
    featured: true,
  },
];

