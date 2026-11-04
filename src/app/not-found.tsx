import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
export default function NotFound(){return <><Navbar/><main id="main-content" className="not-found-page"><Image src="/images/dad-logo.webp" alt="Doctors At Door" width={82} height={82} className="rounded-3xl"/><span className="eyebrow">404 · A MISSING CONNECTION</span><h1>Let’s find your<br/><em>way back.</em></h1><p>This page may have moved. Your next step is right here.</p><div className="button-row"><Link href="/" className="dad-button">Back to home <span className="direction-arrow direction-arrow-up-right" aria-hidden="true">↗</span></Link><Link href="/dad-report" className="text-link">Explore DAD Report <span className="direction-arrow direction-arrow-right" aria-hidden="true">→</span></Link></div></main><Footer/></>;}
