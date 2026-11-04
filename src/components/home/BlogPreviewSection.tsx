import Link from "next/link";
import { getPublicBlogPosts } from "@/lib/server/public-content";
import { BlogCard } from "@/components/BlogCard";
import { ArrowUpRight } from "lucide-react";

export async function BlogPreviewSection() {
  const posts = (await getPublicBlogPosts()).slice(0, 3);
  if (!posts.length) return null;
  return <section className="dad-section home-journal"><div className="dad-container">
    <div className="section-heading"><div><span className="eyebrow">THE DAD JOURNAL</span><h2>Fresh thinking.<br/><em>Healthier connections.</em></h2></div><Link href="/blog" className="text-link">Explore the journal <ArrowUpRight size={17}/></Link></div>
    <div className="related-grid">{posts.map(post => <BlogCard key={post.id} post={post}/>)}</div>
  </div></section>;
}
