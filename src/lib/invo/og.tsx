import { ImageResponse } from "next/og";
import { BLOG } from "./landing";
import type { InvoLocale } from "./locales";
import { publishedPost } from "./posts";

export const ogSize = { width: 1200, height: 630 };

export function postOgImage(locale: InvoLocale, slug: string): ImageResponse {
  const post = publishedPost(locale.id, slug);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#262626",
          color: "#f5f5f5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 32 }}>
          <span style={{ fontWeight: 800 }}>Invo</span>
          {post ? (
            <span style={{ padding: "6px 18px", borderRadius: 999, background: "#fed7aa", color: "#c2410c", fontSize: 26 }}>
              {BLOG[locale.id].categories[post.category]}
            </span>
          ) : null}
        </div>
        <div style={{ display: "flex", fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2 }}>
          {post?.title ?? "Invo Blog"}
        </div>
        <div style={{ display: "flex", height: 12, width: 220, borderRadius: 6, background: "#ea580c" }} />
      </div>
    ),
    ogSize,
  );
}
