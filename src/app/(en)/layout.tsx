import type { Metadata } from "next";
import { Analytics } from "@/components/analytics/Analytics";
import { fontClassName } from "../fonts";
import { SITE_URL, siteVerification } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Bilal Labs",
    template: "%s | Bilal Labs",
  },
  description: "Apps and legal documents from Bilal Labs",
  ...siteVerification(),
};

export default function EnRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fontClassName}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
