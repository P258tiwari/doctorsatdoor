import { LegalToc } from "@/components/LegalToc";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { LegalHeader } from "@/components/LegalHeader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Privacy policy",
  "How Doctors At Door collects, stores, and protects your medical reports and personal information.",
  "/privacy-policy"
);

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="legal-page">
        <LegalHeader label="YOUR INFORMATION. YOUR CHOICES." title="Privacy policy." emphasis="Your information matters." description="How Doctors At Door collects, uses, and handles your information." updated="Last updated: November 2026"/>
        <div className="dad-container legal-reading-layout">
        <LegalToc items={[{"id":"legal-1","title":"1. Introduction and our approach"},{"id":"legal-2","title":"2. Information we collect"},{"id":"legal-3","title":"3. How we use your information"},{"id":"legal-4","title":"4. AI processing and medical disclaimer"},{"id":"legal-5","title":"5. Keeping, exporting, and deleting your data"},{"id":"legal-6","title":"6. Contact our privacy officer"}]}/><section className="legal-content">
          <div className="legal-copy space-y-8">
            <div className="space-y-3">
              <h2 id="legal-1" className="text-xl sm:text-2xl font-bold text-slate-900">1. Introduction and our approach</h2>
              <p>
                Doctors At Door (&quot;DAD&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) runs a digital healthcare platform, including our live app, <strong>DAD Report</strong>. Your medical records are some of the most sensitive information you have. Our approach is simple: <strong>your medical records belong to you.</strong>
              </p>
              <p>
                We do not sell your medical history to advertisers, pharmaceutical marketers, or data brokers.
              </p>
            </div>

            <div className="space-y-3">
              <h2 id="legal-2" className="text-xl sm:text-2xl font-bold text-slate-900">2. Information we collect</h2>
              <p>When you use DAD Report and the DAD platform, we collect:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>
                  <strong>Account details:</strong> your name, email address, mobile number, and encrypted login tokens.
                </li>
                <li>
                  <strong>Medical reports and documents:</strong> files you choose to upload, such as lab reports, blood tests, scans, prescriptions, discharge summaries, and health insurance policies.
                </li>
                <li>
                  <strong>Information read from your reports:</strong> details we extract using text recognition (OCR) and AI models, such as test dates, lab names, test results, and normal ranges.
                </li>
                <li>
                  <strong>Voice messages:</strong> short audio recordings you make when you send a doctor follow-up request (PING).
                </li>
                <li>
                  <strong>Family profiles:</strong> the names and relationships of family members you add to your account.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 id="legal-3" className="text-xl sm:text-2xl font-bold text-slate-900">3. How we use your information</h2>
              <p>We use your information only to provide and improve our services:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                <li>To arrange your medical reports by date in a timeline.</li>
                <li>To create AI summaries in simple language, explain medical terms, and make AI video explanations.</li>
                <li>To explain the cover and limits in the insurance policies you upload.</li>
                <li>To let you share reports with doctors or specialists, including for a second opinion. Sharing happens only when you choose and for a limited time.</li>
                <li>To show notifications about upcoming diagnostic appointments created by diagnostic centres connected to DAD.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 id="legal-4" className="text-xl sm:text-2xl font-bold text-slate-900">4. AI processing and medical disclaimer</h2>
              <p>
                DAD uses AI to read and summarise medical documents. These AI models run in an isolated cloud environment. <strong>We do not use your uploaded medical documents to train public AI models.</strong>
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm">
                <strong>Important:</strong> DAD Report&apos;s AI summaries and AI video explanations help you understand your reports. They are not medical diagnoses, clinical advice, or treatment plans. Always ask a qualified doctor before making medical decisions.
              </div>
            </div>

            <div className="space-y-3">
              <h2 id="legal-5" className="text-xl sm:text-2xl font-bold text-slate-900">5. Keeping, exporting, and deleting your data</h2>
              <p>
                We keep your records only while your account is active. You can export all your records at any time. To delete your account, send a request from our <Link href="/account-deletion" className="text-indigo-600 font-semibold underline">account deletion page</Link>. Deletion cannot be undone. Once we process your request, we permanently delete all your files, extracted data, and backups.
              </p>
            </div>

            <div className="space-y-3">
              <h2 id="legal-6" className="text-xl sm:text-2xl font-bold text-slate-900">6. Contact our privacy officer</h2>
              <p>
                If you have questions about data security or this privacy policy, or want to use your data rights, contact our privacy officer:
              </p>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm">
                <strong>Privacy and Data Protection Officer</strong><br />
                Doctors At Door (DAD)<br />
                Email: <a href="mailto:privacy@doctorsatdoor.com" className="text-indigo-600 underline">privacy@doctorsatdoor.com</a><br />
                Website: doctorsatdoor.com
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

