"use client";

import Link from "next/link";

export default function Error({ retry }: { error: unknown; retry: () => void }) {
  return <main id="main-content" className="not-found-page"><span className="eyebrow">SOMETHING WENT WRONG</span><h1>We could not<br/><em>load this page.</em></h1><p>Please try again in a moment.</p><div className="button-row"><button type="button" className="dad-button" onClick={() => retry()}>Try again</button><Link href="/" className="text-link">Back to home</Link></div></main>;
}
