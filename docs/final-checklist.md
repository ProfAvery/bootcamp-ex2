# Final Requirement Checklist

## Setup and run

- [x] Dependencies install with `npm install`
- [x] Mock backend runs with `npm run api`
- [x] Next.js app runs with `npm run dev`
- [x] Local app URL documented (`http://localhost:3000`)
- [x] Mock reports URL documented (`http://localhost:3001/reports`)

## Data and API behavior

- [x] Reports load from server
- [x] Activities load per report
- [x] Team assignment uses team availability as source of truth
- [x] Assigning team rejects missing teams
- [x] Assigning team rejects non-available teams
- [x] Assigning team updates `assignedTeamId`
- [x] Assigning team auto-moves `New -> Assigned`
- [x] Closing a report releases assigned team to `Available`
- [x] Closed report keeps `assignedTeamId` for history

## UI behavior

- [x] Report list route (`/`) with loading/error/empty states
- [x] Report detail route (`/reports/[reportId]`)
- [x] Clear report not-found state
- [x] Detail page includes role switcher
- [x] Dispatcher can assign teams and update status
- [x] Field Lead can update status but cannot assign teams
- [x] New reports do not show standalone `Move to Assigned` status button
- [x] New reports show helper text: "Assign a team to move this report to Assigned."
- [x] Status actions only allow:
  - [x] Assigned -> In Progress
  - [x] In Progress -> Closed
- [x] Assignment control shows availability clearly
- [x] Assignment unavailable when report is Closed
- [x] Activity log visible on report detail

## Workflow and rules

- [x] Status flow: `New -> Assigned -> In Progress -> Closed`
- [x] Invalid status jumps are blocked by workflow helpers + API validation
- [x] Team availability state is updated via report PATCH flow

## Limitations acknowledged

- [x] No real authentication
- [x] `json-server` is mock persistence
- [x] Demo actions mutate `data/db.json`
- [x] Manual testing only
