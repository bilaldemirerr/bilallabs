import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { markdownToHtml } from "@/lib/markdown";
import {
  CHROME,
  LANGUAGE_NAME,
  BLOG,
  PT_STORE,
  SECTIONS,
} from "@/lib/invo/landing";
import {
  APP_STORE_URL,
  blogFeedPath,
  blogIndexPath,
  blogPostPath,
  landingPath,
  localeById,
  LOCALES,
  PRIVACY_URL,
  SUPPORT_URL,
  TERMS_URL,
  type InvoLocale,
  type LocaleId,
} from "@/lib/invo/locales";
import { CATEGORIES, postHeadings, publishedPosts, readingMinutes, type InvoPost } from "@/lib/invo/posts";
import { SITE_URL } from "@/lib/site";
import { readStore, type StoreCopy } from "@/lib/invo/store";
import styles from "./invo.module.css";

/** Store screenshots are 1320×2868. Crops drop the baked-in ad lines and keep the document or phone. */
const SHOT_W = 1320;
const SHOT_H = 2868;
const CROP = {
  document: { x: 0, y: 1080, w: 1320, h: 1520 },
  cover: { x: 0, y: 1080, w: 1320, h: 780 },
  price: { x: 0, y: 500, w: 1320, h: 2320 },
  brand: { x: 96, y: 80, w: 1128, h: 2188 },
  reports: { x: 0, y: 640, w: 1320, h: 2200 },
  types: { x: 40, y: 140, w: 1240, h: 2060 },
} as const;

function shotSrc(imageDir: string, file: string): string {
  return `/invo/${imageDir}/${file}`;
}

function CroppedShot({
  src,
  alt,
  crop,
  frameClass,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  crop: { x: number; y: number; w: number; h: number };
  frameClass: string;
  priority?: boolean;
  sizes: string;
}) {
  return (
    <div className={frameClass} style={{ aspectRatio: `${crop.w} / ${crop.h}` }}>
      <Image
        src={src}
        alt={alt}
        width={SHOT_W}
        height={SHOT_H}
        priority={priority}
        sizes={sizes}
        className={styles.crop}
        style={{
          width: `${(SHOT_W / crop.w) * 100}%`,
          maxWidth: "none",
          height: "auto",
          left: `${(-crop.x / crop.w) * 100}%`,
          top: `${(-crop.y / crop.h) * 100}%`,
        }}
      />
    </div>
  );
}

function StoreBadge({ localeId, compact }: { localeId: LocaleId; compact?: boolean }) {
  const chrome = CHROME[localeId];
  return (
    <a
      className={compact ? `${styles.badge} ${styles.badgeInline}` : styles.badge}
      href={APP_STORE_URL}
      rel="noopener noreferrer"
      aria-label={chrome.badgeAlt}
    >
      {/* Official badge. Height stays at the asset's 40px; don't redraw it. */}
      <img src={`/invo/badges/${localeId}.svg`} alt="" height={40} />
    </a>
  );
}

