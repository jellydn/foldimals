# External Integrations

**Analysis Date:** 2026-08-29

## APIs & External Services

**Runtime content:**
- Google Fonts CSS endpoint - `src/styles.css` imports Fredoka and Nunito from `https://fonts.googleapis.com`; this is the sole explicit third-party runtime network integration in source.
- No application data API or external SDK - `package.json` has only React/React DOM as runtime packages, while all lesson content is bundled locally from `src/data/lessons.ts`.
- The service worker performs generic same-origin network fetches and caches responses in `public/sw.js`; it contains no hard-coded third-party API endpoint.

**Browser platform APIs (not third-party services):**
- Web Storage - `src/storage.ts` reads/writes `localStorage` key `foldimals-progress-v1`; `src/App.tsx` loads and persists progress entirely on-device.
- Service Worker, Cache Storage, and Fetch - Production registration occurs in `src/main.tsx`; cache-first app-shell/runtime handling and offline fallback are implemented in `public/sw.js`.
- File/camera picker and Blob URL - `src/App.tsx` accepts `image/*`, supplies the `capture="environment"` hint, and previews a selected photo via `URL.createObjectURL`; the image is not uploaded or persisted.
- Web App Manifest - `index.html` links install metadata from `public/manifest.webmanifest`, which references the local icon `public/foldimals-icon.svg`.

## Data Storage

**Databases:**
- None - no database package, connection string, or network persistence appears in `package.json`, `src/storage.ts`, or `src/App.tsx`.

**File Storage:**
- No server/cloud file storage - a user-selected image remains an in-memory Blob URL held in component state in `src/App.tsx`; source assets are static files under `public/`.
- Local progress is JSON in browser `localStorage`, implemented by `src/storage.ts`; malformed or unavailable values fall back to empty progress.

**Caching:**
- Browser Cache Storage only - `public/sw.js` uses cache name `foldimals-v1`, pre-caches `/`, `/index.html`, `/manifest.webmanifest`, and `/foldimals-icon.svg`, then caches successful GET responses at runtime.
- No Redis, CDN SDK, or application cache library is declared in `package.json`.

## Authentication & Identity

**Auth Provider:**
- None - there are no identity dependencies in `package.json`, no login UI in `src/App.tsx`, and no token/cookie handling in `src/`.
- Progress is anonymous and device/browser-local through `src/storage.ts`; there are no user accounts or cross-device synchronization paths.

## Monitoring & Observability

**Error Tracking:**
- None - no monitoring SDK is declared in `package.json` or initialized by `src/main.tsx`.

**Logs:**
- No application logging pipeline - source under `src/` has no logging calls; storage parsing failures are intentionally swallowed and reset in `src/storage.ts`.
- Service-worker registration in `src/main.tsx` has no explicit success/failure reporting, and `public/sw.js` handles failed fetches by falling back to cached `/index.html`.

## CI/CD & Deployment

**Hosting:**
- GitHub Pages - `.github/workflows/deploy-pages.yml` publishes the Vite `dist/` artifact to the custom domain declared in `public/CNAME`.
- Cloudflare DNS is external deployment state: `foldimals.itman.fyi` must be a DNS-only CNAME to `jellydn.github.io`; no Cloudflare API credential or DNS-as-code exists in this repository.
- GitHub Pages manages TLS and HTTPS after DNS validation. Path-relative Vite, manifest, and service-worker URLs support both the generated project path and custom-domain root.

**CI Pipeline:**
- GitHub Actions - pushes to `main` and manual dispatches run the workflow in `.github/workflows/deploy-pages.yml`.
- The `verify` job uses `oven-sh/setup-bun`, installs from `bun.lock`, runs tests/typecheck/lint/build, and uploads only `dist/` with `actions/upload-pages-artifact`.
- The separate `deploy` job uses official `actions/configure-pages` and `actions/deploy-pages` actions with job-scoped `pages: write` and OIDC `id-token: write`; no long-lived deployment secret is required. Attaching the custom domain remains a repository-owner setting because GitHub Actions tokens cannot update that Pages administration field.

## Environment Configuration

**Required env vars:**
- None - `src/` contains no custom `import.meta.env` or process environment access; `src/main.tsx` uses only Vite's built-in `import.meta.env.PROD` to gate service-worker registration.

**Secrets location:**
- None defined - there are no tracked `.env` files or credential references; `.gitignore` excludes `*.local` but the application currently has no secret-backed integration.

## Webhooks & Callbacks

**Incoming:**
- None - this is a client-only static application with no server endpoint in `package.json` or `src/`; browser lifecycle listeners in `src/main.tsx` and `public/sw.js` are platform events, not webhooks.

**Outgoing:**
- None - no webhook or mutation request exists in `src/` or `public/sw.js`; the only external runtime request declared by the app is the stylesheet import to Google Fonts in `src/styles.css`.

---

*Integration audit: 2026-08-29*
