import type { Metadata } from "next";
import LegalDocument from "@/components/LegalDocument";
import { markdownToHtml, readAppMarkdown } from "@/lib/markdown";

export const metadata: Metadata = {
  title: "Privacy Policy | Shotly",
  description: "Shotly Privacy Policy and Health Data Privacy Policy — Bilal Labs",
};

export default function ShotlyPrivacyPage() {
  const html = markdownToHtml(readAppMarkdown("shotly", "privacy"));
  return (
    <LegalDocument
      appName="Shotly"
      appSlug="shotly"
      title="Privacy Policy"
      html={html}
      sibling={{ href: "/shotly/terms", label: "Terms and Conditions" }}
    />
  );
}
