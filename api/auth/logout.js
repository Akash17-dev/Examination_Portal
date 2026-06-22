const { sendJson } = require("../_utils");
const { clearAuthCookie } = require("../_auth");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") return sendJson(response, 405, { ok: false, message: "Method not allowed." });
  clearAuthCookie(response);
  sendJson(response, 200, { ok: true });
};
