# Architecture

**Analysis Date:** 2026-08-29

## Pattern Overview

**Overall:** Client-only, state-driven React single-page PWA with static lesson content

**Key Characteristics:**
- One React root owns navigation and durable progress; there is no router, backend, API, authentication, or global state library (`src/main.tsx`, `src/App.tsx`).
- Screens are conditional views of a small finite state (`home`, `preview`, `player`, `complete`, `collection`) rather than URL-addressable routes (`src/App.tsx`).
- Curriculum and diagrams are typed static data, while the folding player is reusable across animals (`src/data/lessons.ts`, `src/types.ts`, `src/components/FoldingPlayer.tsx`).
- Browser `localStorage` supplies all durable user state, and a hand-written service worker supplies offline app-shell/runtime caching (`src/storage.ts`, `public/sw.js`).

## Layers

**Bootstrap and PWA Shell:**
- Purpose: Mount the application, load global styles, expose install metadata, and register offline support in production.
- Location: `index.html`, `src/main.tsx`, `src/styles.css`, `public/manifest.webmanifest`, `public/sw.js`
- Contains: HTML root, React bootstrap, service-worker registration, responsive presentation, manifest, and cache handlers.
- Depends on: React DOM, browser DOM/service worker/cache APIs, Vite production environment flags.
- Used by: The browser and installed PWA runtime.

**Application Orchestration and Screens:**
- Purpose: Own screen flow, selected lesson, progress state, and screen-level UI.
- Location: `src/App.tsx`
- Contains: `App`, `AppHeader`, `Home`, `AnimalCard`, `Preview`, `Completion`, and `Collection`.
- Depends on: Lesson queries, storage functions, shared types, `AnimalArt`, and `FoldingPlayer`.
- Used by: `src/main.tsx`.

**Reusable Player and Rendering:**
- Purpose: Execute a lesson one fold at a time and turn lesson diagram identifiers/guides into visual instructions.
- Location: `src/components/FoldingPlayer.tsx`, `src/components/OrigamiCanvas.tsx`, `src/components/AnimalArt.tsx`
- Contains: Per-session step/help/replay state, generic controls, SVG fold diagrams, guides, targets, and finished animal art.
- Depends on: `AnimalLesson`, `FoldStep`, and `AnimalId` contracts from `src/types.ts`; content passed from the application layer.
- Used by: `src/App.tsx` and completion/home/collection/player views.

**Content and Domain Model:**
- Purpose: Define the curriculum, progression order, visual metadata, fold instructions, and domain contracts.
- Location: `src/data/lessons.ts`, `src/types.ts`
- Contains: Five ordered `AnimalLesson` records, guide-coordinate helpers, `getLesson`, `isLessonUnlocked`, and TypeScript interfaces.
- Depends on: No UI or persistence code; `src/data/lessons.ts` imports only domain types.
- Used by: `src/App.tsx`, player/rendering components, storage typing, and tests.

**Persistence:**
- Purpose: Load, save, and transform local progress.
- Location: `src/storage.ts`
- Contains: Versioned key `foldimals-progress-v1`, empty state, defensive JSON loading, serialization, and idempotent completion logic.
- Depends on: Browser `Storage` and `SavedProgress`/`AnimalId` types.
- Used by: `src/App.tsx`; injectable storage subsets are used by `src/storage.test.ts`.

**Delivery:**
- Purpose: Gate and publish the static production bundle to the custom HTTPS origin.
- Location: `.github/workflows/deploy-pages.yml`, `public/CNAME`
- Contains: Bun setup, install/test/typecheck/lint/build steps, Pages artifact upload, least-privilege OIDC deployment, and the `foldimals.itman.fyi` domain declaration.
- Depends on: GitHub Actions/Pages and an external Cloudflare DNS-only CNAME.
- Used by: Pushes to `main` and manual workflow dispatches.

## Data Flow

**Screen Flow:**
1. `src/main.tsx` mounts `App`; `App` starts on `home`, selects Dog by default, and lazily initializes progress with `loadProgress`.
2. Home renders ordered cards from `lessons`; `isLessonUnlocked` enables Dog or a lesson whose immediate predecessor is completed.
3. Selecting an enabled card stores its `AnimalId` and moves `home` or `collection` to `preview`; preview starts/resumes `player` from `progress.current[id]`.
4. `FoldingPlayer` advances locally through steps, exits back to `preview`, or calls completion on its final action.
5. Completion updates progress and shows `complete`; the user then returns to `home`, opens `collection`, or can later select a completed animal to fold again.
6. Header actions reach `home` or `collection` from every shell screen; the full-screen player intentionally replaces the shell and exposes its own exit control.

**Lesson Playback and Player/Content Boundary:**
1. `src/App.tsx` resolves the selected ID through `getLesson` and passes the complete `AnimalLesson` to `FoldingPlayer`.
2. `FoldingPlayer` interprets only generic lesson fields (`steps`, color, instruction, hint) and owns ephemeral `stepIndex`, `animationKey`, and `helpLevel`.
3. `OrigamiCanvas` receives the active `FoldStep`; `diagram` selects a hard-coded SVG paper state, while `guide.line`, `guide.arrow`, and `guide.targets` drive generic overlays.
4. Final diagram names ending in `final` switch from the fold diagram to reusable `AnimalArt`.
5. Thus lesson copy/coordinates/order live in `src/data/lessons.ts`, but supported diagram vocabulary and animal geometry must also be implemented in `src/components/OrigamiCanvas.tsx` and `src/components/AnimalArt.tsx`.

