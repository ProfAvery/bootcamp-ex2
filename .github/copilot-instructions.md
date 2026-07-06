# Copilot Instructions for `emergency-demo`

## Build, lint, and test commands

Use npm for all project commands.

- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Start production server: `npm run start`

Automated tests are not configured yet in this repository (`package.json` has no `test` script and no test runner config), so there is currently no single-test command.

## High-level architecture

This repo currently contains a minimal Next.js 16 App Router app scaffold, plus planning docs for a larger emergency-response workflow app.

- UI entry points are in `app/`:
  - `app/layout.js` sets global HTML/body structure, loads Geist fonts via `next/font/google`, and applies global classes.
  - `app/page.js` is the current single route (`/`) and uses `next/image`.
  - `app/globals.css` defines Tailwind v4 import/theme tokens and light/dark CSS variables.
- Build/runtime config is intentionally minimal:
  - `next.config.mjs` (default config)
  - `postcss.config.mjs` with `@tailwindcss/postcss`
  - `eslint.config.mjs` using `eslint-config-next/core-web-vitals`
- `docs/` contains product/architecture direction for upcoming work (role-based emergency report queue, status transitions, activity log, json-server-backed mock API). Treat those docs as feature intent; the implementation is not yet present in code.

## Key repository conventions

- **Framework/runtime:** Next.js `16.2.10`, React `19.2.4`, App Router.
- **Language choice:** JavaScript (not TypeScript) for app code.
- **Styling:** Tailwind CSS v4 with `@import "tailwindcss"` and `@theme inline` tokens in `app/globals.css`.
- **Path alias:** `@/*` is configured in `jsconfig.json`.
- **Lint baseline:** Next Core Web Vitals rules via `eslint-config-next/core-web-vitals`.
- **Agent-specific rule from `AGENTS.md` / `CLAUDE.md`:** Next.js in this repo may differ from older conventions; check docs under `node_modules/next/dist/docs/` and heed deprecations before changing framework-level patterns.
- **Product-domain conventions from docs (`docs/decisions.md`, `docs/customer-notes.md`):**
  - Roles: Dispatcher and Field Lead.
  - Status flow: `New -> Assigned -> In Progress -> Closed`.
  - Keep status transition logic centralized (reducer or reducer-like helper).
  - Activity entries should be generated automatically for assignment/status changes.
  - Mock backend expectation is `json-server` with API-driven report loading.

## Emergency Request Queue requirements

Before implementing, read:

- `docs/requirements.md`
- `docs/customer-notes.md`
- `docs/open-questions.md`
- `docs/decisions.md`

Implementation must preserve these rules:

- Show 4–6 emergency reports.
- Include exactly 3 response teams.
- Teams are interchangeable.
- Any available team can be assigned to any open report.
- Use a directly reachable detail route, such as `/reports/[reportId]`.
- Use json-server as the mock backend.
- The report list must load from the server.
- Include loading states.
- Include a clear report-not-found state.
- Activity logs must show the full action list for the selected report.
- Activity entries must include timestamps.
- Use role-based UI:
  - Dispatcher can assign teams.
  - Field Lead cannot assign teams.
  - Both roles can view reports, view details, view logs, and update status.
- Centralize status transition rules in a reducer or reducer-like helper.
- Prevent invalid status jumps:
  - `New` can move only to `Assigned`.
  - `Assigned` can move only to `In Progress`.
  - `In Progress` can move only to `Closed`.
  - `Closed` cannot move forward.
- Keep changes small and reviewable.
- Do not implement the whole app in one request.
- Do not change `AGENTS.md` unless explicitly asked.