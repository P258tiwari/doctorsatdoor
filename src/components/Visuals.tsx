import Image from "next/image";
export function CarePhoto({ src = "family-care", alt, className = "", priority = false }: { src?: string; alt: string; className?: string; priority?: boolean }) { return <div className={`care-photo ${className}`}><Image src={`/images/${src}.webp`} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" preload={priority} /></div>; }
