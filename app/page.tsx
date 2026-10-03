import { Hero } from "@/components/sections/Hero";
import { SearchBar } from "@/components/sections/SearchBar";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { TowerShowcase } from "@/components/sections/TowerShowcase";
import { StatsCounters } from "@/components/sections/StatsCounters";
import { LocationsMap } from "@/components/sections/LocationsMap";
import { WhyChoose } from "@/components/sections/WhyChoose";
import { Categories } from "@/components/sections/Categories";
import { Amenities } from "@/components/sections/Amenities";
import { EmiSection } from "@/components/sections/EmiSection";
import { Testimonials } from "@/components/sections/Testimonials";
import { BlogPreview } from "@/components/sections/BlogPreview";
import { ContactBand } from "@/components/sections/ContactBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SearchBar />
      <FeaturedProjects />
      <TowerShowcase />
      <StatsCounters />
      <LocationsMap />
      <WhyChoose />
      <Categories />
      <Amenities />
      <EmiSection />
      <Testimonials />
      <BlogPreview />
      <ContactBand />
    </>
  );
}
