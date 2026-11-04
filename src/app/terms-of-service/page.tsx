import { LegalToc } from "@/components/LegalToc";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { LegalHeader } from "@/components/LegalHeader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Terms of Service",
  "Doctors At Door Terms of Service governing the use of the DAD ecosystem and DAD Report application.",
  "/terms-of-service"
);

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="legal-page">
        <LegalHeader label="CLEAR TERMS. SHARED UNDERSTANDING." title="Terms of service." emphasis="A shared understanding." description="The terms governing your use of Doctors At Door and DAD Report." updated="Last updated: November 2026"/>
        <div className="dad-container legal-reading-layout">
        <LegalToc items={[{"id":"legal-1","title":"1. Acceptance of Terms"},{"id":"legal-2","title":"2. Nature of the DAD Platform (Not a Medical Provider)"},{"id":"legal-3","title":"3. DAD Report Medical & Insurance Disclaimers"},{"id":"legal-4","title":"4. User Account & Vault Responsibilities"},{"id":"legal-5","title":"5. Intellectual Property"},{"id":"legal-6","title":"6. Termination & Deletion"}]}/><section className="legal-content">
          <div className="legal-copy space-y-8">
            <div className="space-y-3">
              <h2 id="legal-1" className="text-xl sm:text-2xl font-bold text-slate-900">1. Acceptance of Terms</h2>
              <p>
                By accessing or using the Doctors At Door website (doctorsatdoor.com) or our active application, DAD Report (report.doctorsatdoor.com), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the platform.
              </p>
            </div>

            <div className="space-y-3">
              <h2 id="legal-2" className="text-xl sm:text-2xl font-bold text-slate-900">2. Nature of the DAD Platform (Not a Medical Provider)</h2>
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs sm:text-sm space-y-2">
                <strong>Critical Operational Notice:</strong>
                <p>
                  Doctors At Door is a digital healthcare technology platform and coordination ecosystem. DAD is NOT a hospital, medical clinic, licensed pharmacy, or diagnostic laboratory. DAD does not employ physicians to provide direct medical consultations through this website, nor do we issue prescriptions or definitive clinical diagnoses.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 id="legal-3" className="text-xl sm:text-2xl font-bold text-slate-900">3. DAD Report Medical &amp; Insurance Disclaimers</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>AI Summaries &amp; Video Avatars:</strong> The plain-language summaries, high/low flags, and avatar video explanations generated within DAD Report are provided solely for personal record indexing and patient educational literacy. They do not constitute certified medical diagnoses or clinical care plans.
                </li>
                <li>
                  <strong>Insurance Document Interpretation:</strong> AI-generated insurance summaries are intended to assist you in understanding terms like room rent limits, copay clauses, and waiting periods. They do not alter, expand, or replace the legally binding policy terms issued by your insurance underwriter.
                </li>
                <li>
                  <strong>Doctor Voice Ping:</strong> Voice recordings sent to consulting doctors are supplementary communications and must never be used in life-threatening medical emergencies. In an emergency, always call local emergency response services immediately.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 id="legal-4" className="text-xl sm:text-2xl font-bold text-slate-900">4. User Account &amp; Vault Responsibilities</h2>
              <p>
                You are responsible for maintaining the confidentiality of your login credentials and for all activities occurring under your account. You agree not to upload fraudulent medical documents, malicious files, or third-party records without explicit legal consent.
              </p>
            </div>

            <div className="space-y-3">
              <h2 id="legal-5" className="text-xl sm:text-2xl font-bold text-slate-900">5. Intellectual Property</h2>
              <p>
                All brand marks, logos, user interface designs, AI software pipelines, and content on Doctors At Door are the proprietary intellectual property of Doctors At Door. However, <strong>your medical files, lab reports, and personal notes remain your personal property.</strong>
              </p>
            </div>

            <div className="space-y-3">
              <h2 id="legal-6" className="text-xl sm:text-2xl font-bold text-slate-900">6. Termination &amp; Deletion</h2>
              <p>
                You may cease using the service and request permanent deletion of your account and records at any time by visiting our <Link href="/account-deletion" className="text-indigo-600 font-semibold underline">Account Deletion Page</Link>.
              </p>
            </div>
          </div>
        </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

