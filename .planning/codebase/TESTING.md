# Testing Patterns

**Analysis Date:** 2026-08-29

## Test Framework

**Runner:**
- Vitest 4 (`^4.0.0` in `package.json`; `4.1.11` resolved in `bun.lock`)
- Config: `vite.config.ts` uses the `jsdom` environment, loads `./src/test/setup.ts`, and enables global test APIs.

**Assertion Library:**
- Vitest's global `expect`, extended with `@testing-library/jest-dom/vitest` in `src/test/setup.ts`.
- React Testing Library 16 and `@testing-library/user-event` drive component rendering and interaction.

**Run Commands:**
```bash
bun run test                         # Run all tests once (vitest run)
bunx vitest                          # Watch mode; available from installed Vitest, no package script
# No working coverage command is configured; no Vitest coverage provider is installed
```

All required commands also run on pushes to `main` before deployment in `.github/workflows/deploy-pages.yml`. The Pages artifact is uploaded only after the test, typecheck, lint, and build steps succeed.

## Test File Organization

**Location:**
- Tests are co-located beside source: `src/App.test.tsx`, `src/storage.test.ts`, `src/data/lessons.test.ts`, and `src/components/FoldingPlayer.test.tsx`.
- Shared browser setup is isolated in `src/test/setup.ts`.

**Naming:**
- Subject basename plus `.test.ts` for logic and `.test.tsx` for React components.

**Structure:**
```
src/<module>.test.ts[x]
src/components/<Component>.test.tsx
src/data/<module>.test.ts
src/test/setup.ts
```

## Test Structure

**Suite Organization:**
```typescript
describe('progress storage', () => {
  it('safely handles missing and malformed progress', () => {
    expect(loadProgress({ getItem: () => null })).toEqual(emptyProgress)
    expect(loadProgress({ getItem: () => '{bad json' })).toEqual(emptyProgress)
  })
})
```
This pattern is used in `src/storage.test.ts`: imports, one subject-oriented `describe`, behavior-named `it` cases, then arrange/act/assert statements inline.

**Patterns:**
- `src/App.test.tsx` clears shared `localStorage` in `beforeEach`; no test has explicit teardown.
- Component tests call `userEvent.setup()`, `render(...)`, then await user clicks and assert through `screen`.
- Queries favor accessible roles and names (`getByRole`) for controls/headings, with `getByText` for visible progress/help and `queryByText` for absence.
- Logic tests use direct calls and structural assertions (`toEqual`, `toBe`, `toBeDefined`); component assertions use jest-dom matchers such as `toBeDisabled` and `toBeInTheDocument`.

## Mocking

**Framework:** Hand-written fakes; Vitest mock/spy APIs are not used.

**Patterns:**
```typescript
const storage: Storage = {
  get length() { return values.size },
  clear: () => values.clear(),
  getItem: (key) => values.get(key) ?? null,
  key: (index) => [...values.keys()][index] ?? null,
  removeItem: (key) => { values.delete(key) },
  setItem: (key, value) => { values.set(key, value) },
}
Object.defineProperty(globalThis, 'localStorage', { value: storage, configurable: true })
```
`src/test/setup.ts` also stubs `window.scrollTo` and `URL.createObjectURL`. `src/storage.test.ts` injects minimal `getItem`/`setItem` objects directly into storage functions.

**What to Mock:**
- Browser APIs absent or inconvenient in jsdom (`scrollTo`, object URLs) and persistent local storage are replaced globally in `src/test/setup.ts`.
- Narrow infrastructure dependencies are passed directly to `loadProgress` and `saveProgress` in `src/storage.test.ts`.

**What NOT to Mock:**
- React child components, lesson data, and storage integration are real in `src/App.test.tsx`; its journey tests exercise the assembled app through the DOM rather than mocking module boundaries.

## Fixtures and Factories

**Test Data:**
```typescript
localStorage.setItem(
  STORAGE_KEY,
  JSON.stringify({ completed: ['dog'], current: { cat: 2 } }),
)
```
`src/App.test.tsx` seeds small progress objects inline. `src/components/FoldingPlayer.test.tsx` uses the production `lessons[0]`; `src/storage.test.ts` defines its progress value inline.

**Location:**
- No fixture/factory directory exists. Data is inline or imported from `src/data/lessons.ts`.

## Coverage

**Requirements:** None enforced. `vite.config.ts` has no coverage settings or thresholds, `package.json` has no coverage script/provider, and `.gitignore` merely ignores a possible `coverage` directory.

**View Coverage:**
```bash
# Unavailable as configured. Add @vitest/coverage-v8 or @vitest/coverage-istanbul first,
# then run: bunx vitest run --coverage
```
- Existing tests cover 8 behaviors across 4 files: the main Dog journey/progress restoration (`src/App.test.tsx`), progressive help and advancing (`src/components/FoldingPlayer.test.tsx`), lesson ordering/unlocks (`src/data/lessons.test.ts`), and basic storage parsing/save/idempotent completion (`src/storage.test.ts`).
- Not directly covered: `src/components/AnimalArt.tsx`, `src/components/OrigamiCanvas.tsx`, `src/main.tsx`, collection empty/populated interactions, completion decoration/photo controls, replay/previous/exit callbacks, last-step completion callback in `FoldingPlayer`, non-array/non-object parsed storage fields, storage write failures, and service-worker registration.

## Test Types

**Unit Tests:**
- `src/data/lessons.test.ts` validates data shape/progression rules; `src/storage.test.ts` validates pure/persistence helpers with injected fakes.
- `src/components/FoldingPlayer.test.tsx` is a focused component test using real lesson data and DOM interaction.

**Integration Tests:**
- `src/App.test.tsx` renders the full app with real child components and in-memory local storage. It covers initial locking, lesson entry, saved progression restoration, completing all six Dog steps, collection reward copy, and unlocking Cat.

**E2E Tests:**
- Not used. No Playwright/Cypress dependency, config, or browser-level test directory exists.

## Common Patterns

**Async Testing:**
```typescript
const user = userEvent.setup()
render(<App />)
await user.click(screen.getByRole('button', { name: 'Dog' }))
expect(screen.getByRole('heading', { name: 'Dog' })).toBeInTheDocument()
```
User interactions are awaited; assertions are immediate because updates complete within `user.click` (`src/App.test.tsx`). No `waitFor`, fake timers, or async network tests are present.

**Error Testing:**
```typescript
expect(loadProgress({ getItem: () => null })).toEqual(emptyProgress)
expect(loadProgress({ getItem: () => '{bad json' })).toEqual(emptyProgress)
```
The only explicit error-path test verifies graceful fallback for absent and malformed serialized progress in `src/storage.test.ts`; no rejection or thrown-error assertions are present.

---

*Testing analysis: 2026-08-29*
