import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/kpss/seo";
import { SITE_URL } from "@/lib/site";
import { COMPARE_SLUG, OPUS_VIDEO_BASE, RECIPES, REPO_URL, recipePath, videoJsonLd } from "@/lib/opus-video";
import styles from "../subagents/subagents.module.css";
import v from "./opus-video.module.css";

const TITLE = "How to Make Videos with Claude Opus 5.5 (Real Recipes, Prompts & Costs)";
const DESCRIPTION =
  "Make videos with Claude Opus 5.5: an App Store preview from one prompt, a kinetic typography explainer and a captioned vertical clip. Real MP4s, exact prompts, measured costs.";

const FAQ = [
  {
    q: "Can Claude Opus 5.5 make videos?",
    a: "Not directly: it outputs text, not video. But it writes code very well, and frameworks like HyperFrames (HTML) and Remotion (React) turn code into MP4. The model writes the composition, the framework renders it.",
  },
  {
    q: "Which framework should I use with Claude?",
    a: "HyperFrames if you want plain HTML and agent skills built for it, Remotion if you already work in React or need its ecosystem, Manim for math and diagram animation. See the comparison page for details.",
  },
  {
    q: "How much does a Claude-made video cost?",
    a: "The one measured run here, an App Store preview plus screenshots, cost about $5 at Opus 5.5 API list prices, mostly cache reads. Rendering itself is local and free.",
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: OPUS_VIDEO_BASE },
  openGraph: {
    type: "article",
    title: TITLE,
    description: DESCRIPTION,
    url: OPUS_VIDEO_BASE,
    images: [RECIPES[0].videos[0].poster],
  },
};

export default function OpusVideoHub() {
  const crumbs = breadcrumbJsonLd([
    { name: "Bilal Labs", path: "/" },
    { name: "Videos with Claude Opus 5.5", path: OPUS_VIDEO_BASE },
  ]);
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: "2026-09-30",
    author: { "@type": "Person", name: "Bilal Demirer" },
    url: `${SITE_URL}${OPUS_VIDEO_BASE}`,
    video: videoJsonLd(RECIPES[0], RECIPES[0].videos[0], SITE_URL),
  };
  const hero = RECIPES[0].videos[0];

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml([crumbs, faq, article])} />
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link>
      </p>
      <h1>How to make videos with Claude Opus 5.5</h1>
      <p>
        Claude doesn&apos;t render video. It writes the code that does. I&apos;m an indie iOS developer, and every recipe
        below ships a real MP4 I made this way, the exact prompt, what the agent did, render time and, where I could measure
        it, the token cost. Source for all of them is in the{" "}
        <a href={REPO_URL} rel="noopener">opus-video-recipes repo</a>.
      </p>

      <video className={v.video} src={hero.src} poster={hero.poster} width={hero.width} height={hero.height} controls playsInline preload="none" aria-label="App Store preview video for the Lovely app, made with Claude Opus 5.5" />
      <p className={styles.muted}>
        The App Store preview for my app Lovely, from one prompt. <Link href={recipePath(RECIPES[0].slug)}>See the recipe</Link>.
      </p>

      <h2>The workflow in four steps</h2>
      <ul>
        <li>
          <strong>Pick a code-to-video framework.</strong> <a href="https://github.com/heygen-com/hyperframes" rel="noopener">HyperFrames</a>{" "}
          (HTML + GSAP) or <a href="https://www.remotion.dev" rel="noopener">Remotion</a> (React). Both render locally to MP4 with
          headless Chrome and FFmpeg.
        </li>
        <li>
          <strong>Give the agent the framework&apos;s skills.</strong> <code>npx skills add heygen-com/hyperframes</code> or{" "}
          <code>npx skills add remotion-dev/skills</code>, in Claude Code or Cursor.
        </li>
        <li>
          <strong>Write a brief, not a wish.</strong> Length, size, fps, the text on screen for each beat, and the real assets it
          may use. The App Store recipe shows what a good brief looks like.
        </li>
        <li>
          <strong>Make it check before it renders.</strong> <code>npx hyperframes check</code> catches layout, contrast and timing
          bugs; then look at frames before you publish.
        </li>
      </ul>

      <h2>Claude Opus 5.5 facts that matter here</h2>
      <p>
        Model ID <code>claude-opus-5-5</code>, released September 22, 2026. $4 per million input tokens, $20 per million output,
        $0.20 per million cache reads. 1M-token context, 128K max output, adaptive thinking always on (default effort: medium).
        Sources: <a href="https://www.anthropic.com/claude-opus-5-5" rel="noopener">Anthropic&apos;s announcement</a> and the{" "}
        <a href="https://platform.claude.com/docs/en/about-claude/models/overview" rel="noopener">models overview</a>. Video work is
        agentic and re-reads the same files, so cache reads are most of the bill.
      </p>

      <h2>Recipes</h2>
      <ul className={v.cards}>
        {RECIPES.map((r) => (
          <li key={r.slug}>
            <Link href={recipePath(r.slug)}>
              <Image src={r.videos[0].poster} alt="" width={r.videos[0].width} height={r.videos[0].height} />
              <strong>{r.title}</strong>
              <span>{r.framework} · {r.videos[0].seconds}s</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2>Which framework?</h2>
      <p>
        <Link href={`${OPUS_VIDEO_BASE}/${COMPARE_SLUG}`}>HyperFrames vs Remotion vs Manim for Claude-made videos</Link>: language,
        license, agent support and what each is good at, from their docs.
      </p>

      <h2>FAQ</h2>
      {FAQ.map((f) => (
        <div key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}

      <p>
        More AI dev guides: <Link href="/ai/subagents">subagent examples for Claude Code and Cursor</Link>.
      </p>
    </main>
  );
}
