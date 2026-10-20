import { localeById } from "@/lib/invo/locales";
import { ogSize, postOgImage } from "@/lib/invo/og";
import { publishedPosts } from "@/lib/invo/posts";

export const alt = "Invo Blog";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return publishedPosts("en").map((post) => ({ slug: post.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  return postOgImage(localeById("en"), (await params).slug);
}
