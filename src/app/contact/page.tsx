import { Suspense } from "react";
import { Metadata } from "next";
import { ArrowDown, ArrowUpRight, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CarePhoto } from "@/components/Visuals";
import { ContactFormClient } from "./ContactFormClient";
import "./contact.css";
import { pageMetadata } from "@/lib/seo";
import { SocialLinks } from "@/components/layout/SocialLinks";
export const metadata:Metadata=pageMetadata("Contact & Partnerships","Talk to Doctors At Door about partnerships, funding, or your DAD Report experience.","/contact");
export default function ContactPage() {
 return <><Navbar/><main id="main-content" className="contact-page"><div className="dad-container">
 <header className="contact-heading"><div><span className="eyebrow">LET&apos;S START A CONVERSATION</span><h1>Good care starts<br/><em>with a connection.</em></h1></div><div className="contact-intro"><p>A question, an idea, or a shared ambition. We would love to hear from you.</p><a href="#contact-message">Start a conversation <ArrowDown size={16}/></a></div></header>
 <div className="contact-content"><aside className="contact-story"><div className="contact-photo"><CarePhoto src="collaboration" alt="A doctor discussing health records with a family"/><span>Better care begins with people.</span></div><div className="contact-story-copy"><span className="eyebrow">BUILD WITH DAD</span><h2>Meaningful ideas.<br/><em>Shared possibilities.</em></h2><p>Connect with our team about clinic partnerships, diagnostic services, funding, or product support.</p><a className="contact-email" href="mailto:support@doctorsatdoor.com"><span className="contact-email-icon" aria-hidden="true"><Mail size={20}/></span><span><small>WRITE TO US</small>support@doctorsatdoor.com</span><ArrowUpRight size={18}/></a><SocialLinks /></div></aside>
 <div id="contact-message" className="contact-form-column"><Suspense fallback={<p>Loading inquiry form...</p>}><ContactFormClient/></Suspense></div></div>
 </div></main><Footer/></>;
}
