"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";
import type { Subject } from "@/lib/kpss/types";

export function QuestionViewTracker({
  questionId,
  subject,
  slug,
}: {
  questionId: string;
  subject: Subject;
  slug: string;
}) {
  useEffect(() => {
    track("question_view", { question_id: questionId, subject, slug });
  }, [questionId, subject, slug]);

  return null;
}
