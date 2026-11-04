import type { Metadata } from "next";

export const SITE_URL = "https://www.doctorsatdoor.com";
const shareImage = { url: "/images/og-default.png", width: 1200, height: 630, alt: "Doctors At Door: connected digital healthcare" };

// Every public page needs its own canonical and social tags: Next.js replaces openGraph per page, it never derives it from the title.
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: "Doctors At Door (DAD)", locale: "en_IN", type: "website", images: [shareImage] },
    twitter: { card: "summary_large_image", title, description, images: [shareImage] },
  };
}
