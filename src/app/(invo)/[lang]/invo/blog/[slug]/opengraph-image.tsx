import { notFound } from "next/navigation";
import { localeByPrefix } from "@/lib/invo/locales";
import { ogSize, postOgImage } from "@/lib/invo/og";

export const alt = "Invo Blog";
export const size = ogSize;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const locale = localeByPrefix(lang);
  if (!locale?.blog) notFound();
  return postOgImage(locale, slug);
}
