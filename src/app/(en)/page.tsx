import type { Metadata } from "next";
import Link from "next/link";
import { APPS } from "@/lib/apps";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Bilal Labs",
  description: "Apps and legal documents from Bilal Labs",
};

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Bilal Labs</h1>
      <p className={styles.lead}>
        Apps and tools from Bilal Labs. KPSS soru bankası, legal documents, and
        more.
      </p>
      <ul className={styles.list}>
        {APPS.map((app) => (
          <li key={app.slug}>
            <Link href={`/${app.slug}`}>
              <strong>{app.name}</strong>
              <span>{app.description}</span>
            </Link>
          </li>
        ))}
      </ul>
      <p className={styles.contact}>
        Contact:{" "}
        <a href="mailto:bilaldemirerlabs@gmail.com">
          bilaldemirerlabs@gmail.com
        </a>
      </p>
    </main>
  );
}
