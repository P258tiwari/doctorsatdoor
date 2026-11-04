import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FolderHeart, ScanText, Share2 } from "lucide-react";
import type { BlogAuthor } from "@/types";
import "./ArticleClosing.css";

export function ArticleClosing({ author }: { author: BlogAuthor }) {
  const initials = author.name.replace(/^(dr\.?|prof\.?)\s+/i, "").split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("");

  return (
    <div id="article-closing" className="article-closing dad-container">
      <aside className="article-author" aria-label="About the author">
        <div className="article-author-top"><span>THE VOICE BEHIND THE STORY</span><span>DAD JOURNAL</span></div>
        <div className="article-author-body">
          <div className="article-author-monogram" aria-hidden="true">
            {author.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.avatar_url}
                alt={author.name}
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }}
              />
            ) : (
              initials
            )}
          </div>
          <div className="article-author-copy">
            <h2>{author.name}</h2>
            {author.role && <p className="article-author-role">{author.role}</p>}
            {author.bio && <p className="article-author-bio">{author.bio}</p>}
          </div>
        </div>
      </aside>

      <section className="article-product" aria-labelledby="article-product-title">
        <div className="article-product-copy">
          <div className="article-product-brand"><Image src="/images/dad-reports-logo.webp" alt="DAD Reports" width={40} height={40}/><span>DAD REPORT</span><span className="article-product-live">LIVE</span></div>
          <span className="article-product-eyebrow">LESS PAPERWORK. MORE PEACE OF MIND.</span>
          <h2 id="article-product-title">A home for your<br/><em>health story.</em></h2>
          <p>Give your family’s medical records a home. Organised, understandable, and ready when you need them.</p>
          <Link href="/dad-report" className="dad-button lime article-product-link">Explore DAD Report <ArrowUpRight size={16}/></Link>
          <ul className="article-product-benefits" aria-label="DAD Report features">
            <li><FolderHeart aria-hidden="true"/><span>Organise</span></li>
            <li><ScanText aria-hidden="true"/><span>Understand</span></li>
            <li><Share2 aria-hidden="true"/><span>Share</span></li>
          </ul>
        </div>
        <div className="article-product-visual">
          <svg className="article-product-waves" viewBox="0 0 800 650" preserveAspectRatio="none" aria-hidden="true" focusable="false">
            <path className="article-wave-back" d="M0 520C180 570 160 220 390 270S650 190 800 70V650H0Z"/>
            <path className="article-wave-front" d="M0 590C200 630 210 345 430 380S650 300 800 200V650H0Z"/>
            <path className="article-wave-line" d="M0 485C180 535 160 185 390 235S650 155 800 35"/>
            <path className="article-wave-line article-wave-line-soft" d="M0 555C200 595 210 310 430 345S650 265 800 165"/>
          </svg>
          <figure className="iphone16" aria-label="DAD Reports shown in an iPhone 16 mockup">
            <span className="iphone16-action" aria-hidden="true"/><span className="iphone16-volume" aria-hidden="true"/><span className="iphone16-power" aria-hidden="true"/><span className="iphone16-camera-control" aria-hidden="true"/>
            <div className="iphone16-screen">
              <Image src="/images/dad-app.webp" alt="Actual DAD Reports app showing upload, organise and share, medical insurance and treatment folders" width={708} height={1535} sizes="(max-width: 640px) 205px, 230px"/>
              <span className="iphone16-island" aria-hidden="true"><span/></span>
              <span className="iphone16-home" aria-hidden="true"/>
            </div>
          </figure>
        </div>
      </section>
    </div>
  );
}
