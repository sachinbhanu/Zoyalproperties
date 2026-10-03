import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { AppProvider } from "@/components/providers/AppProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Preloader } from "@/components/ui/Preloader";
import { PageCurtain } from "@/components/ui/PageCurtain";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/whatsapp/FloatingWhatsApp";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Inter({ subsets: ["latin"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.brand} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.brand}`,
  },
  description: siteConfig.description,
  keywords: ["real estate India", "luxury apartments", "villas", "penthouses", "Gurugram", "Mumbai", "Bengaluru", "Zoyal Properties"],
  openGraph: {
    type: "website",
    siteName: siteConfig.brand,
    title: `${siteConfig.brand} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: "en_IN",
    url: siteConfig.url,
  },
  twitter: { card: "summary_large_image", title: siteConfig.brand, description: siteConfig.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#040712",
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
};

const bootScript = `(function(){try{var t=localStorage.getItem('zoyal-theme');document.documentElement.dataset.theme=(t==='light'||t==='dark')?t:'dark';if(sessionStorage.getItem('zoyal-seen')==='1')document.documentElement.classList.add('seen');}catch(e){document.documentElement.dataset.theme='dark';}})();`;

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: siteConfig.brand,
  description: siteConfig.description,
  url: siteConfig.url,
  telephone: siteConfig.displayPhone,
  email: siteConfig.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Cyber Hub Road, DLF Phase 2",
    addressLocality: "Gurugram",
    addressRegion: "Haryana",
    postalCode: "122002",
    addressCountry: "IN",
  },
  areaServed: ["Gurugram", "Delhi", "Noida", "Mumbai", "Bengaluru", "Hyderabad", "Pune"],
  priceRange: "₹₹₹",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" data-theme="dark" suppressHydrationWarning className={`${display.variable} ${body.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="font-sans">
        <AppProvider>
          <a
            href="#main"
            className="sr-only z-[300] rounded-full bg-cyan px-4 py-2 text-[rgb(4_7_18)] focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            Skip to content
          </a>
          <SmoothScroll />
          <Preloader />
          <PageCurtain />
          <div className="grain" aria-hidden />
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <FloatingWhatsApp />
        </AppProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
