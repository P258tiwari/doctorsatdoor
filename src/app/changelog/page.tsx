import React from "react";
import Image from "next/image";
import { Metadata } from "next";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import "./changelog.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getPublicChangelog } from "@/lib/server/public-content";
import { pageMetadata } from "@/lib/seo";
import { INITIAL_REPORT_RELEASE_NOTE } from "@/lib/initial-release";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata(
  "Changelog: Product Updates",
  "Follow the latest product updates, new AI features, improvements, and fixes for DAD Report and the DAD healthcare ecosystem.",
  "/changelog"
);

async function ChangelogContent() {
  const entries = await getPublicChangelog();

  return (
    <main id="main-content" className="release-page">
      <div className="dad-container">
        <header className="release-heading">
          <div>
            <span className="eyebrow">THE DAD RELEASE LOG</span>
            <h1>
              A product that<br />
              <em>keeps growing.</em>
            </h1>
          </div>
          <div className="release-intro">
            <p>
              Thoughtful improvements, new possibilities, and the details that make everyday care simpler.
            </p>
            <a href="#release-timeline">
              See what is new <ArrowDown size={16} />
            </a>
          </div>
        </header>

        <div className="release-product">
          <div>
            <Image
              className="release-logo rounded-xl"
              src="/images/dad-reports-logo.webp"
              alt=""
              width={42}
              height={42}
            />
            <strong>DAD Ecosystem</strong>
            <span>Product updates & release notes</span>
          </div>
          <Link href="/dad-report" className="text-link">
            Explore DAD Report <ArrowUpRight size={16} />
          </Link>
        </div>

        <section id="release-timeline" className="release-timeline" aria-label="Product release history">
          {entries.map((entry, idx) => {
            const changesList =
              entry.changes && entry.changes.length > 0
                ? entry.changes.map((c) => ({
                    text: c.text,
                    type: c.type === "new" ? "New" : c.type === "upgrade" ? "Upgrade" : "Fix",
                  }))
                : [
                    ...(entry.features || []).map((text) => ({ text, type: "New" })),
                    ...(entry.improvements || []).map((text) => ({ text, type: "Upgrade" })),
                    ...(entry.fixes || []).map((text) => ({ text, type: "Fix" })),
                  ];

            const appLogo = entry.app?.logo_url || "/images/dad-reports-logo.webp";
            const appName = entry.app?.name || entry.product_name || "DAD Report";

            return (
              <div className="release-row" key={entry.id || idx}>
                <div className="release-date">
                  <time dateTime={entry.release_date}>{formatDate(entry.release_date)}</time>
                  <span>{entry.version}</span>
                </div>
                <article className="release-card">
                  <div className="release-card-top">
                    <div className="release-brand flex items-center gap-3">
                      <Image
                        className="release-logo rounded-xl"
                        src={appLogo}
                        unoptimized={/^https?:\/\//.test(appLogo)}
                        alt={appName}
                        width={46}
                        height={46}
                      />
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                        {appName}
                      </span>
                    </div>
                    {entry.is_major && <span className="release-major">Major release</span>}
                  </div>

                  <h2>{entry.title}</h2>
                  {entry.key_feature && (
                    <p className="font-semibold text-indigo-700 text-sm mt-1">
                      ★ {entry.key_feature}
                    </p>
                  )}
                  <p className="release-summary">{entry.summary}</p>

                  {changesList.length > 0 && (
                    <div className="release-detail">
                      <h3>What&apos;s included</h3>
                      <ul className="release-changes">
                        {changesList.map((item, i) => {
                          const separator = item.text.indexOf(":");
                          return (
                            <li className="release-change" key={i}>
                              <span
                                className={`release-change-chip release-change-chip-${item.type.toLowerCase()}`}
                              >
                                {item.type}
                              </span>
                              <div>
                                {separator >= 0 ? (
                                  <>
                                    <h4>{item.text.slice(0, separator)}</h4>
                                    <p>{item.text.slice(separator + 1).trim()}</p>
                                  </>
                                ) : (
                                  <p>{item.text}</p>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                  <p className="release-note">{INITIAL_REPORT_RELEASE_NOTE}</p>
                </article>
              </div>
            );
          })}
          {entries.length === 0 && (
            <p className="release-empty">Our next chapter is on its way. Check back for product updates.</p>
          )}
        </section>
      </div>
    </main>
  );
}

export default function ChangelogPage() {
  return (
    <>
      <Navbar />
      <ChangelogContent />
      <Footer />
    </>
  );
}
