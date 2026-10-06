import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvoBlogPost } from "@/components/invo/InvoScreens";
import { LOCALES, localeByPrefix } from "@/lib/invo/locales";
import { blogPostMetadata } from "@/lib/invo/meta";
import { publishedPost, publishedPosts } from "@/lib/invo/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return LOCALES.filter((locale) => locale.blog && locale.prefix !== "").flatMap((locale) =>
    publishedPosts(locale.id).map((post) => ({ lang: locale.prefix, slug: post.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = localeByPrefix(lang);
  if (!locale?.blog) return {};
  const post = publishedPost(locale.id, slug);
  if (!post) return {};
  return blogPostMetadata(locale, post);
}

export default async function Page({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const locale = localeByPrefix(lang);
  if (!locale?.blog) notFound();
  const post = publishedPost(locale.id, slug);
  if (!post) notFound();
  return <InvoBlogPost locale={locale} post={post} />;
}
