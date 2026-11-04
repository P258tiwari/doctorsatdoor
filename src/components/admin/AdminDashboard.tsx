"use client";
import { Turnstile } from '@/components/ui/Turnstile';
import Image from "next/image";
import { CustomSelect } from '@/components/ui/CustomSelect';
import { CmsContentPanel } from "./cms/CmsContentPanel";
import { SampleVideoSettings } from "./SampleVideoSettings";
import "./admin-login.css";
import "./admin-workspace.css";
import { supabase } from "@/lib/supabase/client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Users, FileText, Clock, HelpCircle, Settings, Trash2, Sparkles, Download, Plus, Search, ArrowUpRight, LogOut, Eye, EyeOff, ShieldCheck } from "lucide-react";
import {
  getLeads,
  updateLeadStatus,
  updateAccountDeletionStatus,
  getAllBlogPostsAdmin,
  getChangelog,
  getFAQs,
  getAccountDeletionRequests,
  getSiteSettings,
} from "@/lib/supabase/data-service";
import {
  LeadInquiry,
  BlogPost,
  ChangelogEntry,
  FAQItem,
  AccountDeletionRequest,
  SiteSettings,
  UserRole,
  LeadStatus,
} from "@/types";
import { formatDate, cn } from "@/lib/utils";

type AdminTab =
  | "overview"
  | "leads"
  | "blog"
  | "changelog"
  | "faqs"
  | "deletions"
  | "settings";

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [checkingSession, setCheckingSession] = useState(Boolean(supabase));
  const [userRole, setUserRole] = useState<UserRole>("super_admin");
  const canEditContent = ["super_admin", "content_admin"].includes(userRole);
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [loginPass, setLoginPass] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [captchaToken,setCaptchaToken]=useState('');
  const [captchaReset,setCaptchaReset]=useState(0);
  const [loggingIn, setLoggingIn] = useState(false);

  const [dataError, setDataError] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const canManageRequests = ["super_admin", "support_admin"].includes(userRole);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [leads, setLeads] = useState<LeadInquiry[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [changelogs, setChangelogs] = useState<ChangelogEntry[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [deletions, setDeletions] = useState<AccountDeletionRequest[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  const [leadFilter, setLeadFilter] = useState<string>("all");
  const [leadSearch, setLeadSearch] = useState<string>("");

  async function reloadContent(){const [b,c,f]=await Promise.all([getAllBlogPostsAdmin(),getChangelog(),getFAQs()]);setBlogPosts(b);setChangelogs(c);setFaqs(f);}
  function openRequestedEditor(){const next=new URLSearchParams(window.location.search).get('next');if(next && /^\/admin\/(articles|releases)\/(new|[a-f0-9-]+)$/.test(next))window.location.assign(next);}
  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let active = true;
    (async () => {
      const { data } = await client.auth.getUser();
      if (!data.user) return;
      const r = await client.from("admin_users").select("role").eq("auth_user_id", data.user.id).single();
      if (active && r.data && ["super_admin", "content_admin", "support_admin"].includes(r.data.role)) {
        setAdminEmail(data.user.email || "");
        setUserRole(r.data.role);
        setIsAuthenticated(true);
        openRequestedEditor();
      }
    })().catch(() => { if (active) setLoginError("Unable to verify your session. Please sign in again."); })
      .finally(() => { if (active) setCheckingSession(false); });
    return () => {
      active = false;
    };
  }, []);
  // Revalidate membership when a session changes, a tab regains focus, or access is revoked.
  useEffect(() => {
    if (!supabase) return;
    let active = true;
    let generation = 0;
    const clear = () => {
      setIsAuthenticated(false); setUserRole('support_admin'); setActiveTab('overview');
      setLeads([]); setDeletions([]); setBlogPosts([]); setChangelogs([]); setFaqs([]); setSiteSettings(null);
      setLoginPass(''); setShowPassword(false);
    };
    const verify = async () => {
      const current = ++generation;
      try {
        const { data, error } = await supabase!.auth.getUser();
        if (!active || current !== generation) return;
        if (error || !data.user) { clear(); return; }
        const result = await supabase!.from('admin_users').select('role').eq('auth_user_id', data.user.id).single();
        if (!active || current !== generation) return;
        if (result.error || !result.data || !['super_admin','content_admin','support_admin'].includes(result.data.role)) { clear(); return; }
        setUserRole(result.data.role); setIsAuthenticated(true);
      } catch { if (active && current === generation) clear(); }
    };
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session || event === 'SIGNED_OUT') { generation++; clear(); }
      else setTimeout(() => { if (active) void verify(); }, 0);
    });
    window.addEventListener('focus', verify);
    const interval = setInterval(verify, 60000);
    return () => { active = false; generation++; subscription.subscription.unsubscribe(); window.removeEventListener('focus', verify); clearInterval(interval); };
  }, []);
  // Load initial dataset after authentication.
  useEffect(() => {
    if (!isAuthenticated) return;
    let active = true;
    const requests = canManageRequests ? [getLeads(), getAccountDeletionRequests()] : [Promise.resolve([]), Promise.resolve([])];
    Promise.allSettled([...requests, ...(canEditContent ? [getAllBlogPostsAdmin(), getChangelog(), getFAQs()] : [Promise.resolve([]), Promise.resolve([]), Promise.resolve([])]), getSiteSettings()]).then(results => {
      if (!active) return;
      const [l,d,b,c,f,s] = results;
      if (l.status === 'fulfilled') setLeads(l.value as LeadInquiry[]);
      if (d.status === 'fulfilled') setDeletions(d.value as AccountDeletionRequest[]);
      if (b.status === 'fulfilled') setBlogPosts(b.value as BlogPost[]);
      if (c.status === 'fulfilled') setChangelogs(c.value as ChangelogEntry[]);
      if (f.status === 'fulfilled') setFaqs(f.value as FAQItem[]);
      if (s.status === 'fulfilled') setSiteSettings(s.value as SiteSettings);
      const failures = results.filter(r => r.status === 'rejected');
      if (failures.length) setDataError('Some sections could not load from the database. ' + failures.map(r => r.status === 'rejected' ? (r.reason?.message || 'Connection failed') : '').join(' '));
      setLoadingData(false);
    });
    return () => { active = false; };
  }, [isAuthenticated, canEditContent, canManageRequests]);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loggingIn) return;
    setLoginError("");
    if (!supabase) { setLoginError("Database is not configured. Please contact your administrator."); return; }
    if(!captchaToken){setLoginError('Please complete the verification.');return;}
    setLoggingIn(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: adminEmail.trim(), password: loginPass, options: { captchaToken } });
      if (error || !data.user) { setLoginError("Unable to sign in. Check your email and password."); return; }
      const { data: admin, error: roleError } = await supabase.from("admin_users").select("role").eq("auth_user_id", data.user.id).single();
      if (roleError || !admin || !["super_admin", "content_admin", "support_admin"].includes(admin.role)) {
        await supabase.auth.signOut();
        setLoginError("Admin access has not been set up for this account. Contact your administrator.");
        return;
      }
      setUserRole(admin.role as UserRole);
      setLoginPass("");
      setIsAuthenticated(true);
      openRequestedEditor();
    } catch {
      setLoginError("Unable to connect. Please try again.");
    } finally { setLoggingIn(false);setCaptchaToken('');setCaptchaReset(n=>n+1); }
  };

  // CSV Lead Exporter
  const exportLeadsCsv = () => {
    if (leads.length === 0) return;
    const headers = [
      "ID",
      "Date",
      "Type",
      "Name",
      "Email",
      "Phone",
      "City",
      "Organization",
      "Status",
      "Message",
    ];
    const rows = leads.map((l) => [
      l.id,
      l.created_at,
      l.inquiry_type,
      `"${l.full_name.replace(/"/g, '""')}"`,
      l.email,
      l.phone || "",
      l.city || "",
      `"${(l.organization || "").replace(/"/g, '""')}"`,
      l.status,
      `"${l.message.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dad_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle Status Update for Lead
  const handleLeadStatusChange = async (id: string, newStatus: LeadStatus) => {
    setUpdatingId(id); setDataError('');
    try { await updateLeadStatus(id, newStatus); setLeads(rows => rows.map(l => l.id === id ? { ...l, status: newStatus } : l)); }
    catch (e) { setDataError(e instanceof Error ? e.message : 'Could not update enquiry status.'); }
    finally { setUpdatingId(''); }
  };

  // A saved session must be checked before showing either the login or workspace.
  if (checkingSession) {
    return (
      <main className="dad-admin-login dad-admin-loading" aria-busy="true">
        <div className="dad-admin-loader" role="status" aria-label="Loading your workspace">
          <div className="dad-admin-loader-mark" aria-hidden="true">
            <span className="dad-admin-loader-orbit" />
            <Image src="/images/dad-logo.webp" width={64} height={64} alt="" />
          </div>
          <span className="dad-admin-loader-label" aria-hidden="true">DAD WORKSPACE</span>
          <div className="dad-admin-loader-track" aria-hidden="true"><span /></div>
        </div>
      </main>
    );
  }

  // If not logged in, render authentication gateway
  if (!isAuthenticated) {
    return (
      <main className="dad-admin-login">
        <div className="dad-admin-login-content">
          <header className="dad-admin-login-heading">
            <Link href="/" className="dad-admin-login-brand" aria-label="Doctors At Door home">
              <Image src="/images/dad-logo.webp" width={64} height={64} alt="Doctors At Door" />
            </Link>
            <span className="dad-admin-login-eyebrow">DOCTORS AT DOOR / ADMIN</span>
            <h1>Welcome back.<br/><em>Your workspace awaits.</em></h1>
            <p>Sign in to manage your content and enquiries.</p>
          </header>
          <form onSubmit={handleLogin} className="dad-admin-login-form">
            {loginError && <p role="alert" className="dad-admin-login-error">{loginError}</p>}
            <div className="dad-admin-login-field">
              <label htmlFor="admin-email">Email address</label>
              <input id="admin-email" type="email" autoComplete="username" placeholder="you@example.com" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} />
            </div>
            <div className="dad-admin-login-field">
              <label htmlFor="admin-password">Password</label>
              <div className="dad-admin-password-wrap">
                <input id="admin-password" type={showPassword ? "text" : "password"} placeholder="Enter your password" required autoComplete="current-password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} />
                <button type="button" className="dad-admin-password-toggle" aria-label={showPassword ? "Hide password" : "Show password"} aria-controls="admin-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </div>
            </div>
            <Turnstile action="login" onToken={setCaptchaToken} resetKey={captchaReset}/>
            <button type="submit" disabled={loggingIn || !captchaToken} className="dad-admin-login-submit">
              <span>{loggingIn ? "Signing in..." : "Sign in to your workspace"}</span><span aria-hidden="true">{"\u2197"}</span>
            </button>
          </form>
          <footer className="dad-admin-login-footer">
            <Link href="/"><span aria-hidden="true">{"\u2190"}</span> Back to Doctors At Door</Link>
            <p>Authorised team access only.</p>
          </footer>
        </div>
      </main>
    );
  }

  // Filtered Leads
  const filteredLeads = leads.filter((l) => {
    const matchesFilter = leadFilter === "all" || l.inquiry_type === leadFilter;
    const matchesSearch =
      l.full_name.toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.email.toLowerCase().includes(leadSearch.toLowerCase()) ||
      (l.organization || "").toLowerCase().includes(leadSearch.toLowerCase()) ||
      l.message.toLowerCase().includes(leadSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="admin-shell min-h-screen bg-slate-100 flex flex-col md:flex-row">
      <aside className="workspace-sidebar">
        <Link href="/" className="workspace-brand"><Image src="/images/dad-logo.webp" width={48} height={48} alt="DAD"/><span>Doctors At Door<small>Content &amp; care workspace</small></span></Link>
        <span className="workspace-nav-label">YOUR WORKSPACE</span>
        <nav aria-label="Admin navigation">
          {([
            ["overview", "Overview", LayoutDashboard], ["leads", "Enquiries", Users], ["blog", "Journal", FileText], ["changelog", "Release notes", Clock], ["faqs", "Questions & answers", HelpCircle], ["deletions", "Deletion requests", Trash2], ["settings", "Site settings", Settings],
          ] as const).filter(([tab]) => tab === "overview" || tab === "settings" || (["leads", "deletions"].includes(tab) ? canManageRequests : canEditContent)).map(([tab,label,Icon]) => <button key={tab} type="button" aria-current={activeTab===tab ? "page" : undefined} onClick={()=>setActiveTab(tab)}><Icon size={18}/><span>{label}</span>{tab==="leads"&&<small>{leads.length}</small>}{tab==="blog"&&<small>{blogPosts.length}</small>}</button>)}
        </nav>
        <div className="workspace-sidebar-bottom">
          <div className="workspace-account"><span>DA</span><div>Administrator<small>{userRole.replaceAll("_", " ")}</small></div></div>
          <Link href="/" target="_blank">View website <ArrowUpRight size={17}/></Link>
          <button type="button" onClick={async()=>{await supabase?.auth.signOut();setIsAuthenticated(false);setLoginPass("");setShowPassword(false);}}><LogOut size={17}/>Sign out</button>
        </div>
      </aside>
      <main className="workspace-main">
        {dataError && <p className="workspace-error" role="alert">{dataError}</p>}
        {loadingData && <p role="status" className="workspace-loading">Loading database records…</p>}
        <div className="workspace-topbar"><span>DAD WORKSPACE <span>/</span> {({overview:"Overview",leads:"Enquiries",blog:"Journal",changelog:"Release notes",faqs:"Questions & answers",deletions:"Deletion requests",settings:"Site settings"})[activeTab]}</span><span className="workspace-access"><ShieldCheck size={15} strokeWidth={1.8} aria-hidden="true"/> Authorised access</span></div>
        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6 max-w-6xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Your workspace.<br/><em>A clearer overview.</em>
              </h1>
              <p className="text-xs text-slate-500">
                Keep your content current and your conversations moving.
              </p>
            </div>

            {/* Stat Cards */}
            <div className="workspace-stats">
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase">Total Leads</span>
                  <Users className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  {leads.length}
                </div>
                <div className="text-[11px] text-slate-500">
                  {leads.filter((l) => l.status === "new").length} new pending review
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase">Live Applications</span>
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  1
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">
                  DAD Report is live
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase">Published Articles</span>
                  <FileText className="w-4 h-4 text-sky-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  {blogPosts.filter((b) => b.is_published).length}
                </div>
                <div className="text-[11px] text-slate-500">
                  {blogPosts.length} total drafts &amp; posts
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-semibold uppercase">Deletion Requests</span>
                  <Trash2 className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900 font-mono">
                  {deletions.length}
                </div>
                <div className="text-[11px] text-slate-500">
                  {deletions.filter((d) => d.status === "pending").length} pending verification
                </div>
              </div>
            </div>

            {canEditContent && <div className="workspace-shortcuts"><div><span className="workspace-kicker">MAKE SOMETHING USEFUL</span><h2>A fresh perspective.<br/><em>A helpful answer.</em></h2></div><div><Link href="/admin/articles/new" className="workspace-shortcut-link">Write an article <ArrowUpRight size={20}/></Link><button type="button" onClick={()=>{setActiveTab("faqs");}}>Manage answers <Plus size={20}/></button></div></div>}
            {/* Recent Leads Preview */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    The latest conversations
                  </h3>
                  <p className="text-xs text-slate-500">
                    New enquiries from people who want to connect with DAD.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("leads")}
                  className="text-xs font-bold text-indigo-600 hover:underline"
                >
                  View All Leads &rarr;
                </button>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {leads.length===0 && <div className="workspace-empty"><Users size={24}/><h4>No enquiries yet</h4><p>New website enquiries will appear here when someone gets in touch.</p></div>}
                {leads.slice(0, 3).map((lead) => (
                  <div key={lead.id} className="py-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{lead.full_name}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                          {lead.inquiry_type}
                        </span>
                        {lead.organization && (
                          <span className="text-slate-400 font-normal">
                            &bull; {lead.organization}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 line-clamp-1 mt-0.5">{lead.message}</p>
                    </div>
                    <span className="font-mono text-slate-400 shrink-0">
                      {formatDate(lead.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. LEADS TAB */}
        {activeTab === "leads" && canManageRequests && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Every conversation matters.
                </h1>
                <p className="text-xs text-slate-500">
                  Manage incoming funding, partnership, and clinic onboarding requests.
                </p>
              </div>

              <button
                type="button"
                onClick={exportLeadsCsv}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-sm transition-all"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Export CSV Report</span>
              </button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200">
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none">
                {["all", "investor", "clinic", "diagnostic", "doctor", "patient"].map(
                  (f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setLeadFilter(f)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap",
                        leadFilter === f
                          ? "bg-indigo-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {f}
                    </button>
                  )
                )}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by name, email, org..."
                  value={leadSearch}
                  onChange={(e) => setLeadSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Leads Table */}
            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Stakeholder</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Contact</th>
                      <th className="px-4 py-3">Message</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredLeads.length===0 && <tr><td colSpan={6}><div className="workspace-empty"><Search size={24}/><h4>No enquiries found</h4><p>Try another filter or check back when a new enquiry arrives.</p></div></td></tr>}
                    {filteredLeads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-900">
                          <div>{l.full_name}</div>
                          {l.organization && (
                            <div className="text-[10px] text-slate-400 font-normal">
                              {l.organization} {l.city ? `(${l.city})` : ""}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700">
                            {l.inquiry_type}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div>{l.email}</div>
                          {l.phone && <div className="text-slate-400">{l.phone}</div>}
                        </td>
                        <td className="px-4 py-3 max-w-xs">
                          <p className="line-clamp-2">{l.message}</p>
                        </td>
                        <td className="px-4 py-3">
                          <CustomSelect
                            aria-label={`Status for ${l.full_name}`}
                            value={l.status} disabled={updatingId === l.id}
                            onChange={(e) =>
                              handleLeadStatusChange(l.id, e.target.value as LeadStatus)
                            }
                            className="workspace-status-select"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_review">In Review</option>
                            <option value="archived">Archived</option>
                          </CustomSelect>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400 whitespace-nowrap">
                          {formatDate(l.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {(['blog','changelog','faqs'] as string[]).includes(activeTab) && canEditContent && <CmsContentPanel kind={activeTab as 'blog'|'changelog'|'faqs'} posts={blogPosts} releases={changelogs} faqs={faqs} onChange={reloadContent}/>}
        {/* 6. DELETIONS TAB */}
        {activeTab === "deletions" && canManageRequests && (
          <div className="space-y-6 max-w-6xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Account requests.
              </h1>
              <p className="text-xs text-slate-500">
                Review incoming account deletion requests and their status.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-3">User Name</th>
                    <th className="px-4 py-3">Account Identifier</th>
                    <th className="px-4 py-3">Contact</th>
                    <th className="px-4 py-3">Reason</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {deletions.length===0 && <tr><td colSpan={6}><div className="workspace-empty"><Trash2 size={24}/><h4>No deletion requests</h4><p>Incoming requests will appear here for review.</p></div></td></tr>}
                  {deletions.map((del) => (
                    <tr key={del.id}>
                      <td className="px-4 py-3 font-semibold text-slate-900">{del.name}</td>
                      <td className="px-4 py-3 font-mono">{del.account_identifier}</td>
                      <td className="px-4 py-3">{del.email_or_phone}</td>
                      <td className="px-4 py-3 text-slate-500">{del.reason || "N/A"}</td>
                      <td className="px-4 py-3">
                        <CustomSelect aria-label={`Status for ${del.name}`} value={del.status} disabled={updatingId === del.id} onChange={async e => {
                          const status = e.target.value as AccountDeletionRequest['status']; setUpdatingId(del.id); setDataError('');
                          try { await updateAccountDeletionStatus(del.id, status); setDeletions(rows => rows.map(row => row.id === del.id ? { ...row, status } : row)); }
                          catch (error) { setDataError(error instanceof Error ? error.message : 'Could not update request.'); }
                          finally { setUpdatingId(''); }
                        }}>{['pending','verified','completed','rejected'].map(status => <option key={status} value={status}>{status}</option>)}</CustomSelect>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-400">
                        {formatDate(del.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 7. SETTINGS & SEO TAB */}
        {activeTab === "settings" && siteSettings && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                The details behind DAD.
              </h1>
              <p className="text-xs text-slate-500">
                Configured ecosystem communication emails and canonical domains.
              </p>
            </div>

            <SampleVideoSettings canEdit={userRole === "super_admin"} />

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-sm text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Site Title</label>
                  <input
                    type="text"
                    disabled
                    value={siteSettings.site_name}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Primary Domain</label>
                  <input
                    type="text"
                    disabled
                    value={siteSettings.primary_domain}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Support Email</label>
                  <input
                    type="text"
                    disabled
                    value={siteSettings.support_email}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Partnerships</label>
                  <input
                    type="text"
                    disabled
                    value={siteSettings.partnerships_email}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Investor Email</label>
                  <input
                    type="text"
                    disabled
                    value={siteSettings.investor_email}
                    className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">DAD Report Live URL</label>
                <input
                  type="text"
                  disabled
                  value={siteSettings.dad_report_url}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                />
              </div>

              <p className="text-[11px] text-slate-400 pt-2">
                These values are managed in the website configuration and are read-only here.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

