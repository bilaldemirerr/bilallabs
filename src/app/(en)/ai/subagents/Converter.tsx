"use client";

import { useState } from "react";
import { convert } from "@/lib/subagents";
import styles from "./subagents.module.css";

const SAMPLE = `---
name: code-reviewer
description: Reviews changes for bugs. Use proactively before committing.
tools: Read, Grep, Glob, Bash
model: sonnet
---

You are a strict code reviewer. Run git diff and report issues by severity.
`;

export function Converter() {
  const [input, setInput] = useState(SAMPLE);
  const [to, setTo] = useState<"cursor" | "claude">("cursor");
  const [copied, setCopied] = useState(false);
  const result = convert(input, to);
  const output = "output" in result ? result.output : "";

  return (
    <section className={styles.tool} aria-labelledby="converter">
      <h2 id="converter">Convert a subagent between Claude Code and Cursor</h2>
      <label className={styles.field}>
        Target
        <select value={to} onChange={(e) => setTo(e.target.value as "cursor" | "claude")}>
          <option value="cursor">Claude Code → Cursor (.cursor/agents/)</option>
          <option value="claude">Cursor → Claude Code (.claude/agents/)</option>
        </select>
      </label>
      <label className={styles.field}>
        Paste your subagent .md file
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={10} spellCheck={false} />
      </label>
      {"error" in result ? (
        <p role="alert" className={styles.error}>{result.error}</p>
      ) : (
        <>
          <pre className={styles.code}>{output}</pre>
          <button
            type="button"
            className={styles.button}
            onClick={() =>
              navigator.clipboard.writeText(output).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              })
            }
          >
            {copied ? "Copied" : "Copy result"}
          </button>
          {result.notes.length > 0 && (
            <ul className={styles.notes} aria-live="polite">
              {result.notes.map((n) => <li key={n}>{n}</li>)}
            </ul>
          )}
        </>
      )}
      <p className={styles.muted}>Runs in your browser. Nothing is uploaded.</p>
    </section>
  );
}
