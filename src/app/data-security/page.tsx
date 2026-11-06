import { Metadata } from "next";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, LockKeyhole, ShieldCheck, Sparkles, FileText, UserRound, MessageCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./security.css";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata("Data & Security","How we handle your medical reports, sharing, and AI features.","/data-security");

const principles = [
 { Icon: LockKeyhole, title: "Private records", text: "Your reports are stored in your own account." },
 { Icon: ShieldCheck, title: "Thoughtful sharing", text: "You choose when to share reports with your doctor or care team." },
 { Icon: Sparkles, title: "Responsible AI use", text: "AI helps explain your reports. Your doctor makes medical decisions." },
];
const rights = [
 { Icon: FileText, title: "Privacy and access", text: "Learn how we handle your information and respond to privacy requests.", href: "/privacy-policy", link: "Privacy policy" },
 { Icon: UserRound, title: "Account deletion", text: "Request account deletion. Download any reports you need first.", href: "/account-deletion", link: "Account deletion" },
 { Icon: Sparkles, title: "Responsible AI", text: "Use AI summaries to understand your reports. Talk to your doctor before making medical decisions.", href: "/terms-of-service", link: "Terms of service" },
 { Icon: MessageCircle, title: "Questions about security?", text: "Ask our team how we protect your account and reports.", href: "/contact?type=patient", link: "Talk to our team" },
];
export default function DataSecurityPage() {
 return <><Navbar/><main id="main-content" className="security-page"><div className="dad-container">
 <header className="security-heading"><div><span className="eyebrow">TRUST IS PART OF THE JOURNEY</span><h1>Personal information.<br/><em>Thoughtful protection.</em></h1></div><div className="security-intro"><p>Medical reports need careful handling. We focus on clear access, your control over sharing, and responsible use of AI.</p><a href="#data-rights">Understand your data rights <ArrowDown size={16}/></a></div></header>
 <section className="security-principles" aria-labelledby="security-principles-title"><div className="security-section-title"><span className="eyebrow">PERSONAL BY NATURE</span><h2 id="security-principles-title">Your health story. <em>Your control.</em></h2></div><div className="security-principle-grid">{principles.map(({Icon,title,text},i)=><article key={title}><div className="security-principle-top"><span className="security-icon"><Icon size={21}/></span><span className="security-number">0{i+1}</span></div><h3>{title}</h3><p>{text}</p></article>)}</div></section>
 <section id="data-rights" className="security-rights" aria-labelledby="security-rights-title"><div className="security-rights-intro"><span className="eyebrow">CLEAR INFORMATION</span><h2 id="security-rights-title">Informed choices.<br/><em>Every step.</em></h2><p>Learn how we handle your information and where to go for each request.</p></div><div className="security-rights-list">{rights.map(({Icon,title,text,href,link})=><article key={title}><span className="security-icon"><Icon size={20}/></span><div><h3>{title}</h3><p>{text}</p><Link href={href} className="text-link">{link}<ArrowUpRight size={17}/></Link></div></article>)}</div></section>
 </div></main><Footer/></>;
}
