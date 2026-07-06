# Technical Decisions

## Stack

- Next.js App Router
- JavaScript
- Tailwind CSS
- npm
- json-server mock backend

## Architecture

- Next.js handles the UI and routes.
- json-server provides a small mock REST API.
- The app uses a role switcher for Dispatcher and Field Lead.
- Status transition rules are kept in a reducer or reducer-like helper so invalid transitions are centralized.
- Activity entries are created automatically when a report is assigned or its status changes.

## Testing

- Manual testing is required.
- Run lint and build before final submission.