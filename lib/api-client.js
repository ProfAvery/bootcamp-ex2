export async function fetchReports() {
  const response = await fetch("/api/reports", { cache: "no-store" });

  if (!response.ok) {
    let message = "Failed to fetch reports.";

    try {
      const payload = await response.json();
      if (payload?.error) {
        message = payload.error;
      }
    } catch {}

    throw new Error(message);
  }

  return response.json();
}

function buildApiUrl(path, baseUrl = "") {
  return `${baseUrl}${path}`;
}

async function getErrorMessage(response, fallbackMessage) {
  try {
    const payload = await response.json();
    if (payload?.error) {
      return payload.error;
    }
  } catch {
    return fallbackMessage;
  }

  return fallbackMessage;
}

export async function fetchReportById(reportId, baseUrl = "") {
  if (!reportId || typeof reportId !== "string") {
    throw new Error("A valid report ID is required.");
  }

  const response = await fetch(
    buildApiUrl(`/api/reports/${encodeURIComponent(reportId)}`, baseUrl),
    { cache: "no-store" },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    const message = await getErrorMessage(response, "Failed to fetch report.");
    throw new Error(message);
  }

  return response.json();
}

export async function fetchActivitiesByReportId(reportId, baseUrl = "") {
  if (!reportId || typeof reportId !== "string") {
    throw new Error("A valid report ID is required.");
  }

  const response = await fetch(
    buildApiUrl(`/api/activities?reportId=${encodeURIComponent(reportId)}`, baseUrl),
    { cache: "no-store" },
  );

  if (!response.ok) {
    const message = await getErrorMessage(response, "Failed to fetch activities.");
    throw new Error(message);
  }

  const activities = await response.json();
  if (!Array.isArray(activities)) {
    return [];
  }

  return [...activities].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });
}

export async function fetchTeams(baseUrl = "") {
  const response = await fetch(buildApiUrl("/api/teams", baseUrl), {
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await getErrorMessage(response, "Failed to fetch teams.");
    throw new Error(message);
  }

  const teams = await response.json();
  return Array.isArray(teams) ? teams : [];
}
