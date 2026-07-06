export const STATUS_FLOW = ["New", "Assigned", "In Progress", "Closed"];

export function getNextStatus(currentStatus) {
  const currentIndex = STATUS_FLOW.indexOf(currentStatus);

  if (currentIndex === -1 || currentIndex === STATUS_FLOW.length - 1) {
    return null;
  }

  return STATUS_FLOW[currentIndex + 1];
}

export function canTransition(currentStatus, nextStatus) {
  return getNextStatus(currentStatus) === nextStatus;
}

export function getAllowedTransitions(currentStatus) {
  const nextStatus = getNextStatus(currentStatus);
  return nextStatus ? [nextStatus] : [];
}
