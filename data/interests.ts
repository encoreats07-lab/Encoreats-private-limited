export interface Interest {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  image: string;
  iconName: string;
}

export const INTERESTS: Interest[] = [
  {
    id: "int-food",
    name: "Food",
    slug: "food",
    tagline: "Blind tasting menus, chef tables & secret culinary vaults.",
    description: "Multi-course gastronomic journeys crafted by world-class chefs, foragers, and culinary archivists.",
    image: "/images/food1.avif",
    iconName: "Utensils"
  },
  {
    id: "int-music",
    name: "Music",
    slug: "music",
    tagline: "Analogue vinyl sessions, secret jazz rooms & acoustic strings.",
    description: "Intimate audio sanctuaries featuring custom vacuum-tube sound setups and unannounced master artists.",
    image: "/images/music1.avif",
    iconName: "Music"
  },
  {
    id: "int-nightlife",
    name: "Nightlife",
    slug: "nightlife",
    tagline: "Rooftop viewports, botanical mixology & after-hours soirees.",
    description: "Elevated nocturnal gatherings in undisclosed urban vantage points with high-powered stargazing and signature cocktails.",
    image: "/images/party1.avif",
    iconName: "Moon"
  },
  {
    id: "int-art",
    name: "Art",
    slug: "art",
    tagline: "After-dark gallery walks, easel studios & private collections.",
    description: "Exclusive access to private museum collections, guided curator tours, and hands-on champagne painting workshops.",
    image: "/images/flower1.avif",
    iconName: "Palette"
  },
  {
    id: "int-comedy",
    name: "Comedy",
    slug: "comedy",
    tagline: "Underground mic salons, OTT headliners & unscripted sets.",
    description: "40-seat intimate comedy basements where national headliners refine unreleased material in close proximity.",
    image: "/images/event.avif",
    iconName: "Smile"
  },
  {
    id: "int-culture",
    name: "Culture",
    slug: "culture",
    tagline: "Heritage courtyards, royal archives & traditional salons.",
    description: "Immersion into centuries-old palace architecture, rare historical archives, and authentic cultural rituals.",
    image: "/images/restro1.avif",
    iconName: "Landmark"
  },
  {
    id: "int-workshops",
    name: "Workshops",
    slug: "workshops",
    tagline: "Bespoke perfume compounding, leathercraft & rare tea pairing.",
    description: "Hands-on masterclasses taught by master artisans, master perfumers, and rare tea sommeliers.",
    image: "/images/workshop.avif",
    iconName: "Sparkles"
  }
];
