# Zoyal Properties — futuristic 3D real-estate showcase

A demo/showcase site for a fictional premium Indian real-estate brand, built with **Next.js 14 (App Router, TypeScript)**, **Tailwind CSS**, **React Three Fiber** (+ drei, postprocessing), **Framer Motion**, **GSAP ScrollTrigger**, **Lenis**, **Zod + React Hook Form**.
No paid APIs, no keys, no backend required.

```bash
npm install
npm run dev        # uses PORT from .env (default 4000) → http://localhost:4000
```

Other scripts: `npm run build` · `npm start` · `npm run lint` · `npm run typecheck`

> Node 18.18+ (tested on Node 24). Fonts (Space Grotesk + Inter) are fetched from Google Fonts by `next/font` at dev/build time and self-hosted afterwards.

---

## What's inside

| Area | Highlights |
| --- | --- |
| **Home** | Preloader with CSS-3D extruded logo + progress counter → cinematic R3F hero (instanced procedural city, shader windows, traffic, fog, bloom, chromatic aberration; mouse parallax + scroll camera dolly) → search bar → featured tilt cards → rotating twisted-tower spotlight → stat counters → interactive 3D India map → why-choose → categories → pinned GSAP horizontal amenities → EMI calculator with animated charts → testimonials carousel → insights → CTA band → footer |
| **/properties** | Grid/list toggle, city/type/budget/BHK/status filters (URL-synced), sorting, animated layout transitions, skeleton loaders |
| **/properties/[slug]** | Parallax hero, gallery + lightbox, specs table, amenities, schematic floor plan, OpenStreetMap embed, EMI calculator, enquiry form, similar properties, sticky WhatsApp bar, JSON-LD `Product`/`Offer` |
| **Other pages** | `/about`, `/projects`, `/blog`, `/blog/[slug]`, `/contact`, custom 3D `404`, `sitemap.xml`, `robots.txt`, JSON-LD `RealEstateAgent` |
| **WhatsApp** | `buildWhatsAppLink`, `<WhatsAppButton />`, floating pulsing launcher with editable message popover, context-aware messages, enquiry form "Send via WhatsApp" |

### Performance & graceful degradation
* Every WebGL scene is loaded with `next/dynamic` (`ssr: false`) from `components/three/lazy.tsx`; a gradient shows while loading or when WebGL is unavailable.
* Canvases only mount while near the viewport and pause/unmount off-screen (saves GPU and WebGL contexts).
* `hooks/useDevice.ts` classifies the device: **high** (desktop-class → postprocessing + more particles/buildings) vs **low** (mobile, touch, ≤4 cores / ≤4 GB → no postprocessing, ~half the geometry, lower DPR).
* `prefers-reduced-motion`: Lenis off, canvases render on demand (static), text reveals/transitions reduced, GSAP pin replaced by native scroll-snap, testimonial autoplay off.
* Tilt and magnetic effects only run for fine pointers (disabled on touch).

---

## Rebranding for a new client (≈10 minutes)

### 1. Brand name, contact details, tagline, disclaimers
Edit **`config/site.ts`** — one file:

* `brand`, `brandShort`, `logoLetter` (the letter in the 3D preloader logo and nav mark), `tagline`, `description`
* `displayPhone`, `email`, `address`, `officeHours`, social links
* `rera` placeholder text and the `disclaimer` (**remove the "Demo website" copy** before going live — also in `Footer.tsx`, `about/page.tsx`)
* `messages.*` — default WhatsApp message templates (general, property, listings, contact, blog)

Also update the hero copy in `components/sections/Hero.tsx` and the 3D tower spotlight slug in `components/sections/TowerShowcase.tsx`.

### 2. Phone / WhatsApp number and port — `.env`
Everything environment-specific lives in **`.env`** (there is no `.env.local`):

```env
PORT=4000                                  # used by `npm run dev` and `npm start`
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210   # international format, digits only, no "+"
NEXT_PUBLIC_SITE_URL=http://localhost:4000
```

That one number feeds **every** place on the site: WhatsApp buttons/links, floating widget, call buttons (`tel:`), footer, contact page, enquiry-form WhatsApp option and JSON-LD. The displayed format (`+91 98765 43210`) is generated automatically in `config/site.ts`.
Restart the dev server after editing `.env`. On Vercel, add the same variables in Project → Settings → Environment Variables (the port is ignored there).

### 3. Colours
Edit the **RGB triplets** at the top of **`app/globals.css`** (`--bg`, `--surface`, `--fg`, `--muted`, `--cyan`, `--violet`, `--gold`; separate blocks for dark and light). Tailwind (`tailwind.config.ts`) and every component read from these variables.
The 3D scenes use matching hexes in `components/three/utils.ts` (`BRAND`) and a few `#22d3ee / #8b5cf6 / #f5be5a` values inside the scene files — search for those to retint the 3D world.

