import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { DadLogo } from "./DadLogo";
import "./Footer.css";
import { SocialLinks } from "./SocialLinks";

const groups = [
  { title: "The ecosystem", links: [["DAD Report", "/dad-report"], ["DAD Admin", "/dad-admin"], ["DAD Lab", "/dad-lab"], ["DAD Diagnostic", "/dad-diagnostic"]] },
  { title: "Discover DAD", links: [["Our vision", "/#ecosystem"], ["Roadmap", "/#roadmap"], ["Journal", "/blog"], ["Changelog", "/changelog"], ["Partnerships", "/contact?type=partnership"], ["Funding", "/contact?type=investor"]] },
  { title: "Here for you", links: [["Contact us", "/contact"], ["Data & security", "/data-security"], ["Privacy policy", "/privacy-policy"], ["Terms of service", "/terms-of-service"], ["Account deletion", "/account-deletion"]] },
];

export function Footer() {
  return <footer className="site-footer">
    <div className="dad-container">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <DadLogo />
          <p>Building a platform that connects patients, doctors, and care services.</p>
          <a className="site-footer-email" href="mailto:support@doctorsatdoor.com"><span>support@doctorsatdoor.com</span><ArrowUpRight size={18} aria-hidden="true" /></a>
          <SocialLinks />
        </div>
        {groups.map(group => <nav className="site-footer-links" aria-label={group.title} key={group.title}>
          <h2>{group.title}</h2>
          <ul>{group.links.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul>
          {group.title === "The ecosystem" && <p className="site-footer-coming">Admin, Lab, and Diagnostic<br/>are coming soon.</p>}
        </nav>)}
      </div>
      <div className="site-footer-note"><p>Doctors At Door is a healthcare technology platform, not a hospital or medical practice. AI explanations help you understand your reports. They do not replace advice from a qualified healthcare professional. AI insurance explanations do not replace your policy terms.</p></div>
      <div className="site-footer-bottom"><span>© 2026 Doctors At Door. All rights reserved.</span><div className="site-footer-india"><Image src="/images/make-in-india.png" alt="Make in India" width={64} height={29}/><span>Made in India</span></div></div>
    </div>
  </footer>;
}
