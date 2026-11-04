import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
export function DadLogo({ className, variant = "auto", size = "md" }: { className?: string; variant?: "light" | "dark" | "auto"; showTagline?: boolean; size?: "sm" | "md" | "lg" }) {
return <Link href="/" className={cn("dad-brand", variant === "dark" && "dad-brand-light", className)} aria-label="Doctors At Door home"><Image src="/images/dad-logo.webp" width={size === "lg" ? 72 : 52} height={size === "lg" ? 72 : 52} alt="DAD — Doctors At Door" className="dad-brand-mark" /><span><strong>Doctors At Door</strong><small>An Eco-system for Healthcare</small></span></Link>;
}
