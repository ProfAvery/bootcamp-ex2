const JSON_SERVER_URL = process.env.JSON_SERVER_URL || "http://localhost:3001";

function errorResponse(message, status, details) {
  return Response.json(
    details ? { error: message, details } : { error: message },
    { status },
  );
}

export async function GET(request) {
  const targetUrl = new URL("/reports", JSON_SERVER_URL);
  request.nextUrl.searchParams.forEach((value, key) => {
    targetUrl.searchParams.append(key, value);
  });

  let response;
  try {
    response = await fetch(targetUrl, { cache: "no-store" });
  } catch {
    return errorResponse("Failed to reach json-server for reports.", 502);
  }

  if (!response.ok) {
    return errorResponse("Failed to load reports from json-server.", 502, {
      upstreamStatus: response.status,
    });
  }

  const reports = await response.json();
  return Response.json(reports);
}
