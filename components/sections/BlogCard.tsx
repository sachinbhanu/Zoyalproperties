import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Clock } from "lucide-react";
import type { BlogPost } from "@/data/content";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group glass glow-border flex h-full flex-col overflow-hidden rounded-3xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={post.image} alt={post.title} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-[1100ms] group-hover:scale-110" />
        <span className="absolute left-4 top-4 rounded-full bg-black/50 px-3 py-1 text-[11px] uppercase tracking-wider text-white backdrop-blur-md">{post.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-3 text-xs text-muted">
          <time dateTime={post.date}>{new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {post.readTime}
          </span>
        </p>
        <h3 className="mt-3 font-display text-xl font-semibold leading-snug transition-colors group-hover:text-cyan">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm text-muted">{post.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-cyan">
          Read insight <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
