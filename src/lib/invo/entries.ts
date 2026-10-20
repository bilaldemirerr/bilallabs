import { SITE_URL } from "../site.ts";
import { blogIndexPath, blogPostPath, landingPath, LOCALES, type InvoLocale } from "./locales.ts";
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

function xml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function blogFeedXml(locale: InvoLocale): string {
  const items = publishedPosts(locale.id)
    .map((post) => {
      const url = `${SITE_URL}${blogPostPath(locale, post.slug)}`;
      return `<item><title>${xml(post.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(post.date).toUTCString()}</pubDate><description>${xml(post.description)}</description></item>`;
    })
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Invo Blog</title><link>${SITE_URL}${blogIndexPath(locale)}</link><description>Invo</description><language>${locale.htmlLang}</language>${items}</channel></rss>`;
}
