# MVP Emergency Request Queue — Implementation Plan

## Problem and approach

Build a small, demo-ready Next.js App Router MVP (under ~3 hours) that reads report data from a json-server backend, supports direct report detail routes, enforces status transitions through centralized helper logic, and applies role-based UI controls for Dispatcher vs Field Lead.

Current state: repository is a clean Next.js 16 scaffold (`app/page.js` starter content only) with no app-domain components, no API routes, and no json-server setup yet.

## Scope and constraints

- Keep implementation small and reviewable; no auth system, only a role switcher.
- Manual testing only.
- No overengineering: minimal file set, straightforward REST calls, simple dashboard layout.

## Proposed file structure (new/updated)

```text
app/
  layout.js                         (update metadata/title only)
  page.js                           (reports list page)
  reports/
    [reportId]/
      page.js                       (report detail page)
      not-found.js                  (clear report-not-found state)
  api/
    reports/
      route.js                      (GET list; optional query passthrough)
      [reportId]/
        route.js                    (GET single, PATCH status/team)
    activities/
      route.js                      (GET by reportId, POST new activity)

components/
  role-switcher.js
  report-list.js
  report-card.js
  report-detail.js
  team-assignment.js
  status-controls.js
  activity-log.js
  loading-state.js
  empty-state.js

lib/
  api-client.js                     (fetch wrappers for app -> Next API routes)
  report-workflow.js                (status order + transition guards)
  report-reducer.js                 (reducer-like update helpers)
  roles.js                          (role constants/permissions)

data/
  db.json                           (json-server seed: reports, teams, activities)

package.json                        (add json-server scripts/dependency)
```

## json-server data shape

`data/db.json`

```json
{
  "reports": [
    {
      "id": "r1",
      "title": "Warehouse fire alarm",
      "location": "Industrial Ave 18",
      "priority": "High",
      "status": "New",
      "description": "Smoke detected in loading dock zone.",
      "assignedTeamId": null
    }
  ],
  "teams": [
    { "id": "t1", "name": "Team Alpha", "availability": "Available" },
    { "id": "t2", "name": "Team Bravo", "availability": "Busy" },
    { "id": "t3", "name": "Team Charlie", "availability": "Available" }
  ],
  "activities": [
    {
      "id": "a1",
      "reportId": "r1",
      "type": "report_created",
      "message": "Report created",
      "timestamp": "2026-07-05T17:00:00.000Z",
      "actorRole": "System"
    }
  ]
}
```

Notes:
- Seed 4–6 reports.
- Exactly 3 teams.
- Activity log is append-only and queryable by `reportId`.

## Routes/pages

- `/` — report queue list view with role switcher and loading state.
- `/reports/[reportId]` — report detail with description, assigned team, status controls, activity log.
- Detail route handles missing IDs with a clear not-found UI.

Backend-facing routes (Next route handlers):
- `GET /api/reports`
- `GET /api/reports/:reportId`
- `PATCH /api/reports/:reportId`
- `GET /api/activities?reportId=:reportId`
- `POST /api/activities`

## API/data-fetching approach

- Run json-server on a separate local port (e.g., `3001`) with `data/db.json`.
- UI fetches **same-origin Next API routes**; route handlers proxy to json-server.
- For “load from server every time,” use uncached fetch (`cache: "no-store"` where applicable).
- After assignment/status updates, perform:
  1. report update (`PATCH /api/reports/:id`)
  2. activity append (`POST /api/activities`)
  3. local refresh (re-fetch detail/list data)

## Major UI components

- `RoleSwitcher`: toggle Dispatcher / Field Lead in UI state.
- `ReportList` + `ReportCard`: queue table/cards with title/location/priority/status and attention cues.
- `ReportDetail`: description, assigned team, status section, and log area.
- `TeamAssignment`: Dispatcher-only assignment control; disabled/hidden for Field Lead.
- `StatusControls`: role-shared status advancement controls constrained by helper rules.
- `ActivityLog`: full per-report log with timestamps and clear ordering.
- `LoadingState` + `EmptyState`: reusable loading and not-found/empty feedback.

## Reducer/helper design for status transitions

Centralize workflow in `lib/report-workflow.js`:

- `STATUS_FLOW = ["New", "Assigned", "In Progress", "Closed"]`
- `getNextStatus(currentStatus)`
- `canTransition(currentStatus, nextStatus)` (strictly adjacent forward only)
- `getAllowedTransitions(currentStatus)` (used to render enabled controls)

Use reducer-like helpers in `lib/report-reducer.js`:
- `applyTeamAssignment(report, teamId)`
- `applyStatusTransition(report, nextStatus)`
- Each helper validates via workflow functions and returns explicit error for invalid moves.

## Role-based UI behavior

- Dispatcher:
  - Can assign available teams to open reports.
  - Can update status.
- Field Lead:
  - Cannot assign teams (control hidden or disabled with explanatory text).
  - Can update status.
- Both:
  - Can view list, detail, and full activity log.

## Manual testing checklist

1. Start Next app + json-server; verify list loads from API with loading indicator.
2. Confirm 4–6 reports render and exactly 3 teams exist.
3. Open detail route directly (`/reports/r1`) and verify content loads.
4. Open invalid detail route and verify clear report-not-found state.
5. Switch role to Dispatcher: assign an available team; verify report updates and activity entry with timestamp appears.
6. Switch role to Field Lead: assignment control is unavailable; status controls still available.
7. Validate status transitions:
   - New -> Assigned allowed
   - Assigned -> In Progress allowed
   - In Progress -> Closed allowed
   - Any skipped jump blocked in UI and helper validation
8. Verify activity log shows full action history for selected report (not truncated).
9. Run `npm run lint` and `npm run build`.

## Risks and requirement ambiguities

- **Invalid-action UX (hide vs disable):** docs allow either; default to disabled controls with clear labels where helpful.
- **Activity wording:** not strict; use concise, human-readable action text.
- **Priority/team availability vocabulary:** use `High/Medium/Low` and `Available/Busy` as documented assumptions.
- **Time budget risk:** creating too many abstractions may exceed MVP budget; keep components thin and helper logic focused.

## Execution todos (small slices)

1. Add json-server seed data and npm scripts.
2. Add workflow/role helper modules.
3. Add Next API route handlers that proxy json-server.
4. Build reports list route (`/`) with loading + role switcher.
5. Build report detail route (`/reports/[reportId]`) with not-found state.
6. Add assignment/status actions and activity logging.
7. Manual verification (lint/build/checklist).
