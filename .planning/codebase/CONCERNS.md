# Codebase Concerns

**Analysis Date:** 2026-08-29

## Tech Debt

**Screen flow and component boundaries:**
- Issue: All navigation is an in-memory `Screen` state and most screens live in one component file; there are no URLs, browser-history integration, or per-screen focus handling.
- Files: `src/App.tsx`
- Impact: Refreshing or using Back loses the current screen, and adding flows increases coupling in an already broad application component. Screen changes can also leave keyboard/screen-reader focus on detached controls.
- Fix approach: Extract screens, introduce a small router/state-machine boundary, and set focus to the new screen heading after navigation.

**Diagram/content coupling:**
- Issue: Lesson diagrams are free-form strings interpreted by a long conditional renderer; unknown values silently fall back to a diamond.
- Files: `src/types.ts`, `src/data/lessons.ts`, `src/components/OrigamiCanvas.tsx`
- Impact: Typos or new lesson content can display the wrong fold without a type or runtime error.
- Fix approach: Use a discriminated `Diagram` union or renderer registry and reject unsupported diagram IDs during content validation.

**Monolithic global styling:**
- Issue: All responsive layouts, component styles, colors, and animations share one stylesheet with many tightly coupled class selectors.
- Files: `src/styles.css`
- Impact: Visual changes have a wide regression surface and lesson colors are split between inline styles and CSS.
- Fix approach: Separate design tokens and component-level styles while retaining the existing reduced-motion override.

## Known Bugs

**Semantically invalid saved steps can crash lesson rendering:**
- Symptoms: `loadProgress` accepts any object as `current`; a non-numeric, negative, or otherwise invalid step can produce an invalid `stepIndex`, after which `step.instruction`/`step.guide` is accessed.
- Files: `src/storage.ts`, `src/components/FoldingPlayer.tsx`
- Trigger: Put JSON such as `{"completed":[],"current":{"dog":"bad"}}` or a negative index in `foldimals-progress-v1`, reload, and enter Dog.
- Workaround: Clear site storage; the application has no in-product reset.

**Progress writes can fail outside the existing error boundary:**
- Symptoms: Reads catch storage errors, but `saveProgress` does not; unavailable or quota-limited `localStorage` can throw from the application effect.
- Files: `src/storage.ts`, `src/App.tsx`
- Trigger: Deny storage access or make `setItem` throw.
- Workaround: Use a browsing context where local storage is writable.

**Photo object URLs are never released:**
- Symptoms: Repeatedly changing a completion photo retains prior blob URLs until the page unloads.
- Files: `src/App.tsx`
- Trigger: Complete a lesson and choose multiple photos in succession.
- Workaround: Reload the page.

## Security Considerations

**Child photo and remote-font privacy:**
- Risk: Selected photos stay in browser memory and are not uploaded by current code, but there is no explanatory privacy copy. Separately, CSS contacts Google Fonts and exposes normal request metadata to that third party.
- Files: `src/App.tsx`, `src/styles.css`
- Current mitigation: Photos use local `URL.createObjectURL` values only and are not persisted; the app has no analytics, account, or backend integration.
- Recommendations: State clearly that photos remain on-device, revoke object URLs on replacement/unmount, and self-host or bundle fonts for a child-focused offline app.

**GitHub Pages cannot define custom security headers:**
- Risk: The selected static host does not provide repository-configured CSP, framing protection, referrer policy, or other custom response headers.
- Files: `.github/workflows/deploy-pages.yml`, `index.html`, `docs/adr/0002-deploy-as-a-static-site-on-github-pages.md`
- Current mitigation: React escapes lesson strings, no arbitrary HTML injection API is used, the application has no server-side secrets, and Pages provides managed HTTPS.
- Recommendations: Keep third-party runtime resources minimal; if stronger response-header control becomes necessary, move the static artifact behind a configurable CDN and supersede ADR 0002.

## Performance Bottlenecks

**Online font dependency and eager application bundle:**
- Problem: Two Google font families are render-time external requests, while all screens, SVG art, and lesson content ship in the initial JavaScript bundle.
- Files: `src/styles.css`, `src/App.tsx`, `src/data/lessons.ts`, `src/components/AnimalArt.tsx`
- Cause: CSS `@import` and no route/component splitting; the current production build is modest (217.92 kB JS / 68.19 kB gzip), so this is a growth concern rather than a current severe bottleneck.
- Improvement path: Self-host subsetted fonts; split lesson/player or data modules only when measured bundle growth warrants it.

## Fragile Areas

**Hand-written service worker lifecycle and caching:**
- Files: `public/sw.js`, `src/main.tsx`, `public/manifest.webmanifest`, `src/styles.css`
- Why fragile: The install shell omits Vite's hashed JS/CSS and remote fonts. Runtime cache-first behavior has no expiration, caches every GET (including cross-origin requests), does not check `response.ok`, and falls back to HTML for any failed request type. Cache invalidation depends on manually changing `foldimals-v1`.
- Safe modification: Generate a build-aware precache manifest, restrict runtime strategies by destination/origin, version caches automatically, and provide an explicit offline navigation fallback.
- Test coverage: No service-worker registration, install/update, first-visit offline, runtime-cache, or offline-font test exists.

