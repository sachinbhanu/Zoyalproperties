import { img } from "@/data/images";

/* ---------------- Map locations ---------------- */
export interface MapLocation {
  city: string;
  lon: number;
  lat: number;
  /** Visual offset so clustered NCR nodes stay readable on the stylised map */
  offset?: [number, number];
  blurb: string;
}

export const mapLocations: MapLocation[] = [
  { city: "Delhi", lon: 77.1, lat: 28.65, offset: [0.5, 1.1], blurb: "The capital's legacy addresses" },
  { city: "Gurugram", lon: 77.03, lat: 28.45, offset: [-1.4, -0.5], blurb: "Corporate skyline & luxury towers" },
  { city: "Noida", lon: 77.39, lat: 28.54, offset: [1.9, -0.3], blurb: "Green, planned & well-connected" },
  { city: "Mumbai", lon: 72.87, lat: 19.07, blurb: "Sea-facing, iconic & aspirational" },
  { city: "Bengaluru", lon: 77.59, lat: 12.97, blurb: "India's tech capital" },
  { city: "Hyderabad", lon: 78.48, lat: 17.38, blurb: "Financial District momentum" },
  { city: "Pune", lon: 73.85, lat: 18.52, blurb: "Culture, IT & great weather" },
];

/** Simplified India outline (lon, lat) used to build the dotted map */
export const INDIA_OUTLINE: [number, number][] = [
  [74.3, 34.9], [76.0, 35.8], [77.8, 35.5], [78.9, 34.3], [78.2, 32.5], [79.0, 31.0],
  [80.2, 30.2], [81.0, 30.2], [80.1, 28.8], [81.0, 28.0], [83.0, 27.4], [85.8, 26.6],
  [88.1, 26.4], [88.2, 27.8], [88.9, 28.1], [89.8, 26.8], [91.6, 27.0], [92.7, 27.9],
  [94.5, 29.3], [96.0, 29.0], [97.3, 28.2], [96.2, 27.2], [95.1, 26.0], [94.5, 24.7],
  [93.4, 23.0], [92.6, 22.0], [92.2, 23.7], [91.6, 24.2], [91.8, 25.2], [90.7, 25.1],
  [89.9, 25.3], [89.8, 26.0], [89.0, 26.0], [88.4, 25.5], [88.2, 24.9], [88.0, 24.0],
  [88.7, 23.2], [88.9, 21.8], [87.0, 21.5], [86.5, 20.2], [85.0, 19.3], [84.0, 18.3],
  [82.3, 16.7], [81.2, 16.0], [80.3, 15.5], [80.1, 13.5], [80.3, 11.5], [79.8, 10.3],
  [79.2, 9.2], [78.2, 8.9], [77.5, 8.1], [76.5, 8.9], [75.8, 11.5], [74.8, 12.9],
  [74.2, 15.0], [73.5, 16.7], [72.8, 19.0], [72.8, 20.8], [72.6, 21.6], [72.0, 21.0],
  [70.2, 21.0], [69.0, 22.3], [68.2, 23.6], [68.8, 23.7], [70.3, 24.3], [71.1, 24.4],
  [70.0, 26.5], [70.0, 27.5], [71.0, 28.0], [72.0, 29.0], [73.4, 29.9], [74.6, 31.1],
  [74.8, 32.3], [74.2, 33.4],
];

/* ---------------- Why choose ---------------- */
export const whyChoose = [
  { icon: "ShieldCheck", title: "RERA-first transparency", text: "Every listing is vetted for clear titles, approvals and honest pricing — no hidden charges, ever." },
  { icon: "Gem", title: "Curated premium inventory", text: "We showcase fewer, better homes. Each project is hand-picked for design, location and long-term value." },
  { icon: "Handshake", title: "Dedicated relationship partner", text: "One advisor from first call to key handover — site visits, negotiation, paperwork and home loans." },
  { icon: "TrendingUp", title: "Investment intelligence", text: "Micro-market data, rental yields and appreciation forecasts to back every decision with numbers." },
  { icon: "Banknote", title: "Seamless home loans", text: "Pre-approved offers from leading banks, with EMI planning built right into your journey." },
  { icon: "Sparkles", title: "Post-sales concierge", text: "Interiors, rentals, property management — we stay with you long after the keys are handed over." },
] as const;

