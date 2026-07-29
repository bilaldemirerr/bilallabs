import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { markdownToHtml, readAppMarkdown } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Terms and Conditions | Shotly",
  description: "Shotly Terms and Conditions — Bilal Labs",
};

export default function ShotlyTermsPage() {
  const html = markdownToHtml(readAppMarkdown("shotly", "terms"));
  return (
    <LegalDocument
      appName="Shotly"
      appSlug="shotly"
      title="Terms and Conditions"
      html={html}
      sibling={{ href: "/shotly/privacy", label: "Privacy Policy" }}
    />
  );
}
