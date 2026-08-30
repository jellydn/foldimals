# CONCERNS.md — Foldimals

Technical debt, bugs, security/performance risks, and fragile areas.

## Summary

Foldimals is small and healthy, but several areas carry manual, release-time risk — especially hand-authored SVG geometry and the hand-written service worker. There is **no automation for UI/visual correctness and no error tracking**.

## Technical Debt & Maintainability

- **Monolithic `src/App.tsx`.** All five screens (`Home`, `Preview`, `Completion`, `Collection`, `AppHeader`, `AnimalCard`) plus routing and state live in one ~250-line file. It's manageable now but trending toward component-file extraction would improve readability and testability.
- **Hand-rolled routing (`Screen` union)** — fine for 5 screens; a competitor/router is unnecessary, but there's no deep-linking or back/forward history support (e.g. refresh lands on `home` regardless).
- **`lessons.ts` is data-heavy with hand-authored coordinates.** The `guide(...)` compact tuples are hard to read/verify visually; correctness of folds relies on manual review rather than rendering tests.
- **Duplicated geometry between data & renderer.** `diagram` string vocabulary must stay in sync with `PaperDiagram` branches in `OrigamiCanvas.tsx` and pose branches in `AnimalArt.tsx`. Adding a new fold type touches data + renderer with no compile-time coupling between them (arbitrary strings).
- **`renovate.json` present but no visible config tuning** (default renovate behavior). Minor.

## Potential Bugs & Fragile Areas

- **`FoldingPlayer` `helpLevel`/replay coupling:** `askForHelp` increments `helpLevel` and replays; state transitions (0→1→2) drive slow/detailed modes. Logic is concentrated in one component; further help modes would need refactor. Edge: `goToStep` resets help but `replay` alone preserves it.
- **`isFinal` relies on `diagram.endsWith('final')` string convention.** Any lesson step named e.g. `*-final-eared` would accidentally be treated as final; brittle to naming.
- **Progress `current[id]` indexing:** `updateStep` keys by the *currently selected* animal. If a user switches animals mid-lesson the persisted step tracks per-id correctly via `progress.current[id]`, but there's no validation that a persisted `current` index is `< steps.length` — a stale/corrupt index is clamped only in `FoldingPlayer` (`Math.min(initialStep, steps.length - 1)`), and `storage.ts` doesn't sanitize numeric bounds.
- **Browser state loss:** progress is unsynced across devices and lost when site data is cleared (documented in ADR 0001, acceptable for target audience, but worth flagging if multi-device ever matters).
- **Photo handling:** `Completion` uses object URLs that are never revoked — a minor memory consideration; photo is also lost on reload (by design, never persisted).

## Security & Privacy

- **No backend/analytics/PII** — positive privacy posture; no secrets in repo (verified: only static assets and config).
- **Fonts loaded from Google Fonts CDN** — a small external request (tracking/privacy + offline caveat); offline PWA shell won't load Google Fonts without connectivity unless cached.
- **Service worker caching** is generally safe (only GET, cache-first with fallback), but could serve stale assets without cache-busting discipline when `CACHE` version changes are missed.

## Performance

- **Bundle is tiny** (React + two-ish components, inline SVG). No obvious bottleneck at this scale.
- **Re-mount animation approach:** OrigamiCanvas remounts the `<svg>` on every `animationKey` change (via React `key`) to retrigger CSS — this is simple but causes full re-render of that subtree; fine for current scale.
- **No image/asset heavy loads** — geometry is hand-coded SVG, ideal for the domain.
- `bun` build output not measured, but PWA scope is minimal (shell + icon).

## Risk Matrix (priority)

| Area | Risk | Mitigation |
| --- | --- | --- |
| Hand-authored fold geometry | **High** — visual correctness of the core product | Rigorous manual review; add rendering/snapshot tests |
| Diagram-string ↔ renderer coupling | **Medium** — data/renderer can drift silently | Type the `diagram` union; centralize the vocabulary |
| `App.tsx` monolith | **Medium** — long-term readability/testability | Extract per-screen components; add component tests |
| Persisted `current` index bounds | **Low-Medium** — stale index if corrupt | Sanitize/bound in `storage.ts` |
| Object-URL lifecycle | **Low** | Revoke URLs after preview |
| Service-worker cache versioning | **Low** | Keep `CACHE` version bumped on asset changes |
| No error monitoring | **Low** (static app) | Acceptable for scope; revisit if it grows |

## Status of Previously-Recorded Concerns

The following concerns have been addressed in the `chore/address-codebase-concerns` branch:

- **Type-safe diagram union** — added `DiagramId` in `types.ts`; `OrigamiCanvas` now renders shapes via an exhaustive `switch` on `DiagramId`.
- **Bound persisted step indices** — `clampStepIndices` in `storage.ts` clamps `current[id]` against step counts on load.
- **Unit tests for `OrigamiCanvas` and `AnimalArt`** — added.
- **Revoke object URLs** — `Completion` revokes photo URLs on change and unmount.
- **Split `App.tsx` screens** — screens extracted into `src/components/{AppHeader,AnimalCard,Home,Preview,Completion,Collection}.tsx`.

Remaining opportunities: visual/snapshot regression tests for the hand-authored fold geometry, and deeper coverage of this release-correctness risk.