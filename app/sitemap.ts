import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { properties } from "@/data/properties";
import { blogPosts } from "@/data/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = siteConfig.url.replace(/\/$/, "");
  const staticRoutes = ["", "/properties", "/projects", "/about", "/blog", "/contact"].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
  return [
    ...staticRoutes,
    ...properties.map((p) => ({ url: `${base}/properties/${p.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...blogPosts.map((b) => ({ url: `${base}/blog/${b.slug}`, lastModified: new Date(b.date), changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
