import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/kpss/seo";
import { SITE_URL } from "@/lib/site";
import { COMPARE_SLUG, OPUS_VIDEO_BASE, RECIPES, recipePath } from "@/lib/opus-video";
import styles from "../../subagents/subagents.module.css";
import v from "../opus-video.module.css";

const PATH = `${OPUS_VIDEO_BASE}/${COMPARE_SLUG}`;
const TITLE = "HyperFrames vs Remotion vs Manim for Claude-Made Videos";
const DESCRIPTION =
  "Which code-to-video framework to use with Claude Opus 5.5: HyperFrames (HTML), Remotion (React) or Manim (Python). Language, license, agent skills and rendering, from the docs.";

const ROWS: [string, string, string, string][] = [
  ["You write", "HTML + CSS + a seekable animation runtime (GSAP by default; Lottie, Three.js, Anime.js, CSS, WAAPI adapters)", "React components in TypeScript/JavaScript", "Python scenes"],
  ["License", "Apache-2.0", "Remotion License: free for individuals, for-profits with up to 3 employees and non-profits; company license otherwise", "MIT (Manim Community)"],
  ["Agent support", "Official skills and plugin for Claude Code, Cursor and others (npx skills add heygen-com/hyperframes)", "Official Remotion Agent Skills (npx skills add remotion-dev/skills)", "No official agent skills that we found"],
  ["Local render", "npx hyperframes render: headless Chrome + FFmpeg, Node 22+", "npx remotion render: headless Chrome + FFmpeg", "manim render: Cairo or OpenGL + FFmpeg"],
  ["Cloud render", "HeyGen cloud, AWS Lambda, Google Cloud Run", "Remotion Lambda", "Your own machines"],
  ["Built-in checks", "lint and check: layout, contrast, timing, runtime errors", "TypeScript, Remotion Studio preview", "Preview renders"],
  ["Extras in the CLI", "Local TTS (Kokoro), transcription (whisper.cpp), a catalog of blocks", "Player component to embed videos in a web app", "LaTeX, graphs, geometry primitives"],
  ["Best at", "Promos, explainers, captions and social clips an agent can write in one file", "Product videos in an existing React/TS codebase, templated video at scale", "Math, diagrams, algorithm visualizations"],
];

const FAQ = [
  {
    q: "Which one is easiest for Claude?",
    a: "The one whose language your project already uses. With no existing code, HyperFrames needs the least setup: one HTML file, and its check command gives the agent concrete errors to fix.",
  },
  {
    q: "Is Remotion free for commercial use?",
    a: "For individuals, for-profit companies with up to 3 employees and non-profits, yes. Larger for-profit companies need a company license. Read Remotion's LICENSE.md for the exact terms.",
  },
  {
    q: "Can Manim make product promos?",
    a: "It can draw anything, but it is built for mathematical animation. For app promos with screenshots, video clips and captions, the browser-based frameworks are a better fit.",
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { type: "article", title: TITLE, description: DESCRIPTION, url: PATH },
};

export default function ComparePage() {
  const crumbs = breadcrumbJsonLd([
    { name: "Bilal Labs", path: "/" },
    { name: "Videos with Claude Opus 5.5", path: OPUS_VIDEO_BASE },
    { name: "HyperFrames vs Remotion vs Manim", path: PATH },
  ]);
  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: TITLE,
    description: DESCRIPTION,
    datePublished: "2026-09-30",
    author: { "@type": "Person", name: "Bilal Demirer" },
    url: `${SITE_URL}${PATH}`,
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml([crumbs, article, faq])} />
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link> / <Link href={OPUS_VIDEO_BASE}>Videos with Claude Opus 5.5</Link>
      </p>
      <h1>HyperFrames vs Remotion vs Manim for Claude-made videos</h1>
      <p>
        Claude Opus 5.5 can&apos;t render video, so the framework decides what it writes. This compares the three I see most, from
        their docs and repos as of September 2026. No speed benchmarks: render time depends on the composition and the machine,
        and my recipes list theirs.
      </p>

      <div style={{ overflowX: "auto" }}>
        <table className={v.table}>
          <thead>
            <tr>
              <th scope="col"></th>
              <th scope="col">HyperFrames</th>
              <th scope="col">Remotion</th>
              <th scope="col">Manim</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map(([k, ...cells]) => (
              <tr key={k}>
                <th scope="row">{k}</th>
                {cells.map((c) => <td key={c}>{c}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>What I used, and why</h2>
      <ul>
        <li>
          <strong>Remotion</strong> for the <Link href={recipePath(RECIPES[0].slug)}>App Store preview</Link>: my content project
          already had a Remotion composition, so the agent extended it with new screens and copy.
        </li>
        <li>
          <strong>HyperFrames</strong> for the <Link href={recipePath(RECIPES[1].slug)}>kinetic typography explainer</Link> and
          the <Link href={recipePath(RECIPES[2].slug)}>captioned vertical clip</Link>: one HTML file each, with local voice and
          transcription from the same CLI.
        </li>
      </ul>

      <h2>Sources</h2>
      <ul>
        <li><a href="https://github.com/heygen-com/hyperframes" rel="noopener">HyperFrames on GitHub</a></li>
        <li><a href="https://github.com/remotion-dev/remotion/blob/main/LICENSE.md" rel="noopener">Remotion LICENSE.md</a> and <a href="https://github.com/remotion-dev/skills" rel="noopener">Remotion Agent Skills</a></li>
        <li><a href="https://docs.manim.community/" rel="noopener">Manim Community docs</a></li>
      </ul>

      <h2>FAQ</h2>
      {FAQ.map((f) => (
        <div key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}

      <p>
        <Link href={OPUS_VIDEO_BASE}>All recipes: how to make videos with Claude Opus 5.5</Link>
      </p>
    </main>
  );
}
