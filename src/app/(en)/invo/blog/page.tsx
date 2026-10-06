import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InvoBlogIndex } from "@/components/invo/InvoScreens";
import { localeById } from "@/lib/invo/locales";
import { blogIndexMetadata } from "@/lib/invo/meta";

const locale = localeById("en");

export function generateMetadata(): Metadata {
  return blogIndexMetadata(locale);
}

export default function Page() {
  if (!locale.blog) notFound();
  return <InvoBlogIndex locale={locale} />;
}
