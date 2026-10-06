/**
 * Drafts one Invo post skeleton per locale that has a description.md.
 * Run: node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/draft-invo-post.mts
 * No arguments. No network. No LLM. Does not write pt, edit the sitemap, or commit.
 * Reads the first "- [ ]" line in content/invo/queue.md and writes
 * content/invo/<locale>/<slug>.md with published: false for en, de, es, fr, pt-BR, tr.
 * A second run skips that line, so it does not write the same files again.
 * The body is a skeleton: the query as the H1, section markers as HTML comments,
 * and one line naming the description.md a human must use before publishing.
 * Publishing is a one-line frontmatter change in that one file:
 *   published: false
 *   becomes
 *   published: true
 * The route and sitemap.ts follow that flag. No other file change is required.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { LOCALES } from "../src/lib/invo/locales.ts";

const QUEUE = path.join(process.cwd(), "content", "invo", "queue.md");
const targets = LOCALES.filter((locale) => locale.blog && locale.contentDir && locale.descriptionMd);

function slugify(query: string): string {
  const slug = query
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  if (!slug || slug.includes("..")) throw new Error(`cannot slugify ${query}`);
  return slug;
}

function skeleton(query: string, slug: string, date: string, descriptionMd: string): string {
  const quoted = query.replaceAll('"', '\\"');
  return `---
title: "${quoted}"
description: "${quoted}"
slug: "${slug}"
date: "${date}"
query: "${quoted}"
published: false
---

# ${query}

<!-- section: answer the query using only this description.md -->
<!-- section: steps, each one something this description.md says the app does -->
<!-- section: optional AI as review-before-send, only if this description says it -->

Write the body from ${descriptionMd} before setting published: true.
`;
}

if (targets.length !== 6 || targets.some((locale) => locale.id === "pt")) {
  throw new Error("draft targets must be the six locales that have a description.md");
}

const raw = readFileSync(QUEUE, "utf8");
const lines = raw.split("\n");
const index = lines.findIndex((line) => line.startsWith("- [ ] "));
if (index === -1) {
  console.log("no unused queue line");
  process.exit(0);
}

const query = lines[index].slice("- [ ] ".length).trim();
const slug = slugify(query);
const date = new Date().toISOString().slice(0, 10);

for (const locale of targets) {
  if (!locale.contentDir || !locale.descriptionMd) continue;
  const dir = path.join(process.cwd(), "content", "invo", locale.contentDir);
  mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${slug}.md`);
  if (existsSync(file)) {
    console.log(`skip ${path.relative(process.cwd(), file)}`);
    continue;
  }
  writeFileSync(file, skeleton(query, slug, date, locale.descriptionMd));
  console.log(`write ${path.relative(process.cwd(), file)}`);
}

lines[index] = `- [x] ${query}`;
writeFileSync(QUEUE, lines.join("\n"));
console.log(`used queue line: ${query}`);
