/**
 * Locales are the keys in Invo/Invo/Resources/Localizable.xcstrings.
 * en-GB, en-AU, and es-MX are not separate site locales.
 */
export const LOCALES = [
  {
    id: "en",
    htmlLang: "en",
    prefix: "",
    contentDir: "en",
    imageDir: "en",
    storeDir: "en-US",
    descriptionMd: "aso/metadata/en-US/description.md",
    blog: true,
    titleLead: "construction estimate app",
    emptyBlog: "The first article is on the way.",
  },
  {
    id: "de",
    htmlLang: "de",
    prefix: "de",
    contentDir: "de",
    imageDir: "de",
    storeDir: "de-DE",
    descriptionMd: "aso/metadata/de-DE/description.md",
    blog: true,
    titleLead: "Kostenvoranschläge und Rechnungen",
    emptyBlog: "Der erste Artikel folgt.",
  },
  {
    id: "es",
    htmlLang: "es",
    prefix: "es",
    contentDir: "es",
    imageDir: "es",
    storeDir: "es-ES",
    descriptionMd: "aso/metadata/es-ES/description.md",
    blog: true,
    titleLead: "presupuestos y facturas",
    emptyBlog: "El primer artículo está en camino.",
  },
  {
    id: "fr",
    htmlLang: "fr",
    prefix: "fr",
    contentDir: "fr",
    imageDir: "fr",
    storeDir: "fr-FR",
    descriptionMd: "aso/metadata/fr-FR/description.md",
    blog: true,
    titleLead: "Devis, offres et factures",
    emptyBlog: "Le premier article arrive.",
  },
  {
    id: "pt-BR",
    htmlLang: "pt-BR",
    prefix: "pt-br",
    contentDir: "pt-BR",
    imageDir: "pt-BR",
    storeDir: "pt-BR",
    descriptionMd: "aso/metadata/pt-BR/description.md",
    blog: true,
    titleLead: "orçamentos e faturas",
    emptyBlog: "O primeiro artigo está a caminho.",
  },
  {
    id: "tr",
    htmlLang: "tr",
    prefix: "tr",
    contentDir: "tr",
    imageDir: "tr",
    storeDir: "tr",
    descriptionMd: "aso/metadata/tr/description.md",
    blog: true,
    titleLead: "tahmin, teklif ve fatura",
    emptyBlog: "İlk yazı yolda.",
  },
  {
    id: "pt",
    htmlLang: "pt",
    prefix: "pt",
    contentDir: null,
    imageDir: null,
    storeDir: null,
    descriptionMd: null,
    blog: false,
    titleLead: null,
    emptyBlog: null,
  },
] as const;

export type InvoLocale = (typeof LOCALES)[number];
export type LocaleId = InvoLocale["id"];

export const APP_STORE_URL = "https://apps.apple.com/us/app/id6740983516";
/** fastlane/metadata/en-US/privacy_url.txt */
export const PRIVACY_URL = "https://const-terms.vercel.app/privacy";
/** Terms URL printed in every description.md. fastlane has no separate terms file. */
export const TERMS_URL = "https://const-terms.vercel.app";
/** fastlane/metadata/en-US/support_url.txt */
export const SUPPORT_URL = "https://const-terms.vercel.app";

export const SHOT_FILES = [
  "01-estimates-invoices.png",
  "02-job-types.png",
  "03-professional-quote.png",
  "04-branded-logo.png",
  "05-reports.png",
] as const;

/** Bullet indexes aligned to SHOT_FILES. Same order in every description.md. */
export const SHOT_BULLET_INDEX = [0, 1, 2, 4, 6] as const;

export function localeById(id: string): InvoLocale {
  const locale = LOCALES.find((item) => item.id === id);
  if (!locale) throw new Error(`unknown invo locale ${id}`);
  return locale;
}

export function localeByPrefix(prefix: string): InvoLocale | undefined {
  return LOCALES.find((item) => item.prefix === prefix);
}

export function landingPath(locale: { prefix: string }): string {
  return locale.prefix ? `/${locale.prefix}/invo` : "/invo";
}

export function blogIndexPath(locale: { prefix: string }): string {
  return `${landingPath(locale)}/blog`;
}

export function blogPostPath(locale: { prefix: string }, slug: string): string {
  return `${blogIndexPath(locale)}/${slug}`;
}
