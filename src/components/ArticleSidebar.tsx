"use client";

import { Turnstile } from '@/components/ui/Turnstile';
import { useEffect, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Link2 } from "lucide-react";

export function ArticleSidebar({ sections, title, slug }: { sections: { id: string; title: string; level: number }[]; title: string; slug: string }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [copied, setCopied] = useState(false);
  const [message, setMessage] = useState("");
  const [captchaToken,setCaptchaToken]=useState('');
  const [captchaReset,setCaptchaReset]=useState(0);
  const [busy, setBusy] = useState(false);
  const url = `https://www.doctorsatdoor.com/blog/${slug}`;
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: "-120px 0px -55% 0px" });
    sections.forEach(section => { const el = document.getElementById(section.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [sections]);
  async function copy() {
    try { await navigator.clipboard.writeText(window.location.href.split("#")[0]); setCopied(true); }
    catch { setMessage("Unable to copy. Please copy the address from your browser."); }
  }
  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = String(new FormData(form).get("email") || "").trim();
    if(!captchaToken){setMessage('Please complete the verification.');return;}
    setBusy(true); setMessage("");
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, consent: true, captchaToken }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Please try again later.');
      setMessage(result.message); form.reset();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Please try again later."); }
    finally { setBusy(false);setCaptchaToken('');setCaptchaReset(n=>n+1); }
  }
  return <aside className="journal-sidebar" aria-label="Article tools"><div className="journal-sidebar-sticky">
    {sections.length > 0 && <nav aria-label="Table of contents"><span className="journal-kicker">IN THIS ARTICLE</span><h2>Table of contents</h2><ol className="journal-toc">{sections.map(section => <li key={section.id} className={section.level === 3 ? "journal-toc-sub" : ""}><a href={`#${section.id}`} aria-current={active === section.id ? "location" : undefined}>{section.title}</a></li>)}</ol></nav>}
    <section className="journal-newsletter" aria-labelledby="journal-newsletter-heading"><span className="journal-kicker">THE DAD JOURNAL</span><h2 id="journal-newsletter-heading">A little clarity.<br/><em>In your inbox.</em></h2><p>Fresh perspectives on connected care and your family’s health.</p><form onSubmit={subscribe}><label htmlFor="journal-email">Email address</label><input id="journal-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={254}/><Turnstile action="newsletter" onToken={setCaptchaToken} resetKey={captchaReset}/><button className="dad-button" disabled={busy || !captchaToken} type="submit">{busy ? "Submitting…" : "Sign me up"}<ArrowUpRight size={16}/></button><small>I agree to DAD emails. <a href="/privacy-policy">Privacy policy</a>.</small></form></section>
    <p className="journal-form-status" role="status">{message}</p>
    <section className="journal-share" aria-labelledby="journal-share-heading"><h2 id="journal-share-heading">Share this perspective</h2><div className="journal-share-links">
      <button type="button" onClick={copy} aria-label={copied ? "Link copied" : "Copy article link"} title={copied ? "Link copied" : "Copy article link"}>{copied ? <Check size={18} aria-hidden="true"/> : <Link2 size={18} aria-hidden="true"/>}</button>
      <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" title="Share on LinkedIn"><svg width="18" height="18" viewBox="0 0 100 100" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path d="m90 90v-29.3c0-14.4-3.1-25.4-19.9-25.4-8.1 0-13.5 4.4-15.7 8.6h-.2v-7.3h-15.9v53.4h16.6v-26.5c0-7 1.3-13.7 9.9-13.7 8.5 0 8.6 7.9 8.6 14.1v26h16.6z"/><path d="m11.3 36.6h16.6v53.4h-16.6z"/><path d="m19.6 10c-5.3 0-9.6 4.3-9.6 9.6s4.3 9.7 9.6 9.7 9.6-4.4 9.6-9.7-4.3-9.6-9.6-9.6z"/></svg></a>
      <a href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`} aria-label="Share by email"><svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor" stroke="none" aria-hidden="true" focusable="false"><path d="M467,76H45C20.137,76,0,96.262,0,121v270c0,24.885,20.285,45,45,45h422c24.655,0,45-20.03,45-45V121 C512,96.306,491.943,76,467,76z M460.698,106c-9.194,9.145-167.415,166.533-172.878,171.967c-8.5,8.5-19.8,13.18-31.82,13.18 s-23.32-4.681-31.848-13.208C220.478,274.284,64.003,118.634,51.302,106H460.698z M30,384.894V127.125L159.638,256.08L30,384.894z M51.321,406l129.587-128.763l22.059,21.943c14.166,14.166,33,21.967,53.033,21.967c20.033,0,38.867-7.801,53.005-21.939 l22.087-21.971L460.679,406H51.321z M482,384.894L352.362,256.08L482,127.125V384.894z"/></svg></a>
    </div></section>
  </div></aside>;
}
