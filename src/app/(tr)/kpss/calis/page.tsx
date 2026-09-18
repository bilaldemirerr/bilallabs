import type { Metadata } from "next";
import { PracticeClient } from "@/components/kpss/PracticeClient";

export const metadata: Metadata = {
  title: "Soru Çöz",
  description: "KPSS Ortaöğretim soru çözüm oturumu",
  robots: { index: false },
};

export default function KpssPracticePage() {
  return <PracticeClient />;
}
