import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";

export function FinalCtaSection() {
  return (
    <section className="final-cta dad-container" aria-labelledby="next-chapter-title">
      <div className="final-cta-heading">
        <span className="eyebrow">YOUR NEXT CHAPTER IN CARE</span>
        <h2 id="next-chapter-title">Better connected care.<br /><em>Starting with your reports.</em></h2>
        <Link href="/contact" className="text-link">Talk to the DAD team <ArrowUpRight size={18} /></Link>
      </div>
      <div className="final-cta-action">
        <div className="final-cta-product">
          <Image src="/images/dad-reports-logo.webp" alt="DAD Report" width={52} height={52} />
          <div><strong>DAD Report</strong><div className="final-cta-badges"><span className="report-live-badge"><span aria-hidden="true" />Live now</span><span className="report-ai-badge"><Sparkles size={14} aria-hidden="true" />AI-powered</span></div></div>
        </div>
        <p>Keep your family’s medical reports in one app, and understand them with AI summaries.</p>
        <Link href="https://report.doctorsatdoor.com/" className="dad-button">Explore DAD Report <ArrowUpRight size={18} /></Link>
      </div>
    </section>
  );
}
