"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/kpss/AuthProvider";
import { startPath } from "@/lib/kpss/paths";
import { resetAllKpssProgress } from "@/lib/kpss/reset-progress";
import styles from "./ResumeCard.module.css";

export function ResetProgressButton() {
  const router = useRouter();
  const { uid, loading } = useAuth();
  const [busy, setBusy] = useState(false);

  async function handleReset() {
    if (
      !window.confirm(
        "Tüm ilerlemen silinecek: cevaplar, tekrar sırası ve oturum istatistikleri. Emin misin?",
      )
    ) {
      return;
    }

    setBusy(true);
    try {
      await resetAllKpssProgress(uid);
      router.push(startPath());
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (loading) return null;

  return (
    <button
      type="button"
      className={styles.resetBtn}
      onClick={handleReset}
      disabled={busy}
    >
      {busy ? "Sıfırlanıyor…" : "İlerlemeyi sıfırla"}
    </button>
  );
}
