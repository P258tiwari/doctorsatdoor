import { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, LockKeyhole, ShieldCheck, Sparkles, FileText, UserRound, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./security.css";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata("Data & Security","Our approach to personal health records, thoughtful sharing, and responsible AI assistance.","/data-security");

const principles = [
 { Icon: LockKeyhole, title: "Private records", text: "A personal space for the information that matters to you." },
 { Icon: ShieldCheck, title: "Thoughtful sharing", text: "Choose when to share relevant records with the people involved in your care." },
 { Icon: Sparkles, title: "Responsible assistance", text: "AI helps explain information. Your healthcare professional guides clinical decisions." },
];
const rights = [
 { Icon: FileText, title: "Privacy and access", text: "Learn how we handle your information and respond to privacy requests.", href: "/privacy-policy", link: "Privacy policy" },
 { Icon: UserRound, title: "Account deletion", text: "Request account deletion; save any records you need first.", href: "/account-deletion", link: "Account deletion" },
 { Icon: Sparkles, title: "Responsible AI", text: "Use AI for clarity; verify reports and consult a clinician for medical decisions.", href: "/terms-of-service", link: "Terms of service" },
 { Icon: MessageCircle, title: "Questions about security?", text: "Ask our team about security controls for your product and account.", href: "/contact?type=patient", link: "Talk to our team" },
];
export default function DataSecurityPage() {
 return <><Navbar/><main id="main-content" className="security-page"><div className="dad-container">
 <header className="security-heading"><div><span className="eyebrow">TRUST IS PART OF THE JOURNEY</span><h1>Personal information.<br/><em>Thoughtful protection.</em></h1></div><div className="security-intro"><p>Health records deserve careful handling. Our approach centres on clear access, user control, and responsible use.</p><a href="#data-rights">Understand your data rights <ArrowDown size={16}/></a></div></header>
 <section className="security-principles" aria-labelledby="security-principles-title"><div className="security-section-title"><span className="eyebrow">PERSONAL BY NATURE</span><h2 id="security-principles-title">Your health story. <em>Your control.</em></h2></div><div className="security-principle-grid">{principles.map(({Icon,title,text},i)=><article key={title}><div className="security-principle-top"><span className="security-icon"><Icon size={21}/></span><span className="security-number">0{i+1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
 <section id="data-rights" className="security-rights" aria-labelledby="security-rights-title"><div className="security-rights-intro"><span className="eyebrow">CLEAR INFORMATION</span><h2 id="security-rights-title">Informed choices.<br/><em>Every step.</em></h2><p>Understand how your information is handled and find the right next step for you.</p></div><div className="security-rights-list">{rights.map(({Icon,title,text,href,link})=><article key={title}><span className="security-icon"><Icon size={20}/></span><div><h3>{title}</h3><p>{text}</p><Link href={href} className="text-link">{link}<ArrowUpRight size={17}/></Link></div></article>)}</div></section>
 </div></main><Footer/></>;
}
