"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { track } from "@/lib/analytics";

type Props = ComponentProps<typeof Link> & {
  questionId: string;
  slug: string;
};

export function PracticeCtaLink({
  questionId,
  slug,
  onClick,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      onClick={(event) => {
        track("cta_practice", { question_id: questionId, slug });
        onClick?.(event);
      }}
    />
  );
}
