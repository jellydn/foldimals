# AGENTS.md — Foldimals

Tablet-first origami learning PWA (kids 7–12) built with Vite + React 19 + TypeScript + Vitest. No backend, no env vars. Progress lives in the browser's `localStorage`.

## Toolchain (not Node/npm)

This repo uses **Bun**, not npm. CI pins Bun 1.4.0 and installs with `--frozen-lockfile`, so keep `bun.lock` in sync.

```bash
bun install        # NOT npm install
bun run dev        # vite --host 0.0.0.0
bun run test       # vitest run (single run, not watch)
bun run typecheck  # tsc -b
bun run lint       # eslint .
bun run build      # tsc -b && vite build
```

Run a single test file: `bun run test src/App.test.tsx`.
Mirror CI order locally: **test → typecheck → lint → build**.

## Architecture

- `src/main.tsx` — React root. Registers `public/sw.js` **only in PROD** (`import.meta.env.PROD`).
- `src/App.tsx` — the only routing layer. A `Screen` union (`home | preview | player | complete | collection`) switches screens; there is **no router library**.
- `src/types.ts` — the contracts: `AnimalLesson`, `FoldStep`, `FoldGuide`, `SavedProgress`, and `AnimalId = 'dog' | 'cat' | 'mouse' | 'frog' | 'bird'`.
- `src/data/lessons.ts` — all lesson copy and fold-guide coordinates. The **order of the `lessons` array is the progression order**; `isLessonUnlocked` unlocks a lesson only when the previous one is completed (index 0 always unlocked).
- `src/storage.ts` — `localStorage` key `foldimals-progress-v1`. `loadProgress`/`saveProgress` accept an injectable `Storage`, which the tests rely on.
- `src/components/` — `FoldingPlayer` (lesson-agnostic), `OrigamiCanvas` (SVG fold/target animation), `AnimalArt`.

The `FoldingPlayer` stays decoupled from lesson data through the `AnimalLesson`/`FoldStep` types in `src/types.ts`.

## Testing quirks

- Vitest + jsdom, `globals: true`, setup at `src/test/setup.ts`.
- `src/test/setup.ts` installs an in-memory `localStorage` mock plus `window.scrollTo` and `URL.createObjectURL`. Do **not** expect real `localStorage` in tests.
- Component tests use `@testing-library/react` + `user-event`; `import '@testing-library/jest-dom/vitest'` is already loaded in setup, so matchers like `toBeInTheDocument` are available without re-importing.

## Build & deploy quirks

- `vite.config.ts` sets `base: './'` (path-relative). This is **required** for GitHub Pages hosting at both the project subpath and the custom domain — do not switch to an absolute base.
- `public/sw.js` provides offline/PWA caching; `public/CNAME` and `public/manifest.webmanifest` declare the custom domain and PWA metadata.
- Deploy is automatic: push to `main` → GitHub Actions (`.github/workflows/deploy-pages.yml`) runs all four checks and publishes `dist/` via the official Pages actions. The custom domain must be attached in Pages settings and DNS validated by the repo owner.
- Dev server allows `.onamp.dev` hosts (`server.allowedHosts`).

## Deep-dive references

See `.planning/codebase/{ARCHITECTURE,STRUCTURE,STACK,TESTING}.md` and `docs/adr/README.md` for fuller context.
