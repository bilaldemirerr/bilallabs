import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvoLanding } from "@/components/invo/InvoScreens";
import { localeByPrefix } from "@/lib/invo/locales";
import { landingMetadata } from "@/lib/invo/meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = localeByPrefix(lang);
  if (!locale) return {};
  return landingMetadata(locale);
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = localeByPrefix(lang);
  if (!locale) notFound();
  return <InvoLanding locale={locale} />;
}
