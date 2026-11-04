// Keep existing CMS image references compatible with the digital-platform artwork.
const articleImages: Record<string, { src: string; alt: string; width?: string; height?: string }> = {
  '/images/journal-dad-ecosystem-cover.webp': {
    src: '/images/journal-dad-ecosystem-cover-digital.webp',
    width: '1536',
    height: '1024',
    alt: 'DAD on mobile and laptop connecting families, doctors and diagnostic reports',
  },
  '/images/journal-care-team.webp': {
    src: '/images/journal-care-team-digital.webp',
    width: '1536',
    height: '1024',
    alt: 'Doctor and care coordinator profiles connected through DAD digital workflows',
  },
  '/images/journal-diagnostic-handover.webp': {
    src: '/images/journal-diagnostic-handover-digital.webp',
    width: '1536',
    height: '1024',
    alt: 'Diagnostic reports shared digitally through DAD between care providers and families',
  },
  '/images/journal-connected-care.webp': {
    src: '/images/journal-connected-care-digital.webp',
    width: '1536',
    height: '1024',
    alt: 'Family health records connected across the DAD mobile and laptop platform',
  },
};

export function articleImage(src: string, alt = ''): { src: string; alt: string; width?: string; height?: string } {
  return articleImages[src] || { src, alt };
}
