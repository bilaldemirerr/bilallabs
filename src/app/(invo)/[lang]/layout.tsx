import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Analytics } from "@/components/analytics/Analytics";
import { fontClassName } from "../../fonts";
import { LOCALES, localeByPrefix } from "@/lib/invo/locales";
import { SITE_URL, siteVerification } from "@/lib/site";
import "../../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.prefix !== "").map((locale) => ({ lang: locale.prefix }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bilal Labs",
    template: "%s | Bilal Labs",
  },
  ...siteVerification(),
};

export default async function InvoLocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = localeByPrefix(lang);
  if (!locale) notFound();
  return (
    <html lang={locale.htmlLang} className={fontClassName}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
