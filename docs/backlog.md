# Backlog

## Later refactors

- [ ] Replace repeated badge class logic with shared badge component.
  - Reason: `report-card.js` and `report-detail.js` may duplicate priority/status styling.
- [ ] Fetch individual team names from the server instead of loading the entire list and running `find` client-side.
  - Reason: More efficient once the number of teams needs to scale.

## Future improvements

- [ ] Persist selected role across page navigation.
  - Reason: Current role switcher may reset between pages.

## Known limitations

- [ ] No real authentication.
  - Reason: Demo uses a role switcher by design.