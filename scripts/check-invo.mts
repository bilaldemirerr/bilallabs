import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { invoSitemapEntries, sitemapUrlForPost } from "../src/lib/invo/entries.ts";
import { SITE_URL } from "../src/lib/site.ts";
import {
  blogIndexPath,
  landingPath,
  LOCALES,
  localeById,
} from "../src/lib/invo/locales.ts";
import { postsIn } from "../src/lib/invo/posts.ts";
import { PT_HEADLINE, PT_PRIVACY, PT_SUPPORT, PT_TERMS, PT_TOOLS } from "../src/lib/invo/pt.ts";
import { readStore } from "../src/lib/invo/store.ts";

const EXPECTED = ["de", "en", "es", "fr", "pt", "pt-BR", "tr"];
const EXAMPLE = "how-to-turn-a-job-estimate-into-an-invoice-with-markup-and-a-deposit";
const ENGLISH_QUERY = "how to turn a job estimate into an invoice with markup and a deposit";

assert.deepEqual(
  [...LOCALES.map((locale) => locale.id)].sort(),
  [...EXPECTED].sort(),
);
assert.equal(LOCALES.length, 7);
assert.equal(LOCALES.filter((locale) => locale.blog).length, 6);
assert.equal(localeById("pt").blog, false);
assert.equal(existsSync(path.join("content", "invo", "pt")), false);

const entries = invoSitemapEntries(new Date("2026-10-06T00:00:00Z"));
const urls = entries.map((entry) => entry.url);

for (const locale of LOCALES) {
  assert.ok(urls.includes(`${SITE_URL}${landingPath(locale)}`), locale.id);
  const blogUrl = `${SITE_URL}${blogIndexPath(locale)}`;
  if (locale.blog) assert.ok(urls.includes(blogUrl), blogUrl);
  else assert.ok(!urls.includes(blogUrl), blogUrl);
}
assert.ok(!urls.some((url) => url.includes("/pt/invo/blog")));

assert.equal(
  sitemapUrlForPost(localeById("en"), { published: false, slug: "not-a-page" }),
  null,
);
assert.equal(
  sitemapUrlForPost(localeById("pt"), { published: true, slug: EXAMPLE }),
  null,
);

const sitemapSource = readFileSync(path.join("src", "app", "sitemap.ts"), "utf8");
assert.ok(sitemapSource.includes("invoSitemapEntries"));

const posts = LOCALES.flatMap((locale) => postsIn(locale.id));
const english = posts.find((post) => post.locale === "en" && post.slug === EXAMPLE);
assert.ok(english);
assert.equal(english.published, true);
assert.equal(english.query, ENGLISH_QUERY);

for (const locale of LOCALES.filter((item) => item.blog)) {
  const post = posts.find((item) => item.locale === locale.id && item.slug === EXAMPLE);
  assert.ok(post, locale.id);
  assert.equal(post.published, true);
  if (!locale.storeDir) continue;
  const store = readStore(locale.storeDir);
  const used = store.bullets.filter((bullet) => post.body.includes(bullet));
  assert.ok(used.length >= 3, `${locale.id} post is missing description bullets`);
  const blob = `${store.name}\n${store.subtitle}\n${store.promo}\n${store.opening.join("\n")}\n${store.bullets.join("\n")}\n${store.scope}`.toLowerCase();
  if (locale.id === "en") {
    assert.equal(locale.titleLead, "construction estimate app");
    assert.ok(blob.includes("construction"));
    assert.ok(blob.includes("estimate"));
  } else if (locale.titleLead) {
    assert.ok(blob.includes(locale.titleLead.toLowerCase()), locale.titleLead);
    assert.notEqual(post.body.trim(), english.body.trim());
    for (const phrase of ["sales tax", "handymen", "jobsite", "you review and send"]) {
      assert.ok(!post.body.toLowerCase().includes(phrase), `${locale.id} ${phrase}`);
    }
  }
  assert.equal(store.plans.length, 4);
  assert.ok(store.freeLine.includes("3"));
  assert.ok(existsSync(path.join("public", "invo", locale.imageDir, "01-estimates-invoices.png")));
}

for (const post of posts) {
  assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(post.slug, /^[a-z0-9-]+$/);
  assert.equal(typeof post.published, "boolean");
  const locale = localeById(post.locale);
  const url = sitemapUrlForPost(locale, post);
  if (post.published) assert.ok(url && urls.includes(url), post.slug);
  else assert.ok(!urls.some((item) => item.endsWith(`/${post.slug}`)), post.slug);
}

for (const value of [PT_HEADLINE, PT_TOOLS, PT_PRIVACY, PT_TERMS, PT_SUPPORT]) {
  assert.equal(value.trim().length > 0, true);
  assert.ok(!/weekly|lifetime|wöchentlich|semanal|vitalício|ömür boyu/i.test(value));
}

const ideas = readFileSync(path.join("content", "invo", "queue.md"), "utf8")
  .split("\n")
  .filter((line) => line.startsWith("- [ ] ") || line.startsWith("- [x] "));
assert.equal(ideas.length, 8);

const storeDirs = readdirSync(path.join("content", "invo", "store"));
assert.deepEqual(storeDirs.sort(), ["de-DE", "en-US", "es-ES", "fr-FR", "pt-BR", "tr"]);
assert.ok(!storeDirs.includes("en-GB"));
assert.ok(!storeDirs.includes("es-MX"));

console.log("invo checks ok");
