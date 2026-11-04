"use client";
import { useState } from "react";
import Image from "next/image";
import "./EcosystemSection.css";

const connections = [
  { name: "Patients & families", status: "Live", text: "Start with DAD Report and see your complete care journey, treatment timeline and doctor's plan.", color: "#359c80" },
  { name: "Doctors", status: "Through DAD Report", text: "Doctors get the full health history and create a treatment timeline patients can see.", color: "#ad83b7" },
  { name: "Admin & care teams", status: "Coming soon", text: "A planned workspace where assistants share details for doctors and connect with patients for care.", color: "#65508f" },
  { name: "Diagnostics & labs", status: "Planned", text: "Connecting doctors and labs: tests are prescribed, patients visit, and reports arrive on their phone.", color: "#c39245" },
  { name: "Clinics & hospitals", status: "Planned", text: "A patient referral system connecting multiple clinics and hospitals for better, hassle-free care.", color: "#bd778b" },
];
const future = [
  ["Pharmacy", "Medicines connected to your care."],
  ["DAD Paramedic", "Assisted care closer to home."],
  ["AI health assistant", "AI health support with human oversight."],
  ["Healthcare marketplace", "One place to find healthcare services and products."],
  ["Fitness & wellness", "Everyday wellbeing as part of your health."],
  ["Holistic healthcare", "Care for every part of your health."],
  ["Healthcare community", "A community to learn and share around care."],
];

export function EcosystemSection() {
  const [active, setActive] = useState(0);
  const selected = active < connections.length ? connections[active] : { name: future[active - connections.length][0], text: future[active - connections.length][1], status: "Future vision" };
  return <section id="ecosystem" className="home-ecosystem dad-section" aria-labelledby="ecosystem-title"><div className="dad-container">
    <header className="eco-introduction"><span className="eyebrow">MANY CONNECTIONS. ONE PURPOSE.</span><h2 id="ecosystem-title">One <em>Eco-system.</em></h2><div className="eco-values"><span>Comfort</span><span>Priority</span><span>Convenience</span></div><p>A more connected healthcare journey, built around people. We’re bringing patients, doctors and care teams closer together, starting with DAD Report and growing step by step.</p></header>
    <div className="eco-platform"><Image src="/images/dad-logo.webp" alt="Doctors At Door" width={48} height={48}/><div><strong>Doctors At Door Platform</strong><span>One health story. Connected care.</span></div></div>
    <div className="eco-connections" role="group" aria-label="Explore ecosystem connections">{connections.map((item, index) => <button type="button" key={item.name} aria-pressed={active === index} aria-controls="eco-description" onClick={() => setActive(index)}><span className="eco-node-title"><span style={{ background: item.color }}/>{item.name}</span><small>{item.status}</small></button>)}</div>
    <div className="eco-future"><span className="eco-future-label">THE WIDER VISION</span><div className="eco-future-links" role="group" aria-label="Explore future ecosystem ideas">{future.map(([name], index) => <button type="button" key={name} aria-pressed={active === connections.length + index} aria-controls="eco-description" onClick={() => setActive(connections.length + index)}>{name}<span>Vision</span></button>)}</div></div>
    <div id="eco-description" className="eco-description" aria-live="polite" aria-atomic="true"><div><strong>{selected.name}</strong><span>{selected.status}</span></div><p>{selected.text}</p></div>
    <p className="eco-availability-note">DAD Report is live. Other modules and wider ecosystem connections are planned; availability will expand in phases.</p>
  </div></section>;
}
