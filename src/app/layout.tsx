import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import "./responsive.css";
import { Suspense } from "react";
import { AnchorNavigation } from "@/components/layout/AnchorNavigation";
import { SITE_URL } from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Doctors At Door (DAD) | Connected Digital Healthcare",
    template: "%s | Doctors At Door",
  },
  description:
    "Doctors At Door (DAD) connects patients, doctors, clinics, diagnostics and labs in one digital healthcare ecosystem. Explore DAD Report, our first live app.",
  applicationName: "Doctors At Door",
  authors: [{ name: "Doctors At Door Team", url: SITE_URL }],
};

export const viewport: Viewport = {
  themeColor: "#1F194C",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
        <Suspense fallback={null}><AnchorNavigation /></Suspense>
        {children}
      </body>
    </html>
  );
}
