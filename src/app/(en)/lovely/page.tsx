import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

const SUPPORT_EMAIL = "bdemirer70@gmail.com";

const FAQ = [
  {
    q: "How do I pair with my partner?",
    a: "One of you opens Profile → Connect your partner and shares the 6-digit code; the other enters it. A code works once, and creating a new one cancels the old one.",
  },
  {
    q: "Who can see what I share?",
    a: "Only your paired partner. There are no public profiles or feeds. If you end the partnership, neither of you can see the other's content anymore.",
  },
  {
    q: "How does location sharing work?",
    a: "It is off until you turn it on in Profile. Your partner then sees the distance between you, rounded to about 100 meters. Live location shares your precise position only for the period you pick (15 minutes, 1 hour or 8 hours) and stops by itself.",
  },
  {
    q: "Does one subscription cover both of us?",
    a: "Yes. When either partner has Lovely Premium, both get it. Manage or cancel it in your Apple Account settings; deleting the app does not cancel it.",
  },
  {
    q: "How do I restore my purchase?",
    a: "Open the Premium screen and tap Restore, signed in to the same Apple Account you bought it with.",
  },
  {
    q: "How do I delete my account?",
    a: "Profile → Delete account. Your account, profile, the memories and stories you created, your mood and your location are deleted for good.",
  },
] as const;

export const metadata: Metadata = {
  title: "Lovely Support",
  description:
    "Contact Lovely support and read answers about pairing, privacy, location sharing, Premium and deleting your account.",
};

export default function LovelyIndexPage() {
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link>
      </p>
      <h1>Lovely</h1>
      <p className={styles.lead}>
        A private app for two partners: stories, moods, a shared journal and
        distance. Email us if you have a question or something in the app is
        not working.
      </p>

      <section aria-labelledby="support-heading">
        <h2 id="support-heading">Support</h2>
        <ul className={styles.list}>
          <li>
            <a className={styles.support} href={`mailto:${SUPPORT_EMAIL}`}>
              <strong>Email support</strong>
              <span>{SUPPORT_EMAIL}</span>
            </a>
          </li>
        </ul>
      </section>

      <section aria-labelledby="faq-heading">
        <h2 id="faq-heading">Common questions</h2>
        <ul className={styles.faq}>
          {FAQ.map((item) => (
            <li key={item.q}>
              <h3>{item.q}</h3>
              <p>{item.a}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="legal-heading">
        <h2 id="legal-heading">Legal</h2>
        <ul className={styles.list}>
          <li>
            <Link href="/lovely/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/lovely/terms">Terms of Use</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
