import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import { Navbar } from "./layout/Navbar";
import { Footer } from "./layout/Footer";
import { CarePhoto } from "./Visuals";
import { ProductPhone } from "./ProductPhone";
import "./ProductLanding.css";

type Props = { name: string; headline: string; description: string; photo: string; features: string[][]; type: string; live?: boolean };
const audiences: Record<string, string> = { Report: "For you and your family", Admin: "For clinics and care teams", Lab: "For laboratories and clinicians", Diagnostic: "For diagnostic centres and care teams" };

export function ProductLanding({ name, headline, description, photo, features, type, live = false }: Props) {
  const contact = `/contact?type=${type}`;
  const conceptImage = ["Report", "Admin", "Lab", "Diagnostic"].includes(name) ? `dad-${name.toLowerCase()}-digital` : photo;
  return <><Navbar/><main id="main-content" className="product-landing">
    <div className="dad-container">
      <header className="product-heading">
        <div><div className="product-heading-label"><span className="eyebrow">THE DAD ECOSYSTEM / {name.toUpperCase()}</span><span className={`product-availability ${live ? "available" : ""}`}><span/>{live ? "Live now" : "Coming soon"}</span>{name === "Report" && <span className="product-ai-badge"><Sparkles size={14} aria-hidden="true"/>AI-powered</span>}</div><h1>{headline}<br/><em>{live ? "A lot more care." : "Connected by DAD."}</em></h1></div>
        <div className="product-heading-intro"><p>{description}</p><a className="text-link" href="#product-details">{live ? "Explore the app" : "Discover the vision"}<ArrowDown size={17}/></a></div>
      </header>
      <section className="product-overview" aria-label={`Introducing DAD ${name}`}>
        <div className="product-lifestyle"><CarePhoto src={conceptImage} alt={`DAD ${name} digital platform concept on mobile and laptop, illustrating ${name === "Report" ? "AI-organised health records, family profiles and a report timeline" : name === "Admin" ? "planned clinic coordination" : name === "Lab" ? "planned laboratory and report workflows" : "planned diagnostic appointments and imaging records"}`} priority/><span className="product-photo-label">{audiences[name]}</span></div>
        <div className="product-overview-copy"><Image src={live ? "/images/dad-reports-logo.webp" : "/images/dad-logo.webp"} alt={live ? "DAD Report" : "Doctors At Door"} width={60} height={60}/><span className="eyebrow">DAD {name.toUpperCase()}</span><h2>{live ? <>Your health story.<br/><em>All together.</em></> : <>Part of something<br/><em>more connected.</em></>}</h2><p>{live ? "Keep your medical reports in one app, understand them with AI summaries, and manage your family’s reports too." : description}</p><Link href={live ? "https://report.doctorsatdoor.com/" : contact} className="dad-button">{live ? "Explore DAD Report" : "Explore a partnership"}<ArrowUpRight size={16}/></Link><small>{live ? "AI explanations help you understand reports. They do not replace medical advice." : "In development. Planned features may change before launch."}</small></div>
      </section>
      <section id="product-details" className="product-capabilities" aria-labelledby="product-features-title"><div className="product-section-heading"><div><span className="eyebrow">{live ? "EVERY PART OF YOUR HEALTH STORY" : "THE ROAD AHEAD"}</span><h2 id="product-features-title">{live ? "One app." : "Designed around"}<br/><em>{live ? "For all your reports." : "better continuity."}</em></h2></div><p>{live ? "Practical tools to organise, understand, and share your family’s medical reports." : "Each product has one role in the wider DAD platform. These are the features we are working on."}</p></div><div className="product-feature-list">{features.map(([title, text], index) => <article key={title}><span className="product-feature-number">{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></section>
      {live && <section className="product-app-preview" aria-labelledby="product-preview-title"><ProductPhone/><div><span className="eyebrow">A LOOK INSIDE DAD REPORT</span><h2 id="product-preview-title">Less paperwork.<br/><em>More peace of mind.</em></h2><ol>{[["Upload", "Upload report PDFs or images."], ["Organise", "Let AI add reports to your timeline, or create your own folders."], ["Understand and share", "Read AI summaries, combine reports into one PDF, and share them with your doctor."]].map(([title, text], i) => <li key={title}><span>0{i + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol><Link className="text-link" href="/data-security">Read about data and security<ArrowUpRight size={17}/></Link></div></section>}
      <section className="product-next-step"><div><span className="eyebrow">{live ? "YOUR NEXT CHAPTER IN CARE" : "LET’S SHAPE WHAT COMES NEXT"}</span><h2>{live ? "A clearer picture starts here." : "Build the next connection."}</h2><p>{live ? "Keep your family’s medical reports together in DAD Report." : `Talk to us about the future of DAD ${name} and how your team could be part of it.`}</p></div><div className="product-next-actions"><Link className="dad-button" href={live ? "https://report.doctorsatdoor.com/" : contact}>{live ? "Explore DAD Report" : "Start a conversation"}<ArrowUpRight size={16}/></Link><Link className="text-link" href={live ? "/contact" : "/dad-report"}>{live ? "Talk to our team" : "Discover DAD Report"}<ArrowUpRight size={16}/></Link></div></section>
    </div>
  </main><Footer/></>;
}
