# RCC Certificate Builder

A small frontend-only certificate editor for the Roman Catholic College appreciation certificate. Edit the wording and signatures, then download a PNG, a single-page landscape PDF, or a `.certificate.json` source file that can be opened again later.

## Run locally

```bash
pnpm install
pnpm dev
```

The app is a static Next.js export. `pnpm exec next build` creates the production output in `out/`.

## Included behavior

- RCC Appreciation preset with the supplied transparent crest.
- Editable certificate text, four preserved signature slots, 1–4 visible signatures, and a seal toggle.
- Local draft persistence under `certificate-builder:draft:v1`.
- JSON source save/open with Zod validation and a 100 KB file limit.
- Shared HTML capture for 3508 × 2480 PNG and A4 landscape PDF downloads.
- Traditional serif and script certificate styling matching the supplied reference.

The future advanced styling section is intentionally not implemented in version one.
