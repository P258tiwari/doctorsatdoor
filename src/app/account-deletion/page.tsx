import React from "react";
import { LegalHeader } from "@/components/LegalHeader";
import { Metadata } from "next";
import { AlertTriangle, FileX, Trash2, Link2Off, Download } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AccountDeletionClient } from "./AccountDeletionClient";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Account deletion request",
  "Request permanent deletion of your DAD Report account, your medical reports, and related data.",
  "/account-deletion"
);

export default function AccountDeletionPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="legal-page deletion-page">
        <LegalHeader label="YOUR DATA. YOUR DECISION." title="Account deletion." emphasis="Your choice, respected." description="You have the right to delete your account, including all uploaded medical reports, timelines, and family profiles."/>
        <section className="dad-container deletion-content">
          <div className="deletion-layout">
            {/* Warning Box */}
            <div className="deletion-warning space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Before you continue</span>
              </div>
              <p className="leading-relaxed">
                Account deletion is <strong>permanent and cannot be undone</strong>. After we process your request:
              </p>
              <ul className="deletion-warning-list">
                <li><FileX size={17} aria-hidden="true"/><span>All uploaded PDFs, scans, and report images will be permanently deleted from our storage.</span></li>
                <li><Trash2 size={17} aria-hidden="true"/><span>Your timelines and AI summaries will be deleted.</span></li>
                <li><Link2Off size={17} aria-hidden="true"/><span>Any view-only links you shared with doctors will stop working.</span></li>
                <li><Download size={17} aria-hidden="true"/><span>Download copies of any reports you want to keep before you send this request.</span></li>
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

