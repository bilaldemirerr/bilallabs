import type { Metadata } from "next";
import { Analytics } from "@/components/analytics/Analytics";
import { fontClassName } from "../fonts";
import { SITE_URL, siteVerification } from "@/lib/site";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "KPSS Ortaöğretim Soru Bankası",
    template: "%s | KPSS Ortaöğretim",
  },
  ...siteVerification(),
};

export default function TrRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={fontClassName}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
