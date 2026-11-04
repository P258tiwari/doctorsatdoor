import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import "./LegalPages.css";

export function LegalHeader({ label, title, emphasis, description, updated }: { label: string; title: string; emphasis: string; description: string; updated?: string }) {
  return <header className="legal-page-heading dad-container"><div><span className="eyebrow">{label}</span><h1>{title}<br/><em>{emphasis}</em></h1>{updated && <p className="legal-updated">{updated}</p>}</div><div className="legal-page-intro"><p>{description}</p><Link href="/data-security" className="text-link">Our approach to privacy <ArrowUpRight size={16}/></Link></div></header>;
}
