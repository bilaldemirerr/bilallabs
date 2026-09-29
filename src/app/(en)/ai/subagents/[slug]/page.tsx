import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/kpss/seo";
import {
  getSubagent,
  isReadonly,
  renderClaude,
  renderCursor,
  SUBAGENTS,
  SUBAGENTS_BASE,
  subagentPath,
} from "@/lib/subagents";
import styles from "../subagents.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUBAGENTS.map((a) => ({ slug: a.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const agent = getSubagent((await params).slug);
  if (!agent) return {};
  const title = `${agent.title} Subagent Example for Claude Code & Cursor`;
  return {
    title,
    description: agent.summary,
    alternates: { canonical: subagentPath(agent.slug) },
    openGraph: { type: "article", title, description: agent.summary, url: subagentPath(agent.slug) },
  };
}

export default async function SubagentPage({ params }: Props) {
  const agent = getSubagent((await params).slug);
  if (!agent) notFound();

  const readonly = isReadonly(agent.tools);
  const path = subagentPath(agent.slug);
  const crumbs = breadcrumbJsonLd([
    { name: "Bilal Labs", path: "/" },
    { name: "Subagent examples", path: SUBAGENTS_BASE },
    { name: agent.title, path },
  ]);
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: agent.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const related = agent.related.map(getSubagent).filter((a) => a !== undefined);

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml([crumbs, faq])} />
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link> / <Link href={SUBAGENTS_BASE}>Subagent examples</Link>
      </p>
      <h1>{agent.title} subagent for Claude Code and Cursor</h1>
      <p>{agent.intro}</p>
      <p>
        <strong>Access:</strong> {readonly ? "read-only (cannot edit files)" : "can edit files"}. <strong>Tools:</strong>{" "}
        {agent.tools.join(", ")}. <strong>Suggested Claude model:</strong> {agent.model}.
      </p>

      <h2>Claude Code: .claude/agents/{agent.slug}.md</h2>
      <pre className={styles.code}>{renderClaude(agent)}</pre>

      <h2>Cursor: .cursor/agents/{agent.slug}.md</h2>
      <pre className={styles.code}>{renderCursor(agent)}</pre>
      <p className={styles.muted}>
        Cursor has no <code>tools</code> field, so tool access is expressed as <code>readonly: {String(readonly)}</code>.
        {readonly ? " Read-only agents can still run non-mutating commands like git diff." : ""}
      </p>

      <h2>When to use it</h2>
      <p>{agent.when}</p>

      <h2>How to install and run</h2>
      <p>
        Save the file in your project (or in <code>~/.claude/agents/</code> / <code>~/.cursor/agents/</code> for every project).
        In Claude Code, @-mention it, ask “use the {agent.slug} subagent”, or start a session with{" "}
        <code>claude --agent {agent.slug}</code>. In Cursor, type <code>/{agent.slug}</code> or ask for it by name. Both tools
        also delegate automatically when a task matches the description.
      </p>

      <h2>Common pitfalls</h2>
      <ul>
        {agent.pitfalls.map((p) => <li key={p}>{p}</li>)}
      </ul>

      <h2>FAQ</h2>
      {agent.faqs.map((f) => (
        <div key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}

      <h2>Related subagents</h2>
      <ul className={styles.grid}>
        {related.map((a) => (
          <li key={a.slug}>
            <Link href={subagentPath(a.slug)}>
              <strong>{a.title}</strong>
              <span>{a.description.split(". ")[0]}.</span>
            </Link>
          </li>
        ))}
      </ul>
      <p>
        <Link href={SUBAGENTS_BASE}>All subagent examples and the Claude Code ↔ Cursor converter</Link>
      </p>
    </main>
  );
}
