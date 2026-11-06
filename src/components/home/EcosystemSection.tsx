"use client";
import { useState } from "react";
import Image from "next/image";
import "./EcosystemSection.css";

const connections = [
  { name: "Patients and families", status: "Live", text: "Use DAD Report to organise, understand, and share your family’s medical reports.", color: "#359c80" },
  { name: "Doctors", status: "Through DAD Report", text: "Doctors receive follow-up requests and shared reports, and can send test requests to patients.", color: "#ad83b7" },
  { name: "Admin and care teams", status: "Coming soon", text: "Planned tools that help clinic staff prepare patient details for doctors and stay in touch with patients.", color: "#65508f" },
  { name: "Diagnostics and labs", status: "Planned", text: "Doctors request tests, patients choose a time, and the lab uploads the reports to the app.", color: "#c39245" },
  { name: "Clinics and hospitals", status: "Planned", text: "A referral system that connects clinics and hospitals, so patients can move between them more easily.", color: "#bd778b" },
];
const future = [
  ["Pharmacy", "Medicines connected to your care."],
  ["DAD Paramedic", "Assisted care closer to home."],
  ["AI health assistant", "AI health support with human oversight."],
  ["Healthcare marketplace", "One place to find healthcare services and products."],
  ["Fitness and wellness", "Everyday wellbeing as part of your health."],
  ["Holistic healthcare", "Care for every part of your health."],
  ["Healthcare community", "A community where people learn and share experiences of care."],
];

export function EcosystemSection() {
  const [active, setActive] = useState(0);
  const selected = active < connections.length ? connections[active] : { name: future[active - connections.length][0], text: future[active - connections.length][1], status: "Future vision" };
  return <section id="ecosystem" className="home-ecosystem dad-section" aria-labelledby="ecosystem-title"><div className="dad-container">
    <header className="eco-introduction"><span className="eyebrow">MANY CONNECTIONS. ONE PURPOSE.</span><h2 id="ecosystem-title">One <em>ecosystem.</em></h2><div className="eco-values"><span>Comfort</span><span>Priority</span><span>Convenience</span></div><p>We’re bringing patients, doctors, and care teams closer together. We’re starting with DAD Report and adding more connections step by step.</p></header>
    <div className="eco-platform"><Image src="/images/dad-logo.webp" alt="Doctors At Door" width={48} height={48}/><div><strong>Doctors At Door platform</strong><span>One health story. Connected care.</span></div></div>
    <div className="eco-connections" role="group" aria-label="Explore ecosystem connections">{connections.map((item, index) => <button type="button" key={item.name} aria-pressed={active === index} aria-controls="eco-description" onClick={() => setActive(index)}><span className="eco-node-title"><span style={{ background: item.color }}/>{item.name}</span><small>{item.status}</small></button>)}</div>
    <div className="eco-future"><span className="eco-future-label">THE WIDER VISION</span><div className="eco-future-links" role="group" aria-label="Explore future ecosystem ideas">{future.map(([name], index) => <button type="button" key={name} aria-pressed={active === connections.length + index} aria-controls="eco-description" onClick={() => setActive(connections.length + index)}>{name}<span>Vision</span></button>)}</div></div>
    <div id="eco-description" className="eco-description" aria-live="polite" aria-atomic="true"><div><strong>{selected.name}</strong><span>{selected.status}</span></div><p>{selected.text}</p></div>
    <p className="eco-availability-note">DAD Report is live. Other products and connections are planned and will be released in phases.</p>
  </div></section>;
}
