# RCC Certificate and Invitation Builder

A frontend-only editor for the Roman Catholic College appreciation certificate and scholarship felicitation invitation. Update the content in the editor, inspect the live preview, and download a PNG, PDF, or editable JSON source file.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` produces a static site in `out/`. Serve that directory over HTTP to check the production export.

## Templates and saved content

- **RCC Appreciation** retains the A4 landscape certificate with 1–4 signatures and an optional seal.
- **RCC Scholarship Invitation** uses the original A5 portrait PSD artwork. The wording, chief guest, five default guest entries, and event details are editable. Additional guests can be added up to the source-file limit of 20.
- The two templates keep independent browser drafts. Certificate drafts retain the existing `certificate-builder:draft:v1` key; invitation drafts use `certificate-builder:draft:invitation:v1`.
- Use **Save source** and **Open source** to exchange validated `.certificate.json` and `.invitation.json` files.
- Oversized content is identified in the editor. PNG and PDF export stays disabled until the affected text fits.

The invitation artwork and reference files are in `public/assets/invitation-art.png` and `docs/`. Inter and Forum are bundled for the invitation; their SIL Open Font Licenses are in `docs/font-licenses/`. The italic “Chief Guest” phrase uses Libre Baskerville Italic as a close substitute for the PSD’s Century Schoolbook Italic.

## Acceptance checklist

- [ ] The invitation preview matches the reference layout with the crest, gold rules and ornaments, curves, graduation artwork, and editable text.
- [ ] Add and remove invitation guests, edit names and roles, switch templates, reload, and confirm each template restores its own draft.
- [ ] Save and reopen both JSON formats; check invalid data leaves the active document intact.
- [ ] Invitation PNG is exactly 1748 × 2480; invitation PDF is one A5 portrait page.
- [ ] Certificate exports remain 3508 × 2480 PNG and one A4 landscape PDF page.
- [ ] Verify mobile preview scaling and confirm downloaded documents exclude preview or editor styling.
- [ ] Run TypeScript, ESLint, and a production static build.
