import { blogFeedXml } from "@/lib/invo/entries";
import { localeById } from "@/lib/invo/locales";

export const dynamic = "force-static";

export function GET() {
  return new Response(blogFeedXml(localeById("en")), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
