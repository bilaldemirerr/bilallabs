import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bilallabs.vercel.app";

export function siteVerification(): Pick<Metadata, "verification"> {
  const google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
  return google ? { verification: { google } } : {};
}