/* ---------------- Categories ---------------- */
export const categories = [
  { type: "Apartment", icon: "Building2", text: "Sky-high living, smart layouts", image: img("towerGlass", 900) },
  { type: "Villa", icon: "Home", text: "Private pools & gardens", image: img("villaPool5", 900) },
  { type: "Penthouse", icon: "Crown", text: "Crown-jewel sky homes", image: img("towerArch", 900) },
  { type: "Plot", icon: "Map", text: "Build your own legacy", image: img("plotAerial", 900) },
  { type: "Commercial", icon: "Briefcase", text: "Offices & high-street retail", image: img("officeGlass", 900) },
] as const;

/* ---------------- Amenities showcase ---------------- */
export const amenityShowcase = [
  { title: "Infinity Sky Pools", text: "Swim at 400 ft with the skyline as your horizon.", image: img("villaPool1", 1200) },
  { title: "Private Cinemas", text: "Dolby Atmos screening rooms for residents and guests.", image: img("livingDark", 1200) },
  { title: "Wellness & Spa", text: "Steam, sauna, cold plunge and certified therapists.", image: img("bedroomSoft", 1200) },
  { title: "Sky Lounges", text: "Co-working pods and entertainment terraces above the clouds.", image: img("livingLounge", 1200) },
  { title: "Landscaped Podiums", text: "Acres of biophilic gardens, cycling tracks and play zones.", image: img("villaGarden", 1200) },
  { title: "Smart Homes", text: "Voice, app and sensor automation across every room.", image: img("livingModern", 1200) },
];

/* ---------------- Stats ---------------- */
export const stats = [
  { value: 2500, suffix: "+", label: "Happy families" },
  { value: 40, suffix: "+", label: "Projects delivered" },
  { value: 12, suffix: "", label: "Years of trust" },
  { value: 8, suffix: "", label: "Cities across India" },
];

/* ---------------- Testimonials ---------------- */
export const testimonials = [
  {
    name: "Aarav & Meera Khanna",
    role: "Homeowners, Golf Course Road",
    text: "From the first walkthrough to the registry, the Zoyal team was exceptionally transparent. We got our sky-home at a price we trusted and a handover that felt like a celebration.",
  },
  {
    name: "Dr. Sanjana Iyer",
    role: "Cardiologist, Bengaluru",
    text: "I was investing from a distance and was nervous. Their investment brief, rental yield analysis and video walkthroughs made it effortless. My Whitefield loft was rented within 3 weeks.",
  },
  {
    name: "Vikram Singhania",
    role: "Founder, Singhania Logistics",
    text: "We took two floors of Grade-A office space in Noida. The negotiation, legal checks and fit-out coordination were handled like a professional corporate desk.",
  },
  {
    name: "Priya & Rohan Deshmukh",
    role: "First-time buyers, Pune",
    text: "As first-time buyers we had a hundred questions. Our advisor answered each patiently — even helped us get a better loan rate. We moved into our dream home last spring.",
  },
  {
    name: "Mohammed Rizwan Qureshi",
    role: "NRI investor, Dubai",
    text: "Buying a sea-facing apartment in Worli from abroad felt risky until Zoyal handled everything digitally. Clean paperwork, zero surprises, and it has appreciated well.",
  },
];

