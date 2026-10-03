import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { PropertiesExplorer } from "@/components/property/PropertiesExplorer";

export const metadata: Metadata = {
  title: "Properties for Sale in India",
  description: "Browse premium apartments, villas, penthouses, plots and commercial spaces across Gurugram, Delhi, Noida, Mumbai, Bengaluru, Hyderabad and Pune.",
  openGraph: { title: "Properties for Sale in India | Zoyal Properties" },
};

export default function PropertiesPage() {
  return (
    <>
      <PageHeader eyebrow="Listings" title={"Discover your\n*perfect* property"} text="Filter by city, type, budget and BHK — switch between grid and list, and sort to suit." />
      <section className="container-x pb-28">
        <Suspense fallback={<div className="skeleton h-72 rounded-3xl" aria-hidden />}>
          <PropertiesExplorer />
        </Suspense>
      </section>
    </>
  );
}
