import { LegalToc } from "@/components/LegalToc";
import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { LegalHeader } from "@/components/LegalHeader";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Terms of service",
  "The terms for using the Doctors At Door website and the DAD Report app.",
  "/terms-of-service"
);

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="legal-page">
        <LegalHeader label="CLEAR TERMS. SHARED UNDERSTANDING." title="Terms of service." emphasis="A shared understanding." description="The terms for using Doctors At Door and DAD Report." updated="Last updated: November 2026"/>
        <div className="dad-container legal-reading-layout">
        <LegalToc items={[{"id":"legal-1","title":"1. Accepting these terms"},{"id":"legal-2","title":"2. What DAD is (not a medical provider)"},{"id":"legal-3","title":"3. DAD Report medical and insurance disclaimers"},{"id":"legal-4","title":"4. Your account responsibilities"},{"id":"legal-5","title":"5. Intellectual property"},{"id":"legal-6","title":"6. Stopping use and deleting your account"}]}/><section className="legal-content">
          <div className="legal-copy space-y-8">
            <div className="space-y-3">
              <h2 id="legal-1" className="text-xl sm:text-2xl font-bold text-slate-900">1. Accepting these terms</h2>
              <p>
                By using the Doctors At Door website (doctorsatdoor.com) or our live app, DAD Report (report.doctorsatdoor.com), you agree to these terms. If you do not agree, please stop using the platform.
              </p>
            </div>

            <div className="space-y-3">
              <h2 id="legal-2" className="text-xl sm:text-2xl font-bold text-slate-900">2. What DAD is (not a medical provider)</h2>
              <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-950 text-xs sm:text-sm space-y-2">
                <strong>Important:</strong>
                <p>
                  Doctors At Door is a healthcare technology platform. DAD is <strong>not</strong> a hospital, clinic, licensed pharmacy, or diagnostic lab. DAD does not employ doctors to give medical consultations through this website, and we do not issue prescriptions or clinical diagnoses.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h2 id="legal-3" className="text-xl sm:text-2xl font-bold text-slate-900">3. DAD Report medical and insurance disclaimers</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>AI summaries and AI video explanations:</strong> the summaries, high/low flags, and AI video explanations in DAD Report are for your personal records and to help you understand your reports. They are not medical diagnoses or care plans.
                </li>
                <li>
                  <strong>Insurance policy explanations:</strong> AI explanations of your insurance policy help you understand terms such as room rent limits, co-pay, and waiting periods. They do not change or replace the legal terms of the policy issued by your insurer.
                </li>
                <li>
                  <strong>Doctor follow-up requests (PING):</strong> voice messages sent to doctors are not for emergencies. In a medical emergency, call your local emergency services immediately.
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h2 id="legal-4" className="text-xl sm:text-2xl font-bold text-slate-900">4. Your account responsibilities</h2>
              <p>
                You are responsible for keeping your login details private and for all activity in your account. You agree not to upload fake medical documents, harmful files, or another person&apos;s records without their legal permission.
              </p>
            </div>

            <div className="space-y-3">
              <h2 id="legal-5" className="text-xl sm:text-2xl font-bold text-slate-900">5. Intellectual property</h2>
              <p>
                All brand names, logos, interface designs, AI software, and content on Doctors At Door belong to Doctors At Door. However, <strong>your medical files, lab reports, and personal notes remain your property.</strong>
              </p>
            </div>

            <div className="space-y-3">
              <h2 id="legal-6" className="text-xl sm:text-2xl font-bold text-slate-900">6. Stopping use and deleting your account</h2>
              <p>
                You can stop using the service at any time. You can also request permanent deletion of your account and records on our <Link href="/account-deletion" className="text-indigo-600 font-semibold underline">account deletion page</Link>.
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

