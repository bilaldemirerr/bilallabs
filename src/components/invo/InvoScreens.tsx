import Link from "next/link";
import Image from "next/image";
import { markdownToHtml } from "@/lib/markdown";
import {
  APP_STORE_URL,
  blogIndexPath,
  blogPostPath,
  landingPath,
  LOCALES,
  PRIVACY_URL,
  SHOT_BULLET_INDEX,
  SHOT_FILES,
  SUPPORT_URL,
  TERMS_URL,
  type InvoLocale,
  type LocaleId,
} from "@/lib/invo/locales";
import { publishedPosts, type InvoPost } from "@/lib/invo/posts";
import { PT_HEADLINE, PT_PRIVACY, PT_SUPPORT, PT_TERMS, PT_TOOLS } from "@/lib/invo/pt";
import { readStore } from "@/lib/invo/store";
import styles from "./invo.module.css";

function LanguageSwitcher({
  current,
  hrefFor,
}: {
  current: LocaleId;
  hrefFor: (id: LocaleId) => string | null;
}) {
  return (
    <nav className={styles.switcher}>
      {LOCALES.map((locale) => {
        const href = hrefFor(locale.id);
        if (!href) return null;
        return (
          <Link
            key={locale.id}
            href={href}
            hrefLang={locale.htmlLang}
            aria-current={locale.id === current ? "page" : undefined}
          >
            {locale.id}
          </Link>
        );
      })}
    </nav>
  );
}

function Quote({ value }: { value: string }) {
  const parts = value.split("**");
  return parts.map((part, index) =>
    index % 2 === 1 ? <strong key={index}>{part}</strong> : <span key={index}>{part}</span>,
  );
}

function PtLanding({ locale }: { locale: InvoLocale }) {
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link>
      </p>
      <LanguageSwitcher current={locale.id} hrefFor={(id) => landingPath(LOCALES.find((item) => item.id === id)!)} />
      <h1>
        <Quote value={PT_HEADLINE} />
      </h1>
      <p className={styles.lead}>{PT_TOOLS}</p>
      <p>
        <a className={styles.store} href={APP_STORE_URL} rel="noopener noreferrer">
          App Store
        </a>
      </p>
      <ul className={styles.legal}>
        <li>
          <a href={PRIVACY_URL} rel="noopener noreferrer">{PT_PRIVACY}</a>
        </li>
        <li>
          <a href={TERMS_URL} rel="noopener noreferrer">{PT_TERMS}</a>
        </li>
        <li>
          <a href={SUPPORT_URL} rel="noopener noreferrer">{PT_SUPPORT}</a>
        </li>
      </ul>
    </main>
  );
}

export function InvoLanding({ locale }: { locale: InvoLocale }) {
  if (!locale.storeDir || !locale.imageDir) return <PtLanding locale={locale} />;
  const store = readStore(locale.storeDir);
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link>
      </p>
      <LanguageSwitcher current={locale.id} hrefFor={(id) => landingPath(LOCALES.find((item) => item.id === id)!)} />
      <p className={styles.name}>{store.name}</p>
      <h1>{store.subtitle}</h1>
      {store.opening.map((paragraph) => (
        <p className={styles.lead} key={paragraph}>
          {paragraph}
        </p>
      ))}
      <section aria-labelledby="features">
        <h2 id="features">{store.featuresHeading}</h2>
        <ul className={styles.bullets}>
          {store.bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
        <p className={styles.scope}>{store.scope}</p>
      </section>
      <div className={styles.shots}>
        {SHOT_FILES.map((file, index) => (
          <Image
            key={file}
            src={`/invo/${locale.imageDir}/${file}`}
            alt={store.bullets[SHOT_BULLET_INDEX[index]]}
            width={1320}
            height={2868}
            sizes="(max-width: 800px) 45vw, 180px"
          />
        ))}
      </div>
      <section>
        <p className={styles.free}>{store.freeLine}</p>
        <ul className={styles.plans}>
          {store.plans.map((plan) => (
            <li key={plan}>{plan}</li>
          ))}
        </ul>
      </section>
      <p>
        <a className={styles.store} href={APP_STORE_URL} rel="noopener noreferrer">
          App Store
        </a>
      </p>
      <ul className={styles.legal}>
        <li>
          <a href={PRIVACY_URL} rel="noopener noreferrer">{store.privacyLabel}</a>
        </li>
        <li>
          <a href={TERMS_URL} rel="noopener noreferrer">{store.termsLabel}</a>
        </li>
        <li>
          <a href={SUPPORT_URL} rel="noopener noreferrer">Support</a>
        </li>
      </ul>
    </main>
  );
}

export function InvoBlogIndex({ locale }: { locale: InvoLocale }) {
  if (!locale.storeDir || !locale.blog) return null;
  const store = readStore(locale.storeDir);
  const posts = publishedPosts(locale.id);
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link>
        {" · "}
        <Link href={landingPath(locale)}>{store.name}</Link>
      </p>
      <LanguageSwitcher
        current={locale.id}
        hrefFor={(id) => {
          const item = LOCALES.find((localeItem) => localeItem.id === id);
          return item?.blog ? blogIndexPath(item) : null;
        }}
      />
      <h1>{store.subtitle}</h1>
      {posts.length === 0 ? (
        <p className={styles.lead}>{locale.emptyBlog}</p>
      ) : (
        <ul className={styles.list}>
          {posts.map((post) => (
            <li key={post.slug}>
              <Link href={blogPostPath(locale, post.slug)}>
                <strong>{post.title}</strong>
                <span>{post.description}</span>
              </Link>
              <time dateTime={post.date}>{post.date}</time>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export function InvoBlogPost({ locale, post }: { locale: InvoLocale; post: InvoPost }) {
  if (!locale.storeDir || !locale.blog) return null;
  const store = readStore(locale.storeDir);
  const html = markdownToHtml(post.body);
  return (
    <main className={styles.main}>
      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link>
        {" · "}
        <Link href={landingPath(locale)}>{store.name}</Link>
        {" · "}
        <Link href={blogIndexPath(locale)}>{store.subtitle}</Link>
      </p>
      <LanguageSwitcher
        current={locale.id}
        hrefFor={(id) => {
          const item = LOCALES.find((localeItem) => localeItem.id === id);
          if (!item?.blog) return null;
          return publishedPosts(item.id).some((entry) => entry.slug === post.slug)
            ? blogPostPath(item, post.slug)
            : null;
        }}
      />
      <p className={styles.muted}>
        <time dateTime={post.date}>{post.date}</time>
      </p>
      <div className={styles.prose} dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  );
}
