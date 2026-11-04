import { LegalToc } from "@/components/LegalToc";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { LegalHeader } from "@/components/LegalHeader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Privacy Policy",
  "Doctors At Door Privacy Policy: Learn how we collect, store, and protect your personal medical records and health documents.",
  "/privacy-policy"
);

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="legal-page">
        <LegalHeader label="YOUR INFORMATION. YOUR CHOICES." title="Privacy policy." emphasis="Your information matters." description="How Doctors At Door collects, uses, and handles your information." updated="Last updated: November 2026"/>
        <div className="dad-container legal-reading-layout">
        <LegalToc items={[{"id":"legal-1","title":"1. Introduction & Core Philosophy"},{"id":"legal-2","title":"2. Information We Collect"},{"id":"legal-3","title":"3. How We Use Your Information"},{"id":"legal-4","title":"4. AI Processing Guardrails & Medical Disclaimer"},{"id":"legal-5","title":"5. Data Retention, Portability & Account Deletion"},{"id":"legal-6","title":"6. Contact Our Privacy Officer"}]}/><section className="legal-content">
          <div className="legal-copy space-y-8">
            <div className="space-y-3">
              <h2 id="legal-1" className="text-xl sm:text-2xl font-bold text-slate-900">1. Introduction &amp; Core Philosophy</h2>
              <p>
                Doctors At Door (&quot;DAD&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) provides a digital healthcare ecosystem platform, including our active application <strong>DAD Report</strong>. We believe that your health records are among the most sensitive personal data in existence. Our privacy philosophy is simple: <strong>your medical records belong exclusively to you.</strong>
              </p>
              <p>
                We do not monetize your medical history by selling data to third-party advertisers, pharmaceutical marketers, or data brokers.
              </p>
            </div>

            <div className="space-y-3">
              <h2 id="legal-2" className="text-xl sm:text-2xl font-bold text-slate-900">2. Information We Collect</h2>
              <p>When you use DAD Report and the DAD platform, we collect:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Account Identifiers:</strong> Name, email address, mobile phone number, and encrypted authentication tokens.
                </li>
                <li>
                  <strong>Health Documents &amp; Reports:</strong> Files you voluntarily upload, including pathology reports, blood panels, diagnostic scans, prescriptions, discharge summaries, and health insurance policy schedules.
                </li>
                <li>
                  <strong>Extracted Biomarker Data:</strong> Structured parameters extracted via optical character recognition (OCR) and clinical models (e.g., test dates, laboratory names, biomarker test results, normal reference ranges).
                </li>
                <li>
                  <strong>Voice Memos:</strong> Short audio recordings you create when using our Doctor Follow-Up Voice Ping feature.
                </li>
                <li>
                  <strong>Family Profiles:</strong> Profile names and relationships for family members you choose to manage within your personal account vault.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 id="legal-3" className="text-xl sm:text-2xl font-bold text-slate-900">3. How We Use Your Information</h2>
              <p>Your information is used strictly to provide and improve service functionality:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To chronologically organize and structure your medical history into an indexed health timeline.</li>
                <li>To generate plain-language AI summaries, terminology explanations, and avatar video narrations.</li>
                <li>To decode coverage limits and inclusions within your uploaded health insurance documents.</li>
                <li>To facilitate time-limited, user-authorized record sharing with doctors or second-opinion specialists.</li>
                <li>To display upcoming diagnostic appointment notifications created by DAD-connected diagnostic centers.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 id="legal-4" className="text-xl sm:text-2xl font-bold text-slate-900">4. AI Processing Guardrails &amp; Medical Disclaimer</h2>
              <p>
                DAD uses specialized AI inference pipelines to parse and summarize medical documents. These models operate in an isolated cloud environment. <strong>Your uploaded medical documents are not used to train public foundation models.</strong>
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
                <strong>Important Medical Clarification:</strong> DAD Report&apos;s summaries and video avatars are educational comprehension aids. They do not constitute formal medical diagnoses, clinical advice, or treatment regimens. Always consult your qualified physician for medical decisions.
              </div>
            </div>

            <div className="space-y-3">
              <h2 id="legal-5" className="text-xl sm:text-2xl font-bold text-slate-900">5. Data Retention, Portability &amp; Account Deletion</h2>
              <p>
                We retain your records only as long as you maintain an active account. You may export your entire digital health archive at any time. If you wish to delete your account, you can submit an irreversible deletion request via our <Link href="/account-deletion" className="text-indigo-600 font-semibold underline">Account Deletion Portal</Link>. Upon processing, all associated files, extracted records, and backups are permanently purged.
              </p>
            </div>

            <div className="space-y-3">
              <h2 id="legal-6" className="text-xl sm:text-2xl font-bold text-slate-900">6. Contact Our Privacy Officer</h2>
              <p>
                If you have questions about our data security practices, privacy policies, or wish to exercise your data rights, please contact our Data Governance Officer at:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                <strong>Privacy &amp; Data Protection Officer</strong><br />
                Doctors At Door (DAD)<br />
                Email: <a href="mailto:privacy@doctorsatdoor.com" className="text-indigo-600 underline">privacy@doctorsatdoor.com</a><br />
                Primary domain: doctorsatdoor.com
              </div>
            </div>
          </div>
        </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

