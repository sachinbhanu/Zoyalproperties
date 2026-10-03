import { imgs } from "@/data/images";

export type PropertyType = "Apartment" | "Villa" | "Penthouse" | "Plot" | "Commercial";
export type PropertyStatus = "Ready to Move" | "Under Construction" | "New Launch";

export interface Property {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  city: string;
  locality: string;
  state: string;
  /** Price in INR */
  price: number;
  type: PropertyType;
  /** 0 for plots & commercial */
  bhk: number;
  /** Area in sq ft */
  area: number;
  status: PropertyStatus;
  description: string;
  amenities: string[];
  /** 3–5 images; first is the cover */
  gallery: string[];
  coordinates: { lat: number; lng: number };
  featured: boolean;
  /** ISO date */
  possession: string;
}

export const CITIES = [
  "Gurugram",
  "Delhi",
  "Noida",
  "Mumbai",
  "Bengaluru",
  "Hyderabad",
  "Pune",
] as const;
export type City = (typeof CITIES)[number];

export const PROPERTY_TYPES: PropertyType[] = ["Apartment", "Villa", "Penthouse", "Plot", "Commercial"];
export const STATUSES: PropertyStatus[] = ["Ready to Move", "Under Construction", "New Launch"];

export const properties: Property[] = [
  {
    id: "zp-001",
    slug: "aurelia-skyline-residences-golf-course-road",
    title: "Aurelia Skyline Residences",
    tagline: "Sky-high living on Gurugram's golden mile",
    city: "Gurugram",
    locality: "Golf Course Road",
    state: "Haryana",
    price: 68000000,
    type: "Apartment",
    bhk: 4,
    area: 3200,
    status: "Under Construction",
    description:
      "A 52-storey glass monolith on Golf Course Road with double-height lobbies, private sky decks and panoramic Aravalli views. Every residence ships with Italian marble, smart-home automation and a dedicated lift lobby.",
    amenities: ["Infinity Sky Pool", "Private Cinema", "Smart Home Automation", "Concierge", "Sky Lounge", "Valet Parking", "Spa & Wellness", "EV Charging"],
    gallery: imgs(["towerGlass", "livingBright", "kitchenIsland", "bedroomOrange", "skylineNight"]),
    coordinates: { lat: 28.4325, lng: 77.1005 },
    featured: true,
    possession: "2028-03-01",
  },
  {
    id: "zp-002",
    slug: "nexora-heights-sohna-road",
    title: "Nexora Heights",
    tagline: "Move-in ready, minutes from Sohna's business belt",
    city: "Gurugram",
    locality: "Sohna Road",
    state: "Haryana",
    price: 21500000,
    type: "Apartment",
    bhk: 3,
    area: 1850,
    status: "Ready to Move",
    description:
      "Thoughtfully planned 3 BHK homes with cross-ventilation, large balconies and a landscaped podium. Close to schools, hospitals and the Sohna elevated corridor.",
    amenities: ["Clubhouse", "Swimming Pool", "Gymnasium", "Kids' Play Area", "24x7 Security", "Power Backup", "Jogging Track"],
    gallery: imgs(["towerModern", "livingModern", "kitchenWhite", "bedroomLight"]),
    coordinates: { lat: 28.4, lng: 77.05 },
    featured: false,
    possession: "2025-06-01",
  },
  {
    id: "zp-003",
    slug: "vaaya-orchards-dwarka-expressway",
    title: "Vaaya Orchards Villas",
    tagline: "Private pool villas inside a 12-acre orchard",
    city: "Gurugram",
    locality: "Dwarka Expressway",
    state: "Haryana",
    price: 95000000,
    type: "Villa",
    bhk: 5,
    area: 5200,
    status: "New Launch",
    description:
      "Only 48 independent villas, each with a private pool, home theatre and landscaped courtyard. Gated community with biophilic design, solar roofs and direct expressway access.",
    amenities: ["Private Pool", "Home Theatre", "Solar Power", "Clubhouse", "Tennis Court", "Organic Orchard", "Smart Security", "Concierge"],
    gallery: imgs(["villaPool5", "villaPool6", "livingSuite", "villaNight", "kitchenDark"]),
    coordinates: { lat: 28.42, lng: 76.99 },
    featured: true,
    possession: "2029-01-01",
  },
  {
    id: "zp-004",
    slug: "celestia-park-towers-dwarka",
    title: "Celestia Park Towers",
    tagline: "Metro-connected comfort in the heart of Dwarka",
    city: "Delhi",
    locality: "Dwarka",
    state: "Delhi",
    price: 13500000,
    type: "Apartment",
    bhk: 2,
    area: 1150,
    status: "Ready to Move",
    description:
      "Efficient 2 BHK homes with park-facing balconies, a five-minute walk from the Dwarka metro. Ideal for first-time buyers and young families.",
    amenities: ["Gymnasium", "Kids' Play Area", "Yoga Deck", "24x7 Security", "Power Backup", "Visitor Parking"],
    gallery: imgs(["towerBalcony", "livingLoft", "bedroomBlue"]),
    coordinates: { lat: 28.5921, lng: 77.046 },
    featured: false,
    possession: "2024-12-01",
  },
  {
    id: "zp-005",
    slug: "maharaja-enclave-villas-vasant-kunj",
    title: "Maharaja Enclave Villas",
    tagline: "Heritage grandeur beside the Delhi Ridge",
    city: "Delhi",
    locality: "Vasant Kunj",
    state: "Delhi",
    price: 145000000,
    type: "Villa",
    bhk: 4,
    area: 4100,
    status: "Ready to Move",
    description:
      "Ultra-private four-bedroom villas with double-height drawing rooms and mature gardens, tucked beside the Ridge forest. Delhi's rarest address, delivered and ready.",
    amenities: ["Private Garden", "Home Lift", "Wine Cellar", "Staff Quarters", "Clubhouse", "Gated Security", "Solar Heating"],
    gallery: imgs(["villaGarden", "livingWarm", "villaDusk", "kitchenWarm", "bedroomSoft"]),
    coordinates: { lat: 28.52, lng: 77.159 },
    featured: false,
    possession: "2025-02-01",
  },
  {
    id: "zp-006",
    slug: "regalia-courts-south-extension",
    title: "Regalia Courts Penthouses",
    tagline: "Eight sky-mansions above South Extension",
    city: "Delhi",
    locality: "South Extension",
    state: "Delhi",
    price: 220000000,
    type: "Penthouse",
    bhk: 4,
    area: 4800,
    status: "Under Construction",
    description:
      "Duplex penthouses with 14-foot ceilings, private terraces with plunge pools and sweeping views across Lutyens' Delhi. Built by award-winning architects with museum-grade finishes.",
    amenities: ["Private Terrace", "Plunge Pool", "Sky Lounge", "Concierge", "Private Elevator", "Wine Room", "Valet Parking", "Spa & Wellness"],
    gallery: imgs(["towerArch", "livingDark", "stairs", "bedroomOrange", "livingLounge"]),
    coordinates: { lat: 28.57, lng: 77.22 },
    featured: true,
    possession: "2028-09-01",
  },
  {
    id: "zp-007",
    slug: "zenith-gardens-noida-sector-150",
    title: "Zenith Gardens",
    tagline: "India's greenest sector, now with a skyline",
    city: "Noida",
    locality: "Sector 150",
    state: "Uttar Pradesh",
    price: 14500000,
    type: "Apartment",
    bhk: 3,
    area: 1650,
    status: "Under Construction",
    description:
      "Set within a 90% open-space township, Zenith Gardens offers 3 BHK homes around a 4-acre central forest with sports facilities and cycling tracks.",
    amenities: ["Central Forest", "Cycling Track", "Cricket Pitch", "Swimming Pool", "Clubhouse", "Co-working Lounge", "EV Charging"],
    gallery: imgs(["towerWhite", "livingBlue", "kitchenWhite", "bedroomLight"]),
    coordinates: { lat: 28.445, lng: 77.49 },
    featured: false,
    possession: "2027-09-01",
  },
  {
    id: "zp-008",
    slug: "helix-business-square-noida-expressway",
    title: "Helix Business Square",
    tagline: "Grade-A offices on the Noida Expressway",
    city: "Noida",
    locality: "Expressway",
    state: "Uttar Pradesh",
    price: 36000000,
    type: "Commercial",
    bhk: 0,
    area: 2400,
    status: "Ready to Move",
    description:
      "Plug-and-play office floors with column-free plates, 100% power backup and high-speed lifts. Direct access to the Noida Expressway and the Aqua Line metro.",
    amenities: ["100% Power Backup", "High-speed Lifts", "Food Court", "Conference Centre", "Basement Parking", "Fibre Ready"],
    gallery: imgs(["officeGlass", "officeBoardroom", "towerMono", "officeKitchen"]),
    coordinates: { lat: 28.56, lng: 77.36 },
    featured: false,
    possession: "2025-04-01",
  },
  {
    id: "zp-009",
    slug: "sapphire-sea-residences-worli",
    title: "Sapphire Sea Residences",
    tagline: "Wake up to the Arabian Sea",
    city: "Mumbai",
    locality: "Worli",
    state: "Maharashtra",
    price: 118000000,
    type: "Apartment",
    bhk: 3,
    area: 2100,
    status: "Under Construction",
    description:
      "Sea-facing 3 BHK residences in a 60-storey tower on Worli's seafront. Floor-to-ceiling glazing, a rooftop infinity pool and a members' club designed by a global hospitality studio.",
    amenities: ["Sea-facing Decks", "Infinity Pool", "Members' Club", "Concierge", "Valet Parking", "Gymnasium", "Private Dining Room", "EV Charging"],
    gallery: imgs(["seaPromenade", "livingLounge", "kitchenIsland", "bedroomBlue", "skylineAerial"]),
    coordinates: { lat: 19.0176, lng: 72.8156 },
    featured: true,
    possession: "2029-06-01",
  },
  {
    id: "zp-010",
    slug: "bandra-monarch-penthouses",
    title: "Bandra Monarch Penthouses",
    tagline: "Mumbai's most coveted sky-homes",
    city: "Mumbai",
    locality: "Bandra",
    state: "Maharashtra",
    price: 280000000,
    type: "Penthouse",
    bhk: 4,
    area: 3900,
    status: "New Launch",
    description:
      "Triple-aspect penthouses crowning a boutique 28-storey tower in Bandra West. Private lifts, a terrace garden and curated art walls — walkable to Carter Road.",
    amenities: ["Private Lift", "Terrace Garden", "Art Gallery Lobby", "Concierge", "Wine Room", "Valet Parking", "Spa & Wellness"],
    gallery: imgs(["towerDark", "livingSuite", "stairs", "bedroomSoft"]),
    coordinates: { lat: 19.0596, lng: 72.8295 },
    featured: false,
    possession: "2030-03-01",
  },
  {
    id: "zp-011",
    slug: "lakeview-pinnacle-powai",
    title: "Lakeview Pinnacle",
    tagline: "Powai Lake at your doorstep",
    city: "Mumbai",
    locality: "Powai",
    state: "Maharashtra",
    price: 20500000,
    type: "Apartment",
    bhk: 2,
    area: 980,
    status: "Ready to Move",
    description:
      "Lake-facing 2 BHK homes in a mature, well-connected neighbourhood close to IIT Bombay and the Hiranandani business district.",
    amenities: ["Lake-view Deck", "Gymnasium", "Swimming Pool", "Kids' Play Area", "24x7 Security", "Visitor Parking"],
    gallery: imgs(["towerBalcony", "livingGrey", "kitchenWarm", "bedroomBlue"]),
    coordinates: { lat: 19.1176, lng: 72.906 },
    featured: false,
    possession: "2025-01-01",
  },
  {
    id: "zp-012",
    slug: "thane-horizon-towers",
    title: "Thane Horizon Towers",
    tagline: "Affordable luxury beside the creek",
    city: "Mumbai",
    locality: "Thane",
    state: "Maharashtra",
    price: 11200000,
    type: "Apartment",
    bhk: 2,
    area: 820,
    status: "Under Construction",
    description:
      "Smartly designed 2 BHK homes in Thane West with a 20,000 sq ft podium garden and quick access to the Eastern Express Highway.",
    amenities: ["Podium Garden", "Gymnasium", "Multipurpose Hall", "Kids' Play Area", "Power Backup", "CCTV Surveillance"],
    gallery: imgs(["towerMirror", "livingLight", "kitchenWhite"]),
    coordinates: { lat: 19.2183, lng: 72.9781 },
    featured: false,
    possession: "2027-12-01",
  },
  {
    id: "zp-013",
    slug: "meridian-tech-lofts-whitefield",
    title: "Meridian Tech Lofts",
    tagline: "Walk to work in Bengaluru's tech corridor",
    city: "Bengaluru",
    locality: "Whitefield",
    state: "Karnataka",
    price: 23000000,
    type: "Apartment",
    bhk: 3,
    area: 1750,
    status: "Ready to Move",
    description:
      "Loft-style 3 BHKs with double-height living rooms and co-working lounges, a short walk from ITPL and the Purple Line metro.",
    amenities: ["Co-working Lounge", "Rooftop Garden", "Swimming Pool", "Gymnasium", "Pet Park", "EV Charging", "Clubhouse"],
    gallery: imgs(["towerMinimal", "livingMinimal", "kitchenIsland", "bedroomLight"]),
    coordinates: { lat: 12.9698, lng: 77.75 },
    featured: false,
    possession: "2025-03-01",
  },
  {
    id: "zp-014",
    slug: "koramangala-courtyard-villas",
    title: "Koramangala Courtyard Villas",
    tagline: "Garden villas in the city's most loved neighbourhood",
    city: "Bengaluru",
    locality: "Koramangala",
    state: "Karnataka",
    price: 89000000,
    type: "Villa",
    bhk: 4,
    area: 3600,
    status: "Under Construction",
    description:
      "A boutique cluster of 24 courtyard villas with private gardens, rainwater harvesting and rooftop studios, steps from Koramangala's cafés and parks.",
    amenities: ["Private Courtyard", "Rooftop Studio", "Rainwater Harvesting", "Solar Power", "Clubhouse", "Gated Security"],
    gallery: imgs(["villaWood", "livingWood", "villaGlass", "kitchenDark", "bedroomOrange"]),
    coordinates: { lat: 12.9352, lng: 77.6245 },
    featured: false,
    possession: "2027-11-01",
  },
  {
    id: "zp-015",
    slug: "gachibowli-crest",
    title: "Gachibowli Crest",
    tagline: "Hyderabad's financial district, elevated",
    city: "Hyderabad",
    locality: "Gachibowli",
    state: "Telangana",
    price: 27500000,
    type: "Apartment",
    bhk: 3,
    area: 2050,
    status: "New Launch",
    description:
      "A 45-storey tower with 3 BHK sky-homes, a 70,000 sq ft clubhouse and a sky-bridge jogging track, minutes from the Financial District.",
    amenities: ["Sky Jogging Track", "70,000 sq ft Clubhouse", "Swimming Pool", "Squash Court", "Smart Home", "EV Charging", "Concierge"],
    gallery: imgs(["towerArch", "livingModern", "kitchenWhite", "bedroomSoft", "skyline"]),
    coordinates: { lat: 17.4401, lng: 78.3489 },
    featured: true,
    possession: "2029-02-01",
  },
  {
    id: "zp-016",
    slug: "cyberspire-offices-gachibowli",
    title: "Cyberspire Offices",
    tagline: "Where Hyderabad's next unicorns will sit",
    city: "Hyderabad",
    locality: "Gachibowli",
    state: "Telangana",
    price: 42000000,
    type: "Commercial",
    bhk: 0,
    area: 3200,
    status: "Under Construction",
    description:
      "LEED-Gold designed workspaces with terrace break-out zones, smart building management and a high-street retail podium.",
    amenities: ["LEED Gold Design", "Terrace Break-out Zones", "Smart BMS", "Retail Podium", "Basement Parking", "Fibre Ready"],
    gallery: imgs(["officeBoardroom", "towerGlass", "officeGlass"]),
    coordinates: { lat: 17.43, lng: 78.36 },
    featured: false,
    possession: "2027-08-01",
  },
  {
    id: "zp-017",
    slug: "hinjewadi-verdant-plots",
    title: "Verdant Plots Hinjewadi",
    tagline: "Build your dream home in Pune's IT hub",
    city: "Pune",
    locality: "Hinjewadi",
    state: "Maharashtra",
    price: 9500000,
    type: "Plot",
    bhk: 0,
    area: 2400,
    status: "Ready to Move",
    description:
      "RERA-ready, clear-title residential plots with 30-ft roads, underground utilities and a landscaped central park in a gated layout.",
    amenities: ["30-ft Roads", "Underground Utilities", "Central Park", "Gated Entry", "Water Supply", "Street Lighting"],
    gallery: imgs(["plotLayout", "plotAerial", "plotField"]),
    coordinates: { lat: 18.5912, lng: 73.7389 },
    featured: false,
    possession: "2025-05-01",
  },
  {
    id: "zp-018",
    slug: "koregaon-park-atelier",
    title: "Koregaon Park Atelier",
    tagline: "Penthouse living, Pune's most elegant address",
    city: "Pune",
    locality: "Koregaon Park",
    state: "Maharashtra",
    price: 76000000,
    type: "Penthouse",
    bhk: 3,
    area: 2800,
    status: "Ready to Move",
    description:
      "Designer penthouses with private terraces, tree-top views and a boutique residents' lounge, close to the city's finest restaurants and galleries.",
    amenities: ["Private Terrace", "Residents' Lounge", "Concierge", "Gymnasium", "Valet Parking", "Spa & Wellness"],
    gallery: imgs(["towerWhite", "livingLounge", "bedroomBlue", "kitchenIsland"]),
    coordinates: { lat: 18.5362, lng: 73.894 },
    featured: false,
    possession: "2025-07-01",
  },
  {
    id: "zp-019",
    slug: "hillcrest-villas-hinjewadi",
    title: "Hillcrest Villas",
    tagline: "Hill-view villas with a resort-style clubhouse",
    city: "Pune",
    locality: "Hinjewadi",
    state: "Maharashtra",
    price: 34000000,
    type: "Villa",
    bhk: 3,
    area: 2600,
    status: "Under Construction",
    description:
      "Contemporary 3 BHK villas on elevated plots with hill views, private terraces and an amenity-rich clubhouse.",
    amenities: ["Hill Views", "Private Terrace", "Resort Clubhouse", "Swimming Pool", "Tennis Court", "Gated Security"],
    gallery: imgs(["villaCube", "livingLight", "villaPool4", "bedroomLight"]),
    coordinates: { lat: 18.59, lng: 73.73 },
    featured: false,
    possession: "2027-10-01",
  },
  {
    id: "zp-020",
    slug: "aravali-greens-plots-sohna-road",
    title: "Aravali Greens Plots",
    tagline: "Premium plotted development at the foothills",
    city: "Gurugram",
    locality: "Sohna Road",
    state: "Haryana",
    price: 24000000,
    type: "Plot",
    bhk: 0,
    area: 3000,
    status: "New Launch",
    description:
      "Low-density plotted community of 120 plots bordering the Aravali greens, with wide boulevards and an upcoming clubhouse.",
    amenities: ["Boulevard Roads", "Clubhouse (Upcoming)", "Landscaped Parks", "Gated Entry", "Solar Street Lights", "Water Harvesting"],
    gallery: imgs(["plotAerial", "plotHome", "plotField"]),
    coordinates: { lat: 28.38, lng: 77.06 },
    featured: false,
    possession: "2027-04-01",
  },
  {
    id: "zp-021",
    slug: "skyforge-residences-noida-expressway",
    title: "Skyforge Residences",
    tagline: "Statement towers on the Noida Expressway",
    city: "Noida",
    locality: "Expressway",
    state: "Uttar Pradesh",
    price: 41000000,
    type: "Apartment",
    bhk: 4,
    area: 2900,
    status: "Ready to Move",
    description:
      "Four-bedroom residences with 11-foot ceilings, private lift lobbies and a 3-acre sky-garden podium. Ready to move with a premium handover package.",
    amenities: ["Sky Garden Podium", "Private Lift Lobby", "Infinity Pool", "Squash Court", "Concierge", "EV Charging", "Spa & Wellness"],
    gallery: imgs(["towerMono", "livingSofa", "kitchenIsland", "bedroomOrange", "skylineNight"]),
    coordinates: { lat: 28.5605, lng: 77.3605 },
    featured: true,
    possession: "2025-08-01",
  },
  {
    id: "zp-022",
    slug: "thane-trade-centre",
    title: "Thane Trade Centre",
    tagline: "Retail & office floors on Ghodbunder Road",
    city: "Mumbai",
    locality: "Thane",
    state: "Maharashtra",
    price: 29000000,
    type: "Commercial",
    bhk: 0,
    area: 1500,
    status: "Under Construction",
    description:
      "High-footfall retail shops and boutique offices on Ghodbunder Road with double-height frontage and ample visitor parking.",
    amenities: ["Double-height Frontage", "Visitor Parking", "Food Court", "Power Backup", "High-speed Lifts"],
    gallery: imgs(["mall", "officeGlass", "towerModern"]),
    coordinates: { lat: 19.25, lng: 72.97 },
    featured: false,
    possession: "2027-06-01",
  },
];

