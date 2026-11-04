import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      // Fixed zone: server and browser must print the same day or hydration fails.
      timeZone: "Asia/Kolkata",
    }).format(date);
  } catch {
    return dateString;
  }
}
