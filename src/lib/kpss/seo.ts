import { SITE_URL } from "@/lib/site";

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_URL}${crumb.path}`,
    })),
  };
}

/** JSON.stringify XSS'e karşı temizlemez; '<' kaçırılarak gömülür. */
export function jsonLdHtml(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
