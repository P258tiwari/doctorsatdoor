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
export const metadata:Metadata=pageMetadata("Contact and partnerships","Contact Doctors At Door about partnerships, funding, or help with DAD Report.","/contact");
export default function ContactPage() {
 return <><Navbar/><main id="main-content" className="contact-page"><div className="dad-container">
 <header className="contact-heading"><div><span className="eyebrow">LET&apos;S START A CONVERSATION</span><h1>Good care starts<br/><em>with a connection.</em></h1></div><div className="contact-intro"><p>Have a question, an idea, or a partnership in mind? We would love to hear from you.</p><a href="#contact-message">Start a conversation <ArrowDown size={16}/></a></div></header>
 <div className="contact-content"><aside className="contact-story"><div className="contact-photo"><CarePhoto src="collaboration" alt="A doctor discussing health records with a family"/><span>Better care begins with people.</span></div><div className="contact-story-copy"><span className="eyebrow">BUILD WITH DAD</span><h2>Your questions.<br/><em>Our team.</em></h2><p>Contact our team about clinic partnerships, diagnostic services, funding, or help with DAD Report.</p><a className="contact-email" href="mailto:support@doctorsatdoor.com"><span className="contact-email-icon" aria-hidden="true"><Mail size={20}/></span><span><small>WRITE TO US</small>support@doctorsatdoor.com</span><ArrowUpRight size={18}/></a><SocialLinks /></div></aside>
 <div id="contact-message" className="contact-form-column"><Suspense fallback={<p>Loading the form…</p>}><ContactFormClient/></Suspense></div></div>
 </div></main><Footer/></>;
}
