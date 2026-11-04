import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/types";
import { BlogCover } from "./BlogCover";
import { formatDate } from "@/lib/utils";
import "./RelatedPosts.css";

export function BlogCard({ post }: { post: BlogPost }) {
  return (<article>
              <Link href={`/blog/${post.slug}`} className="related-card">
                <div className="related-image">
                  <BlogCover src={post.cover_image} title={post.title} category={post.category_slug} />
                  <span className="related-category">{post.category}</span>
                  <span className="related-arrow" aria-hidden="true"><ArrowUpRight size={23} /></span>
                </div>
                <div className="related-copy">
                  <div className="related-meta"><time dateTime={post.published_at}>{formatDate(post.published_at)}</time><span aria-hidden="true">·</span><span>{post.reading_time}</span></div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <span className="related-read">Read story <ArrowUpRight size={15} /></span>
                </div>
              </Link>
            </article>);
}
