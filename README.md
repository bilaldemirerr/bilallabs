# Bilal Labs legal site

Multi-app legal documents for App Store / Play listings.

## URLs

| App | Privacy | Terms |
| --- | --- | --- |
| Shotly | `/shotly/privacy` | `/shotly/terms` |

## Add a new app

1. Create `content/<slug>/privacy.md` and `content/<slug>/terms.md`
2. Add the app to `src/lib/apps.ts`
3. Copy `src/app/shotly/` → `src/app/<slug>/` and rename titles/slugs

## Dev

```bash
npm run dev
```

Contact: bilaldemirerlabs@gmail.com
