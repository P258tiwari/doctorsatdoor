"use client";

import Image from "next/image";
import { useState } from "react";
import { articleImage } from '@/lib/article-images';

const legacyCovers: Record<string, string> = {
  "/blog/fragmented-healthcare.jpg": "/images/family-care.webp",
  "/blog/ai-reports.jpg": "/images/family-care.webp",
  "/blog/health-insurance.jpg": "/images/family-care.webp",
  "/blog/clinic-coordination.jpg": "/images/collaboration.webp",
};

export function BlogCover({ src, title, category, sizes = "(max-width: 640px) 100vw, (max-width: 900px) 50vw, 33vw", preload = false }: { src?: string; title: string; category?: string; sizes?: string; preload?: boolean }) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const fallback = category === "ecosystem" ? "/images/collaboration.webp" : "/images/family-care.webp";
  const source = articleImage(src && failedSrc !== src ? (legacyCovers[src] || src) : fallback).src;

  return <Image src={source} alt={`Illustration for ${title}`} fill sizes={sizes} preload={preload} unoptimized={/^https?:\/\//.test(source) && !source.startsWith(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/`)} onError={() => setFailedSrc(src || "")} />;
}
