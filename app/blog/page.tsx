import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { Reveal } from "@/components/ui/Reveal";
import { BlogCard } from "@/components/sections/BlogCard";
import { blogPosts } from "@/data/content";

export const metadata: Metadata = {
  title: "Insights & Market Updates",
  description: "Real estate market insights, buyer's guides and investment strategies from the Zoyal Properties research desk.",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader eyebrow="Insights" title={"Market intelligence,\n*decoded*"} text="Guides, neighbourhood deep-dives and investment thinking from our research desk." />
      <section className="container-x pb-28">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, i) => (
            <Reveal key={post.slug} delay={(i % 3) * 0.08}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
