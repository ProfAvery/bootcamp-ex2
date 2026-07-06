# Emergency Request Queue Demo

A small emergency-response workflow demo built with Next.js App Router and a `json-server` mock backend.

## Tech stack

- Next.js 16 (App Router)
- React 19
- JavaScript
- Tailwind CSS
- json-server (mock API + local persistence)

## Setup

Install dependencies:

```bash
npm install
```

Run json-server:

```bash
npm run api
```

Run Next.js:

```bash
npm run dev
```

## Local URLs

- App: [http://localhost:3000](http://localhost:3000)
- Mock reports API: [http://localhost:3001/reports](http://localhost:3001/reports)

## Core features

- Report queue list loaded from server
- Direct report detail routes (`/reports/[reportId]`)
- Activity log per report
- Team assignment and status progression controls
- Role-based behavior on detail page

## Role behavior

- **Dispatcher** can assign teams and update status.
- **Field Lead** can update status but cannot assign teams.

## Status workflow

`New -> Assigned -> In Progress -> Closed`

- Assigning a team automatically moves **New -> Assigned**.
- Closing a report releases the assigned team back to **Available**.

## Manual testing

1. Start both servers (`npm run api` and `npm run dev`).
2. Open `/` and confirm reports load.
3. Open a report detail page.
4. Switch roles and confirm permissions:
   - Dispatcher can assign + update status.
   - Field Lead cannot assign, but can update status.
5. Assign an available team and confirm report/activity updates.
6. Move status through valid transitions only.
7. Close a report and confirm the team becomes available again.
8. Open an invalid detail URL (for example, `/reports/not-real`) and confirm the not-found UI.

## Known limitations

- No real authentication (role switcher is UI-only).
- `json-server` is mock persistence.
- Demo actions mutate `data/db.json` locally.
- Manual testing only (no automated test suite yet).
