import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Shotly | Bilal Labs",
  description: "Legal documents for Shotly by Bilal Labs",
};

export default function ShotlyIndexPage() {
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link>
      </p>
      <h1>Shotly</h1>
      <p className={styles.lead}>
        GLP-1 shot, dose, weight, and side-effect tracker.
      </p>
      <ul className={styles.list}>
        <li>
          <Link href="/shotly/privacy">Privacy Policy</Link>
        </li>
        <li>
          <Link href="/shotly/terms">Terms and Conditions</Link>
        </li>
      </ul>
    </main>
  );
}