**State and Persistence Flow:**
1. Durable `SavedProgress` consists of `completed: AnimalId[]` and `current: Partial<Record<AnimalId, number>>` (`src/types.ts`).
2. `App` initializes this state from local storage; malformed or absent JSON falls back to `emptyProgress` (`src/storage.ts`).
3. Every player step effect calls `onStepChange`; `App.updateStep` immutably records the selected animal's zero-based step.
4. A `useEffect` in `App` serializes every progress change to `localStorage`.
5. Finishing calls `completeAnimal`, which adds the ID once and resets its current step to zero; this completion then unlocks the next ordered lesson.
6. Completion decoration and uploaded photo are component-local only. The photo uses an object URL and neither it nor `decorated` is persisted (`src/App.tsx`).

**PWA and Offline Flow:**
1. `index.html` links `public/manifest.webmanifest` and the SVG icon with path-relative URLs; the manifest requests standalone display and a scope-relative start URL.
2. Only production builds register the service worker relative to `document.baseURI`, after window load (`src/main.tsx`).
3. Installation resolves shell files against the service-worker scope and pre-caches the app root, HTML, manifest, and icon; activation removes cache versions other than `foldimals-v2` (`public/sw.js`).
4. GET requests use cache-first lookup, then fetch and asynchronously cache responses; a network failure falls back to the scope-relative `index.html`.
5. Vite emits the hashed application assets consumed at runtime; those are not listed in `APP_SHELL` but become cached after their first successful request.

**Build and Deployment Flow:**
1. A push to `main` starts `.github/workflows/deploy-pages.yml`.
2. The read-only verification job installs the locked Bun dependencies and runs tests, typecheck, lint, and the Vite production build.
3. The workflow uploads only `dist/`, including the copied `public/CNAME`, as the Pages artifact.
4. A separate deploy job receives `pages: write` and an OIDC token, enables/configures Pages, and deploys the path-relative artifact.
5. The repository owner attaches the custom domain in Pages settings; Cloudflare then resolves `foldimals.itman.fyi` to `jellydn.github.io`, and GitHub Pages validates the domain and manages TLS.

**State Management:**
- `App` is the sole owner of navigation, selected lesson, and persistent progress (`src/App.tsx`).
- `FoldingPlayer` owns lesson-session UI state, and `Completion` owns nonpersistent decoration/photo state.
- Parent callbacks are the only state boundary; there is no context, reducer, external store, URL state, or server synchronization.

## Key Abstractions

**AnimalLesson / FoldStep:**
- Purpose: Stable, typed contract between curriculum content and generic playback UI.
- Examples: `src/types.ts`, `src/data/lessons.ts`
- Pattern: Data-driven content records with SVG-coordinate guide metadata.

**FoldingPlayer:**
- Purpose: Reusable state machine for previous/next, replay, and two-level progressive help across all lessons.
- Examples: `src/components/FoldingPlayer.tsx`, `src/components/FoldingPlayer.test.tsx`
- Pattern: Controlled boundary for progress callbacks with internal ephemeral interaction state.

**OrigamiCanvas / AnimalArt:**
- Purpose: Render instruction-state paper geometry and reusable final animal illustrations.
- Examples: `src/components/OrigamiCanvas.tsx`, `src/components/AnimalArt.tsx`
- Pattern: Declarative SVG components selected by content IDs/naming conventions.

**Progress Storage Functions:**
- Purpose: Isolate browser serialization and completion transforms from UI code.
- Examples: `src/storage.ts`, `src/storage.test.ts`
- Pattern: Small functional adapter with dependency injection via `Pick<Storage, ...>`.

## Entry Points

**Browser Document:**
- Location: `index.html`
- Triggers: Initial navigation or service-worker fallback.
- Responsibilities: Supply metadata/root element and load `/src/main.tsx` through Vite.

**React Runtime:**
- Location: `src/main.tsx`
- Triggers: Module script execution.
- Responsibilities: Mount `App` in `StrictMode`, import global CSS, and register the production service worker.

**Application Controller:**
- Location: `src/App.tsx`
- Triggers: React root render and user navigation/actions.
- Responsibilities: Resolve screens and lessons, coordinate progress, and connect UI to persistence.

**Service Worker:**
- Location: `public/sw.js`
- Triggers: Production registration followed by install, activate, and fetch events.
- Responsibilities: Cache the app shell, cache fetched GET resources, clean old caches, and provide HTML fallback.

**Deployment Workflow:**
- Location: `.github/workflows/deploy-pages.yml`
- Triggers: Push to `main` or manual dispatch.
- Responsibilities: Run the release gate, build `dist/`, and publish through GitHub Pages without long-lived deployment secrets.

## Error Handling

**Strategy:** Prefer safe local fallback for persisted data; otherwise rely on browser/React behavior without a centralized error channel.

**Patterns:**
- `loadProgress` catches storage/JSON failures and returns `emptyProgress`; it also shape-checks top-level fields (`src/storage.ts`).
- `getLesson` may return `undefined`; `App` falls back to the first lesson, and collection rendering skips unknown IDs (`src/App.tsx`).
- The service worker converts failed GET fetches to cached HTML, but registration, cache writes, and `saveProgress` errors are not surfaced (`src/main.tsx`, `public/sw.js`, `src/storage.ts`).

## Cross-Cutting Concerns

**Logging:** No application logging, analytics, or telemetry is present.

**Validation:** TypeScript constrains authored content at build time; local progress receives only shallow runtime shape checks, with no validation that IDs or step indexes belong to current lessons (`src/types.ts`, `src/storage.ts`). File selection is browser-filtered with `accept="image/*"` (`src/App.tsx`).

**Authentication:** None. The app is entirely local and has no user identity, authorization boundary, or remote data.

---

*Architecture analysis: 2026-08-29*
