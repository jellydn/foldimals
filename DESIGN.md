---
version: alpha
name: Foldimals
description: Implemented visual identity and StyleX design system for the Foldimals origami learning PWA.
colors:
  primary: "#ff785f"
  primary-strong: "#935554"
  canvas: "#fffaf0"
  canvas-glow: "#fff3d7"
  surface: "#ffffff"
  ink: "#27324a"
  muted-text: "#68758a"
  line: "#e9dfd0"
  focus: "#2e8ccf"
  disabled-border: "#c9c4bc"
  disabled-surface: "#eee8df"
  lesson-dog: "#ff876d"
  lesson-dog-strong: "#935c5c"
  lesson-cat: "#8f7ee7"
  lesson-cat-strong: "#5b5898"
  lesson-mouse: "#4ea99b"
  lesson-mouse-strong: "#3a6e72"
  lesson-frog: "#72a83d"
  lesson-frog-strong: "#4c6d44"
  lesson-bird: "#3988d3"
  lesson-bird-strong: "#305d8e"
typography:
  display-hero:
    fontFamily: Fredoka
    fontSize: 48px
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: -0.035em
  heading-section:
    fontFamily: Fredoka
    fontSize: 36px
    fontWeight: 700
  heading-card:
    fontFamily: Fredoka
    fontSize: 24px
    fontWeight: 700
  body-hero:
    fontFamily: Nunito
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.55
  button:
    fontFamily: Nunito
    fontSize: 17px
    fontWeight: 900
  eyebrow:
    fontFamily: Nunito
    fontSize: 13px
    fontWeight: 900
    letterSpacing: 0.15em
  card-meta:
    fontFamily: Nunito
    fontSize: 13px
    fontWeight: 800
rounded:
  small: 10px
  medium: 16px
  large: 24px
  pill: 999px
spacing:
  xsmall: 6px
  small: 10px
  medium: 16px
  large: 24px
  xlarge: 40px
components:
  button-primary:
    backgroundColor: "{colors.primary-strong}"
    textColor: "{colors.surface}"
    typography: "{typography.button}"
    rounded: "{rounded.medium}"
    height: 58px
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.medium}"
    height: 58px
  button-quiet:
    backgroundColor: transparent
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    height: 44px
  button-icon:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: 52px
    width: 52px
  lesson-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.large}"
    height: 275px
  eyebrow:
    textColor: "{colors.primary-strong}"
    typography: "{typography.eyebrow}"
  progress-regular:
    backgroundColor: "{colors.disabled-surface}"
    rounded: "{rounded.pill}"
    height: 10px
---

# Foldimals design system

## Overview

Foldimals is a tablet-first origami learning PWA for children ages 7–12. Its interface is warm, calm, tactile, and encouraging: one prominent task at a time, generous breathing room, friendly paper-animal illustrations, and no scores, ads, account prompts, or dense navigation.

The visual language resembles paper craft rather than a generic productivity app. Dark ink outlines, warm cream canvas, white cards, coral actions, rounded geometry, and short reassuring copy make each screen feel sturdy and playful without becoming noisy. This document records the current implementation; it is not a redesign brief.

## Colors

The machine-readable palette maps to the implementation as follows:

- `primary`, `primary-strong`, `canvas`, `canvas-glow`, `surface`, `ink`, text, line, focus, and disabled colors correspond to the semantic StyleX variables in [`src/design-system/tokens.stylex.ts`](src/design-system/tokens.stylex.ts). `primary` is named `colors.coral` in TypeScript.
- Cream `canvas` is the page foundation. `canvas-glow` appears in the shell's subtle radial wash; white `surface` holds cards and controls.
- Navy `ink` supplies the main text, outlines, and hard-edged shadows. `muted-text` supports descriptions and metadata.
- Coral `primary` marks the logo and bright decorative accents; contrast-safe `primary-strong` marks default eyebrow labels and fills shared primary controls. Blue `focus` is reserved for visible keyboard focus.
- Each lesson owns a bright runtime accent (`lesson-dog` through `lesson-bird`) and a paired strong accent in [`src/data/lessons.ts`](src/data/lessons.ts). Bright accents tint art wells and progress; strong accents color small labels and lesson-specific primary controls against white text. Separate lighter `paperColor` values color the SVG animals themselves and are content data, not shared StyleX tokens.
- The PWA manifest currently uses near-match chrome values `#fff9ed` and `#ff785a`. They are limited to install/browser chrome and must not be copied into component styling as replacements for `canvas` or `primary`.