function LanguageMenu({
  current,
  hrefFor,
}: {
  current: LocaleId;
  hrefFor?: (id: LocaleId) => string;
}) {
  return (
    <details className={styles.lang}>
      <summary aria-label={CHROME[current].language}>{LANGUAGE_NAME[current]}</summary>
      <ul>
        {LOCALES.map((item) => (
          <li key={item.id}>
            <Link
              href={hrefFor ? hrefFor(item.id) : landingPath(item)}
              hrefLang={item.htmlLang}
              aria-current={item.id === current ? "page" : undefined}
              lang={item.htmlLang}
            >
              {LANGUAGE_NAME[item.id]}
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

function SiteFooter({ locale }: { locale: InvoLocale }) {
  const store: StoreCopy = locale.storeDir ? readStore(locale.storeDir) : PT_STORE;
  const chrome = CHROME[locale.id];
  const sections = SECTIONS[locale.id];
  const home = landingPath(locale);
  return (
    <footer className={styles.footer}>
      <div className={`${styles.wrap} ${styles.footerGrid}`}>
        <div>
          <Link href={home} className={styles.wordmark}>
            Invo
          </Link>
          <p className={styles.footerLede}>{store.subtitle}</p>
          <StoreBadge localeId={locale.id} />
        </div>
        <nav aria-label="Invo">
          <Link href={`${home}#features`}>{sections.nav.features}</Link>
          <Link href={`${home}#pricing`}>{sections.nav.pricing}</Link>
          <Link href={`${home}#faq`}>{sections.nav.faq}</Link>
          {locale.blog ? <Link href={blogIndexPath(locale)}>{chrome.blog}</Link> : null}
        </nav>
        <nav aria-label={chrome.support}>
          <a href={SUPPORT_URL} rel="noopener noreferrer">{chrome.support}</a>
          <a href={PRIVACY_URL} rel="noopener noreferrer">{store.privacyLabel}</a>
          <a href={TERMS_URL} rel="noopener noreferrer">{store.termsLabel}</a>
        </nav>
      </div>
      <div className={`${styles.wrap} ${styles.footerBase}`}>
        <span>© {new Date().getFullYear()} Invo</span>
        <Link href="/">Bilal Labs</Link>
      </div>
    </footer>
  );
}

function SiteShell({
  locale,
  section,
  hrefFor,
  children,
}: {
  locale: InvoLocale;
  section: "home" | "blog";
  hrefFor?: (id: LocaleId) => string;
  children: ReactNode;
}) {
  const chrome = CHROME[locale.id];
  const sections = SECTIONS[locale.id];
  const home = landingPath(locale);
  return (
    <div className={styles.page}>
      <header className={styles.bar}>
        <div className={styles.barInner}>
          <Link href={home} className={styles.wordmark}>
            Invo
          </Link>
          <nav className={styles.nav} aria-label="Invo">
            <Link href={`${home}#features`}>{sections.nav.features}</Link>
            <Link href={`${home}#pricing`}>{sections.nav.pricing}</Link>
            <Link href={`${home}#faq`}>{sections.nav.faq}</Link>
            {locale.blog ? (
              <Link href={blogIndexPath(locale)} aria-current={section === "blog" ? "page" : undefined}>
                {chrome.blog}
              </Link>
            ) : null}
          </nav>
          <div className={styles.barEnd}>
            <LanguageMenu current={locale.id} hrefFor={hrefFor} />
            <StoreBadge localeId={locale.id} compact />
          </div>
        </div>
      </header>
      <main>{children}</main>
      <SiteFooter locale={locale} />
    </div>
  );
}

function SectionHead({ title, lede }: { title: string; lede?: string }) {
  return (
    <div className={styles.sectionHead}>
      <h2>{title}</h2>
      {lede ? <p>{lede}</p> : null}
    </div>
  );
}

export function InvoLanding({ locale }: { locale: InvoLocale }) {
  const store: StoreCopy = locale.storeDir ? readStore(locale.storeDir) : PT_STORE;
  const imageDir = locale.imageDir ?? "pt-BR";
  const chrome = CHROME[locale.id];
  const sections = SECTIONS[locale.id];
  const features = store.bullets.length > 8 ? store.bullets : [...store.bullets, chrome.ai].filter(Boolean);
  const tabs = [
    { title: chrome.priceTitle, lines: [store.bullets[1], store.bullets[2]], file: "03-professional-quote.png", crop: CROP.price },
    { title: chrome.sendTitle, lines: [store.bullets[4], store.bullets[3]], file: "04-branded-logo.png", crop: CROP.brand },
    { title: chrome.trackTitle, lines: [store.bullets[6], store.bullets[5]], file: "05-reports.png", crop: CROP.reports },
  ];
  const stats: [string, string][] = [
    ["3", sections.stats[0]],
    ["6", sections.stats[1]],
    ["4", sections.stats[2]],
    [String(LOCALES.length), sections.stats[3]],
  ];
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: sections.faqs.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <SiteShell locale={locale} section="home">
      <section className={`${styles.wrap} ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <h1>{chrome.headline}</h1>
          <p className={styles.lede}>{store.promo || store.subtitle}</p>
          <div className={styles.heroActions}>
            <StoreBadge localeId={locale.id} compact />
            <a href="#features" className={styles.secondary}>
              {sections.seeFeatures}
            </a>
          </div>
        </div>
        <div className={styles.heroStage}>
          <CroppedShot
            src={shotSrc(imageDir, "01-estimates-invoices.png")}
            alt={chrome.headline}
            crop={CROP.document}
            frameClass={styles.frame}
            priority
            sizes="(max-width: 900px) 92vw, 600px"
          />
        </div>
      </section>

      <section className={styles.scopeBand}>
        <p className={styles.wrap}>{store.scope}</p>
      </section>

      <section id="features" className={`${styles.wrap} ${styles.section}`}>
        <SectionHead title={sections.featuresTitle} lede={sections.featuresLede} />
        <div className={styles.featuresGrid}>
          <div className={styles.featuresStage}>
            <CroppedShot
              src={shotSrc(imageDir, "02-job-types.png")}
              alt={store.bullets[0]}
              crop={CROP.types}
              frameClass={styles.frame}
              sizes="(max-width: 900px) 92vw, 420px"
            />
          </div>
          <ul className={styles.featureList}>
            {features.map((item, i) => (
              <li key={item}>
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.tint}>
        <div className={`${styles.wrap} ${styles.section}`}>
          <SectionHead title={sections.tabsTitle} />
          <div className={styles.tabs}>
            {/* ponytail: CSS-only tabs (radio + :has). Upgrade to a client component if tabs need URLs or analytics. */}
            <div className={styles.tabList}>
              {tabs.map((tab, i) => (
                <label key={tab.title} className={styles.tab}>
                  <input type="radio" name="invo-tab" defaultChecked={i === 0} data-tab={i} />
                  <strong>{tab.title}</strong>
                  <span>{tab.lines.filter(Boolean).join(" · ")}</span>
                </label>
              ))}
            </div>
            {tabs.map((tab, i) => (
              <div key={tab.file} className={styles.tabPanel} data-panel={i}>
                <CroppedShot
                  src={shotSrc(imageDir, tab.file)}
                  alt={tab.lines[0] ?? tab.title}
                  crop={tab.crop}
                  frameClass={styles.frame}
                  sizes="(max-width: 900px) 92vw, 460px"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.wrap} ${styles.section}`}>
        <SectionHead title={sections.statsTitle} />
        <dl className={styles.stats}>
          {stats.map(([value, label]) => (
            <div key={label}>
              <dt>{value}</dt>
              <dd>{label}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="pricing" className={styles.tint}>
        <div className={`${styles.wrap} ${styles.section}`}>
          <SectionHead title={sections.pricingTitle} />
          <ul className={styles.plans}>
            {store.plans.map((plan) => (
              <li key={plan}>{plan}</li>
            ))}
          </ul>
          <p className={styles.note}>{chrome.priceNote}</p>
        </div>
      </section>

      <section id="faq" className={`${styles.wrap} ${styles.section} ${styles.faqGrid}`}>
        <SectionHead title={sections.faqTitle} />
        <div className={styles.faq}>
          {sections.faqs.map(([q, a]) => (
            <details key={q}>
              <summary>{q}</summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd).replace(/</g, "\\u003c") }} />
      </section>

      <section className={styles.wrap}>
        <div className={styles.cta}>
          <h2>{sections.ctaTitle}</h2>
          <p>{sections.ctaLede}</p>
          <StoreBadge localeId={locale.id} />
        </div>
      </section>
    </SiteShell>
  );
}

function articleBody(post: InvoPost): string {
  const body = post.body.replace(/^\uFEFF?\s*/, "");
  const heading = `# ${post.title}`;
  if (body.startsWith(heading)) return body.slice(heading.length).replace(/^\s+/, "");
  return body;
}

function blogLanguageHref(id: LocaleId, slug?: string): string {
  const item = localeById(id);
  if (slug && item.blog && publishedPosts(item.id).some((entry) => entry.slug === slug)) {
    return blogPostPath(item, slug);
  }
  return item.blog ? blogIndexPath(item) : landingPath(item);
}

/** Wide crops for blog covers, one per store screenshot. */
const COVER: Record<string, { x: number; y: number; w: number; h: number }> = {
  "01-estimates-invoices.png": CROP.cover,
  "02-job-types.png": { x: 0, y: 700, w: 1320, h: 780 },
  "03-professional-quote.png": { x: 0, y: 900, w: 1320, h: 780 },
  "04-branded-logo.png": { x: 0, y: 600, w: 1320, h: 780 },
  "05-reports.png": { x: 0, y: 1000, w: 1320, h: 780 },
};

function formatDate(locale: InvoLocale, date: string): string {
  return new Intl.DateTimeFormat(locale.htmlLang, { dateStyle: "long", timeZone: "UTC" }).format(new Date(date));
}

function jsonLd(data: object) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

function PostCard({ locale, post, featured }: { locale: InvoLocale; post: InvoPost; featured?: boolean }) {
  const blog = BLOG[locale.id];
  return (
    <Link href={blogPostPath(locale, post.slug)} className={featured ? `${styles.card} ${styles.featured}` : styles.card}>
      <CroppedShot
        src={shotSrc(locale.imageDir ?? "en", post.image)}
        alt=""
        crop={COVER[post.image]}
        frameClass={`${styles.frame} ${styles.cardCover}`}
        sizes={featured ? "(max-width: 900px) 92vw, 640px" : "(max-width: 900px) 92vw, 400px"}
      />
      <div className={styles.cardBody}>
        <span className={styles.pill}>{blog.categories[post.category]}</span>
        <h2>{post.title}</h2>
        <p>{post.description}</p>
        <p className={styles.meta}>
          <time dateTime={post.date}>{formatDate(locale, post.date)}</time> · {blog.minutes(readingMinutes(post.body))}
        </p>
      </div>
    </Link>
  );
}

export function InvoBlogIndex({ locale }: { locale: InvoLocale }) {
  if (!locale.storeDir || !locale.blog || !locale.imageDir) return null;
  const store = readStore(locale.storeDir);
  const chrome = CHROME[locale.id];
  const blog = BLOG[locale.id];
  const posts = publishedPosts(locale.id);
  const [latest, ...rest] = posts;
  const used = CATEGORIES.filter((cat) => rest.some((post) => post.category === cat));
  return (
    <SiteShell locale={locale} section="blog" hrefFor={(id) => blogLanguageHref(id)}>
      <header className={styles.blogHead}>
        <h1>{chrome.blog}</h1>
        <p>{store.subtitle}</p>
      </header>
      {!latest ? (
        <p className={styles.blogEmpty}>{locale.emptyBlog}</p>
      ) : (
        <div className={styles.blogBody}>
          <section aria-label={blog.latest}>
            <h2 className={styles.blogSection}>{blog.latest}</h2>
            <PostCard locale={locale} post={latest} featured />
          </section>
          {rest.length ? (
            <section className={styles.filterable}>
              <h2 className={styles.blogSection}>{chrome.guides}</h2>
              {/* ponytail: CSS-only filter (radio + :has), one rule per category in the CSS. Move to ?category= pages once there are enough posts to index per category. */}
              <div className={styles.chips} role="radiogroup" aria-label={chrome.guides}>
                <label>
                  <input type="radio" name="invo-cat" value="all" defaultChecked />
                  {chrome.guides}
                </label>
                {used.map((cat) => (
                  <label key={cat}>
                    <input type="radio" name="invo-cat" value={cat} />
                    {blog.categories[cat]}
                  </label>
                ))}
                <a href={blogFeedPath(locale)}>{blog.rss}</a>
              </div>
              <ul className={styles.cards}>
                {rest.map((post) => (
                  <li key={post.slug} data-cat={post.category}>
                    <PostCard locale={locale} post={post} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </SiteShell>
  );
}

export function InvoBlogPost({ locale, post }: { locale: InvoLocale; post: InvoPost }) {
  if (!locale.storeDir || !locale.blog || !locale.imageDir) return null;
  const chrome = CHROME[locale.id];
  const blog = BLOG[locale.id];
  const body = articleBody(post);
  const headings = postHeadings(body);
  const related = publishedPosts(locale.id)
    .filter((item) => item.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3);
  const url = `${SITE_URL}${blogPostPath(locale, post.slug)}`;
  return (
    <SiteShell locale={locale} section="blog" hrefFor={(id) => blogLanguageHref(id, post.slug)}>
      <article className={styles.article}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href={landingPath(locale)}>Invo</Link>
          <span aria-hidden="true">/</span>
          <Link href={blogIndexPath(locale)}>{chrome.blog}</Link>
          <span aria-hidden="true">/</span>
          <span>{blog.categories[post.category]}</span>
        </nav>
        <h1>{post.title}</h1>
        <p className={styles.lede}>{post.description}</p>
        <p className={styles.meta}>
          <time dateTime={post.date}>{formatDate(locale, post.date)}</time> · {blog.minutes(readingMinutes(body))}
        </p>
        <CroppedShot
          src={shotSrc(locale.imageDir, post.image)}
          alt=""
          crop={COVER[post.image]}
          frameClass={`${styles.frame} ${styles.articleCover}`}
          priority
          sizes="(max-width: 900px) 92vw, 960px"
        />
        <div className={styles.articleGrid}>
          {headings.length > 1 ? (
            <nav className={styles.toc} aria-label={blog.toc}>
              <p>{blog.toc}</p>
              <ol>
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`}>{h.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          <div>
            <div className={styles.prose} dangerouslySetInnerHTML={{ __html: markdownToHtml(body) }} />
            <aside className={styles.postCta}>
              <p>{blog.postCta}</p>
              <StoreBadge localeId={locale.id} compact />
            </aside>
          </div>
        </div>
      </article>
      {related.length ? (
        <section className={`${styles.wrap} ${styles.relatedWrap}`}>
          <h2 className={styles.blogSection}>{blog.related}</h2>
          <ul className={styles.cards}>
            {related.map((item) => (
              <li key={item.slug}>
                <PostCard locale={locale} post={item} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {jsonLd({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            inLanguage: locale.htmlLang,
            mainEntityOfPage: url,
            author: { "@type": "Organization", name: "Bilal Labs", url: SITE_URL },
            publisher: { "@type": "Organization", name: "Bilal Labs", url: SITE_URL },
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Invo", item: `${SITE_URL}${landingPath(locale)}` },
              { "@type": "ListItem", position: 2, name: chrome.blog, item: `${SITE_URL}${blogIndexPath(locale)}` },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          },
        ],
      })}
    </SiteShell>
  );
}