/* ---------------- Blog ---------------- */
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  body: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "why-dwarka-expressway-is-the-next-gurugram",
    title: "Why the Dwarka Expressway is Gurugram's next big growth corridor",
    excerpt: "Infrastructure, connectivity and a wave of premium launches are reshaping this 18-km stretch.",
    category: "Market Insights",
    date: "2026-08-12",
    readTime: "6 min read",
    image: img("towerModern", 1200),
    author: "Research Desk, Zoyal Properties",
    body: [
      "The Dwarka Expressway has quietly become one of the most compelling real estate corridors in the National Capital Region. With direct access to the IGI Airport, the upcoming metro extension and an expanding social infrastructure, the corridor offers a rare combination of connectivity and space.",
      "Prices here have grown at a healthy clip over the last three years, yet remain at a meaningful discount to Golf Course Road. For end-users, that translates to larger homes and better amenities for the same budget; for investors, it signals runway.",
      "Developers are responding with larger land parcels, low-density towers and independent villa communities. Expect the corridor to attract more premium launches over the next 24 months.",
      "What to look for: clear RERA registration, proximity to the proposed metro alignment, and builders with a track record of on-time delivery. As always, visit in person and compare at least three projects before deciding.",
    ],
  },
  {
    slug: "buying-vs-renting-in-mumbai-2026",
    title: "Buying vs renting in Mumbai: what the numbers say in 2026",
    excerpt: "A frank look at rental yields, EMIs and the real cost of waiting.",
    category: "Buyer's Guide",
    date: "2026-07-03",
    readTime: "5 min read",
    image: img("gateway", 1200),
    author: "Ananya Rao, Head of Advisory",
    body: [
      "Mumbai's rental yields hover around 2.5–3% — far below home-loan interest rates. That gap has historically pushed buyers to wait, but appreciation in prime micro-markets has often outrun the rent saved.",
      "The right answer depends on your holding horizon. If you expect to stay put for 7+ years, ownership usually wins through equity build-up and tax benefits under sections 24(b) and 80C.",
      "For shorter horizons, renting and investing the difference in diversified assets can be rational. We recommend running both scenarios using our EMI calculator before choosing.",
    ],
  },
  {
    slug: "smart-homes-what-luxury-buyers-expect",
    title: "Smart homes: what luxury buyers actually expect in 2026",
    excerpt: "From voice-controlled climate to biometric entry — the features that move the needle.",
    category: "Design & Lifestyle",
    date: "2026-06-18",
    readTime: "4 min read",
    image: img("livingModern", 1200),
    author: "Kabir Mehta, Design Lead",
    body: [
      "Today's premium buyer no longer treats home automation as a gimmick. They expect integrated lighting, climate, security and entertainment that works seamlessly across devices.",
      "The standouts: centralised control panels, scene presets (Arrival, Movie, Sleep), energy dashboards and voice assistants available in regional languages.",
      "Importantly, buyers now ask about open standards like Matter, because they don't want to be locked into one ecosystem. Ask your developer what happens when a device fails in five years.",
    ],
  },
  {
    slug: "hyderabad-financial-district-investment-guide",
    title: "Investing near Hyderabad's Financial District: a practical guide",
    excerpt: "Where demand is strongest, which unit sizes rent fastest, and pitfalls to avoid.",
    category: "Investment",
    date: "2026-05-09",
    readTime: "7 min read",
    image: img("skyline", 1200),
    author: "Research Desk, Zoyal Properties",
    body: [
      "Gachibowli and the Financial District have seen consistent absorption thanks to anchored employment from global technology and BFSI firms.",
      "Two- and three-bedroom apartments within 5 km of major campuses consistently rent faster, while larger homes serve a more selective, long-stay tenant profile.",
      "Always check RERA registration, builder track record, and carpet area versus super built-up area before signing.",
    ],
  },
];

/* ---------------- Team / timeline ---------------- */
export const team = [
  { name: "Aditya Malhotra", role: "Founder & CEO", bio: "Two decades shaping NCR's premium residential market." },
  { name: "Ananya Rao", role: "Head of Advisory", bio: "Guides 300+ families a year through confident buying decisions." },
  { name: "Kabir Mehta", role: "Design Lead", bio: "Architect turned advisor — obsessed with livability and light." },
  { name: "Ishita Bansal", role: "Director, Investments", bio: "Ex-wealth manager translating micro-market data into strategy." },
];

export const timeline = [
  { year: "2014", title: "Zoyal is born", text: "Founded in Gurugram with a three-person team and one mission: honest property advice." },
  { year: "2017", title: "First 500 families", text: "Crossed 500 homes sold across NCR and launched our digital site-visit programme." },
  { year: "2020", title: "Going national", text: "Expanded to Mumbai, Pune and Bengaluru with local advisory desks." },
  { year: "2023", title: "Luxury & investments", text: "Launched our penthouse and villa collection plus an investment research arm." },
  { year: "2026", title: "2,500+ happy families", text: "Eight cities, 40+ projects and a new immersive, AI-assisted discovery experience." },
];

export const faqLinks = [
  { label: "Properties", href: "/properties" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Insights", href: "/blog" },
  { label: "Contact", href: "/contact" },
];
