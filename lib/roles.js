export const ROLE_DISPATCHER = "Dispatcher";
export const ROLE_FIELD_LEAD = "Field Lead";

export function canAssignTeam(role) {
  return role === ROLE_DISPATCHER;
}

export function canUpdateStatus(role) {
  return role === ROLE_DISPATCHER || role === ROLE_FIELD_LEAD;
}
