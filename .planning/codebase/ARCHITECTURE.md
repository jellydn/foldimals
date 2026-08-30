# ARCHITECTURE.md — Foldimals

System patterns, layers, data flow, and abstractions for the Foldimals codebase.

## Overview

Foldimals is a **single-page, client-only React PWA**. One root component (`App`) is the only routing layer — it switches between five screens via a local `Screen` union with **no router library**. Curriculum content is plain typed data in `src/data/lessons.ts`, and a single reusable, lesson-agnostic player renders it. All personalization/state is embedded in the data contracts; all durable state lives in `localStorage`.

## Layering

```text
src/types.ts            # contracts (shared vocabulary)
src/data/lessons.ts     # curriculum data + pure helpers
src/storage.ts          # persistence abstraction over localStorage
src/components/         # presentation pieces (AnimalArt, OrigamiCanvas, FoldingPlayer)
src/App.tsx             # screen flow + state orchestration
src/main.tsx            # bootstrap + PWA service-worker registration
```

### 1. Contracts — `src/types.ts`

Defines the domain vocabulary that keeps layers decoupled:

- `AnimalId = 'dog' | 'cat' | 'mouse' | 'frog' | 'bird'`
- `Point` / `FoldGuide` (`line`, `arrow`, `targets`) — geometry for SVG fold guides
- `FoldStep` (`id`, `instruction`, `hint`, `diagram`, `guide`)
- `AnimalLesson` (`id`, `name`, `tagline`, `difficulty`, `minutes`, `color`, `paperColor`, `steps`)
- `SavedProgress` (`completed: AnimalId[]`, `current: Partial<Record<AnimalId, number>>`)

### 2. Curriculum data — `src/data/lessons.ts`

- Exports `lessons: AnimalLesson[]` in **progression order** (Dog → Cat → Mouse → Frog → Bird).
- `guide()` and `point()` builders keep coordinates compact.
- Pure helpers `getLesson(id)` and `isLessonUnlocked(index, completed)` control selection and unlocking: index 0 always unlocked; each later lesson unlocks only when the previous animal is completed.

### 3. Persistence — `src/storage.ts`

- `loadProgress` / `saveProgress` / `completeAnimal` around key `foldimals-progress-v1`.
- Accept an injectable `Pick<Storage, 'getItem'|'setItem'>` (defaults to `localStorage`) — this makes them unit-testable and keeps the app independent of a concrete storage.
- `loadProgress` defensively handles missing/corrupt JSON and returns `emptyProgress`.

### 4. Presentation components — `src/components/`

- **`AnimalArt`** — renders the completed origami animal as inline SVG for any `AnimalId`; supports an optional `decorated` stars overlay.
- Screen components — `AppHeader`, `AnimalCard`, `Home`, `Preview`, `Completion`, and `Collection` extracted from `App.tsx`; `Completion` revokes object URLs on change/unmount.
- **`OrigamiCanvas`** — pure SVG renderer for a single fold step: draws the paper diagram (`PaperDiagram`), the crease line, the fold arrow (with SVG `marker` arrowhead), and optional highlighted target dots. Re-mounts on a React `key` (`animationKey`) to retrigger CSS animation; a `slow`/"detailed help" flag toggles emphasis.
- **`FoldingPlayer`** — screen for stepping through one `AnimalLesson`. Owns `stepIndex`, `animationKey`, and `helpLevel` (0 = default, 1 = slow replay, 2 = detailed targets + hint). Calls `onStepChange`, `onExit`, `onComplete`; never imports lesson content directly.

### 5. Screen orchestration — `src/App.tsx`

- Holds app-wide state: `screen`, `selectedId`, and `progress` (loaded once from storage).
- Clamps persisted `current[id]` step indices against lesson step counts via `clampStepIndices` on load.
- Five screens: `home` | `preview` | `player` | `complete` | `collection`.
- Owns pure reducer-style helpers `updateStep`, `finish`, `home`, `choose` that mutate `progress` through `setProgress`.
- Critical flow: on `finish()`, calls `completeAnimal` (marks completed, resets current step) then shows completion.
- Persists `progress` via `useEffect` whenever it changes.

### 6. Bootstrap — `src/main.tsx`

- `createRoot` renders `<App/>` in `<StrictMode/>`.
- Conditionally registers `public/sw.js` **only in production** (`import.meta.env.PROD`).

## Key Data Flow

```text
lessons.ts ──┬──> Home cards (unlock via isLessonUnlocked)
             └──> Preview ──> FoldingPlayer ──> onStepChange
                                                └──> onComplete
                                                     └──> App.finish ─> completeAnimal ─> Completion + localStorage
```

1. **Rendering a step:** `App` → `FoldingPlayer` (holds `stepIndex`) → `OrigamiCanvas` gets `lesson.steps[stepIndex]` + a `FoldStep` → SVG.
2. **Resuming:** `FoldingPlayer` is initialized with `initialStep` from `progress.current[selectedId]`.
3. **Persistence:** every step change triggers `App.updateStep` → `setProgress` → `useEffect` → `saveProgress`.
4. **Progression:** completing the last step of a lesson fires `onComplete` → `App.finish` records completion and unlocks the next animal.

## State Management

- **No global state library.** App state is `useState` in `App`; transient player state (`stepIndex`, `helpLevel`, `animationKey`) is local `useState` in `FoldingPlayer`.
- `useCallback` stabilizes `updateStep` to keep the `FoldingPlayer` effect dependency stable.
- Progress is "lifted" to `App` (single source of truth), while per-visit UI state stays in leaf components.

## Abstraction & Extension Points

- **Adding a new animal/lesson:** add a `AnimalLesson` to `lessons.ts` (with `steps`, guides, colors). The player and canvas are lesson-agnostic, so likely **no component changes** — unless the new model needs a new `diagram` string, which requires a `PaperDiagram` branch in `OrigamiCanvas` and a pose branch in `AnimalArt`.
- **Changing persistence:** `storage.ts` isolates the storage implementation (per ADR 0001's injectable `Storage`), so a future backend sync could swap it without touching components.
- **New screen:** add a value to the `Screen` union, a render branch in `App`, and state to drive it.

## Security & Privacy Model

- Photos are previewed on-device via object URLs and never uploaded.
- Service worker caches only static app assets.
- No PII is collected; progress is anonymous local storage.