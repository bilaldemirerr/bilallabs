import { readFileSync } from "fs";
import path from "path";

export function readAppMarkdown(appSlug: string, doc: "privacy" | "terms"): string {
  const file = path.join(process.cwd(), "content", appSlug, `${doc}.md`);
  return readFileSync(file, "utf8");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inline(s: string): string {
  return escapeHtml(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(
      /\[([^\]]+)\]\((https?:[^)]+)\)/g,
      '<a href="$2" rel="noopener noreferrer">$1</a>',
    )
    .replace(
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,
      '<a href="mailto:$1">$1</a>',
    );
}

/** Minimal GFM-ish renderer for legal markdown (headings, lists, tables, hr). */
export function markdownToHtml(md: string): string {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === "") {
      i += 1;
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      out.push("<hr />");
      i += 1;
      continue;
    }

    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    if (heading) {
      const level = heading[1].length;
      out.push(`<h${level}>${inline(heading[2])}</h${level}>`);
      i += 1;
      continue;
    }

    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?\s*-+/.test(lines[i + 1])) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        if (/^\s*\|?\s*-+/.test(lines[i])) {
          i += 1;
          continue;
        }
        const cells = lines[i]
          .replace(/^\|/, "")
          .replace(/\|$/, "")
          .split("|")
          .map((c) => c.trim());
        rows.push(cells);
        i += 1;
      }
      if (rows.length) {
        const [head, ...body] = rows;
        out.push("<table><thead><tr>");
        for (const c of head) out.push(`<th>${inline(c)}</th>`);
        out.push("</tr></thead><tbody>");
        for (const row of body) {
          out.push("<tr>");
          for (const c of row) out.push(`<td>${inline(c)}</td>`);
          out.push("</tr>");
        }
        out.push("</tbody></table>");
      }
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      out.push("<ul>");
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        out.push(`<li>${inline(lines[i].replace(/^[-*]\s+/, ""))}</li>`);
        i += 1;
      }
      out.push("</ul>");
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      out.push("<ol>");
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        out.push(`<li>${inline(lines[i].replace(/^\d+\.\s+/, ""))}</li>`);
        i += 1;
      }
      out.push("</ol>");
      continue;
    }

    const paras: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,3}\s+/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim()) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !(lines[i].includes("|") && i + 1 < lines.length && /^\s*\|?\s*-+/.test(lines[i + 1]))
    ) {
      paras.push(lines[i]);
      i += 1;
    }
    out.push(`<p>${inline(paras.join(" "))}</p>`);
  }

  return out.join("\n");
}
