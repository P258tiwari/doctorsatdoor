"use client";

import { useEffect, useId, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, X } from "lucide-react";
import "./ExploreDad.css";

export function ExploreDad({ className = "" }: { className?: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const previousOverflow = useRef<string | null>(null);
  const restoreScroll = () => {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  };
  useEffect(() => () => restoreScroll(), []);
  const show = () => {
    dialog.current?.showModal();
    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  };
  const close = () => dialog.current?.close();
  return <>
    <button type="button" className={`dad-button ${className}`} onClick={show} aria-haspopup="dialog">Explore DAD <ArrowUpRight size={16} /></button>
    <dialog ref={dialog} className="dad-updates-dialog" aria-labelledby={titleId} onClose={restoreScroll} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
      <button type="button" className="dad-updates-close" onClick={close} aria-label="Close updates"><X size={20} /></button>
      <Image src="/images/dad-logo.webp" alt="Doctors At Door" width={52} height={52} className="dad-updates-logo" />
      <span className="eyebrow">THE NEXT CHAPTER OF DAD</span>
      <h2 id={titleId}>More connections.<br /><em>More possibilities.</em></h2>
      <p>DAD Report is our first live product. Here’s what we’re building towards next.</p>
      <div className="dad-updates-list">
        {[["DAD Admin", "Tools for clinic coordination and care teams."], ["DAD Lab", "Connecting laboratory workflows and reports."], ["DAD Diagnostic", "Bringing diagnostic services into the care journey."]].map(([name, description]) => <div key={name}><div><h3>{name}</h3><p>{description}</p></div><span>Coming soon</span></div>)}
      </div>
      <p className="dad-updates-note">These connections are planned. Features and availability will be announced as development progresses.</p>
      <div className="dad-updates-actions"><Link href="/changelog" className="dad-button" onClick={close}>Latest updates <ArrowUpRight size={16} /></Link><Link href="/contact" className="text-link" onClick={close}>Talk to our team <ArrowUpRight size={16} /></Link></div>
    </dialog>
  </>;
}
