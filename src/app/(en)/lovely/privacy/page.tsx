import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { markdownToHtml, readAppMarkdown } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Privacy Policy | Lovely",
  description: "Lovely Privacy Policy — Bilal Labs",
};

export default function LovelyPrivacyPage() {
  const html = markdownToHtml(readAppMarkdown("lovely", "privacy"));
  return (
    <LegalDocument
      appName="Lovely"
      appSlug="lovely"
      title="Privacy Policy"
      html={html}
      sibling={{ href: "/lovely/terms", label: "Terms of Use" }}
    />
  );
}
