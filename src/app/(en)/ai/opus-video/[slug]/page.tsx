import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/kpss/seo";
import { SITE_URL } from "@/lib/site";
import { COMPARE_SLUG, getRecipe, OPUS_VIDEO_BASE, RECIPES, REPO_URL, recipePath, videoJsonLd } from "@/lib/opus-video";
import styles from "../../subagents/subagents.module.css";
import v from "../opus-video.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return RECIPES.map((r) => ({ slug: r.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = getRecipe((await params).slug);
  if (!r) return {};
  const title = `${r.title} (Claude Opus 5.5 + ${r.framework})`;
  const video = r.videos[0];
  return {
    title,
    description: r.summary,
    alternates: { canonical: recipePath(r.slug) },
    openGraph: {
      type: "video.other",
      title,
      description: r.summary,
      url: recipePath(r.slug),
      images: [video.poster],
      videos: [{ url: video.src, width: video.width, height: video.height, type: "video/mp4" }],
    },
  };
}

export default async function RecipePage({ params }: Props) {
  const r = getRecipe((await params).slug);
  if (!r) notFound();

  const path = recipePath(r.slug);
  const crumbs = breadcrumbJsonLd([
    { name: "Bilal Labs", path: "/" },
    { name: "Videos with Claude Opus 5.5", path: OPUS_VIDEO_BASE },
    { name: r.title, path },
  ]);
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `${r.title} with Claude Opus 5.5`,
    description: r.summary,
    tool: [{ "@type": "HowToTool", name: "Claude Opus 5.5" }, { "@type": "HowToTool", name: r.framework }],
    step: r.steps.map((text, i) => ({ "@type": "HowToStep", position: i + 1, text })),
    video: videoJsonLd(r, r.videos[0], SITE_URL),
  };
  const videos = r.videos.map((video) => videoJsonLd(r, video, SITE_URL));
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: r.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const others = RECIPES.filter((o) => o.slug !== r.slug);

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml([crumbs, howTo, ...videos, faq])} />
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link> / <Link href={OPUS_VIDEO_BASE}>Videos with Claude Opus 5.5</Link>
      </p>
      <h1>{r.title}</h1>
      <p>{r.intro}</p>

      <div className={v.videos}>
        {r.videos.map((video) => (
          <figure key={video.src}>
            <video className={v.video} src={video.src} poster={video.poster} width={video.width} height={video.height} controls playsInline preload="none" aria-label={`${r.title}: ${video.label}`} />
            <figcaption className={styles.muted}>{video.label}</figcaption>
          </figure>
        ))}
      </div>
      {r.transcript && (
        <p className={styles.muted}>
          <strong>Transcript:</strong> {r.transcript}
        </p>
      )}

      <h2>The prompt</h2>
      <pre className={styles.code}>{r.prompt}</pre>
      <p className={styles.muted}>{r.promptNote}</p>

      <h2>What the agent did</h2>
      <ol>
        {r.steps.map((s) => <li key={s}>{s}</li>)}
      </ol>

      <h2>Measured numbers</h2>
      <ul>
        {r.metrics.map(([k, val]) => (
          <li key={k}>
            <strong>{k}:</strong> {val}
          </li>
        ))}
      </ul>

      <h2>Notes and pitfalls</h2>
      <ul>
        {r.notes.map((n) => <li key={n}>{n}</li>)}
      </ul>

      <h2>Source</h2>
      <p>
        Prompt, source and notes: <a href={`${REPO_URL}/tree/main/${r.repoPath}`} rel="noopener">opus-video-recipes/{r.repoPath}</a>.
        Framework choice: <Link href={`${OPUS_VIDEO_BASE}/${COMPARE_SLUG}`}>HyperFrames vs Remotion vs Manim</Link>.
      </p>

      <h2>FAQ</h2>
      {r.faqs.map((f) => (
        <div key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}

      <h2>More recipes</h2>
      <ul className={styles.grid}>
        {others.map((o) => (
          <li key={o.slug}>
            <Link href={recipePath(o.slug)}>
              <strong>{o.title}</strong>
              <span>{o.framework} · {o.videos[0].seconds}s</span>
            </Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href={OPUS_VIDEO_BASE}>All recipes: how to make videos with Claude Opus 5.5</Link>
      </p>
    </main>
  );
}
