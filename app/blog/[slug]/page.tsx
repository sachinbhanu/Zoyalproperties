import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { blogPosts } from "@/data/content";
import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { BlogCard } from "@/components/sections/BlogCard";

type Params = { params: { slug: string } };

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.title, description: post.excerpt, images: [{ url: post.image, alt: post.title }], publishedTime: post.date },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default function BlogPostPage({ params }: Params) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();
  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    image: post.image,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: siteConfig.brand },
    description: post.excerpt,
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="relative overflow-hidden pt-36 sm:pt-44">
        <div className="container-x max-w-4xl">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted hover:text-cyan">
            <ArrowLeft className="h-4 w-4" /> All insights
          </Link>
          <p className="mt-8 text-xs uppercase tracking-[0.25em] text-cyan">{post.category}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">{post.title}</h1>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
            <span>{post.author}</span>
            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</time>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {post.readTime}
            </span>
          </p>
        </div>
        <div className="container-x mt-12 max-w-5xl">
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] glow-border">
            <Image src={post.image} alt={post.title} fill priority sizes="(min-width: 1024px) 1000px, 100vw" className="object-cover" />
          </div>
        </div>
      </header>

      <div className="container-x mt-14 max-w-3xl space-y-6 text-lg leading-[1.8] text-fg/85">
        {post.body.map((para, i) => (
          <Reveal key={i}>
            <p>{para}</p>
          </Reveal>
        ))}
        <Reveal>
          <div className="glass glow-border mt-12 flex flex-col items-start gap-4 rounded-3xl p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-semibold">Want a personalised take?</p>
              <p className="text-sm text-muted">Talk to an advisor about this topic on WhatsApp.</p>
            </div>
            <WhatsAppButton message={`Hi ${siteConfig.brand}, I just read "${post.title}" and would like to discuss it with an advisor.`} />
          </div>
        </Reveal>
      </div>

      <section className="container-x mt-24 pb-28" aria-labelledby="more-heading">
        <h2 id="more-heading" className="font-display text-3xl font-semibold">
          Keep reading
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {more.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      </section>
    </article>
  );
}
