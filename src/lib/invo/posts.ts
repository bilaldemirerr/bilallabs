import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { localeById, type LocaleId } from "./locales.ts";

export type InvoPost = {
  locale: LocaleId;
  title: string;
  description: string;
  slug: string;
  date: string;
  query: string;
  published: boolean;
  body: string;
};

const REQUIRED = ["title", "description", "slug", "date", "query", "published"] as const;

export function parsePost(raw: string, file: string): Omit<InvoPost, "locale"> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw);
  if (!match) throw new Error(`${file} is missing frontmatter`);
  const data: Record<string, string | boolean> = {};
  for (const line of match[1].split(/\r?\n/)) {
    if (line.trim() === "") continue;
    const field = /^([A-Za-z0-9_]+):\s*(.*)$/.exec(line);
    if (!field) throw new Error(`${file} has a bad frontmatter line: ${line}`);
    const rawValue = field[2].trim();
    if (rawValue === "true" || rawValue === "false") data[field[1]] = rawValue === "true";
    else if (rawValue.startsWith('"') && rawValue.endsWith('"')) data[field[1]] = rawValue.slice(1, -1);
    else throw new Error(`${file} field ${field[1]} must be quoted or a boolean`);
  }
  for (const key of REQUIRED) {
    if (data[key] === undefined) throw new Error(`${file} is missing ${key}`);
  }
  if (typeof data.published !== "boolean") throw new Error(`${file} published must be true or false`);
  const slug = String(data.slug);
  const base = path.basename(file, ".md");
  if (slug !== base) throw new Error(`${file} slug ${slug} does not match the filename`);
  return {
    title: String(data.title),
    description: String(data.description),
    slug,
    date: String(data.date),
    query: String(data.query),
    published: data.published,
    body: match[2],
  };
}

export function postsIn(localeId: LocaleId): InvoPost[] {
  const locale = localeById(localeId);
  if (!locale.contentDir) return [];
  const dir = path.join(process.cwd(), "content", "invo", locale.contentDir);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => {
      const file = path.join(dir, name);
      return { locale: localeId, ...parsePost(readFileSync(file, "utf8"), file) };
    });
}

export function publishedPosts(localeId: LocaleId): InvoPost[] {
  return postsIn(localeId)
    .filter((post) => post.published)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

export function publishedPost(localeId: LocaleId, slug: string): InvoPost | undefined {
  return publishedPosts(localeId).find((post) => post.slug === slug);
}
