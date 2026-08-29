# 0001. Use a client-only, data-driven PWA

Date: 2026-08-29

## Status

Accepted

## Context

Foldimals teaches a fixed curriculum to children without login, social features, remote progress, or server-authored content. The player must be reusable across animals while lesson authors need one canonical place for instructions, progression, guide coordinates, and visual states. The app should remain usable after installation and intermittent connectivity.

Alternatives considered were a server-backed application with user accounts, a separate page/component implementation for each animal, and a general-purpose animation or canvas engine.

## Decision

Build Foldimals as a client-only React PWA:

- Define `AnimalLesson` and `FoldStep` contracts in `src/types.ts` and author ordered curriculum in `src/data/lessons.ts`.
- Keep navigation and durable progress orchestration in `src/App.tsx`.
- Use one reusable `FoldingPlayer` and `OrigamiCanvas` for all lessons.
- Persist anonymous completion and step progress in browser `localStorage` through `src/storage.ts`.
- Use browser-native manifest, service worker, cache storage, and photo-preview APIs without a backend.

## Consequences

### Positive

- No account, child data service, server operations, or runtime content API is required.
- Lessons share consistent controls, help behavior, persistence, and accessibility semantics.
- Static assets can be hosted cheaply and installed from any secure origin.
- Lesson order, copy, and guides are reviewable TypeScript data with focused invariant tests.

### Negative

- Progress does not sync between browsers or devices and is lost when site storage is cleared.
- Adding a new diagram vocabulary still requires renderer code as well as lesson data.
- The hand-written service worker and storage schema require explicit versioning and migration discipline.
- Curriculum and real-paper fold correctness remain release-time validation responsibilities.
