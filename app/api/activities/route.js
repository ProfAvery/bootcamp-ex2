const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "http://localhost:3001";

function errorResponse(message, status, details) {
  return Response.json(
    details ? { error: message, details } : { error: message },
    { status },
  );
}

export async function GET(request) {
  const reportId = request.nextUrl.searchParams.get("reportId");
  if (!reportId) {
    return errorResponse("reportId query parameter is required.", 400);
  }

  const targetUrl = new URL("/activities", JSON_SERVER_URL);
  targetUrl.searchParams.set("reportId", reportId);

  let response;
  try {
    response = await fetch(targetUrl, { cache: "no-store" });
  } catch {
    return errorResponse("Failed to reach json-server for activities.", 502);
  }

  if (!response.ok) {
    return errorResponse("Failed to load activities from json-server.", 502, {
      upstreamStatus: response.status,
    });
  }

  const activities = await response.json();
  activities.sort((a, b) => {
    const aTime = new Date(a.timestamp).getTime();
    const bTime = new Date(b.timestamp).getTime();
    return aTime - bTime;
  });

  return Response.json(activities);
}

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("Invalid request body. Expected JSON.", 400);
  }

  const { reportId, type, message, actorRole } = payload || {};
  const required = { reportId, type, message, actorRole };

  for (const [key, value] of Object.entries(required)) {
    if (typeof value !== "string" || value.trim() === "") {
      return errorResponse(`${key} is required and must be a non-empty string.`, 400);
    }
  }

  const activity = {
    reportId,
    type,
    message,
    actorRole,
    timestamp: new Date().toISOString(),
  };

  let response;
  try {
    response = await fetch(new URL("/activities", JSON_SERVER_URL), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(activity),
    });
  } catch {
    return errorResponse("Failed to reach json-server while creating activity.", 502);
  }

  if (!response.ok) {
    return errorResponse("Failed to create activity in json-server.", 502, {
      upstreamStatus: response.status,
    });
  }

  return Response.json(await response.json(), { status: 201 });
}
