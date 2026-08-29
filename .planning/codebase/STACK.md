# Technology Stack

**Analysis Date:** 2026-08-29

## Languages

**Primary:**
- TypeScript 5.9 (strict, ES modules) - React UI, lesson data, browser storage, and tests under `src/`; compiler options are in `tsconfig.app.json` and `tsconfig.node.json`.

**Secondary:**
- TSX/JSX using the React 19 automatic runtime - Application entry and components in `src/main.tsx`, `src/App.tsx`, and `src/components/*.tsx`.
- CSS - Single global responsive stylesheet in `src/styles.css`; no CSS framework or preprocessor is configured in `package.json`.
- JavaScript - Hand-written service worker in `public/sw.js` and ESLint flat configuration in `eslint.config.js`.
- HTML/JSON/SVG - Vite shell in `index.html`, PWA metadata in `public/manifest.webmanifest`, and install icon in `public/foldimals-icon.svg`.

## Runtime

**Environment:**
- Modern browser SPA/PWA - DOM and iterable DOM libraries plus an ES2022 target are declared in `tsconfig.app.json`; the UI mounts into `index.html` from `src/main.tsx`.
- No server runtime is part of the application - lessons are bundled from `src/data/lessons.ts`, and progress stays in browser storage through `src/storage.ts`.
- Node-compatible tooling is required by Vite/TypeScript, but no engine version is pinned in `package.json`; the repository itself documents Bun commands in `README.md`.

**Package Manager:**
- Bun (version not pinned) - install and script commands are documented in `README.md` and all scripts are defined in `package.json`.
- Lockfile: present at `bun.lock` (lockfile version 1); there is no npm, pnpm, or Yarn lockfile in the tracked tree.

## Frameworks

**Core:**
- React `^19.2.0` and React DOM `^19.2.0` - The only production npm dependencies in `package.json`; hooks drive local UI state in `src/App.tsx` and `src/components/FoldingPlayer.tsx`, and `createRoot` boots the app in `src/main.tsx`.
- Browser-native PWA facilities - Install metadata is in `public/manifest.webmanifest`; production-only service-worker registration is in `src/main.tsx`; caching logic is in `public/sw.js`.

**Testing:**
- Vitest `^4.0.0` with jsdom `^27.4.0` - Global jsdom test environment and setup file are configured in `vite.config.ts`; tests live at `src/**/*.test.ts(x)`.
- Testing Library React `^16.3.0`, user-event `^14.6.0`, and jest-dom `^6.9.0` - User-facing component assertions appear in `src/App.test.tsx` and `src/components/FoldingPlayer.test.tsx`; matchers and browser mocks are installed in `src/test/setup.ts`.

**Build/Dev:**
- Vite `^7.3.0` plus `@vitejs/plugin-react` `^5.1.0` - Development server and production bundling are scripted in `package.json`; React and test configuration share `vite.config.ts`.
- TypeScript `^5.9.0` - `tsc -b` performs project-reference type checking before builds via `package.json`, `tsconfig.json`, `tsconfig.app.json`, and `tsconfig.node.json`.
- ESLint `^9.39.0` with typescript-eslint `^8.50.0`, React Hooks, and React Refresh plugins - Flat lint rules and browser globals are defined in `eslint.config.js`; the command is in `package.json`.

## Key Dependencies

**Critical:**
- `react` and `react-dom` `^19.2.0` - Entire runtime UI and rendering layer; declared under production `dependencies` in `package.json` and imported by `src/main.tsx`, `src/App.tsx`, and `src/components/FoldingPlayer.tsx`.
- No runtime router, state manager, database client, API SDK, animation library, or PWA plugin is declared in `package.json`; screen navigation and animation are implemented locally in `src/App.tsx`, `src/components/OrigamiCanvas.tsx`, and `src/styles.css`.

**Infrastructure:**
- Browser `localStorage` - Progress persistence is isolated in `src/storage.ts` and consumed by `src/App.tsx`; it is a browser API, not an npm dependency.
- Cache Storage, Service Worker, and Fetch APIs - Offline/cache behavior is hand-written in `public/sw.js` and registered only for production in `src/main.tsx`.
- File input, camera capture hint, Blob URLs, SVG, and CSS animation - Completion photos use `<input type="file" capture="environment">` and `URL.createObjectURL` in `src/App.tsx`; folding artwork is rendered in `src/components/AnimalArt.tsx` and `src/components/OrigamiCanvas.tsx`.

## Configuration

**Environment:**
- No application environment variables are read: the only environment flag is Vite's built-in `import.meta.env.PROD` in `src/main.tsx`.
- No `.env` files are tracked, and local variants are ignored by `*.local` in `.gitignore`.
- Vite's development server accepts `.onamp.dev` hosts through `server.allowedHosts` in `vite.config.ts`; this is development access configuration, not production hosting configuration.

**Build:**
- `package.json` defines `dev`, `build`, `typecheck`, `lint`, and `test`; production output is Vite's default `dist/`, which is ignored in `.gitignore`.
- `vite.config.ts` configures React compilation and Vitest/jsdom; no base path, deployment adapter, or PWA build plugin is configured.
- `tsconfig.json` references separate browser and tool configs in `tsconfig.app.json` and `tsconfig.node.json`; `eslint.config.js` applies TypeScript, Hooks, Refresh, and browser-global rules.
- `index.html` links `public/manifest.webmanifest` and `public/foldimals-icon.svg`; Vite copies the `public/` assets, including `public/sw.js`, into a static build.

## Platform Requirements

**Development:**
- Bun is the documented package manager and command runner in `README.md`; dependencies and scripts are in `package.json` and resolved by `bun.lock`.
- A Vite-compatible Node environment is implicitly needed by the toolchain, but neither `package.json` nor `README.md` pins a Node/Bun version.
- Tests require jsdom and browser mocks configured in `vite.config.ts` and `src/test/setup.ts`; no real browser test runner is configured.

**Production:**
- Static ES2022-capable browser target with JavaScript, DOM, SVG, `localStorage`, and file/Blob URL support, as used by `tsconfig.app.json`, `src/storage.ts`, `src/App.tsx`, and `src/components/*.tsx`.
- PWA installation/offline behavior additionally requires a secure context and Service Worker/Cache Storage support; registration and cache code are in `src/main.tsx` and `public/sw.js`, with install metadata in `public/manifest.webmanifest`.
- GitHub Pages is the static host. `.github/workflows/deploy-pages.yml` gates pushes with tests/typecheck/lint/build and publishes the untracked `dist/` artifact through OIDC; `public/CNAME` declares `foldimals.itman.fyi`.
- The custom domain additionally requires a Cloudflare DNS-only CNAME to `jellydn.github.io`; GitHub Pages supplies the production TLS certificate after validation.

---

*Stack analysis: 2026-08-29*
