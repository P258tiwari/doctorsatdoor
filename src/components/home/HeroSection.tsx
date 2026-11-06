import Link from "next/link";
import { ArrowUpRight, ArrowDown, Sparkles } from "lucide-react";
import "./HeroSection.css";

export function HeroSection() {
  return <section className="vision-hero dad-container" aria-labelledby="home-vision-title">
    <div className="vision-hero-top"><span className="eyebrow">DOCTORS AT DOOR / AN ECOSYSTEM FOR HEALTHCARE</span><Link href="/dad-report" className="vision-live"><span/>DAD Report is live<ArrowUpRight size={14}/></Link></div>
    <div className="vision-hero-content"><span className="vision-hero-kicker">ONE VISION. A MORE CONNECTED JOURNEY.</span><h1 id="home-vision-title">Healthcare, connected.<br/><em>With you at the centre.</em></h1><p>We’re building a platform that connects patients, families, doctors, and care teams, so everyone has the information they need for the next step.</p><div className="vision-hero-actions"><Link href="/dad-report" className="dad-button">Explore DAD Report<ArrowUpRight size={16}/></Link><Link href="#ecosystem" className="text-link">Discover our vision<ArrowDown size={17}/></Link></div><div className="vision-first-step"><Sparkles size={16} aria-hidden="true"/><span>It starts with DAD Report, an app that helps you organise, understand, and share your medical reports.</span></div></div>
    <div className="vision-principles" aria-label="The DAD vision"><div><span>01 / PEOPLE</span><h2>Care around you.</h2><p>Patients and families come first.</p></div><div><span>02 / INFORMATION</span><h2>Your reports, together.</h2><p>Medical reports, organised and easier to understand.</p></div><div><span>03 / CONTINUITY</span><h2>Every next step, connected.</h2><p>Clinic and lab connections, added in phases.</p></div></div>
  </section>;
}
