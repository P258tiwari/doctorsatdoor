export type UserRole = "super_admin" | "content_admin" | "support_admin";

export interface ChangelogEntry {
  app_id?: string;
  app?: {id:string;name:string;logo_url:string};
  key_feature?: string;
  changes?: {type:"new"|"upgrade"|"fix";text:string}[];
  id: string;
  version: string;
  release_date: string;
  title: string;
  product_id: string;
  product_name: string;
  summary: string;
  features: string[];
  improvements: string[];
  fixes: string[];
  security_notes?: string[];
  is_major?: boolean;
}

export interface BlogAuthor {
  id: string;
  name: string;
  role: string;
  avatar_url?: string;
  bio?: string;
}

export interface BlogPost {
  updated_at?: string;
  category_id?: string;
  author_id?: string;
  content_format?: "markdown"|"html";
  publication_status?: "draft"|"published"|"scheduled";
  publish_at?: string;
  seo_keywords?: string[];
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  category_slug: string;
  author: BlogAuthor;
  reading_time: string;
  published_at: string;
  is_published: boolean;
  is_featured?: boolean;
  tags: string[];
  seo_title?: string;
  seo_description?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: "general" | "dad_report" | "ecosystem" | "partnerships" | "privacy";
  order_index: number;
}

export type LeadType =
  | "patient"
  | "doctor"
  | "diagnostic"
  | "clinic"
  | "investor"
  | "partnership"
  | "other";

export type LeadStatus = "new" | "contacted" | "in_review" | "archived";

export interface LeadInquiry {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  city?: string;
  organization?: string;
  inquiry_type: LeadType;
  subject?: string;
  message: string;
  status: LeadStatus;
  created_at: string;
  notes?: string;
}

export interface AccountDeletionRequest {
  id: string;
  name: string;
  email_or_phone: string;
  account_identifier: string;
  reason?: string;
  status: "pending" | "verified" | "completed" | "rejected";
  created_at: string;
}

export interface SiteSettings {
  site_name: string;
  tagline: string;
  support_email: string;
  partnerships_email: string;
  investor_email: string;
  phone_display: string;
  primary_domain: string;
  dad_report_url: string;
  social_links: {
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    instagram?: string;
  };
}

