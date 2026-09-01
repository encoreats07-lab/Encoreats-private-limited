export interface ChefOrHost {
  name: string;
  title: string;
  bio: string;
  avatar: string;
}

export interface Experience {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  tagline: string;
  category: string;
  categorySlug: string;
  city: string;
  citySlug: string;
  venue: string;
  neighborhood: string;
  price: string;
  duration: string;
  groupSize: string;
  image: string;
  gallery: string[];
  shortDescription: string;
  story: string;
  highlights: string[];
  whatToExpect: string[];
  atmosphere: string;
  chefOrHost: ChefOrHost;
  featured: boolean;
  cardSize: 'large' | 'medium' | 'small';
  date: string;
  time: string;
}

export const EXPERIENCES: Experience[] = [
  {
    id: "exp-1",
    slug: "the-midnight-table",
    title: "The Midnight Table",
    subtitle: "A 10-Course Gastronomic Symphony in Pitch Darkness",
    tagline: "Where taste replaces sight and dining becomes a sensory revelation.",
    category: "Food",
    categorySlug: "food",
    city: "Mumbai",
    citySlug: "mumbai",
    venue: "The Vault at Ballard Estate",
    neighborhood: "Colaba & Heritage District",
    price: "₹8,500 / seat",
    duration: "3.5 Hours",
    groupSize: "Limited to 12 Guests",
    image: "/images/food1.avif",
    gallery: [
      "/images/food1.avif",
      "/images/food2.avif",
      "/images/food3.avif"
    ],
    shortDescription: "An underground tasting menu curated by Chef Kabir Oberoi, set in a century-old maritime vault with blind tasting pairings.",
    story: "Set inside a restored 1920s banking vault hidden beneath the cobblestone avenues of Ballard Estate, The Midnight Table strips away visual distraction. Chef Kabir Oberoi presents a multi-act tasting menu where temperature, texture, wild aromatics, and live classical ambient harp redefine how you experience modern Indian gastronomy.",
    highlights: [
      "10-course mystery tasting menu revealed only upon departure",
      "Sommelier-guided rare vintage bio-dynamic wine pairing",
      "Acoustic harp performance by international guest artist",
      "Exclusive access to the private heritage cellar"
    ],
    whatToExpect: [
      "Arrive at 8:30 PM for introductory botanical cocktails in the parlor.",
      "Transition into the sound-dampened vault room illuminated only by soft ember glow.",
      "Engage with fellow dinner guests across a single obsidian timber communal table.",
      "Receive a handcrafted wax-sealed journal with full recipe notes after midnight."
    ],
    atmosphere: "Intimate, mysterious, candle-lit, acoustics of low cello strings and clinking crystal.",
    chefOrHost: {
      name: "Chef Kabir Oberoi",
      title: "Executive Culinary Artist & Forager",
      bio: "Former Chef de Partie at Noma, Copenhagen. Kabir blends Himalayan wild foraging with avant-garde technique.",
      avatar: "/images/chefkabir.avif"
    },
    featured: true,
    cardSize: "large",
    date: "This Friday & Saturday",
    time: "9:00 PM – 12:30 AM"
  },
  {
    id: "exp-2",
    slug: "afterglow-sessions",
    title: "Afterglow Sessions",
    subtitle: "Analogue Vinyl, Rare Japanese Whiskies & Unplugged Jazz",
    tagline: "An intimate listening sanctuary hidden behind an artisan tailor shop.",
    category: "Music",
    categorySlug: "music",
    city: "Bangalore",
    citySlug: "bangalore",
    venue: "Kissa Room",
    neighborhood: "Indiranagar",
    price: "₹4,200 / person",
    duration: "4 Hours",
    groupSize: "20 Guests",
    image: "/images/music1.avif",
    gallery: [
      "/images/music1.avif",
      "/images/music2.avif"
    ],
    shortDescription: "Custom vintage Hi-Fi sound system playing rare pressings alongside bespoke mixology curated by Tokyo-trained bartenders.",
    story: "Step through a concealed velvet curtain inside Indiranagar's quietest quarter. Afterglow Sessions hosts audiophiles and night seekers for an evening centered around custom vacuum-tube amplifiers, pristine Japanese pressing vinyl, and rare single malts served with handcrafted ice spheres.",
    highlights: [
      "Custom 1970s Tannoy vintage acoustic sound reproduction",
      "Tasting flight of 4 rare Japanese and Islay whiskies",
      "Live 45-minute secret set by visiting neo-soul saxophonist",
      "Curated omakase cocktail pairings"
    ],
    whatToExpect: [
      "Password provided via SMS 2 hours prior to start time.",
      "Strict no-phone policy inside the listening sanctuary.",
      "Deep-dive record listening session accompanied by master mixologist commentary."
    ],
    atmosphere: "Warm walnut wood tone, amber lamp glow, deep velvet armchairs, pristine acoustics.",
    chefOrHost: {
      name: "Tariq Merchant",
      title: "Audio Curation Director",
      bio: "Collector of over 4,000 rare jazz and soul pressings from Shibuya and London vinyl vaults.",
      avatar: "/images/tariq.avif"
    },
    featured: true,
    cardSize: "medium",
    date: "Every Thursday Night",
    time: "8:30 PM – Midnight"
  },
  {
    id: "exp-3",
    slug: "canvas-after-hours",
    title: "Canvas After Hours",
    subtitle: "Private Gallery Nocturne & Champagne Painting Experience",
    tagline: "Immerse yourself in modern fine art when the museum closes its doors.",
    category: "Art",
    categorySlug: "art",
    city: "Delhi",
    citySlug: "delhi",
    venue: "The Oberoi Art Atrium & Pavilion",
    neighborhood: "Lutyens' Delhi",
    price: "₹6,800 / guest",
    duration: "3 Hours",
    groupSize: "15 Guests",
    image: "/images/flower1.avif",
    gallery: [
      "/images/flower1.avif",
      "/images/flower2.avif"
    ],
    shortDescription: "An after-dark gallery walk led by resident curators, featuring private easel sessions and free-flowing vintage champagne.",
    story: "When the public galleries clear, step into an intimate salon bathed in moonlight and gallery spotlighting. Paint under the guidance of acclaimed contemporary artist Ananya Roy while enjoying charcuterie boards and reserve champagne.",
    highlights: [
      "Exclusive private access to contemporary art collection after public closing",
      "Hands-on oil canvas painting studio session with professional materials provided",
      "Curator-led private tour of undisclosed private collections",
      "Take home your framed personal canvas piece"
    ],
    whatToExpect: [
      "Private valet parking and champagne greeting at main gallery foyer.",
      "1-hour guided walkthrough of featured midnight installations.",
      "2-hour hands-on painting masterclass with individual artist feedback."
    ],
    atmosphere: "High ceilings, museum lighting, soft ambient soundscapes, linen and paint scents.",
    chefOrHost: {
      name: "Ananya Roy",
      title: "Resident Contemporary Artist",
      bio: "Exhibited at Venice Biennale and Jehangir Art Gallery; known for large-scale tactile oil textures.",
      avatar: "/images/ananya.avif"
    },
    featured: true,
    cardSize: "medium",
    date: "Saturday Night",
    time: "9:00 PM – Midnight"
  },
  {
    id: "exp-4",
    slug: "city-after-dark",
    title: "City After Dark",
    subtitle: "Rooftop Astronomy, Mixology & Midnight Speakeasy Tour",
    tagline: "Uncover hidden architectural heights and secret rooftop sanctuaries.",
    category: "Nightlife",
    categorySlug: "nightlife",
    city: "Hyderabad",
    citySlug: "hyderabad",
    venue: "Sky Pavilion at Jubilee Hills",
    neighborhood: "Jubilee Hills",
    price: "₹5,500 / guest",
    duration: "4 Hours",
    groupSize: "16 Guests",
    image: "/images/party1.avif",
    gallery: [
      "/images/party1.avif",
      "/images/party2.avif"
    ],
    shortDescription: "A nocturnal journey through secret rooftop portals, featuring high-powered telescope star watching and botanical gin infusions.",
    story: "Ascend to high-altitude urban vantage points usually inaccessible to the public. Equipped with Celestron telescopes and guided by astrophysicists and master mixologists, view lunar craters and planetary alignments over craft spirits.",
    highlights: [
      "High-powered astronomical telescope viewing of deep celestial bodies",
      "Private luxury chauffeur transport between secret rooftop locations",
      "Artisanal gin infusions crafted from high-altitude botanicals",
      "Gourmet midnight tapas served under open skies"
    ],
    whatToExpect: [
      "Check-in at secret ground floor speakeasy entrance.",
      "Chauffeur shuttle between 3 elevated heritage rooftops.",
      "Stargazing commentary alongside craft mixology."
    ],
    atmosphere: "Panoramas of city lights, cool night breeze, acoustic chillout live soundtrack.",
    chefOrHost: {
      name: "Dr. Vikram Sethi",
      title: "Astrophysicist & Mixology Enthusiast",
      bio: "Combines passion for celestial cartography with molecular cocktail crafting.",
      avatar: "/images/vikram.avif"
    },
    featured: true,
    cardSize: "large",
    date: "Friday Night",
    time: "10:00 PM – 2:00 AM"
  },
  {
    id: "exp-5",
    slug: "the-secret-supper",
    title: "The Secret Supper",
    subtitle: "Heritage Courtyard Dining & Live Sufi Acoustic Strings",
    tagline: "Centuries of royal heritage culinary secrets brought to life.",
    category: "Culture",
    categorySlug: "culture",
    city: "Pune",
    citySlug: "pune",
    venue: "Wada Heritage Estate",
    neighborhood: "Old City District",
    price: "₹6,000 / seat",
    duration: "3.5 Hours",
    groupSize: "14 Guests",
    image: "/images/restro1.avif",
    gallery: [
      "/images/restro1.avif"
    ],
    shortDescription: "Feast on slow-cooked regional heritage delicacies in a candlelit 18th-century Maratha courtyard with live sitar and sarod.",
    story: "Experience the timeless grandeur of an authentic 250-year-old wooden Wada courtyard. Lit by hundreds of flickering brass oil lamps, enjoy recipes preserved across generations.",
    highlights: [
      "7-course slow-cooked brass handi feast using heritage wood-fire methods",
      "Live performance by maestro sitarist and tabla virtuoso",
      "Traditional rose-water welcome and heritage attar ceremony",
      "Private historical tour of the estate's secret chambers"
    ],
    whatToExpect: [
      "Bespoke torch-lit entry through ancient wooden archways.",
      "Seated dining on hand-woven silk bolsters around low teak tables.",
      "Traditional silver thali service accompanied by live raga acoustic sets."
    ],
    atmosphere: "Regal, aromatic jasmine scents, flickering oil lamps, sacred sitar melodies.",
    chefOrHost: {
      name: "Rajmata Devika Raje",
      title: "Culinary Historian & Host",
      bio: "Custodian of Maratha royal family culinary archives spanning three centuries.",
      avatar: "/images/Rajmata.avif"
    },
    featured: false,
    cardSize: "medium",
    date: "Sunday Evening",
    time: "7:30 PM – 11:00 PM"
  },
  {
    id: "exp-6",
    slug: "acoustic-room",
    title: "The Underground Standup Salon",
    subtitle: "Uncensored Comedy, Craft Spirits & Intimate Mic",
    tagline: "Raw, unscripted comedy from national headliners in a 40-seat sanctuary.",
    category: "Comedy",
    categorySlug: "comedy",
    city: "Bhubaneswar",
    citySlug: "bhubaneswar",
    venue: "The Cellar Loft",
    neighborhood: "Patia Cultural Hub",
    price: "₹2,500 / seat",
    duration: "2.5 Hours",
    groupSize: "40 Guests",
    image: "/images/event.avif",
    gallery: [
      "/images/event.avif"
    ],
    shortDescription: "An exclusive secret-lineup comedy session featuring surprise sets by top national touring comedians and small-batch brews.",
    story: "No stage barriers, no oversized auditoriums. The Underground Standup Salon offers a raw, close-up comedy environment where India's sharpest comic minds test unreleased hour-long material.",
    highlights: [
      "Surprise 3-comedian secret lineup including top OTT headliners",
      "Complimentary tasting flight of local artisanal craft beers & ciders",
      "Interactive Q&A and post-show lounge hangout with artists",
      "Intimate 40-seat layout guaranteeing front-row perspective"
    ],
    whatToExpect: [
      "Doors open 30 minutes prior; phone pouches used for unreleased material.",
      "Casual plush lounge seating with table service for craft snacks.",
      "High-energy, unfiltered adult comedy sets."
    ],
    atmosphere: "Exposed brick, neon-accented stage spotlight, roaring laughter, relaxed casual vibe.",
    chefOrHost: {
      name: "Rohan Varma",
      title: "Comedy Curator & Producer",
      bio: "Pioneer of underground intimate comedy rooms across South Asia.",
      avatar: "/images/rohan.avif"
    },
    featured: false,
    cardSize: "small",
    date: "Every Saturday",
    time: "8:00 PM – 10:30 PM"
  }
];
