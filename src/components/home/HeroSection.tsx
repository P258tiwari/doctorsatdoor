import Link from "next/link";
import { ArrowUpRight, ArrowDown, Sparkles } from "lucide-react";
import "./HeroSection.css";

export function HeroSection() {
  return <section className="vision-hero dad-container" aria-labelledby="home-vision-title">
    <div className="vision-hero-top"><span className="eyebrow">DOCTORS AT DOOR / AN ECO-SYSTEM FOR HEALTHCARE</span><Link href="/dad-report" className="vision-live"><span/>DAD Report is live<ArrowUpRight size={14}/></Link></div>
    <div className="vision-hero-content"><span className="vision-hero-kicker">ONE VISION. A MORE CONNECTED JOURNEY.</span><h1 id="home-vision-title">Healthcare, connected.<br/><em>With you at the centre.</em></h1><p>We’re building an ecosystem where patients, families, doctors and care teams can stay connected—with the right information, clearer handovers and a better understanding of what comes next.</p><div className="vision-hero-actions"><Link href="/dad-report" className="dad-button">Explore DAD Report<ArrowUpRight size={16}/></Link><Link href="#ecosystem" className="text-link">Discover our vision<ArrowDown size={17}/></Link></div><div className="vision-first-step"><Sparkles size={16} aria-hidden="true"/><span>Starting today with AI-powered health records in DAD Report.</span></div></div>
    <div className="vision-principles" aria-label="The DAD vision"><div><span>01 / PEOPLE</span><h2>Care around you.</h2><p>Patients and families come first.</p></div><div><span>02 / INFORMATION</span><h2>Your story, together.</h2><p>Records, organised and easy to understand.</p></div><div><span>03 / CONTINUITY</span><h2>Every next step connected.</h2><p>Connected care, built step by step.</p></div></div>
  </section>;
}
