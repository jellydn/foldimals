# Coding Conventions

**Analysis Date:** 2026-08-29

## Naming Patterns

**Files:**
- React components use PascalCase `.tsx` names (`src/App.tsx`, `src/components/FoldingPlayer.tsx`); utilities, data, and shared types use lowercase names (`src/storage.ts`, `src/data/lessons.ts`, `src/types.ts`).
- Tests are co-located with their subject and append `.test.ts` or `.test.tsx` (`src/storage.test.ts`, `src/components/FoldingPlayer.test.tsx`).

**Functions:**
- Components and component-local helpers use PascalCase (`AnimalCard`, `PaperDiagram`); handlers and domain helpers use descriptive camelCase (`askForHelp`, `completeAnimal`, `isLessonUnlocked`).
- Event callbacks are named with `on...` in props and at call sites (`onStepChange`, `onComplete`), while local actions use verbs (`choose`, `finish`, `replay`).

**Variables:**
- Values use camelCase; state pairs follow React's `[value, setValue]` form (`stepIndex`/`setStepIndex` in `src/components/FoldingPlayer.tsx`).
- Module constants use uppercase snake case only for a persistence key (`STORAGE_KEY` in `src/storage.ts`); immutable data and style objects otherwise use camelCase (`lessons`, `paperStyle`).

**Types:**
- Interfaces and type aliases use PascalCase (`AnimalLesson`, `SavedProgress`, `FoldingPlayerProps` in `src/types.ts` and `src/components/FoldingPlayer.tsx`).
- Component prop interfaces are named `<Component>Props`; small one-use prop shapes are written inline, as in `AppHeader` and `Home` in `src/App.tsx`.
- String unions model closed domains (`AnimalId`, `Screen`), and type-only dependencies use `import type`.

## Code Style

**Formatting:**
- No formatter or formatter configuration is present. Existing TypeScript uses two-space indentation, single quotes, no semicolons, trailing commas in multiline constructs, and JSX double-quoted attributes.
- JSX ranges from parenthesized multiline returns (`src/components/OrigamiCanvas.tsx`) to compact direct returns and multiple elements on one line (`src/App.tsx`); formatting is not automatically enforced.

**Linting:**
- ESLint 9 flat config lives in `eslint.config.js`; run `bun run lint` (`eslint .`) from `package.json`.
- It applies `@eslint/js` recommended and `typescript-eslint` recommended rules to `**/*.{ts,tsx}`, browser globals, React Hooks recommended rules, and `react-refresh/only-export-components` as a warning with constant exports allowed. `dist` is ignored.
- TypeScript is strict and no-emit under `tsconfig.app.json`; `bun run typecheck` runs project references through `tsc -b --pretty false`.

## Import Organization

**Order:**
1. External runtime dependencies (`react`, Testing Library).
2. Internal components/data/utilities via relative paths.
3. Type-only relative imports, generally after runtime imports.
4. Side-effect imports last (`src/main.tsx` imports `src/styles.css` after `App`; `src/test/setup.ts` imports jest-dom before setup code).

**Path Aliases:**
- None. `tsconfig.app.json` defines no `baseUrl` or `paths`; all internal imports are relative (`./storage`, `../types`).

## Error Handling

**Patterns:**
- `loadProgress` in `src/storage.ts` treats absent or malformed local-storage data as recoverable: it checks parsed fields, catches JSON/storage errors, and returns `emptyProgress` without surfacing an exception.
- Missing lesson lookup is handled with fallbacks: `App` uses `getLesson(selectedId) ?? lessons[0]`, while `Collection` returns `null` for an unknown completed ID (`src/App.tsx`).
- Other browser side effects are not wrapped: `saveProgress`, `URL.createObjectURL`, and service-worker registration can reject or throw without app-level reporting (`src/storage.ts`, `src/App.tsx`, `src/main.tsx`).

## Logging

**Framework:** None

**Patterns:**
- No `console` calls or logging package occur in tracked source. Recoverable storage errors are intentionally silent in `src/storage.ts`.

## Comments

**When to Comment:**
- Source contains no inline explanatory comments, TODOs, FIXMEs, or section comments. Intent is conveyed through names and small helpers such as `point` and `guide` in `src/data/lessons.ts`.

**JSDoc/TSDoc:**
- Not used in the TypeScript source; public shapes are expressed through interfaces and type aliases in `src/types.ts` and component files.

## Function Design

**Size:** Components are function components. Focused rendering/helpers are usually small (`AnimalArt`, storage helpers), but `App` and its page-level components are collected in the 183-line `src/App.tsx`, and `PaperDiagram` is a long conditional renderer in `src/components/OrigamiCanvas.tsx`.

**Parameters:** Components destructure typed props. Domain helpers accept explicit values; storage helpers inject narrow `Pick<Storage, ...>` dependencies with `localStorage` defaults, enabling tests without a full browser storage object (`src/storage.ts`).

**Return Values:** Components return JSX or `null`; immutable state helpers return new objects and spread nested state (`completeAnimal` in `src/storage.ts`). Simple selectors use expression-bodied arrows (`getLesson`, `isLessonUnlocked` in `src/data/lessons.ts`).

## Module Design

**Exports:** Components and helpers are named exports; `App` is the sole default export. Shared domain types are centralized in `src/types.ts`; lesson data and storage operations are separate modules.

**Barrel Files:** None. Callers import directly from concrete files such as `./components/AnimalArt` and `./data/lessons`.

---

*Convention analysis: 2026-08-29*
