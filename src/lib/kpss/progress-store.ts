import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import type { QuestionProgress } from "./types";
import { PROGRESS_SCHEMA_VERSION } from "./types";
import { getFirebaseDb } from "@/lib/firebase/client";

const LOCAL_KEY = "kpss-progress";

function localKey(uid: string) {
  return `${LOCAL_KEY}:${uid}`;
}

/**
 * Şema sürümlenmiş: v1 kayıtlarında hız sinyali yoktu, kutu ve tekrar zamanı
 * korunup eksik alanlar dolduruluyor. Tanınmayan kayıt atılır, silinmez.
 */
export function migrateProgress(raw: unknown): QuestionProgress | null {
  if (typeof raw !== "object" || raw === null) return null;
  const value = raw as Partial<QuestionProgress>;
  if (typeof value.questionId !== "string") return null;

  return {
    questionId: value.questionId,
    version: PROGRESS_SCHEMA_VERSION,
    box: typeof value.box === "number" ? value.box : 1,
    lastReviewed: typeof value.lastReviewed === "number" ? value.lastReviewed : 0,
    nextReview: typeof value.nextReview === "number" ? value.nextReview : 0,
    timesSeen: typeof value.timesSeen === "number" ? value.timesSeen : 0,
    slowCount: typeof value.slowCount === "number" ? value.slowCount : 0,
    speedFlag: value.speedFlag === true,
    lastCorrect: value.lastCorrect,
    lastPace: value.lastPace,
  };
}

function parseMap(raw: string | null): Record<string, QuestionProgress> {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const map: Record<string, QuestionProgress> = {};
    for (const [id, value] of Object.entries(parsed)) {
      const migrated = migrateProgress(value);
      if (migrated) map[id] = migrated;
    }
    return map;
  } catch {
    return {};
  }
}

export async function loadProgress(
  uid: string,
): Promise<Record<string, QuestionProgress>> {
  const db = getFirebaseDb();

  if (db) {
    try {
      const snap = await getDocs(collection(db, "users", uid, "progress"));
      const map: Record<string, QuestionProgress> = {};
      snap.forEach((d) => {
        const migrated = migrateProgress(d.data());
        if (migrated) map[d.id] = migrated;
      });
      if (Object.keys(map).length > 0) {
        localStorage.setItem(localKey(uid), JSON.stringify(map));
        return map;
      }
    } catch {
      // Firestore erişilemezse localStorage'a düş
    }
  }

  if (typeof window === "undefined") return {};
  return parseMap(localStorage.getItem(localKey(uid)));
}

export async function saveProgress(
  uid: string,
  questionId: string,
  progress: QuestionProgress,
): Promise<void> {
  const db = getFirebaseDb();

  if (typeof window !== "undefined") {
    const existing = parseMap(localStorage.getItem(localKey(uid)));
    existing[questionId] = progress;
    localStorage.setItem(localKey(uid), JSON.stringify(existing));
  }

  if (db) {
    try {
      await setDoc(doc(db, "users", uid, "progress", questionId), progress);
    } catch {
      // localStorage yeterli
    }
  }
}
