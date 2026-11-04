"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { FAQItem } from "@/types";
import "./FaqSection.css";

function FaqToggle({ faq, visible, onToggle }: { faq: FAQItem; visible: boolean; onToggle: () => void }) {
  const id = useId();
  return <div className="faq-item faq-toggle-item">
    <h3 className="faq-toggle-heading"><button type="button" className="faq-toggle-row" aria-expanded={visible} aria-controls={`${id}-answer`} onClick={onToggle}>{faq.question}<span className="faq-toggle-icon" aria-hidden="true"><Plus size={16} strokeWidth={2} /></span></button></h3>
    <p id={`${id}-answer`} hidden={!visible}>{faq.answer}</p>
  </div>;
}

export function FaqSection({ faqs }: { faqs: FAQItem[] }) {
  const [openId, setOpenId] = useState<FAQItem["id"] | null>(null);
  return <section id="faq" className="dad-section"><div className="dad-container faq-grid">
    <div><span className="eyebrow">A LITTLE MORE CLARITY</span><h2>Good questions.<br /><em>Clear answers.</em></h2><Link href="/contact" className="text-link">Talk to the DAD team <span className="direction-arrow direction-arrow-up-right" aria-hidden="true">↗</span></Link></div>
    <div>{faqs.map(faq => <FaqToggle key={faq.id} faq={faq} visible={openId === faq.id} onToggle={() => setOpenId(current => current === faq.id ? null : faq.id)} />)}</div>
  </div></section>;
}
