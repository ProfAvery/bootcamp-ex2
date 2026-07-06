const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "http://localhost:3001";

function errorResponse(message, status, details) {
  return Response.json(
    details ? { error: message, details } : { error: message },
    { status },
  );
}

export async function GET() {
  let response;
  try {
    response = await fetch(new URL("/teams", JSON_SERVER_URL), {
      cache: "no-store",
    });
  } catch {
    return errorResponse("Failed to reach json-server for teams.", 502);
  }

  if (!response.ok) {
    return errorResponse("Failed to load teams from json-server.", 502, {
      upstreamStatus: response.status,
    });
  }

  return Response.json(await response.json());
}
