import assert from "node:assert/strict";
import { existsSync, statSync } from "node:fs";
import { isoDuration, RECIPES } from "../src/lib/opus-video.ts";

const slugs = new Set(RECIPES.map((r) => r.slug));
assert.equal(slugs.size, RECIPES.length, "duplicate slug");
for (const r of RECIPES) {
  assert.match(r.slug, /^[a-z0-9]+(-[a-z0-9]+)*$/, r.slug);
  assert.ok(r.summary.length <= 170, `${r.slug} summary too long`);
  assert.equal(r.faqs.length, 3, `${r.slug} faqs`);
  assert.match(r.uploadDate, /^\d{4}-\d{2}-\d{2}$/);
  for (const v of r.videos) {
    for (const f of [v.src, v.poster]) assert.ok(existsSync(`public${f}`), `missing public${f}`);
    assert.ok(statSync(`public${v.src}`).size < 5 * 1024 * 1024, `${v.src} over 5MB`);
    assert.ok(v.seconds >= 10 && v.seconds <= 30, `${v.src} duration`);
  }
}
assert.equal(isoDuration(25.04), "PT25S");

console.log(`check-opus-video: ${RECIPES.length} recipes OK`);