There is no dark theme and no semantic error or warning palette in the current application.

## Typography

Foldimals loads **Fredoka** weights 500–700 for display text and **Nunito** weights 500–800 for body and controls, with system sans-serif fallbacks. Heading elements use Fredoka; document text and controls inherit Nunito.

- The home hero is fluid: 48–76px on larger screens, 50px at the tablet breakpoint, and 45px at 600px and below. It uses a tight `0.98` line height and `-0.035em` tracking.
- Section headings use 36px Fredoka and reduce to 31px on phones. Lesson-card titles use 24px Fredoka.
- Hero copy uses 20px Nunito at `1.55` line height and becomes 16px on phones. Other page copy uses local 14–20px values in the legacy stylesheet.
- Eyebrows are 13px, weight 900, uppercase in content, and tracked at `0.15em`. Card metadata is 13px/800; shared buttons are 17px/900 and become 14px only in the fixed phone player controls.

The YAML typography entries capture implemented roles, not a complete type ramp. Components that remain in `src/styles.css` still own several local sizes.

## Layout

Primary home, preview, and collection content is centered at a maximum width of 1180px with 24px side gutters. The player uses a maximum width of 1160px and prioritizes the animated paper stage over the instruction column.

The shared StyleX spacing scale is 6, 10, 16, 24, and 40px. Shared primitives consume it where their dimensions align. Existing page CSS also contains deliberate one-off values such as 18px card-grid gaps, 22px phone gutters, and fluid `clamp()` padding; the implementation does not claim strict scale-only spacing.

- Above 820px, the home uses a two-column hero and a six-column lesson grid, with each card spanning two columns.
- At 820px and below, lesson cards span three columns, preview becomes one column, and the player tightens its two-column layout.
- At 600px and below, pages use 15px side gutters, the hero and player stack, lesson cards become horizontal rows, completion actions become full-width columns, and player navigation is fixed to the bottom edge.
- A short-height adjustment at widths above 600px compresses the completion screen without changing its content.

## Elevation & Depth

Depth is graphic and paper-like rather than soft or photorealistic. Interactive controls use a navy offset shadow (`0 4px 0 #27324a`) that compresses to `0 1px 0 #27324a` when pressed. Lesson cards use a 6px navy offset, rise to 11px on hover, and use a muted 5px offset when locked. The preview card uses an 8px navy offset.

Illustrations use restrained drop shadows, while backgrounds use tonal layering and radial gradients. Do not introduce broad glassmorphism, blurred panels, or diffuse multi-layer elevation; those treatments are absent from the product.

## Shapes

The shared radius scale is 10px, 16px, 24px, and pill. Buttons use 16px corners, lesson cards use 24px, and badges/progress tracks use circles or pills. The header logo uses a local 12px radius and a slight rotation.

Page-owned surfaces extend this language where the shape has a specific role: the preview card is 32px, the paper stage is 42px, and the finished-animal panel uses an intentionally irregular organic radius. Outlines are usually 2px navy, reinforcing folded-paper edges and large touch targets.

## Components

- **Button:** `primary`, `secondary`, `quiet`, and `icon` variants share native button semantics, visible focus, disabled behavior, and pressed translation. Standard buttons are at least 58px high with 10px block and 24px inline padding. Quiet and phone icon controls retain a 44px minimum target. Primary backgrounds can use a lesson's strong accent at runtime. The `xstyle` contract permits only outer layout adjustments used by current callers.
- **Eyebrow:** A compact orientation label with the strong coral default or a runtime lesson strong accent. It remains text, not a decorative badge.
- **ProgressBar:** A 10px labeled lesson-progress track exposes `role="progressbar"` and numeric ARIA values. The 5px card variant is decorative and hidden from the accessibility tree. Fill width and color are the only dynamic values.
- **Lesson card:** A native button containing number/completion status, optional lock state, tinted art well, animal illustration, title, tagline, metadata, and optional resume progress. Locked cards are disabled, grayscale, and explicitly labeled “locked.” On phones the card changes from vertical to horizontal rather than shrinking its touch target.
- **App header:** Contains a wordmark home button and pill-shaped My Animals button. The house emoji hides below 600px while the text label remains.
- **Origami canvas:** Owns SVG paper diagrams, crease and direction guides, target dots, and final animal art. Selector-heavy SVG styling and keyframes remain in global CSS rather than a StyleX primitive.

