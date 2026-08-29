# Codebase Structure

**Analysis Date:** 2026-08-29

## Directory Layout

```
foldimals/
├── .github/workflows/          # GitHub Pages verification and deployment
│   └── deploy-pages.yml
├── .planning/codebase/         # Generated current-state architecture map
│   ├── ARCHITECTURE.md
│   └── ...                     # Stack, structure, testing, concerns, etc.
├── docs/adr/                   # Accepted architecture decision records
│   ├── README.md
│   ├── 0001-use-a-client-only-data-driven-pwa.md
│   └── 0002-deploy-as-a-static-site-on-github-pages.md
├── public/                    # Static PWA assets copied unchanged by Vite
│   ├── CNAME                  # Production custom-domain declaration
│   ├── foldimals-icon.svg     # App/favicon and manifest icon
│   ├── manifest.webmanifest   # Install metadata
│   └── sw.js                  # Offline cache service worker
├── src/                       # Browser application source
│   ├── components/            # Reusable player and SVG presentation
│   │   ├── AnimalArt.tsx
│   │   ├── FoldingPlayer.tsx
│   │   ├── FoldingPlayer.test.tsx
│   │   └── OrigamiCanvas.tsx
│   ├── data/                  # Authored curriculum content and tests
│   │   ├── lessons.ts
│   │   └── lessons.test.ts
│   ├── test/                  # Shared Vitest browser-test setup
│   │   └── setup.ts
│   ├── App.tsx                # Screen composition and app state controller
│   ├── App.test.tsx           # End-to-end component journey tests
│   ├── main.tsx               # React and service-worker bootstrap
│   ├── storage.ts             # Local progress persistence
│   ├── storage.test.ts        # Storage behavior tests
│   ├── styles.css             # All global/responsive styling and animation
│   └── types.ts               # Shared lesson and progress domain types
├── .gitignore                 # Generated/local exclusions
├── README.md                  # Product summary and developer commands
├── bun.lock                   # Locked dependency graph
├── eslint.config.js           # TypeScript/React flat lint configuration
├── index.html                 # Vite browser document entry
├── package.json               # Scripts and dependencies
├── tsconfig.app.json          # Browser source TypeScript project
├── tsconfig.node.json         # Tooling configuration TypeScript project
├── tsconfig.json              # Composite TypeScript references
└── vite.config.ts             # Vite, React plugin, and Vitest configuration
```

## Directory Purposes

**`src/`:**
- Purpose: Complete client application; there is no server-side source tree.
- Contains: Bootstrap, screen orchestration, domain types, storage adapter, styles, and colocated top-level tests.
- Key files: `src/main.tsx`, `src/App.tsx`, `src/types.ts`, `src/storage.ts`, `src/styles.css`

**`src/components/`:**
- Purpose: Reusable UI below the screen level, centered on lesson playback and SVG output.
- Contains: PascalCase React components and a colocated component test.
- Key files: `src/components/FoldingPlayer.tsx`, `src/components/OrigamiCanvas.tsx`, `src/components/AnimalArt.tsx`

**`src/data/`:**
- Purpose: Static, ordered curriculum and progression queries.
- Contains: Five animal lessons and their step/guide coordinates, plus content invariant tests.
- Key files: `src/data/lessons.ts`, `src/data/lessons.test.ts`

**`src/test/`:**
- Purpose: Shared test-environment initialization rather than product code.
- Contains: jest-dom matchers and jsdom replacements for scrolling, object URLs, and local storage.
- Key files: `src/test/setup.ts`

**`public/`:**
- Purpose: Assets that must retain stable root URLs and bypass module bundling.
- Contains: PWA manifest, service worker, SVG icon, and Pages custom-domain declaration.
- Key files: `public/manifest.webmanifest`, `public/sw.js`, `public/foldimals-icon.svg`, `public/CNAME`

**`.github/workflows/`:**
- Purpose: Repeatable verification and GitHub Pages delivery.
- Contains: One release workflow with read-only checks and a separate least-privilege deploy job.
- Key files: `.github/workflows/deploy-pages.yml`

**`docs/adr/`:**
- Purpose: Preserve accepted architectural decisions and their trade-offs.
- Contains: An index plus numbered records for the client-only PWA and GitHub Pages hosting choices.
- Key files: `docs/adr/README.md`, `docs/adr/0001-use-a-client-only-data-driven-pwa.md`, `docs/adr/0002-deploy-as-a-static-site-on-github-pages.md`

## Key File Locations

**Entry Points:**
- `index.html`: Browser document, metadata, manifest link, root node, and module-script entry.
- `src/main.tsx`: React root creation, global stylesheet import, and production service-worker registration.
- `src/App.tsx`: Logical application entry and finite screen flow.
- `public/sw.js`: Independent service-worker event entry point.

**Configuration:**
- `package.json`: Bun-facing scripts for development, checks, and production builds.
- `vite.config.ts`: React transform, dev allowed host, and Vitest/jsdom setup.
- `tsconfig.json`: References browser and tooling TypeScript projects.
- `tsconfig.app.json`: Strict browser/React compiler settings and `src` scope.
- `tsconfig.node.json`: Strict Vite/ESLint configuration compiler settings.
- `eslint.config.js`: ESLint recommended TypeScript, hooks, and refresh rules.
- `public/manifest.webmanifest`: PWA name, colors, display mode, start URL, and icon.
- `.github/workflows/deploy-pages.yml`: Release checks, artifact build, and GitHub Pages deployment permissions.
- `public/CNAME`: Production domain copied into `dist/` by Vite.