**Progression relies on mutable client storage:**
- Files: `src/storage.ts`, `src/data/lessons.ts`, `src/App.tsx`
- Why fragile: Parsed `completed` entries and `current` keys/values receive only shallow shape checks and are treated as typed data; lesson insertion/reordering also changes unlock semantics.
- Safe modification: Version and migrate stored data, whitelist `AnimalId`s, clamp integer steps against lesson lengths, and encode prerequisites explicitly.
- Test coverage: Malformed JSON and missing storage are covered, but semantically invalid IDs/steps, migration, storage write errors, and lesson reordering are not.

**Accessibility depends on visual regression discipline:**
- Files: `src/App.tsx`, `src/components/FoldingPlayer.tsx`, `src/styles.css`
- Why fragile: Several primary buttons use white text on dynamic lesson colors (notably light coral/green), with no automated contrast check. Screen changes do not announce a route title or move focus, and folding instructions depend heavily on animated visual guides despite text hints.
- Safe modification: Validate token contrast, add focus/announcement behavior, and test keyboard, screen-reader, zoom, and high-contrast flows. Keep the existing `prefers-reduced-motion` rule.
- Test coverage: Tests query accessible roles, but there is no automated accessibility audit or keyboard/focus assertion.

## Scaling Limits

**Static lesson catalogue and sequential unlock model:**
- Current capacity: Five lessons and 36 total steps are compiled into `src/data/lessons.ts`.
- Limit: Every lesson requires a code release plus renderer changes for new diagram forms; unlocks only support the immediately preceding array item.
- Scaling path: Define a validated lesson schema, explicit prerequisites, content-level versioning, and a renderer registry before materially expanding the catalogue.

## Dependencies at Risk

**Vite/React plugin toolchain compatibility:**
- Risk: The current test run emits deprecation warnings from `vite:react-babel` about `esbuild`/`optimizeDeps.esbuildOptions` in the Vite toolchain.
- Impact: Checks pass today, but a future Vite/plugin update could turn the deprecated integration into a break.
- Migration plan: Keep `vite` and `@vitejs/plugin-react` updated as a tested pair and resolve the warning before the deprecated options are removed.

## Missing Critical Features

**Reliable install/offline delivery:**
- Problem: The manifest and service worker establish a basic PWA, but there is no build-generated asset precache, offline/update UX, or automated offline verification. The manifest supplies only an SVG marked maskable rather than conventional 192/512 raster install icons.
- Blocks: Confidence that a newly installed app starts offline, updates predictably, and installs consistently across target tablet platforms.

**DNS and post-deploy checks remain external:**
- Problem: `.github/workflows/deploy-pages.yml` now gates and publishes each release, but Cloudflare DNS is not managed as code and the workflow does not smoke-test the custom URL after certificate issuance.
- Blocks: Fully automated proof that `foldimals.itman.fyi` resolves, serves the expected release over HTTPS, and exposes installable PWA assets after every deploy.

**Lesson content validation:**
- Problem: Existing tests assert order, step counts, and that a guide exists, but not unique IDs, supported diagram IDs, finite/in-range coordinates, non-empty instructions/hints, color validity/contrast, or physical correctness of the folds.
- Blocks: Safe authoring or expansion of lessons without manual code-level review and real-paper validation.

## Test Coverage Gaps

**PWA and production behavior:**
- What's not tested: Production service-worker registration, cache upgrades, offline startup/navigation, install metadata/icons, and deployment headers/base paths.
- Files: `src/main.tsx`, `public/sw.js`, `public/manifest.webmanifest`, `vite.config.ts`
- Risk: The online jsdom suite can remain green while the installed/offline app is stale or unusable.
- Priority: High

**Storage failure and schema boundaries:**
- What's not tested: Invalid-but-parseable progress, out-of-range steps, unknown IDs, migration, and exceptions from `setItem`.
- Files: `src/storage.ts`, `src/storage.test.ts`, `src/components/FoldingPlayer.tsx`
- Risk: User-controlled or old local state can crash a lesson or silently corrupt progression.
- Priority: High

**Accessibility and responsive interaction:**
- What's not tested: Focus after screen changes, complete keyboard journeys, contrast, axe-style rules, reduced-motion behavior, zoom, and phone/tablet viewport layout.
- Files: `src/App.tsx`, `src/components/FoldingPlayer.tsx`, `src/styles.css`, `src/App.test.tsx`
- Risk: Regressions can disproportionately block keyboard, low-vision, or motion-sensitive children.
- Priority: High

**Photo and secondary user journeys:**
- What's not tested: Photo selection/replacement cleanup, decoration state, collection empty/non-empty behavior, exit/resume, previous/replay controls, and final-step callbacks for every lesson.
- Files: `src/App.tsx`, `src/components/FoldingPlayer.tsx`, `src/App.test.tsx`, `src/components/FoldingPlayer.test.tsx`
- Risk: Less-traveled controls can break unnoticed despite the core Dog journey passing.
- Priority: Medium

**Lesson rendering/content fidelity:**
- What's not tested: Each diagram identifier's intended SVG output and the real-world accuracy/comprehensibility of all 36 fold instructions.
- Files: `src/data/lessons.ts`, `src/data/lessons.test.ts`, `src/components/OrigamiCanvas.tsx`
- Risk: A syntactically valid lesson can teach an incorrect or impossible fold.
- Priority: High

---

*Concerns audit: 2026-08-29*
