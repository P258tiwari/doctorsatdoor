"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { ExploreDad } from "./ExploreDad";
import { DadLogo } from "./DadLogo";
import "./Navbar.css";
const links = [["DAD Report", "/dad-report"], ["Ecosystem", "/#ecosystem"], ["Roadmap", "/#roadmap"], ["Journal", "/blog"], ["Contact", "/contact"]];
export function Navbar() {
const [open, setOpen] = useState(false); const pathname = usePathname();
const [activeSection, setActiveSection] = useState("");
useEffect(() => {
  if (pathname !== "/") return;
  const update = () => {
    const section = ["ecosystem", "roadmap"].find(id => {
      const bounds = document.getElementById(id)?.getBoundingClientRect();
      return bounds && bounds.top <= 180 && bounds.bottom > 180;
    });
    setActiveSection(section || "");
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
}, [pathname]);
const navigateFromMenu = () => {
  setOpen(false);
};
const current = (href: string): "page" | "location" | undefined => {
  if (href.includes("#")) return pathname === "/" && activeSection === href.split("#")[1] ? "location" : undefined;
  return pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined;
};
return <header className="dad-nav"><a className="skip-link" href="#main-content">Skip to content</a><div className="dad-container nav-inner"><DadLogo /><nav aria-label="Main navigation" className="desktop-nav">{links.map(([name, href]) => <Link key={href} href={href} onNavigate={() => navigateFromMenu()} aria-current={current(href)}>{name}</Link>)}</nav><ExploreDad className="nav-cta" /><button className="menu-toggle" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>{open && <nav id="mobile-nav" aria-label="Mobile navigation" className="mobile-nav" onKeyDown={e => { if(e.key === "Escape") setOpen(false); }}>{[...links,["Changelog", "/changelog"]].map(([name, href]) => <Link key={href} href={href} onNavigate={() => navigateFromMenu()} aria-current={current(href)} onClick={() => setOpen(false)}>{name}<ArrowUpRight size={16}/></Link>)}<ExploreDad className="mobile-nav-cta" /></nav>}</div></header>;
}
