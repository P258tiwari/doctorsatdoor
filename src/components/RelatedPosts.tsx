import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/types";
import { BlogCard } from "./BlogCard";
import "./RelatedPosts.css";

export function RelatedPosts({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="related-section" aria-labelledby="related-posts-heading">
      <div className="related-container">
        <div className="related-heading">
          <div>
            <span className="related-eyebrow">CONTINUE EXPLORING</span>
            <h2 id="related-posts-heading">A little more <em>perspective.</em></h2>
          </div>
          <Link href="/blog" className="related-allPosts">All insights <ArrowUpRight size={17} /></Link>
        </div>
        <div className="related-grid">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