## Imagery & Motion

Animal imagery is hand-authored SVG with heavy navy outlines, flat cheerful fills, simple facial features, and lesson-specific paper colors. Decorative symbols are sparse and use familiar characters or emoji; they are marked `aria-hidden` when they do not convey content. User-selected completion photos remain on-device and use `object-fit: cover` inside the finished-art shape.

Motion explains or reassures rather than rewards speed. The home animal floats over 3.2 seconds; fold diagrams pulse over 1.35 seconds; guides fade in, arrows march, targets pulse, and progress width transitions over 300ms. “I need help” slows the fold animation to 2.7 seconds before adding target detail. A global `prefers-reduced-motion: reduce` rule reduces all animation and transition durations to `0.01ms` and limits iteration to one.

## Responsive Behavior

The product is designed tablet-first but remains usable from the declared 320px minimum width. Preserve the implemented breakpoints at 820px and 600px unless the owning layouts are migrated together. Do not treat phone layout as a scaled-down tablet: it deliberately changes card direction, hides a nonessential header icon, stacks instruction content, and fixes player controls for thumb reach.

Dynamic and fixed heights are part of the learning flow: the fold stage remains the dominant visual region, controls remain reachable, and content may continue below the viewport on home and preview screens rather than being compressed into one screen.

## Accessibility

All actions use native buttons or a labeled file input. Keyboard focus is a 4px blue outline with 3px offset. Icon-only controls have explicit accessible names; SVG animals and fold diagrams have role/name text; live instructions use `aria-live="polite"`; disabled and locked states use native `disabled`; and labeled progress exposes its current value.

Touch targets are 44–58px for shared controls. Color is not the sole indicator for lock, completion, fold direction, or progress: text, symbols, disabled state, outlines, and geometry reinforce meaning. Bright lesson accents are content-driven and are not text colors; each lesson's paired strong accent supplies at least 4.5:1 contrast for small text and white-on-color primary actions. Any new pairing must be checked at its actual size and weight instead of assuming arbitrary accent values are interchangeable.

## Implementation Constraints

StyleX owns reusable React component styles and extracts atomic CSS at build time. Keep `stylex.vite()` before the React plugin, retain CSS layers, and keep the development virtual stylesheet/runtime hookup in `src/main.tsx`. Shared variables must remain named exports from a `.stylex.ts` file.

Use `stylex.create()` and `stylex.props()` for component-local styles. Add shared values to [`src/design-system/tokens.stylex.ts`](src/design-system/tokens.stylex.ts); use dynamic style functions only for genuine lesson data or progress. Keep each lesson's bright `color`, contrast-safe `strongColor`, and illustrative `paperColor` roles distinct. Compose compiled styles instead of spreading raw objects, and keep cross-component `StyleXStyles` contracts narrow.

Global [`src/styles.css`](src/styles.css) remains the owner of font loading, document defaults, page-level layout not yet migrated, reduced-motion policy, and selector/keyframe-heavy SVG behavior. It lives in the lower-priority `base` CSS layer so global resets cannot override StyleX primitives; the fixed phone player controls retain explicit size overrides in their page-owned media rule. Remove superseded rules when migrating an owner; do not layer a second CSS implementation over StyleX. Unit tests mock StyleX's compile-time APIs for DOM behavior, while lint and the production build validate static syntax and extraction.

## Do's and Don'ts

- **Do** preserve the warm cream, navy outline, white surface, and controlled coral/lesson-accent hierarchy.
- **Do** present one primary learning action at a time and keep instructions short, calm, and noncompetitive.
- **Do** use semantic StyleX tokens and existing primitives before adding literals or another abstraction.
- **Do** keep keyboard names, focus, touch targets, reduced motion, and phone control reach intact.
- **Don't** add scores, streaks, confetti-heavy reward loops, ads, account chrome, or distracting navigation.
- **Don't** invent dark mode, glass surfaces, gradients on controls, photorealistic stock art, or a strict spacing/type ramp that the code does not implement.
- **Don't** use lesson accent colors as general-purpose semantic colors or assume white text passes contrast on every accent.
- **Don't** migrate the SVG animation selectors to StyleX unless the whole canvas ownership boundary benefits from the change.
