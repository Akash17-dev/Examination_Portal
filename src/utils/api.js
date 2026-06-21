export async function readJsonResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(`API returned ${response.status}. Check that the Vercel /api route is deployed.`);
  }

  return response.json();
}
