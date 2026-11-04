import { supabase } from '@/lib/supabase/client';
export type TaxonomyKind = 'categories' | 'authors' | 'tags' | 'apps';
export type TaxonomyItem = { id: string; name: string; slug?: string; role?: string; bio?: string; avatar_url?: string; logo_url?: string; is_default?: boolean; count?: number };
export const tables = { categories: 'blog_categories', authors: 'blog_authors', tags: 'blog_tags', apps: 'release_apps' };
export function db() { if (!supabase) throw new Error('Database is not configured. Please contact the site administrator.'); return supabase; }
export async function editorUser() {
  const client = db(); const { data, error } = await client.auth.getUser();
  if (error || !data.user) return null;
  const r = await client.from('admin_users').select('role').eq('auth_user_id', data.user.id).single();
  if (r.error) throw r.error;
  return ['super_admin', 'content_admin'].includes(r.data.role) ? data.user : null;
}
export async function taxonomy(kind: TaxonomyKind): Promise<TaxonomyItem[]> {
  const client = db(); const r = await client.from(tables[kind]).select('*').order('name'); if (r.error) throw r.error;
  const key = { categories: 'category_id', authors: 'author_id', tags: 'tag_id', apps: 'app_id' }[kind];
  const counts = await client.from(kind === 'tags' ? 'blog_post_tags' : kind === 'apps' ? 'changelog_entries' : 'blog_posts').select(key);
  if (counts.error) throw counts.error;
  const rows = counts.data as unknown as Record<string, string>[];
  return (r.data as TaxonomyItem[]).map(item => ({ ...item, count: rows.filter(row => row[key] === item.id).length }));
}
export async function saveTaxonomyItem(kind: TaxonomyKind, item: Partial<TaxonomyItem>): Promise<TaxonomyItem> {
  const name = item.name?.trim(); if (!name) throw new Error('Please enter a name.');
  // Only send actual columns. Keep protected default flags unchanged on edits.
  const row: Record<string, string> = kind === 'authors' ? { name, role: item.role?.trim() || 'DAD Editorial Team', bio: (item.bio || '').slice(0, 180), avatar_url: item.avatar_url || '' }
    : kind === 'apps' ? { name, logo_url: item.logo_url || '' } : { name, slug: slugOf(name) };
  const q = item.id ? db().from(tables[kind]).update(row).eq('id', item.id) : db().from(tables[kind]).insert(row);
  const r = await q.select('*').single(); if (r.error) throw r.error; return r.data as TaxonomyItem;
}
export async function deleteTaxonomyItem(kind: TaxonomyKind, id: string): Promise<void> {
  const r = await db().from(tables[kind]).delete().eq('id', id).select('id').single(); if (r.error) throw r.error;
}
export function slugOf(text: string) { return text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
export async function uploadMedia(file: File, square = false): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) throw new Error('Choose a JPG, PNG, WebP or GIF image.');
  if (file.size > 10 * 1024 * 1024) throw new Error('Please choose an image under 10 MB.');
  let blob: Blob = file;
  if (square) {
    const bitmap = await createImageBitmap(file); const size = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = Math.min(size, 800);
    const ctx = canvas.getContext('2d'); if (!ctx) throw new Error('Image processing is unavailable.');
    ctx.drawImage(bitmap, (bitmap.width - size) / 2, (bitmap.height - size) / 2, size, size, 0, 0, canvas.width, canvas.height); bitmap.close();
    const converted = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/webp', 0.9)); if (!converted) throw new Error('Could not process this image.'); blob = converted;
  }
  const path = `${crypto.randomUUID()}.${square ? 'webp' : file.type.split('/')[1]}`;
  const r = await db().storage.from('cms-media').upload(path, blob, { contentType: blob.type, upsert: false }); if (r.error) throw r.error;
  return db().storage.from('cms-media').getPublicUrl(path).data.publicUrl;
}
const VIDEO_BUCKET = 'site-videos';
// Uploads first and saves the setting second, so a failure never leaves the page pointing at a missing file.
export async function uploadSampleVideo(file: File, previousUrl?: string) {
  if (!['video/mp4', 'video/webm'].includes(file.type)) throw new Error('Choose an MP4 or WebM video.');
  if (file.size > 50 * 1024 * 1024) throw new Error('Please choose a video under 50 MB.');
  const storage = db().storage.from(VIDEO_BUCKET);
  const path = `${crypto.randomUUID()}.${file.type.split('/')[1]}`;
  const uploaded = await storage.upload(path, file, { contentType: file.type, cacheControl: '31536000', upsert: false }); if (uploaded.error) throw uploaded.error;
  const video = { url: storage.getPublicUrl(path).data.publicUrl, name: file.name };
  const saved = await db().from('site_settings').upsert({ key: 'sample_video', value: video, updated_at: new Date().toISOString() });
  if (saved.error) { await storage.remove([path]); throw saved.error; }
  const marker = `/${VIDEO_BUCKET}/`;
  if (previousUrl?.includes(marker)) await storage.remove([previousUrl.split(marker)[1]]);
  return video;
}
export function errorText(e: unknown): string { return e instanceof Error ? e.message : typeof e === 'object' && e && 'message' in e ? String((e as { message: unknown }).message) : 'Something went wrong. Please try again.'; }
