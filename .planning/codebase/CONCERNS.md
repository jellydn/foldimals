# CONCERNS.md — Foldimals

Technical debt, bugs, security/performance risks, and fragile areas.

## Summary

Foldimals is small and healthy, but several areas carry manual, release-time risk — especially hand-authored SVG geometry and the hand-written service worker. There is **no automation for UI/visual correctness and no error tracking**.

## Technical Debt & Maintainability

- **Hand-rolled routing (`Screen` union)** — fine for 5 screens; a competitor/router is unnecessary, but there's no deep-linking or back/forward history support (e.g. refresh lands on `home` regardless).
- **`lessons.ts` is data-heavy with hand-authored coordinates.** The `guide(...)` compact tuples are hard to read/verify visually; correctness of folds relies on manual review rather than rendering tests.
- **`renovate.json` present but no visible config tuning** (default renovate behavior). Minor.

## Potential Bugs & Fragile Areas

- **`FoldingPlayer` `helpLevel`/replay coupling:** `askForHelp` increments `helpLevel` and replays; state transitions (0→1→2) drive slow/detailed modes. Logic is concentrated in one component; further help modes would need refactor. Edge: `goToStep` resets help but `replay` alone preserves it.
- **Browser state loss:** progress is unsynced across devices and lost when site data is cleared (documented in ADR 0001, acceptable for target audience, but worth flagging if multi-device ever matters).
- **Photo handling:** completion photos are intentionally ephemeral and lost on reload; they are never persisted or uploaded.

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
