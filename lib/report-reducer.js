import { canTransition } from "./report-workflow";

function assertReport(report) {
  if (!report || typeof report !== "object") {
    throw new Error("Invalid report: expected a report object.");
  }

  if (typeof report.status !== "string") {
    throw new Error("Invalid report: missing status.");
  }
}

export function applyTeamAssignment(report, teamId) {
  assertReport(report);

  if (!teamId || typeof teamId !== "string") {
    throw new Error("Invalid team assignment: teamId must be a non-empty string.");
  }

  if (report.status === "Closed") {
    throw new Error("Invalid team assignment: closed reports cannot be reassigned.");
  }

  const nextStatus = report.status === "New" ? "Assigned" : report.status;

  return {
    ...report,
    assignedTeamId: teamId,
    status: nextStatus,
  };
}

export function applyStatusTransition(report, nextStatus) {
  assertReport(report);

  if (typeof nextStatus !== "string" || !nextStatus) {
    throw new Error("Invalid status transition: nextStatus must be a non-empty string.");
  }

  if (!canTransition(report.status, nextStatus)) {
    throw new Error(`Invalid status transition: ${report.status} -> ${nextStatus}.`);
  }

  return {
    ...report,
    status: nextStatus,
  };
}
