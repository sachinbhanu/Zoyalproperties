import { blogPosts } from "@/data/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { BlogCard } from "@/components/sections/BlogCard";

export function BlogPreview() {
  return (
    <section className="section-y relative" aria-labelledby="blog-heading">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="blog-heading" eyebrow="Latest insights" title={"Market intelligence,\n*decoded*"} />
          <Reveal>
            <Button href="/blog" variant="ghost" arrow>
              All insights
            </Button>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post, i) => (
            <Reveal key={post.slug} delay={i * 0.1}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
