import type { Metadata } from "next";
import {
  blogFeedPath,
  blogIndexPath,
  blogPostPath,
  landingPath,
  localeById,
  LOCALES,
  type InvoLocale,
} from "./locales.ts";
import { publishedPost, type InvoPost } from "./posts.ts";
import { CHROME, PT_STORE } from "./landing.ts";
import { readStore } from "./store.ts";

function languagesFor(pathFor: (locale: InvoLocale) => string | null): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of LOCALES) {
    const href = pathFor(locale);
    if (href) languages[locale.htmlLang] = href;
  }
  const fallback = pathFor(localeById("en"));
  if (fallback) languages["x-default"] = fallback;
  return languages;
}

export function landingMetadata(locale: InvoLocale): Metadata {
  const canonical = landingPath(locale);
  const languages = languagesFor((item) => landingPath(item));
  if (!locale.storeDir || !locale.titleLead) {
    return {
      title: CHROME.pt.headline,
      description: PT_STORE.subtitle,
      alternates: { canonical, languages },
    };
  }
  const store = readStore(locale.storeDir);
  return {
    title: `${locale.titleLead} | ${store.name}`,
    description: store.promo,
    alternates: { canonical, languages },
  };
}

export function blogIndexMetadata(locale: InvoLocale): Metadata {
  if (!locale.storeDir || !locale.blog) throw new Error(`${locale.id} has no blog`);
  const store = readStore(locale.storeDir);
  return {
    title: store.subtitle,
    description: store.opening[0],
    alternates: {
      canonical: blogIndexPath(locale),
      languages: languagesFor((item) => (item.blog ? blogIndexPath(item) : null)),
      types: { "application/rss+xml": blogFeedPath(locale) },
    },
  };
}

export function blogPostMetadata(locale: InvoLocale, post: InvoPost): Metadata {
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      locale: locale.htmlLang,
      url: blogPostPath(locale, post.slug),
    },
    alternates: {
      canonical: blogPostPath(locale, post.slug),
      languages: languagesFor((item) => {
        if (!item.blog) return null;
        return publishedPost(item.id, post.slug) ? blogPostPath(item, post.slug) : null;
      }),
    },
  };
}
