# TESTING.md — Foldimals

Framework, structure, mocking, and coverage for the Foldimals codebase.

## Framework & Setup

- **Vitest** (`^4.0.0`) with `globals: true`, `environment: 'jsdom'`, run single-pass via `bun run test` (`vitest run` — **not** watch mode).
- Setup file: `src/test/setup.ts`, referenced from `vite.config.ts` (`test.setupFiles`).
- DOM matchers from `@testing-library/jest-dom/vitest` are loaded globally in setup (e.g. `toBeInTheDocument`, `toBeDisabled`, `toBeEnabled`); components use `@testing-library/react` + `userEvent`.
- Run a single file: `bun run test src/App.test.tsx`.

## Setup (`src/test/setup.ts`)

Installs and stubs browser globals so jsdom behaves predictably:

- **In-memory `localStorage` mock** (`Object.defineProperty(globalThis, 'localStorage', ...)`) with a `Map`-backed store. Tests must **not** expect real `localStorage`.
- `window.scrollTo` stubbed to a no-op.
- `URL.createObjectURL` stubbed to return a fixed `'blob:photo'`.

## Test Files & What They Cover

| File | Coverage |
| --- | --- |
| `src/App.test.tsx` | App integration journey: only Dog unlocked at start; entering Dog and stepping to preview/player; restoring saved progress from storage and unlocking progressed animals; completing a lesson → adds to collection → unlocks next animal |
| `src/storage.test.ts` | Persistence resilience (missing/corrupt JSON → `emptyProgress`); `saveProgress` writes correct key/values; `completeAnimal` completes an animal once (no duplicates) |
| `src/data/lessons.test.ts` | Curriculum invariants: five lessons in progression order; declared per-lesson step ranges (`[6,6,7,8,9]`); every step has a defined `guide`; `isLessonUnlocked` unlocking rules |
| `src/components/FoldingPlayer.test.tsx` | Step advancement (one fold at a time); progressive help (I need help → Show me more help → hint + target text); hint cleared when advancing |
| `src/components/OrigamiCanvas.test.tsx` | Fold diagram renders crease/arrow; `detailedHelp` emphasizes crease + target dots; `slow` adds `is-slow` class; final step shows the finished animal instead of a diagram |
| `src/components/AnimalArt.test.tsx` | Renders a labeled svg for each animal; accepts `className`; decorative stars appear only when `decorated` |
| `src/components/Completion.test.tsx` | Replacing a photo revokes its object URL; unmounting revokes the final active URL |

## Patterns

### Component tests (`App.test.tsx`, `FoldingPlayer.test.tsx`)

- `render(<Component .../>)`, then query with `screen.getByRole('button', { name: ... })` / `getByText` / `getByRole('heading')`.
- Uses `userEvent.setup()` + `await user.click(...)` for realistic interactions.
- `beforeEach(() => localStorage.clear())` resets the storage mock between tests.
- Asserts progression and unlocking through composed behaviors (enabled/disabled buttons, headings, step labels).

### Unit tests (`storage.test.ts`, `lessons.test.ts`)

- Test pure helpers directly with explicit expectations; `loadProgress`/`saveProgress` use injected fake `Storage` (`{ getItem: ... }`, `{ setItem: ... }`) to avoid touching the global mock.

## Mocking Strategy

- Prefer real rendering + the injected-`Storage` seam over mocking modules. The `storage.ts` API already accepts fake storage, so `storage.test.ts` needs no spies.
- Browser APIs (scrollTo, object URLs, localStorage) are stub-installed in setup rather than per-test.
- `userEvent` provides interaction; no manual `fireEvent`/DOM event mocking except through the file-input `onChange` in `Completion` (asserted via the file-input label/behavior in App journey).

## Coverage

- No `coverage` threshold configured (`coverage` dir is `.gitignore`'d, so coverage output isn't enforced in CI).
- Tests run in CI **before** typecheck/lint in `deploy-pages.yml`; a red test blocks the build and deploy.

## Commands

```bash
bun run test                    # full suite (single run)
bun run test src/App.test.tsx   # single test file
bun run typecheck               # strict TS check
bun run lint                    # ESLint
bun run build                   # typecheck + vite build
```

## Known Gaps / Opportunities

- `OrigamiCanvas` and `AnimalArt` now have direct unit tests.
- `Collection` is covered indirectly through the App journey; decoration interactions still lack direct coverage.
- No snapshot or visual-regression tests; geometry bug risk lives in hand-authored guide coordinates in `lessons.ts`.
