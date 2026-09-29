import assert from "node:assert/strict";
import { convert, parseFrontmatter, renderClaude, SUBAGENTS } from "../src/lib/subagents.ts";

const slugs = new Set(SUBAGENTS.map((a) => a.slug));
assert.equal(slugs.size, SUBAGENTS.length, "duplicate slug");
for (const a of SUBAGENTS) {
  assert.match(a.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, a.slug);
  assert.equal(a.faqs.length, 3, `${a.slug} faqs`);
  for (const r of a.related) assert.ok(slugs.has(r), `${a.slug} -> missing related ${r}`);
  assert.ok(a.summary.length <= 170, `${a.slug} summary too long`);
  const back = parseFrontmatter(renderClaude(a));
  assert.equal(back?.fields.name, a.slug);
  assert.equal(back?.fields.tools, a.tools.join(", "));
}

const reviewer = convert(renderClaude(SUBAGENTS[0]), "cursor");
assert.ok("output" in reviewer && reviewer.output.includes("readonly: true"));
assert.ok("output" in reviewer && !reviewer.output.includes("tools:"));

const list = convert("---\nname: x\ndescription: d\ntools:\n  - Read\n  - Edit\n---\nbody", "cursor");
assert.ok("output" in list && list.output.includes("readonly: false"));

const toClaude = convert("---\nname: x\ndescription: d\nreadonly: true\nis_background: true\n---\nbody", "claude");
assert.ok("output" in toClaude && toClaude.output.includes("disallowedTools: Write, Edit") && toClaude.output.includes("background: true"));

assert.ok("error" in convert("no frontmatter", "cursor"));
assert.ok("error" in convert("---\nname: x\n---\nbody", "claude"));

console.log(`check-subagents: ${SUBAGENTS.length} subagents OK`);
