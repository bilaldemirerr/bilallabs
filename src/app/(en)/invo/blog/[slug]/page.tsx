import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvoBlogPost } from "@/components/invo/InvoScreens";
import { localeById } from "@/lib/invo/locales";
import { blogPostMetadata } from "@/lib/invo/meta";
import { publishedPost, publishedPosts } from "@/lib/invo/posts";

const locale = localeById("en");

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts(locale.id).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = publishedPost(locale.id, slug);
  if (!post) return {};
  return blogPostMetadata(locale, post);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = publishedPost(locale.id, slug);
  if (!post) notFound();
  return <InvoBlogPost locale={locale} post={post} />;
}
