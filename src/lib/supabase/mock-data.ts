import { ECOSYSTEM_ARTICLE } from "@/lib/ecosystem-article";
import {
  ChangelogEntry,
  BlogPost,
  FAQItem,
  SiteSettings,
} from "@/types";

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  site_name: "Doctors At Door (DAD)",
  tagline: "Healthcare is Fragmented. DAD Completes the Cycle.",
  support_email: "support@doctorsatdoor.com",
  partnerships_email: "partners@doctorsatdoor.com",
  investor_email: "investors@doctorsatdoor.com",
  phone_display: "+91 98200 00000",
  primary_domain: "https://www.doctorsatdoor.com",
  dad_report_url: "https://report.doctorsatdoor.com",
  social_links: {
    twitter: "https://twitter.com/doctorsatdoor",
    linkedin: "https://linkedin.com/company/doctorsatdoor",
    youtube: "https://youtube.com/@doctorsatdoor",
  },
};

export const DEFAULT_CHANGELOG: ChangelogEntry[] = [
  {
    id: "v-2-4-0",
    version: "v2.4.0",
    release_date: "2025-10-18",
    title: "Diagnostic Appointments Sync & Enhanced Video Avatars",
    product_id: "dad-report",
    product_name: "DAD Report",
    summary:
      "Integrated real-time diagnostic appointment visibility and upgraded our AI avatar video explainer with support for regional Indian languages.",
    features: [
      "In-App Diagnostic Appointments: Appointments booked with DAD-partner diagnostic centers now automatically appear in your app with status tracking and preparation checklists.",
      "Multilingual Avatar Explanations: AI report explainer videos now support Hindi, Marathi, Gujarati, and Tamil in addition to English.",
      "Smart Insurance Claim Preparation: Automated export packet of all invoices and lab reports organized by date for insurance claim submission.",
    ],
    improvements: [
      "50% faster OCR ingestion when batch uploading multi-page PDF medical dossiers.",
      "Refined report classification model with 98.4% accuracy across pathology, radiology, and discharge summaries.",
      "Revamped treatment folder cards with quick progress notes and doctor tags.",
    ],
    fixes: [
      "Resolved an issue where certain rotated prescription scans were oriented sideways.",
      "Fixed date formatting discrepancy on historical reports from before 2018.",
    ],
    security_notes: [
      "Upgraded cryptographic key rotation policy for all user health vault files at rest.",
    ],
    is_major: true,
  },
  {
    id: "v-2-2-0",
    version: "v2.2.0",
    release_date: "2025-08-05",
    title: "Health Insurance Document Intelligence & Treatment Folders",
    product_id: "dad-report",
    product_name: "DAD Report",
    summary:
      "Introduced comprehensive health insurance policy summarization and grouped condition treatment folders.",
    features: [
      "AI Policy Decoder: Upload policy PDFs to instantly see deductible limits, covered day-care treatments, room rent caps, and waiting periods.",
      "Condition & Treatment Folders: Group lab reports, prescriptions, scans, and follow-ups by treatment journey (e.g., 'Thyroid 2025', 'Knee Surgery').",
      "Family Vault Member Switcher: Instant switching between parents, spouse, and children with distinct access privileges.",
    ],
    improvements: [
      "Added voice memo duration meter during doctor follow-up voice ping recordings.",
      "Optimized offline caching for faster viewing on slow mobile connections.",
    ],
    fixes: [
      "Fixed notification delivery badge on iOS web app wrappers.",
      "Cleaned up table formatting on complex blood test panel summaries.",
    ],
    security_notes: [
      "Implemented strict biometric app-lock prompt upon app resume.",
    ],
    is_major: false,
  },
  {
    id: "v-2-0-0",
    version: "v2.0.0",
    release_date: "2025-05-12",
    title: "DAD Report 2.0: AI Longitudinal Health Timeline",
    product_id: "dad-report",
    product_name: "DAD Report",
    summary:
      "The complete architectural evolution from raw report storage to a chronological, AI-powered health memory bank.",
    features: [
      "Chronological Health Timeline: Automatically indexes dates, lab names, test markers, and physician notes.",
      "Plain-Language AI Summaries: Clear breakdown of high/low flags without medical jargon panic.",
      "Doctor Follow-Up Voice Ping: Record a 60-second voice message attached directly to a specific report.",
    ],
    improvements: [
      "Completely new modern UI built with clean white aesthetics and calm indigo tones.",
      "Exportable summary cards designed for quick doctor consultations.",
    ],
    fixes: [
      "Corrected duplicate upload detection algorithm.",
    ],
    security_notes: [
      "End-to-end user-controlled data sharing links with automatic 24-hour expiration tokens.",
    ],
    is_major: true,
  },
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [ECOSYSTEM_ARTICLE];

export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "What is Doctors At Door (DAD)?",
    answer:
      "Doctors At Door (DAD) is a healthcare technology company. We are building a platform that connects patients, doctors, clinics, hospitals, diagnostic centres, labs, and pharmacies.",
    category: "general",
    order_index: 1,
  },
  {
    id: "faq-2",
    question: "What is DAD Report?",
    answer:
      "DAD Report is an app that helps you organise, understand, and share your medical reports. You can upload reports, see them on a timeline, read AI summaries, create folders, add family members, and get an AI explanation of your insurance policy.",
    category: "dad_report",
    order_index: 2,
  },
  {
    id: "faq-3",
    question: "Is DAD Report live right now?",
    answer:
      "Yes. DAD Report is live. You can use it at report.doctorsatdoor.com.",
    category: "dad_report",
    order_index: 3,
  },
  {
    id: "faq-4",
    question: "Are DAD Admin, DAD Lab, and DAD Diagnostic live yet?",
    answer:
      "Not yet. DAD Admin, DAD Lab, and DAD Diagnostic are planned. DAD Admin is for clinics, DAD Lab is for labs, and DAD Diagnostic is for diagnostic centres. Clinics and labs interested in early access can contact us.",
    category: "ecosystem",
    order_index: 4,
  },
  {
    id: "faq-5",
    question: "Can I manage reports for my family?",
    answer:
      "Yes. You can add family members, such as your children, spouse, or parents, to your account. Each person’s reports stay separate. Switch profiles to view a family member’s reports.",
    category: "dad_report",
    order_index: 5,
  },
  {
    id: "faq-6",
    question: "Is DAD a hospital, clinic, or diagnostic centre?",
    answer:
      "No. DAD is a healthcare technology platform. We do not provide medical consultations or run diagnostic tests. We help patients connect with doctors and healthcare providers.",
    category: "general",
    order_index: 6,
  },
  {
    id: "faq-7",
    question: "Can DAD's AI summaries replace my doctor's advice?",
    answer:
      "No. AI summaries and AI video explanations help you understand medical terms and prepare for appointments. They are not diagnoses, prescriptions, or treatment plans. Always ask your doctor before making medical decisions.",
    category: "privacy",
    order_index: 7,
  },
  {
    id: "faq-8",
    question: "How do you protect my data and privacy?",
    answer:
      "Your reports belong to you. Records are encrypted when stored and when sent. DAD does not sell personal health data or share your reports without your permission. You can stop sharing or request account deletion at any time.",
    category: "privacy",
    order_index: 8,
  },
  {
    id: "faq-9",
    question: "Can clinics, doctors, and diagnostic labs partner with DAD?",
    answer:
      "Yes. We are looking for doctors, clinics, diagnostic labs, and healthcare networks to join our pilot programmes. Contact us through the contact page.",
    category: "partnerships",
    order_index: 9,
  },
  {
    id: "faq-10",
    question: "How can investors contact DAD?",
    answer:
      "We welcome health-tech investors who share our goal of making healthcare less fragmented. Choose 'Funding / investor' on our contact page, or email investors@doctorsatdoor.com.",
    category: "partnerships",
    order_index: 10,
  },
];
