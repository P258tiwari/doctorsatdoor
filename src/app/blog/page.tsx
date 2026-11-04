import { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogCover } from "@/components/BlogCover";
import { getPublicBlogPosts } from "@/lib/server/public-content";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { BlogListClient } from "./BlogListClient";
import "./journal-index.css";

export const metadata: Metadata = pageMetadata(
  "The DAD Journal: Healthcare Insights",
  "Ideas, stories, and perspectives on a more connected healthcare journey, from the team building the Doctors At Door ecosystem.",
  "/blog"
);

async function BlogContent() {
  const posts = await getPublicBlogPosts();
  const featured = posts.find((post) => post.is_featured) || posts[0];

  return (
    <main id="main-content" className="journal-index">
      <div className="dad-container">
        <header className="journal-index-heading">
          <div>
            <span className="eyebrow">THE DAD JOURNAL</span>
            <h1>
              Fresh thinking.<br />
              <em>Healthier connections.</em>
            </h1>
          </div>
          <div className="journal-index-intro">
            <p>
              Ideas, stories, and perspectives for a more connected, more human healthcare future.
            </p>
            <a href="#journal-stories">
              Explore the journal <ArrowDown size={16} />
            </a>
          </div>
        </header>

        {featured && (
          <article className="journal-feature" aria-labelledby="journal-feature-title">
            <Link
              href={`/blog/${featured.slug}`}
              className="journal-feature-image"
              aria-label={`Read ${featured.title}`}
            >
              <BlogCover
                src={featured.cover_image}
                title={featured.title}
                category={featured.category_slug}
                sizes="(max-width: 800px) 100vw, 55vw"
                preload
              />
              <span className="journal-feature-badge">FEATURED STORY</span>
              <span className="journal-feature-image-arrow" aria-hidden="true">
                <ArrowUpRight size={24} />
              </span>
            </Link>
            <div className="journal-feature-copy">
              <span className="eyebrow">FEATURED PERSPECTIVE</span>
              <div className="journal-feature-meta">
                <span>{featured.category}</span>
                <span>{featured.reading_time}</span>
              </div>
              <h2 id="journal-feature-title">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>
              <p>{featured.excerpt}</p>
              <div className="journal-feature-byline">
                <strong>{featured.author.name}</strong>
                <time dateTime={featured.published_at}>
                  {formatDate(featured.published_at)}
                </time>
              </div>
              <Link href={`/blog/${featured.slug}`} className="journal-feature-link">
                Read the story <ArrowUpRight size={18} />
              </Link>
            </div>
          </article>
        )}
      </div>

      <BlogListClient initialPosts={posts} />
    </main>
  );
}

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <BlogContent />
      <Footer />
    </>
  );
}
