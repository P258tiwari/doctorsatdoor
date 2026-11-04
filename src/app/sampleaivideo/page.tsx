import { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getPublicSampleVideo } from "@/lib/server/public-content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...pageMetadata("DAD Report Sample Video", "See a sample of DAD Report, the AI health-record app from Doctors At Door.", "/sampleaivideo"),
  robots: { index: false, follow: true },
};

export default async function SampleVideoPage() {
  const video = await getPublicSampleVideo();
  return (
    <main id="main-content" className="flex min-h-svh flex-col items-center justify-center px-5 py-10 text-center">
      <span className="eyebrow">DAD REPORT</span>
      <h1 className="mt-3 mb-6 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">See DAD Report in action</h1>
      <video key={video.url} src={video.url} controls playsInline preload="metadata" className="block w-auto max-w-full max-h-[70svh] rounded-3xl bg-black" />
      <Link href="/dad-report" className="text-link mt-6 inline-flex">Explore DAD Report <ArrowUpRight size={17} /></Link>
    </main>
  );
}
