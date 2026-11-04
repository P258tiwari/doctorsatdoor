import type { BlogPost } from "@/types";

const normalize = (value: string) => value.trim().toLowerCase();

export function getRelatedPosts(post: BlogPost, posts: BlogPost[], limit = 3): BlogPost[] {
  const tags = new Set((post.tags ?? []).map(normalize).filter(Boolean));
  const category = normalize(post.category_slug || post.category || "");
  const seen = new Set<string>();

  return posts
    .filter((candidate) => {
      if (!candidate.is_published || candidate.id === post.id || candidate.slug === post.slug || seen.has(candidate.slug)) return false;
      seen.add(candidate.slug);
      return true;
    })
    .map((candidate) => {
      const sameCategory = category !== "" && normalize(candidate.category_slug || candidate.category || "") === category;
      const sharedTags = new Set((candidate.tags ?? []).map(normalize).filter((tag) => tags.has(tag))).size;
      return { post: candidate, score: (sameCategory ? 10 : 0) + sharedTags };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || b.post.published_at.localeCompare(a.post.published_at))
    .slice(0, Math.max(0, limit))
    .map(({ post: related }) => related);
}
