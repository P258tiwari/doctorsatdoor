import React from "react";
import { LegalHeader } from "@/components/LegalHeader";
import { Metadata } from "next";
import { AlertTriangle, FileX, Trash2, Link2Off, Download } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AccountDeletionClient } from "./AccountDeletionClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Account Deletion Request",
  "Submit an official request to permanently delete your Doctors At Door and DAD Report account, personal health records, and associated data.",
  "/account-deletion"
);

export default function AccountDeletionPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="legal-page deletion-page">
        <LegalHeader label="YOUR DATA. YOUR DECISION." title="Account deletion." emphasis="Your choice, respected." description="You have the absolute right to delete your account and purge all uploaded medical reports, health timelines, and family profiles."/>
        <section className="dad-container deletion-content">
          <div className="deletion-layout">
            {/* Warning Box */}
            <div className="deletion-warning space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Important Deletion Warning:</span>
              </div>
              <p className="leading-relaxed">
                Account deletion is <strong>permanent and irreversible</strong>. Once processed:
              </p>
              <ul className="deletion-warning-list">
                <li><FileX size={17} aria-hidden="true"/><span>All uploaded PDFs, radiology scans, and lab images will be permanently purged from cloud storage.</span></li>
                <li><Trash2 size={17} aria-hidden="true"/><span>All AI-indexed health timelines and summaries will be destroyed.</span></li>
                <li><Link2Off size={17} aria-hidden="true"/><span>Any active view-only sharing links provided to doctors will immediately become invalid.</span></li>
                <li><Download size={17} aria-hidden="true"/><span>We recommend downloading an offline copy of your original reports before requesting deletion.</span></li>
              </ul>
            </div>

            {/* Interactive Deletion Form */}
            <AccountDeletionClient />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

