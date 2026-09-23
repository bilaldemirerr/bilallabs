import type { Metadata } from "next";
import Link from "next/link";
import styles from "./page.module.css";

const SUPPORT_EMAIL = "bdemirer70@gmail.com";

const FAQ = [
  {
    q: "Where is my data stored?",
    a: "Shots, weight, and side effects stay on your device. Shotly does not upload those health entries to our servers. Uninstalling the app removes them.",
  },
  {
    q: "How do I delete a dose?",
    a: "Open the shot and tap Delete shot. To remove every log, go to Settings → Data → Manage my data → Delete all logs. Delete everything also clears your treatment setup.",
  },
  {
    q: "Reminders are not showing. What should I do?",
    a: "Open Settings → Reminders → Notifications and turn on the reminders you want. If nothing appears, allow notifications for Shotly in your phone’s Settings, then open the app and save those choices again.",
  },
  {
    q: "Is Shotly medical advice?",
    a: "No. Shotly is a personal log for shots, weight, and side effects. Talk with your clinician about dosing and treatment.",
  },
] as const;

export const metadata: Metadata = {
  title: "Shotly Support",
  description:
    "Contact Shotly support and read answers about on-device data, deleting a dose, and reminders.",
};

export default function ShotlyIndexPage() {
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link>
      </p>
      <h1>Shotly</h1>
      <p className={styles.lead}>
        GLP-1 shot, dose, weight, and side-effect tracker. Email us if you
        have a question or something in the app is not working.
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
            <Link href="/shotly/privacy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/shotly/terms">Terms and Conditions</Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
