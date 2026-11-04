# Doctors At Door (DAD) — Healthcare Ecosystem Website & CMS

> **"Healthcare is fragmented. DAD completes the cycle."**

A complete, modern, fast, SEO-first digital healthcare ecosystem web platform built from scratch for **Doctors At Door (DAD)** (`doctorsatdoor.com`).

Positions DAD as a visionary health-tech startup building a unified, connected healthcare cloud that links **Patients, Doctors, Clinics, Diagnostic Centers, and Clinical Laboratories**, while prominently showcasing its first live application: **DAD Report** (`report.doctorsatdoor.com`).

---

## 🌟 Key Highlights

1. **Brand & Positioning**:
   - Replaces traditional waitlist collection with active ecosystem engagement: **Funding / Investor Interest**, **Partnership / Collaboration**, and **Clinic & Diagnostic Pilot Programs**.
   - Showcases **DAD Report** as the active, live foundation of patient health memory.
   - Presents upcoming modules (**DAD Admin**, **DAD Lab**, **DAD Diagnostic**) as part of a disciplined, multi-year strategic roadmap.

2. **Frontend Architecture**:
   - **Next.js (App Router)** with TypeScript
   - **Tailwind CSS** with a light-first, clean, trustworthy healthcare-tech visual identity (deep indigo tones, soft lavender/cyan accents, and calm contrast).
   - High-fidelity interactive components:
     - Real-time **One Eco-system** interactive node visualizer (Patient, Doctor, Clinic, Lab, Admin, Pharmacy, Paramedic, AI Assistant, Marketplace).
     - **DAD Report Spotlight** featuring live interactive preview cards for AI report timelines, plain-language summaries, multilingual avatar video explainers, insurance policy decoding, condition folders, and in-app diagnostic appointments.
     - 4-Phase **Ecosystem Roadmap** with interactive milestones.
     - Transparent **Trust & Privacy First** framework with zero fake compliance claims.

3. **Complete Blog CMS**:
   - `/blog`: Category filtering (Ecosystem, Patient Education, Insurance, Diagnostics), real-time search, reading-time estimation, tags, and featured hero article.
   - `/blog/[slug]`: Markdown article reader, author biographies, related articles, and structured JSON-LD `BlogPosting` schema.

4. **Product Pages**:
   - `/dad-report`: Dedicated in-depth product showcase for DAD Report with interactive feature walkthroughs and direct links to the live application.
   - `/dad-admin`: Dedicated coming-soon preview for clinic OPD queue management and doctor intelligence.
   - `/dad-lab`: Dedicated coming-soon preview for clinical lab LIMS middleware.
   - `/dad-diagnostic`: Dedicated coming-soon preview for diagnostic booking and home phlebotomy dispatch.

5. **Changelog System**:
   - `/changelog`: Version history tracking improvements, features, bug fixes, and security updates for live products.

6. **Lead Capture & Support**:
   - `/contact`: Dedicated hub with category router (Investor, Clinic, Diagnostic, Doctor, Patient, Partnership).
   - `/account-deletion`: Transparent self-serve account deletion request form with automated database logging.
   - Legal Pages: `/data-security`, `/privacy-policy`, and `/terms-of-service`.

7. **Admin Panel / CMS (`/admin`)**:
   - Secure dashboard with role-based permissions (`super_admin`, `content_admin`, `support_admin`).
   - Manage Inquiries & Leads: Filter by category, update status (`new`, `contacted`, `in_review`, `archived`), and **Export to CSV**.
   - Manage Blog Articles: Write, edit, publish/unpublish, and delete articles.
   - Manage Changelogs: Publish new release versions.
   - Manage FAQs & Account Deletion Requests.
   - Seamless dual-mode: Works out of the box with local storage fallback or connects directly to Supabase PostgreSQL!

---

## 🛠️ Tech Stack

- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend / Database**: Supabase (PostgreSQL, Row-Level Security, Auth)
- **SEO**: Dynamic Sitemap (`sitemap.ts`), `robots.ts`, OpenGraph, Twitter Cards, JSON-LD Schema (`Organization`, `WebSite`, `BlogPosting`, `SoftwareApplication`, `FAQPage`)
- **Deployment**: Vercel ready

---

## 🚀 Quick Start & Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(The website runs seamlessly out of the box with built-in mock data even before adding Supabase credentials!)*

### 3. Supabase Setup (Optional for Live DB)
1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard.
3. Paste and run the entire SQL migration script from `supabase/schema.sql`.
4. Copy your **Project URL** and **Anon Key** into `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## 📂 Site Route Map

| Route | Purpose | Status |
| :--- | :--- | :--- |
| `/` | Main Ecosystem Homepage (Hero, Nodes, Problem, Solution, Spotlight, Roadmap, FAQs, CTAs) | Live |
| `/dad-report` | Dedicated DAD Report Product Page | Live Product |
| `/dad-admin` | DAD Admin Clinic Coordination Preview | Coming Soon (Phase 2) |
| `/dad-lab` | DAD Lab LIMS Middleware Preview | Coming Soon (Phase 2) |
| `/dad-diagnostic` | DAD Diagnostic Workflow Preview | Coming Soon (Phase 2) |
| `/changelog` | Release Changelog (DAD Report updates) | Live |
| `/blog` | Health-Tech Blog & Knowledge Hub | Live |
| `/blog/[slug]` | Individual Blog Article Reader | Live |
| `/contact` | Multi-category Lead & Partnership Hub | Live |
| `/data-security` | Data Security & Cryptographic Encryption Details | Live |
| `/privacy-policy` | Structured Privacy Policy | Live |
| `/terms-of-service` | Platform Terms of Service | Live |
| `/account-deletion` | Self-Serve Account Deletion Request Form | Live |
| `/admin` | CMS & Lead Management Portal | Live (Role Protected) |
| `/sitemap.xml` | Dynamic SEO Sitemap | Live |
| `/robots.txt` | Crawler Directives | Live |

---

## 🔐 Admin Portal (`/admin`)

To access the admin dashboard:
1. Navigate to `/admin`.
2. Select your role (`Super Admin`, `Content Admin`, or `Support Admin`).
3. Enter your email and click **Sign In** (runs in authorized demo mode or connects to your Supabase Auth session).
4. Features available in the console:
   - **Leads & Inquiries**: Review and filter submissions, update status, and export to CSV.
   - **Blog CMS**: Draft, edit, publish, and delete blog articles.
   - **Changelog**: Release new versions of DAD Report.
   - **FAQs**: Create and manage questions.
   - **Account Deletions**: Review and confirm verified deletion requests.

---

## 🚢 Deployment (Vercel)

1. Push this repository to GitHub / GitLab / Bitbucket.
2. In Vercel, click **Add New Project** and select this repository.
3. Add the environment variables from `.env.example` in your Vercel Project Settings.
4. Click **Deploy**. Vercel will automatically build the Next.js App Router application with static generation and edge optimization.
