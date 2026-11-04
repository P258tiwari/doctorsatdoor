import { cacheLife } from "next/cache";
import { getBlogPosts, getChangelog, getFAQs, getSampleVideo } from "@/lib/supabase/data-service";

// Cached Supabase reads for public pages, so they ship as static HTML. CMS edits appear within about a minute.
// ponytail: time-based only; call revalidateTag from the admin saves if that minute ever matters.
export async function getPublicBlogPosts() {
  "use cache";
  cacheLife("minutes");
  return getBlogPosts();
}
export async function getPublicBlogPost(slug: string) {
  return (await getPublicBlogPosts()).find((post) => post.slug === slug) || null;
}
export async function getPublicChangelog() {
  "use cache";
  cacheLife("minutes");
  return getChangelog();
}
export async function getPublicFAQs() {
  "use cache";
  cacheLife("minutes");
  return getFAQs();
}
export async function getPublicSampleVideo() {
  "use cache";
  cacheLife("minutes");
  return getSampleVideo();
}
