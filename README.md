# vales.ae

Static site for the **AMMF — AI Marketing Maturity Framework** self-assessment.

A free, self-serve assessment that scores how AI and a marketing team work
together across six dimensions, then shows where the gap between ambition and
execution is widest.

## Structure

- `mvp/index.html` — the full single-page assessment: landing, question flow,
  email gate, results (radar chart + biggest gap + breakdown), client-side PDF.

## Deploy (Vercel)

- **Framework Preset:** Other
- **Build Command:** (none)
- **Output Directory:** `mvp`

## Private job-hunting map

`/job-hunting` is served by `api/job-hunting.js` with a signed, HttpOnly session.
The 500-organisation and 84-programme dataset is encrypted in
`private/job-hunting-data.enc` because this repository is public. The Vercel
project needs these sensitive environment variables in Production and Preview:
`JOB_HUNTING_PASSWORD`, `JOB_HUNTING_SESSION_SECRET`, and
`JOB_HUNTING_DATA_KEY` (64 hexadecimal characters). Keep the source JSON and
the data key outside the repository. To update the canonical dataset, run
`JOB_HUNTING_DATA_KEY=<key> node scripts/encrypt-job-hunting-data.js <bundle-directory>`
and deploy the resulting encrypted file.

---
© 2026 Valentino Scicolone
