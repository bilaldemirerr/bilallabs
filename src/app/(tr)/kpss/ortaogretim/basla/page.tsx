import type { Metadata } from "next";
import { StartPracticeRedirect } from "@/components/kpss/StartPracticeRedirect";

export const metadata: Metadata = {
  title: "Soru Çöz",
  robots: { index: false },
};

export default function BaslaPage() {
  return <StartPracticeRedirect />;
}
