"use client";

import { clearProgress } from "./progress-store";
import { resetPracticeQueue } from "./practice-queue";
import { resetSession } from "./session";

/** Tüm KPSS ilerlemesini sıfırlar — soru kutuları, oturum, yanlış kuyruğu. */
export async function resetAllKpssProgress(uid: string): Promise<void> {
  resetSession();
  resetPracticeQueue();
  await clearProgress(uid);
}