**Core Logic:**
- `src/App.tsx`: Home/preview/player/completion/collection transitions and parent state.
- `src/components/FoldingPlayer.tsx`: Step navigation, replay, progressive help, and completion callback.
- `src/components/OrigamiCanvas.tsx`: Diagram-name-to-SVG rendering and fold guide overlay.
- `src/data/lessons.ts`: Canonical lesson order/content and sequential unlock rule.
- `src/storage.ts`: Progress load/save/completion behavior.
- `src/types.ts`: Shared content and persistence model.

**Testing:**
- `src/App.test.tsx`: Core selection, resume/unlock, and completion journey.
- `src/components/FoldingPlayer.test.tsx`: Player progression and help behavior.
- `src/data/lessons.test.ts`: Lesson ordering, step counts, guides, and unlocking.
- `src/storage.test.ts`: Malformed data fallback, serialization, and idempotent completion.
- `src/test/setup.ts`: Global Vitest/jsdom setup configured by `vite.config.ts`.

**Presentation and PWA:**
- `src/styles.css`: Single global stylesheet containing all page/component rules, animations, breakpoints, and reduced-motion handling.
- `src/components/AnimalArt.tsx`: Shared finished-animal SVG visuals.
- `public/sw.js`: Cache-first GET strategy and navigation fallback.
- `public/foldimals-icon.svg`: Stable icon URL shared by HTML and manifest.

## Naming Conventions

**Files:**
- PascalCase `.tsx` for exported React components: `src/components/FoldingPlayer.tsx`, `src/components/AnimalArt.tsx`.
- Lowercase `.ts` for data, types, storage, and test setup modules: `src/data/lessons.ts`, `src/storage.ts`, `src/types.ts`.
- Tests use the source basename plus `.test.ts` or `.test.tsx` and are colocated with the tested module: `src/storage.test.ts`, `src/components/FoldingPlayer.test.tsx`.
- Root tool configuration uses ecosystem-standard names: `vite.config.ts`, `eslint.config.js`, `tsconfig.app.json`.
- Stable public assets use descriptive lowercase names: `public/foldimals-icon.svg`, `public/manifest.webmanifest`, `public/sw.js`.

**Directories:**
- Lowercase role-based directories under `src`: `src/components/`, `src/data/`, `src/test/`.
- The current tree is shallow: screens remain private functions in `src/App.tsx`; only reusable UI is extracted to `src/components/`.

**Symbols and Content IDs:**
- Components/types use PascalCase (`FoldingPlayer`, `AnimalLesson`); functions/variables use camelCase (`loadProgress`, `stepIndex`).
- Animal IDs are lowercase union literals (`dog`, `cat`, `mouse`, `frog`, `bird`) in `src/types.ts`.
- Step IDs use `<animal>-<ordinal>` and diagram IDs use lowercase hyphenated semantic states, with final states ending in `final` (`src/data/lessons.ts`).
- CSS classes are lowercase kebab-case and globally scoped (`player-layout`, `collection-grid`) in `src/styles.css`.

## Where to Add New Code

**New Feature:**
- Primary code: Extend screen-level behavior in `src/App.tsx`; extract reusable interaction/rendering into `src/components/` when it is not specific to one screen.
- Tests: Colocate as `src/<module>.test.ts(x)` or `src/components/<Component>.test.tsx`, following existing files.

**New Component/Module:**
- Implementation: Add reusable visual/interactive components to `src/components/`; keep non-React domain helpers in a focused lowercase module under `src/`.

**New Lesson or Animal Content:**
- Domain ID/type: Update `AnimalId` in `src/types.ts`.
- Curriculum: Add the ordered `AnimalLesson` and fold guides in `src/data/lessons.ts`.
- Rendering: Add final artwork in `src/components/AnimalArt.tsx` and every new diagram vocabulary/state in `src/components/OrigamiCanvas.tsx`.
- Tests: Update content order/count/unlock expectations in `src/data/lessons.test.ts` and add journey coverage where progression changes affect `src/App.tsx`.

**New Screen:**
- State and composition: Add a `Screen` variant and transition/render branch in `src/App.tsx`; this project does not currently have route files or a router.
- Styling: Add global rules and responsive variants to `src/styles.css`.

**Utilities:**
- Shared helpers: Keep domain-wide contracts in `src/types.ts`; add a focused lowercase module beside `src/storage.ts` rather than creating a generic utility directory without multiple consumers.

**PWA Assets/Behavior:**
- Static install assets: `public/`, with matching root-relative references in `index.html` or `public/manifest.webmanifest`.
- Offline policy: `public/sw.js`; change `CACHE` when a cache migration is required.

## Special Directories

**`public/`:**
- Purpose: Root-addressable PWA resources copied directly into the Vite output.
- Generated: No.
- Committed: Yes.

**`src/test/`:**
- Purpose: Shared test harness loaded before each Vitest suite.
- Generated: No.
- Committed: Yes.

**`dist/`:**
- Purpose: Vite production build output created by `bun run build`.
- Generated: Yes.
- Committed: No; excluded by `.gitignore`.

**`node_modules/`:**
- Purpose: Installed package tree represented reproducibly by `bun.lock`.
- Generated: Yes.
- Committed: No; excluded by `.gitignore`.

**`.planning/codebase/`:**
- Purpose: Generated repository architecture and structure map for planning.
- Generated: Yes, by the codebase mapping task.
- Committed: Yes; refresh the map when architecture, integrations, or conventions materially change.

**`docs/adr/`:**
- Purpose: Numbered records for consequential architecture decisions.
- Generated: No; records are intentionally authored and reviewed.
- Committed: Yes.

**`.github/workflows/`:**
- Purpose: CI and deployment automation.
- Generated: No.
- Committed: Yes.

---

*Structure analysis: 2026-08-29*
