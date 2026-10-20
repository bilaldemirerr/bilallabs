import { blogFeedXml } from "@/lib/invo/entries";
import { LOCALES, localeByPrefix } from "@/lib/invo/locales";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.blog && locale.prefix !== "").map((locale) => ({ lang: locale.prefix }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string }> }) {
  const locale = localeByPrefix((await params).lang);
  if (!locale?.blog) return new Response("Not found", { status: 404 });
  return new Response(blogFeedXml(locale), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
