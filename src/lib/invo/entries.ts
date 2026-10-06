import { SITE_URL } from "../site.ts";
import { blogIndexPath, blogPostPath, landingPath, LOCALES } from "./locales.ts";
import { publishedPosts, type InvoPost } from "./posts.ts";

export type InvoSitemapEntry = {
  url: string;
  lastModified: Date;
  changeFrequency: "weekly" | "monthly";
  priority: number;
};

/** Unpublished posts are omitted. pt has a landing and no blog. */
export function invoSitemapEntries(lastModified: Date): InvoSitemapEntry[] {
  const entries: InvoSitemapEntry[] = [];
  for (const locale of LOCALES) {
    entries.push({
      url: `${SITE_URL}${landingPath(locale)}`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    });
    if (!locale.blog) continue;
    entries.push({
      url: `${SITE_URL}${blogIndexPath(locale)}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.4,
    });
    for (const post of publishedPosts(locale.id)) {
      const url = sitemapUrlForPost(locale, post);
      if (!url) continue;
      entries.push({
        url,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }
  return entries;
}

export function sitemapUrlForPost(
  locale: { blog: boolean; prefix: string },
  post: Pick<InvoPost, "published" | "slug">,
): string | null {
  if (!locale.blog || !post.published) return null;
  return `${SITE_URL}${blogPostPath(locale, post.slug)}`;
}