export const getPropertyBySlug = (slug: string) => properties.find((p) => p.slug === slug);

export const getSimilarProperties = (p: Property, count = 3) =>
  properties
    .filter((x) => x.id !== p.id)
    .map((x) => ({
      x,
      score:
        (x.city === p.city ? 3 : 0) +
        (x.type === p.type ? 2 : 0) +
        (Math.abs(x.price - p.price) / p.price < 0.5 ? 1 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count)
    .map((s) => s.x);

export const featuredProperties = properties.filter((p) => p.featured);

export const projectCountByCity = (city: string) => properties.filter((p) => p.city === city).length;

/** Budget presets (INR) used by the search bar and filters */
export const BUDGETS = [
  { id: "any", label: "Any budget", min: 0, max: Infinity },
  { id: "u1", label: "Under ₹1 Cr", min: 0, max: 1e7 },
  { id: "1-2", label: "₹1 – 2 Cr", min: 1e7, max: 2e7 },
  { id: "2-5", label: "₹2 – 5 Cr", min: 2e7, max: 5e7 },
  { id: "5-10", label: "₹5 – 10 Cr", min: 5e7, max: 1e8 },
  { id: "10p", label: "₹10 Cr +", min: 1e8, max: Infinity },
] as const;

export const BHK_OPTIONS = [1, 2, 3, 4, 5] as const;
