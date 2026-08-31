# Foldimals design system

Foldimals uses [StyleX](https://stylexjs.com/) for reusable React interface styles. StyleX extracts atomic CSS during the Vite build, so production styling remains static while component composition stays typed and local.

The repository-root [`DESIGN.md`](../DESIGN.md) follows Google Labs' DESIGN.md format and is the source of truth for the implemented visual identity, machine-readable design tokens, responsive behavior, motion, and accessibility. This guide focuses on how that identity is implemented and extended with StyleX.

## Foundations

[`src/design-system/tokens.stylex.ts`](../src/design-system/tokens.stylex.ts) is the source of truth for semantic colors, font families, radii, spacing, and control shadows. Components consume semantic names such as `colors.canvas` and `colors.ink` rather than copying values. Lesson colors remain runtime data: bright `color` values own tints and progress, while contrast-safe `strongColor` values own small labels and primary actions through narrow primitive props.

The initial primitives are:

- `Button` — primary, secondary, quiet, and icon variants with shared touch targets, pressed states, disabled states, and focus-visible treatment. Its `xstyle` escape hatch only accepts outer layout properties.
- `Eyebrow` — the small uppercase orientation label used across screens, with an optional lesson accent.
- `ProgressBar` — regular labeled progress for a lesson and compact decorative progress for cards. Labeled progress exposes the native progressbar ARIA contract.

`AnimalArt` accepts a width/height-only `xstyle` contract so a parent can size the SVG without exposing its internal drawing styles.

## Authoring rules

1. Put shared values in the token file; keep genuinely one-off layout values beside their component.
2. Use `stylex.create()` and `stylex.props()` for React component styles. Compose variants rather than spreading raw style objects.
3. Use dynamic StyleX functions only for values that come from lesson data or live progress.
4. Keep component style escape hatches narrow. Add a supported property only when a caller has a real layout need.
5. Keep `src/styles.css` for document defaults, page-level CSS that has not yet migrated, and SVG selectors/keyframes. Keep it in the lower-priority `base` layer so resets cannot override StyleX primitives, and remove old rules as their owning component moves to StyleX.
6. Preserve minimum touch targets, visible keyboard focus, `prefers-reduced-motion`, and the existing phone/tablet breakpoints when migrating.

The StyleX Vite plugin must stay before the React plugin in [`vite.config.ts`](../vite.config.ts). ESLint validates static StyleX syntax, token-file naming, shorthands, and unused style definitions. Unit tests mock compile-time StyleX functions because they verify DOM behavior; `bun run build` verifies extraction and generated CSS.

## Migrated surfaces

The app shell/header, animal lesson cards, cross-screen action buttons, eyebrow labels, and progress indicators are StyleX-owned. Preview, player, completion, and collection page layout remain in the existing stylesheet. This boundary demonstrates tokens, variants, responsive styles, dynamic values, and cross-component composition without coupling the origami animation system to the migration.
