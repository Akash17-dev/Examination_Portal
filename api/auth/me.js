const { sendJson } = require("../_utils");
const { authenticate } = require("../_auth");

module.exports = async function handler(request, response) {
  if (request.method !== "GET") return sendJson(response, 405, { ok: false, message: "Method not allowed." });
  const { user } = await authenticate(request, response);
  if (!user) return;
  sendJson(response, 200, { ok: true, user });
};
