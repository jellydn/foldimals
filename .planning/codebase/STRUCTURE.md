# STRUCTURE.md — Foldimals

Directory layout, key locations, and naming conventions.

## Directory Tree

```text
.
├── .github/workflows/deploy-pages.yml  # CI/CD: verify + deploy to GitHub Pages
├── .planning/                          # Codebase mapping docs (this skill's output)
│   └── codebase/
├── docs/
│   └── adr/                            # Architecture Decision Records
│       ├── README.md                   # ADR index table
│       ├── 0001-use-a-client-only-data-driven-pwa.md
│       └── 0002-deploy-as-a-static-site-on-github-pages.md
├── public/                             # Static assets copied verbatim to dist
│   ├── CNAME                           # Custom domain declaration
│   ├── foldimals-icon.svg              # PWA icon
│   ├── manifest.webmanifest            # PWA manifest
│   └── sw.js                           # Hand-written service worker
├── src/                                # Application source
│   ├── main.tsx                        # React bootstrap + SW registration
│   ├── App.tsx                         # Root component + only routing layer
│   ├── styles.css                      # All global styling
│   ├── types.ts                        # Domain contracts
│   ├── storage.ts                      # localStorage persistence
│   ├── data/
│   │   └── lessons.ts                  # Curriculum + fold-guide coordinates│   ├── components/
│   │   ├── AnimalArt.tsx               # Finished-origami SVG per animal
│   │   ├── OrigamiCanvas.tsx           # Per-step SVG fold/target diagram (typed DiagramId)
│   │   ├── FoldingPlayer.tsx            # Step-through lesson player screen
│   │   ├── AppHeader.tsx               # Top nav (wordmark + My Animals)
│   │   ├── AnimalCard.tsx              # Per-animal grid card
│   │   ├── Home.tsx                    # Landing grid screen
│   │   ├── Preview.tsx                 # Lesson overview screen
│   │   ├── Completion.tsx              # Finished state + decoration/photo
│   │   └── Collection.tsx              # My Animals screen
│   └── test/
│       └── setup.ts                    # Test setup: localStorage mock, globals
├── index.html                          # Vite HTML entry
├── package.json
├── bun.lock                            # Bun lockfile (keep in sync)
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── vite.config.ts
├── renovate.json
└── AGENTS.md
```

## Key Locations

| Concern | File(s) |
| --- | --- |
| App entry / bootstrap | `src/main.tsx` |
| Screen routing + state | `src/App.tsx` |
| Domain types | `src/types.ts` |
| Lesson content + guides | `src/data/lessons.ts` |
| Persistence | `src/storage.ts` |
| Fold animation / SVG | `src/components/OrigamiCanvas.tsx` |
| Reusable player | `src/components/FoldingPlayer.tsx` |
| Finished animal art | `src/components/AnimalArt.tsx` |
| Screen components | `src/components/{AppHeader,AnimalCard,Home,Preview,Completion,Collection}.tsx` |
| Styling | `src/styles.css` |
| PWA assets | `public/` (sw.js, manifest, icon, CNAME) |
| Deployment pipeline | `.github/workflows/deploy-pages.yml` |
| Architectural decisions | `docs/adr/` |

## Naming Conventions

- **Files:** `kebab-case.ts` / `kebab-case.tsx` except component files, which use PascalCase (`FoldingPlayer.tsx`). React components are also PascalCase function names (`function App`, `export function FoldingPlayer`).
- **Test files:** colocated with source using the `<file>.test.ts(x)` suffix (`App.test.tsx`, `storage.test.ts`, `lessons.test.ts`, `FoldingPlayer.test.tsx`).
- **Types & Interfaces:** PascalCase (`AnimalLesson`, `FoldStep`). Type aliases for unions (`AnimalId`, `Screen`) use PascalCase too.
- **Constants:** `SCREAMING_SNAKE_CASE` exported at module level (`STORAGE_KEY`, `emptyProgress`).
- **Functions:** camelCase (`loadProgress`, `completeAnimal`, `isLessonUnlocked`, `getLesson`).
- **Diagram identifiers:** `kebab-case` (`'dog-snout'`, `'frog-sides'`, `'bird-final'`); strings ending in `final` represent the completed model (`isFinal = step.diagram.endsWith('final')`).

## Screen Layout (`src/App.tsx`)

Local `Screen` union drives the one root component:

- `home` → `Home` (hero + animal grid)
- `preview` → `Preview` (lesson overview, resume/start button)
- `player` → `FoldingPlayer` (step-through fold display)
- `complete` → `Completion` (celebration + decoration/photo)
- `collection` → `Collection` ("My Animals" grid of completed animals)

The `player` screen returns `<FoldingPlayer>` early (outside the `.app-shell` header layout); all other screens render inside `.app-shell` under `<AppHeader>`.

## Page/Component Breakdown

| Component | File | Role |
| --- | --- | --- |
| `App` | `src/App.tsx` | State + routing + clamping |
| `AppHeader` | `src/components/AppHeader.tsx` | Top nav (wordmark + My Animals) |
| `AnimalCard` | `src/components/AnimalCard.tsx` | Per-animal grid card (lock/complete/step) |
| `Home` | `src/components/Home.tsx` | Landing grid |
| `Preview` | `src/components/Preview.tsx` | Lesson overview |
| `Completion` | `src/components/Completion.tsx` | Finished state + decoration/photo |
| `Collection` | `src/components/Collection.tsx` | "My Animals" page |
| `FoldingPlayer` | `src/components/FoldingPlayer.tsx` | Step screen |
| `OrigamiCanvas` | `src/components/OrigamiCanvas.tsx` | Per-step diagram SVG |
| `AnimalArt` | `src/components/AnimalArt.tsx` | Completed-animal SVG |