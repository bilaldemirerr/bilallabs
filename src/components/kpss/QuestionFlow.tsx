"use client";

import { useState, type ReactNode } from "react";
import { NextQuestionNav } from "@/components/kpss/NextQuestionNav";
import { QuestionPractice } from "@/components/kpss/QuestionPractice";
import type { Question } from "@/lib/kpss/types";

type Props = {
  question: Question;
  solutionId: string;
  children: ReactNode;
};

export function QuestionFlow({ question, solutionId, children }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <NextQuestionNav
        currentQuestionId={question.id}
        refreshKey={refreshKey}
      />
      <QuestionPractice
        question={question}
        solutionId={solutionId}
        onAnswered={() => setRefreshKey((k) => k + 1)}
      />
      {children}
      <NextQuestionNav
        currentQuestionId={question.id}
        refreshKey={refreshKey}
      />
    </>
  );
}
