import { supabase } from './client';
import { DEFAULT_CHANGELOG, DEFAULT_BLOG_POSTS, DEFAULT_FAQS, DEFAULT_SITE_SETTINGS } from './mock-data';
import { db } from '@/lib/cms/client';
import type { ChangelogEntry, BlogPost, FAQItem, LeadInquiry, AccountDeletionRequest, SiteSettings, LeadStatus } from '@/types';

export async function getChangelog(): Promise<ChangelogEntry[]> {
  if (!supabase) return DEFAULT_CHANGELOG;
  const r = await supabase.from('changelog_entries').select('*, app:release_apps(id,name,logo_url)').order('release_date', { ascending: false });
  if (r.error) throw r.error; return r.data as ChangelogEntry[];
}
export async function saveChangelogEntry(entry: ChangelogEntry): Promise<void> {
  const row = Object.fromEntries(Object.entries(entry).filter(([key]) => key !== 'app'));
  const r = await db().from('changelog_entries').upsert(row).select('id').single(); if (r.error) throw r.error;
}
export async function deleteChangelogEntry(id: string): Promise<void> {
  const r = await db().from('changelog_entries').delete().eq('id', id).select('id').single(); if (r.error) throw r.error;
}

type BlogRow = Omit<BlogPost, 'category' | 'category_slug' | 'author'> & {
  category: { name: string; slug: string } | null; author: BlogPost['author'] | null;
  tag_links: { tag: { name: string } | null }[];
};
const blogSelect = '*, category:blog_categories(name,slug), author:blog_authors(id,name,role,avatar_url,bio), tag_links:blog_post_tags(tag:blog_tags(name))';
function mapBlogRow(row: BlogRow): BlogPost {
  const { tag_links, ...post } = row;
  return { ...post, category: row.category?.name || 'DAD General', category_slug: row.category?.slug || 'dad-general', author: row.author || { id: '', name: 'Doctors At Door', role: 'DAD Editorial Team' }, tags: (tag_links || []).flatMap(link => link.tag ? [link.tag.name] : []) };
}
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!supabase) return DEFAULT_BLOG_POSTS.filter(p => p.is_published);
  // Admin RLS can see drafts, so public reads must also explicitly filter scheduling.
  const r = await supabase.from('blog_posts').select(blogSelect).eq('is_published', true).in('publication_status', ['published', 'scheduled']).lte('publish_at', 'now').order('published_at', { ascending: false });
  if (r.error) throw r.error; return (r.data as unknown as BlogRow[]).map(mapBlogRow);
}
export async function getAllBlogPostsAdmin(): Promise<BlogPost[]> {
  const r = await db().from('blog_posts').select(blogSelect).order('published_at', { ascending: false });
  if (r.error) throw r.error; return (r.data as unknown as BlogRow[]).map(mapBlogRow);
}
export async function deleteBlogPost(id: string): Promise<void> {
  const r = await db().from('blog_posts').delete().eq('id', id).select('id').single(); if (r.error) throw r.error;
}
export async function getFAQs(): Promise<FAQItem[]> {
  if (!supabase) return DEFAULT_FAQS;
  const r = await supabase.from('faqs').select('*').order('order_index'); if (r.error) throw r.error; return r.data as FAQItem[];
}
export async function saveFaq(faq: FAQItem): Promise<void> {
  const r = await db().from('faqs').upsert(faq).select('id').single(); if (r.error) throw r.error;
}
export async function deleteFaq(id: string): Promise<void> {
  const r = await db().from('faqs').delete().eq('id', id).select('id').single(); if (r.error) throw r.error;
}

export async function getLeads(): Promise<LeadInquiry[]> {
  const r = await db().from('lead_inquiries').select('*').order('created_at', { ascending: false }); if (r.error) throw r.error; return r.data as LeadInquiry[];
}
export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  const r = await db().from('lead_inquiries').update({ status }).eq('id', id).select('id').single(); if (r.error) throw r.error;
}
export async function getAccountDeletionRequests(): Promise<AccountDeletionRequest[]> {
  const r = await db().from('account_deletion_requests').select('*').order('created_at', { ascending: false }); if (r.error) throw r.error; return r.data as AccountDeletionRequest[];
}
export async function updateAccountDeletionStatus(id: string, status: AccountDeletionRequest['status']): Promise<void> {
  const r = await db().from('account_deletion_requests').update({ status }).eq('id', id).select('id').single(); if (r.error) throw r.error;
}
export type SampleVideo = { url: string; name: string };
const DEFAULT_SAMPLE_VIDEO: SampleVideo = { url: '/videos/dad-demo-video.mp4', name: 'DAD Demo Video.mp4' };
export async function getSampleVideo(): Promise<SampleVideo> {
  if (!supabase) return DEFAULT_SAMPLE_VIDEO;
  const r = await supabase.from('site_settings').select('value').eq('key', 'sample_video').maybeSingle();
  if (r.error) throw r.error;
  return r.data?.value?.url ? r.data.value as SampleVideo : DEFAULT_SAMPLE_VIDEO;
}
export async function getSiteSettings(): Promise<SiteSettings> { return DEFAULT_SITE_SETTINGS; }
