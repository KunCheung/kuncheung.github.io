# AGENTS.md

Project instructions for AI coding agents working in this repository.

## Project Shape

- This is a small Vite + React personal homepage.
- Main application code lives in `src/App.jsx`.
- Global styles live in `src/styles.css`.
- Static assets and article Markdown files live in `public/`.
- There is no separate test suite at the moment; use `npm run build` as the fastest verification check for code or content wiring changes.

## Content Editing

- Keep homepage content in the data arrays near the top of `src/App.jsx`.
- Writing entries use hash routes in the form `#/articles/<slug>`.
- Article Markdown sources are configured per post in `sources`.
- For bilingual articles, use the existing filename pattern:
  - Chinese: `public/articles/<slug>_CN.md`
  - English: `public/articles/<slug>-EN.md`
- Keep `README.md` in sync when article filenames, content locations, commands, or deployment notes change.

## Development Commands

- Install dependencies: `npm install`
- Start local dev server: `npm run dev`
- Build production assets: `npm run build`
- Preview production build: `npm run preview`

## Guardrails

- Prefer small, focused diffs.
- Do not add analytics, telemetry, or new network calls unless explicitly requested.
- Do not edit generated `dist/` output manually.
- Do not assume files mentioned in old docs still exist; search the repo first.