### 4. Fonts
`app/layout.tsx` — swap `Space_Grotesk` / `Inter` for any `next/font/google` font (e.g. `Sora`).

### 5. Listings, images, content
* **Properties:** `data/properties.ts` (typed; ≥ 20 sample listings). Prices are INR numbers — `formatPrice()` renders Lakh/Crore. India-only cities are listed in `CITIES`; add a city there **and** in `data/content.ts → mapLocations` to get a node on the 3D map.
* **Images:** all photos are free-to-use Unsplash IDs registered in **`data/images.ts`**. Replace an ID (the part after `photo-` in an Unsplash URL) or put a full URL from Unsplash / Pexels / Pixabay. Hosts allowed by `next/image` are in `next.config.mjs` (`remotePatterns`). To use a client's own images, drop them in `/public` and use `/your-image.jpg` paths (then no `remotePatterns` entry is needed).
* **Testimonials, blog posts, team, timeline, stats, amenities, categories:** `data/content.ts`.
* **Enquiries:** `app/api/enquiry/route.ts` validates with Zod and `console.log`s the payload. Replace the log with Resend/SendGrid, a CRM webhook or a DB insert.
* **SEO:** set `NEXT_PUBLIC_SITE_URL` (sitemap, canonical, OG). Per-page metadata lives in each `page.tsx`. Add an OG image (`app/opengraph-image.png`) for a branded share card.
* **Office map:** coordinates in `app/contact/page.tsx`; listing maps use each property's `coordinates`.

---

## Project structure

```
app/                    routes, layout, metadata, sitemap, robots, api/enquiry, 404
components/
  ui/                   Button, Magnetic, TiltCard, SplitReveal, Reveal, Counter, Preloader, PageCurtain, Select, ThemeToggle…
  layout/               Navbar, Footer, Logo, NewsletterForm, PageHeader
  sections/             Home sections (Hero, SearchBar, FeaturedProjects, TowerShowcase, LocationsMap, Amenities, Testimonials…)
  property/             PropertyCard, PropertiesExplorer, Gallery(lightbox), FloorPlan, EmiCalculator, EnquiryForm, StickyWhatsAppBar
  whatsapp/             WhatsAppButton (+ message popover), FloatingWhatsApp, icon
  three/                HeroScene, TowerScene, FloatingShapes, IndiaMapScene, NotFoundScene, LazyCanvas, lazy.tsx (next/dynamic)
  providers/            AppProvider (theme + preloader state), SmoothScroll (Lenis ↔ GSAP)
config/site.ts          brand, contact, WhatsApp number & message templates
data/                   properties.ts, content.ts, images.ts
hooks/                  useDevice, useInView
lib/                    whatsapp.ts, format.ts, emi.ts, filters.ts, schemas.ts, lenis.ts, sceneState.ts
```

---

## Deploy to Vercel

1. Push the repo to GitHub/GitLab/Bitbucket.
2. In Vercel: **Add New → Project →** import the repo (framework preset *Next.js* is detected automatically; no build settings needed).
3. Add environment variables: `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL` (your production URL).
4. Deploy. Add the custom domain under *Settings → Domains*, then update `NEXT_PUBLIC_SITE_URL` and redeploy.

CLI alternative: `npm i -g vercel && vercel --prod`.

---

## Per-client checklist

- [ ] Brand name, logo letter, tagline, hero copy (`config/site.ts`, `Hero.tsx`)
- [ ] WhatsApp number (`.env` / Vercel env) and message templates
- [ ] E-mail, address, office hours, social links, office map coordinates
- [ ] Real **RERA numbers** and legal copy; remove the "Demo website, listings are fictional" notes
- [ ] Brand colours (`app/globals.css`) and 3D accent hexes
- [ ] Real listings, prices, floor plans, amenities (`data/properties.ts`)
- [ ] Client photography (`data/images.ts` or `/public`) + alt text; update image credits in the footer / `/about#credits`
- [ ] Testimonials (real, with permission), team, timeline, blog content
- [ ] Wire `/api/enquiry` to email/CRM; consider spam protection (honeypot/Turnstile)
- [ ] `NEXT_PUBLIC_SITE_URL`, OG image, analytics, cookie/consent banner if required
- [ ] Privacy policy & terms pages (not included)
- [ ] Test on a real mid-range phone and a low-end laptop; tune particle counts in `HeroScene.tsx` if needed

## Credits
Photos: [Unsplash](https://unsplash.com/license) contributors. Map embeds: © OpenStreetMap contributors. All brands, projects, people and testimonials are fictional.
#   Z o y a l p r o p e r t i e s  
 