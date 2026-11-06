import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import "./PartnershipSection.css";

export function PartnershipSection() {
  return (
    <section className="future-connections" aria-labelledby="future-connections-title">
      <div className="dad-container">
        <div className="future-connections-top">
          <span className="eyebrow">THE CONNECTIONS AHEAD</span>
          <span className="future-connections-status"><span aria-hidden="true" />Future ecosystem · In development</span>
        </div>
        <div className="future-connections-grid">
          <div className="future-connections-copy">
            <h2 id="future-connections-title">Different places.<br /><em>One care journey.</em></h2>
            <p>Home, clinic, lab, diagnostic centre. Each holds part of your health story. We want to connect them, so your next care team knows what came before.</p>
            <p className="future-connections-invite">We want to work with care providers, technology partners, and investors who share this goal.</p>
            <div className="future-connections-actions">
              <Link href="/contact?type=partnership" className="dad-button lime">Partner with DAD <ArrowUpRight size={18} /></Link>
              <Link href="/contact?type=investor" className="text-link">Discuss funding <ArrowUpRight size={18} /></Link>
            </div>
          </div>
          <figure className="future-connections-visual">
            <div className="future-network-scene">
              <Image src="/images/dad-digital-ecosystem.webp" alt="DAD on mobile and laptop at the centre of a future digital network connecting families, doctors, clinics, laboratories and diagnostic centres" width={1536} height={1024} sizes="(max-width:850px) 100vw, 58vw" />
            </div>
          </figure>
        </div>
        <div className="future-connections-bottom">
          <span>Starting with records. Building towards continuity.</span>
          <p>DAD Report is live. Clinic, lab, and diagnostic connections are planned and will be added in phases.</p>
        </div>
      </div>
    </section>
  );
}
