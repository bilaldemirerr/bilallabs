import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { markdownToHtml, readAppMarkdown } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Terms of Use | Lovely",
  description: "Lovely Terms of Use — Bilal Labs",
};

export default function LovelyTermsPage() {
  const html = markdownToHtml(readAppMarkdown("lovely", "terms"));
  return (
    <LegalDocument
      appName="Lovely"
      appSlug="lovely"
      title="Terms of Use"
      html={html}
      sibling={{ href: "/lovely/privacy", label: "Privacy Policy" }}
    />
  );
}
