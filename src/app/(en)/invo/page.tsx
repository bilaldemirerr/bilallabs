import type { Metadata } from "next";
import { InvoLanding } from "@/components/invo/InvoScreens";
import { localeById } from "@/lib/invo/locales";
import { landingMetadata } from "@/lib/invo/meta";

const locale = localeById("en");

export function generateMetadata(): Metadata {
  return landingMetadata(locale);
}

export default function Page() {
  return <InvoLanding locale={locale} />;
}
