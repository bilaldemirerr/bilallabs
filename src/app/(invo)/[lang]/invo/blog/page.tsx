import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvoBlogIndex } from "@/components/invo/InvoScreens";
import { localeByPrefix } from "@/lib/invo/locales";
import { blogIndexMetadata } from "@/lib/invo/meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = localeByPrefix(lang);
  if (!locale?.blog) return {};
  return blogIndexMetadata(locale);
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = localeByPrefix(lang);
  if (!locale?.blog) notFound();
  return <InvoBlogIndex locale={locale} />;
}
