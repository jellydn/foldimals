# 0002. Deploy as a static site on GitHub Pages

Date: 2026-08-29

## Status

Accepted

## Context

Foldimals produces a static Vite `dist/` bundle and requires a secure origin for PWA installation and service workers. The production URL must be `https://foldimals.itman.fyi`. No Vercel or Cloudflare API credential is available to the repository or current deployment environment, while source already lives on GitHub.

Alternatives considered were importing the repository into the owner's existing Vercel account and deploying to Cloudflare Pages. Both would add provider credentials or dashboard state without improving the runtime architecture.

## Decision

Deploy with GitHub Pages and official GitHub Actions:

- `.github/workflows/deploy-pages.yml` runs tests, typecheck, lint, and build before publishing `dist/`.
- The deploy job receives only `pages: write` and OIDC `id-token: write`; the verification job remains read-only.
- Vite, manifest, and service-worker URLs are path-relative so the generated project URL and custom-domain root both work.
- `public/CNAME` declares `foldimals.itman.fyi` in the built artifact.
- The repository owner attaches `foldimals.itman.fyi` in GitHub Pages settings.
- Cloudflare DNS must publish a DNS-only `CNAME` from `foldimals.itman.fyi` to `jellydn.github.io`.
- GitHub Pages manages the TLS certificate and HTTPS redirect after DNS validation.

## Consequences

### Positive

- Deployment is repeatable, versioned with source, and gated by all project checks.
- No long-lived deployment secret is stored in GitHub or the application.
- The host provides global static delivery and managed HTTPS suitable for the PWA.
- The same artifact works at the generated project URL before custom-domain DNS is ready.

### Negative

- DNS remains external Cloudflare state and requires zone-owner access.
- GitHub Pages does not provide repository-configured custom response headers.
- Initial custom-domain certificate issuance cannot complete until DNS resolves correctly.
- A private repository requires an account plan that supports private GitHub Pages.
