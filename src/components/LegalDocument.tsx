import Link from "next/link";
import styles from "./LegalDocument.module.css";

type Props = {
  appName: string;
  appSlug: string;
  title: string;
  html: string;
  sibling: { href: string; label: string };
};

export default function LegalDocument({
  appName,
  appSlug,
  title,
  html,
  sibling,
}: Props) {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link href="/">Bilal Labs</Link>
          <span className={styles.sep}>/</span>
          <Link href={`/${appSlug}`}>{appName}</Link>
          <span className={styles.sep}>/</span>
          <span>{title}</span>
        </nav>
        <div className={styles.links}>
          <Link href={sibling.href}>{sibling.label}</Link>
        </div>
      </header>
      <article
        className={styles.prose}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <footer className={styles.footer}>
        <p>
          © {new Date().getFullYear()} Bilal Labs ·{" "}
          <a href="mailto:bilaldemirerlabs@gmail.com">
            bilaldemirerlabs@gmail.com
          </a>
        </p>
      </footer>
    </div>
  );
}
