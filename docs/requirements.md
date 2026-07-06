# Requirements: Emergency Request Queue

Build a web app for handling incoming emergency reports.

## Report list

- Show a list of 4–6 emergency reports.
- Each report should show a title, location, priority, and current status.
- Make it easy to tell which reports still need attention.

## Report details

- A user should be able to open a more detailed view for a report.
- The detail view should show the report description, assigned team, and recent actions.
- A report detail view should be directly reachable by its own address in the browser.

## Response teams

- Include exactly 3 response teams.
- Each team should have a name and availability status.
- Teams are interchangeable.
- Any available team can be assigned to any open report.
- Teams do not need types, specialties, locations, or equipment.

## Report status workflow

Reports move through this workflow:

1. New
2. Assigned
3. In Progress
4. Closed

The interface should make invalid or unavailable actions difficult to choose.

## Activity log

- Record important actions automatically, such as assigning a team or changing a report status.
- New actions should appear in the log in a clear order.
- The activity log should show actions for the selected report.
- The full action list for a report should be retrievable, not just recent actions.
- Every activity action should have a timestamp.

## Role-based interface

Include at least two user roles:

- Dispatcher
- Field Lead

Both roles can:

- View reports
- View report details
- View the activity log
- Update report status

Only the Dispatcher can assign response teams.

The interface should clearly show or hide controls based on the current user role.

## Data loading

- Start with provided sample data or a small mock data source.
- The app should show a reasonable loading state.
- The app should handle a missing or invalid report with a clear “report not found” message.