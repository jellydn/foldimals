# Foldimals

[Foldimals](https://foldimals.itman.fyi) is a tablet-first origami learning PWA for children ages 7–12. It turns each animal into a calm sequence of one-fold-at-a-time instructions—no account, ads, scores, or distracting navigation.

## What children can do

- Follow five lessons in progression order: Dog, Cat, Mouse, Frog, and Bird.
- Watch a large animated paper model with a crease, arrow, and concise instruction for every fold.
- Replay a fold or ask for progressive help: first a slower replay, then highlighted targets and an alternate hint.
- Resume an unfinished lesson and unlock the next animal after completion.
- Revisit completed animals in **My Animals**, decorate a finished model, or preview an on-device photo.
- Install the app as a PWA and revisit cached content.

Photos are never uploaded or saved by Foldimals. Progress stays in the browser's local storage, so clearing site data resets the collection.

## How it works

```text
AnimalLesson data ──▶ reusable FoldingPlayer ──▶ SVG OrigamiCanvas
       │                       │                         │
       └── copy + guides       ├── replay + help        └── fold + target animation
                               │
Browser localStorage ◀──────── App screen flow ────────▶ My Animals
```

Lesson content and fold-guide coordinates live in [`src/data/lessons.ts`](src/data/lessons.ts). The player remains lesson-agnostic through the `AnimalLesson` and `FoldStep` contracts in [`src/types.ts`](src/types.ts).

For deeper context:

- [Architecture map](.planning/codebase/ARCHITECTURE.md)
- [Codebase structure](.planning/codebase/STRUCTURE.md)
- [Technology stack](.planning/codebase/STACK.md)
- [Testing guide](.planning/codebase/TESTING.md)
- [Architecture decisions](docs/adr/README.md)

## Development

Requires [Bun](https://bun.sh/).

```bash
bun install
bun run dev
```

Vite prints the local development URL. The app has no required environment variables or backend services.

## Quality checks

```bash
bun run test       # Vitest + Testing Library
bun run typecheck  # strict TypeScript
bun run lint       # ESLint
bun run build      # production Vite bundle
```

## Deployment

Pushes to `main` run all four checks and deploy the `dist/` artifact with the official GitHub Pages actions in [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). The path-relative build works at the generated project URL and the custom domain declared in [`public/CNAME`](public/CNAME). After the repository owner attaches that domain in Pages settings and DNS validates it, GitHub Pages provides the TLS certificate and HTTPS redirect.

See [ADR 0002](docs/adr/0002-deploy-as-a-static-site-on-github-pages.md) for the hosting decision and DNS requirements.
