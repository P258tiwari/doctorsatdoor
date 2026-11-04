'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// A destination section may arrive after navigation in a streamed Suspense boundary.
export function AnchorNavigation() {
  const pathname = usePathname();
  useEffect(() => {
    let observer: MutationObserver | undefined;
    let frame = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const stop = () => {
      observer?.disconnect();
      cancelAnimationFrame(frame);
      if (timeout) clearTimeout(timeout);
    };
    const scrollToHash = () => {
      stop();
      if (!window.location.hash) return;
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      const find = () => {
        const target = document.getElementById(id);
        if (!target) return;
        observer?.disconnect();
        frame = requestAnimationFrame(() => {
          frame = requestAnimationFrame(() => {
            const offset = Math.max(
              parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0,
              parseFloat(getComputedStyle(target).scrollMarginTop) || 0,
            );
            window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset), behavior: 'instant' });
          });
        });
      };
      observer = new MutationObserver(find);
      observer.observe(document.body, { childList: true, subtree: true });
      timeout = setTimeout(stop, 15000);
      find();
    };
    const click = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element).closest('a[href]');
      if (!anchor || anchor.getAttribute('target') === '_blank') return;
      const url = new URL(anchor.getAttribute('href')!, window.location.href);
      if (url.origin === window.location.origin && url.pathname === pathname && url.search === window.location.search && url.hash) {
        // Own same-page fragments so the router and smooth scrolling do not race.
        event.preventDefault();
        if (url.href !== window.location.href) window.history.pushState(null, '', url.href);
        scrollToHash();
      }
    };
    scrollToHash();
    window.addEventListener('hashchange', scrollToHash);
    document.addEventListener('click', click, true);
    window.addEventListener('wheel', stop, { passive: true });
    window.addEventListener('touchstart', stop, { passive: true });
    return () => {
      stop();
      window.removeEventListener('hashchange', scrollToHash);
      document.removeEventListener('click', click, true);
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchstart', stop);
    };
  }, [pathname]);
  return null;
}
