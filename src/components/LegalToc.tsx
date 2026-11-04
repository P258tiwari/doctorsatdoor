"use client";

import { useEffect, useState } from "react";

export function LegalToc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id ?? "");
  useEffect(() => {
    const update = () => {
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const heading = document.getElementById(item.id);
        if (heading && heading.getBoundingClientRect().top <= 180) current = item.id;
      }
      setActive(current);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return <nav className="legal-toc" aria-label="Table of contents"><strong>Table of contents</strong><ol className="legal-toc-list">{items.map(item => <li key={item.id}><a href={`#${item.id}`} aria-current={active === item.id ? "location" : undefined}>{item.title}</a></li>)}</ol></nav>;
}
