import { ArticleClosing } from "@/components/ArticleClosing";
import { RelatedPosts } from "@/components/RelatedPosts";
import { getRelatedPosts } from "@/lib/related-posts";
import { BlogCover } from "@/components/BlogCover";
import { ArticleBody, articleSections } from "@/components/ArticleBody";
import { ArticleSidebar } from "@/components/ArticleSidebar";
import "./article.css";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPublicBlogPost, getPublicBlogPosts } from "@/lib/server/public-content";
import { SITE_URL } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { articleImage } from '@/lib/article-images';
import type { BlogPost } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublicBlogPosts();
  // Cache Components fails the build on an empty list; this placeholder just renders the 404.
  return posts.length ? posts.map((post) => ({ slug: post.slug })) : [{ slug: "no-articles-yet" }];
}

const coverOf = (post: BlogPost) => articleImage(post.cover_image || "/images/family-care.webp").src;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: post.seo_title ? { absolute: post.seo_title } : post.title,
    description: post.seo_description || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      modifiedTime: post.updated_at,
      siteName: "Doctors At Door (DAD)",
      authors: [post.author.name],
      images: [coverOf(post)],
      url: `/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      images: [coverOf(post)],
      title: post.title,
      description: post.excerpt,
    },
  };
}

// ponytail: unknown slugs answer 200 + noindex because the shell streams first; a real 404 needs a slug lookup in Proxy.
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublicBlogPost(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublicBlogPosts();
  const relatedPosts = getRelatedPosts(post, allPosts);

  // BlogPosting Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    image: new URL(coverOf(post), SITE_URL).href,
    author: /editorial/i.test(post.author.role)
      ? { "@type": "Organization", name: post.author.name, url: SITE_URL }
      : { "@type": "Person", name: post.author.name, jobTitle: post.author.role },
    publisher: {
      "@type": "Organization",
      name: "Doctors At Door",
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/images/dad-logo.webp` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <>
      <Navbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <main id="main-content" className="journal-page pt-28">
        {/* Article Header */}
        <section className="journal-header py-12 md:py-16">
          <div className="dad-container space-y-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Articles</span>
            </Link>

            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                {post.category}
              </span>
              <div className="journal-header-meta">
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                <span aria-hidden="true">·</span>
                <span>{post.reading_time}</span>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.2]">
              {post.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Author Byline */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-5 border-t border-slate-200/80">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-indigo-600 text-white font-bold text-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                  {post.author.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.author.avatar_url}
                      alt={post.author.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    post.author.name[0]
                  )}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">
                    {post.author.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {post.author.role}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Topic:</span>
                {post.tags?.slice(0, 2).map((t, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="journal-reading">
          <div className="dad-container journal-grid">
            <article className="journal-article" aria-label={post.title}>
              <div className="journal-cover"><BlogCover src={post.cover_image} title={post.title} category={post.category_slug} sizes="(max-width: 900px) 100vw, 75vw" preload /></div>
              <ArticleBody content={post.content}/>
            </article>
            <ArticleSidebar sections={articleSections(post.content)} title={post.title} slug={post.slug}/>
          </div>
        </section>

        <ArticleClosing author={post.author} />
        <RelatedPosts posts={relatedPosts} />
      </main>
      <Footer />
    </>
  );
}
