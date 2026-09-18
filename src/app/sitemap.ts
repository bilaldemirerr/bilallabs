import type { MetadataRoute } from "next";
import { APPS } from "@/lib/apps";
import { SITE_URL } from "@/lib/site";
import { QUESTIONS } from "@/lib/kpss/questions";
import { ALL_SLUGS } from "@/lib/kpss/slug";
import {
  LEVEL_BASE,
  questionPath,
  subjectPath,
  topicPath,
} from "@/lib/kpss/paths";
import { SUBJECTS, TOPICS } from "@/lib/kpss/types";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const legal = APPS.filter((app) => !app.slug.startsWith("kpss")).flatMap((app) => [
    { url: `${SITE_URL}/${app.slug}`, lastModified, priority: 0.3 },
    { url: `${SITE_URL}/${app.slug}/privacy`, lastModified, priority: 0.2 },
    { url: `${SITE_URL}/${app.slug}/terms`, lastModified, priority: 0.2 },
  ]);

  // Sorusu olmayan konu sayfası ince içerik; havuz dolana kadar sitemap dışında.
  const topics = SUBJECTS.flatMap((subject) =>
    Object.keys(TOPICS[subject])
      .filter((topic) =>
        QUESTIONS.some((q) => q.subject === subject && q.topic === topic),
      )
      .map((topic) => ({
        url: `${SITE_URL}${topicPath(subject, topic)}`,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
  );

  return [
    { url: SITE_URL, lastModified, priority: 0.5 },
    {
      url: `${SITE_URL}${LEVEL_BASE}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...SUBJECTS.map((subject) => ({
      url: `${SITE_URL}${subjectPath(subject)}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...topics,
    ...ALL_SLUGS.map((slug) => ({
      url: `${SITE_URL}${questionPath(slug)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...legal,
  ];
}
