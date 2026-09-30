import type { Metadata } from "next";
import Link from "next/link";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/kpss/seo";
import { SUBAGENTS, SUBAGENTS_BASE, subagentPath } from "@/lib/subagents";
import { Converter } from "./Converter";
import styles from "./subagents.module.css";

const FAQ = [
  {
    q: "Where do subagent files go?",
    a: "Claude Code: .claude/agents/ in the project or ~/.claude/agents/ for all projects. Cursor: .cursor/agents/ or ~/.cursor/agents/. Cursor also loads .claude/agents/ and .codex/agents/ for compatibility.",
  },
  {
    q: "Can one file work in both Claude Code and Cursor?",
    a: "Mostly. Cursor reads .claude/agents/, and name, description and the prompt body carry over. But Cursor ignores Claude-only fields such as tools, and Claude Code ignores Cursor's readonly. For a read-only agent, keep a Cursor copy with readonly: true.",
  },
  {
    q: "Which frontmatter fields are required?",
    a: "Claude Code requires name and description. In Cursor both are optional (name defaults to the file name), but without a description the agent cannot decide when to delegate.",
  },
];

export const metadata: Metadata = {
  title: `Subagent Examples for Claude Code & Cursor (${SUBAGENTS.length} Copy-Paste Templates)`,
  description:
    `${SUBAGENTS.length} ready-to-use subagent files for Claude Code (.claude/agents) and Cursor (.cursor/agents): code reviewer, debugger, test runner, security auditor and more, plus a free format converter.`,
  alternates: { canonical: SUBAGENTS_BASE },
};

export default function SubagentsHub() {
  const crumbs = breadcrumbJsonLd([
    { name: "Bilal Labs", path: "/" },
    { name: "Subagent examples", path: SUBAGENTS_BASE },
  ]);
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml([crumbs, faq])} />
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link>
      </p>
      <h1>Subagent examples for Claude Code and Cursor</h1>
      <p>
        A subagent is a Markdown file with YAML frontmatter that defines a specialist agent with its own
        context window and system prompt. Every example below comes in both formats, checked against the{" "}
        <a href="https://code.claude.com/docs/en/sub-agents" rel="noopener">Claude Code</a> and{" "}
        <a href="https://cursor.com/docs/subagents" rel="noopener">Cursor</a> docs.
      </p>

      <Converter />

      <h2>Claude Code vs Cursor subagent format</h2>
      <ul>
        <li>
          <strong>Both:</strong> <code>name</code>, <code>description</code> (the delegation trigger), <code>model</code>, and the
          Markdown body as the system prompt.
        </li>
        <li>
          <strong>Claude Code only:</strong> <code>tools</code> / <code>disallowedTools</code> allowlists, <code>permissionMode</code>,{" "}
          <code>maxTurns</code>, <code>skills</code>, <code>hooks</code>, <code>mcpServers</code>, <code>memory</code>, <code>effort</code>,{" "}
          <code>isolation: worktree</code>, <code>background</code>, <code>color</code>. Model aliases: sonnet, opus, haiku, inherit.
        </li>
        <li>
          <strong>Cursor only:</strong> <code>readonly</code> (no file edits or state-changing shell commands) and{" "}
          <code>is_background</code>. <code>model</code> is <code>inherit</code> or a Cursor model ID.
        </li>
      </ul>

      <h2>All {SUBAGENTS.length} subagents</h2>
      <ul className={styles.grid}>
        {SUBAGENTS.map((a) => (
          <li key={a.slug}>
            <Link href={subagentPath(a.slug)}>
              <strong>{a.title}</strong>
              <span>{a.description.split(". ")[0]}.</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2>FAQ</h2>
      {FAQ.map((f) => (
        <div key={f.q}>
          <h3>{f.q}</h3>
          <p>{f.a}</p>
        </div>
      ))}

      <p>
        More AI dev guides: <Link href="/ai/opus-video">how to make videos with Claude Opus 5.5</Link>.
      </p>
    </main>
  );
}
