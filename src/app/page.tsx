import "./home.css";
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { EcosystemSection } from "@/components/home/EcosystemSection";
import { ProblemSection } from "@/components/home/ProblemSection";
import { DadReportSpotlight } from "@/components/home/DadReportSpotlight";
import { EcosystemModulesSection } from "@/components/home/EcosystemModulesSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { RoadmapSection } from "@/components/home/RoadmapSection";
import { PartnershipSection } from "@/components/home/PartnershipSection";
import { BlogPreviewSection } from "@/components/home/BlogPreviewSection";
import { FaqSection } from "@/components/home/FaqSection";
import { FinalCtaSection } from "@/components/home/FinalCtaSection";
import { socials } from "@/components/layout/SocialLinks";
import { getPublicFAQs } from "@/lib/server/public-content";
import { pageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = pageMetadata(
  "Doctors At Door (DAD) | Connected digital healthcare",
  "DAD is building a platform that connects patients, doctors, clinics, and labs. Our first app, DAD Report, helps you organise, understand, and share medical reports.",
  "/"
);

export default async function HomePage() {
  const faqs = await getPublicFAQs();

  // JSON-LD structured schema for search engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Doctors At Door",
        url: SITE_URL,
        logo: `${SITE_URL}/images/dad-logo.webp`,
        sameAs: socials.map((social) => social.href),
        contactPoint: {
          "@type": "ContactPoint",
          email: "support@doctorsatdoor.com",
          contactType: "customer support",
        },
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: "Doctors At Door",
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqs.slice(0, 8).map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Navbar />
      <main id="main-content" className="home-page">
        <HeroSection />
        <DadReportSpotlight />
        <ProblemSection />
        <EcosystemSection />
        <EcosystemModulesSection />
        <HowItWorksSection />
        <RoadmapSection />
        <PartnershipSection />
        <BlogPreviewSection />
        <FaqSection faqs={faqs} />
        <FinalCtaSection />
      </main>
      <Footer />
    </>
  );
}
