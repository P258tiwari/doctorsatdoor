import { MetadataRoute } from "next";
import { getPublicBlogPosts } from "@/lib/server/public-content";
import { SITE_URL } from "@/lib/seo";

const pages: [path: string, priority: number][] = [
  ["/", 1],
  ["/dad-report", 0.9],
  ["/changelog", 0.8],
  ["/blog", 0.8],
  ["/contact", 0.8],
  ["/dad-admin", 0.7],
  ["/dad-lab", 0.7],
  ["/dad-diagnostic", 0.7],
  ["/data-security", 0.6],
  ["/privacy-policy", 0.5],
  ["/terms-of-service", 0.5],
  ["/account-deletion", 0.4],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPublicBlogPosts();
  return [
    ...pages.map(([path, priority]) => ({ url: `${SITE_URL}${path === "/" ? "" : path}`, priority })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at),
      priority: 0.7,
    })),
  ];
}
