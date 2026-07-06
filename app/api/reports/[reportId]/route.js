import {
  applyStatusTransition,
  applyTeamAssignment,
} from "@/lib/report-reducer";

const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "http://localhost:3001";

function errorResponse(message, status, details) {
  return Response.json(
    details ? { error: message, details } : { error: message },
    { status },
  );
}

function toEntityUrl(entity, id) {
  return new URL(`/${entity}/${encodeURIComponent(id)}`, JSON_SERVER_URL);
}

async function patchTeamAvailability(teamId, availability) {
  let response;
  try {
    response = await fetch(toEntityUrl("teams", teamId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ availability }),
    });
  } catch {
    return {
      error: errorResponse("Failed to reach json-server while updating team.", 502),
    };
  }

  if (!response.ok) {
    return {
      error: errorResponse("Failed to update team in json-server.", 502, {
        upstreamStatus: response.status,
      }),
    };
  }

  return { team: await response.json() };
}

async function fetchReport(reportId) {
  let response;
  try {
    response = await fetch(toEntityUrl("reports", reportId), { cache: "no-store" });
  } catch {
    return { error: errorResponse("Failed to reach json-server for reports.", 502) };
  }

  if (response.status === 404) {
    return {
      error: errorResponse(`Report "${reportId}" was not found.`, 404),
    };
  }

  if (!response.ok) {
    return {
      error: errorResponse("Failed to load report from json-server.", 502, {
        upstreamStatus: response.status,
      }),
    };
  }

  return { report: await response.json() };
}

async function fetchTeam(teamId) {
  let response;
  try {
    response = await fetch(toEntityUrl("teams", teamId), { cache: "no-store" });
  } catch {
    return { error: errorResponse("Failed to reach json-server for teams.", 502) };
  }

  if (response.status === 404) {
    return {
      error: errorResponse(`Team "${teamId}" does not exist.`, 400),
    };
  }

  if (!response.ok) {
    return {
      error: errorResponse("Failed to load team from json-server.", 502, {
        upstreamStatus: response.status,
      }),
    };
  }

  return { team: await response.json() };
}

export async function GET(_request, { params }) {
  const { reportId } = await params;
  const { report, error } = await fetchReport(reportId);
  if (error) return error;
  return Response.json(report);
}

export async function PATCH(request, { params }) {
  const { reportId } = await params;

  let payload;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid request body. Expected JSON.", 400);
  }

  const { assignedTeamId, status, actorRole } = payload || {};
  if (!actorRole || typeof actorRole !== "string") {
    return errorResponse("actorRole is required.", 400);
  }

  if (assignedTeamId && status) {
    return errorResponse(
      "Provide either assignedTeamId or status in a single PATCH request, not both.",
      400,
    );
  }

  if (!assignedTeamId && !status) {
    return errorResponse("Request must include assignedTeamId or status.", 400);
  }

  const { report, error: reportError } = await fetchReport(reportId);
  if (reportError) return reportError;

  let updatedReport;
  const previousAssignedTeamId = report.assignedTeamId;

  if (assignedTeamId) {
    const { team, error: teamError } = await fetchTeam(assignedTeamId);
    if (teamError) return teamError;

    if (team.availability !== "Available") {
      return errorResponse(`Team "${assignedTeamId}" is not available.`, 400);
    }

    try {
      updatedReport = applyTeamAssignment(report, assignedTeamId);
    } catch (error) {
      return errorResponse(error.message, 400);
    }
  } else {
    try {
      updatedReport = applyStatusTransition(report, status);
    } catch (error) {
      return errorResponse(error.message, 400);
    }
  }

  let updateResponse;
  try {
    updateResponse = await fetch(toEntityUrl("reports", reportId), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedReport),
    });
  } catch {
    return errorResponse("Failed to reach json-server while updating report.", 502);
  }

  if (!updateResponse.ok) {
    return errorResponse("Failed to update report in json-server.", 502, {
      upstreamStatus: updateResponse.status,
    });
  }

  const savedReport = await updateResponse.json();

  if (assignedTeamId) {
    const { error: assignedTeamUpdateError } = await patchTeamAvailability(
      assignedTeamId,
      "Busy",
    );
    if (assignedTeamUpdateError) return assignedTeamUpdateError;

    if (previousAssignedTeamId && previousAssignedTeamId !== assignedTeamId) {
      const { error: previousTeamUpdateError } = await patchTeamAvailability(
        previousAssignedTeamId,
        "Available",
      );
      if (previousTeamUpdateError) return previousTeamUpdateError;
    }
  }

  if (updatedReport.status === "Closed" && previousAssignedTeamId) {
    const { error: releaseTeamError } = await patchTeamAvailability(
      previousAssignedTeamId,
      "Available",
    );
    if (releaseTeamError) return releaseTeamError;
  }

  return Response.json(savedReport);
}
