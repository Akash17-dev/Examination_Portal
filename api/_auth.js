const bcrypt = require("bcryptjs");
const { getDatabase } = require("../server/db");
const { COOKIE_NAME, cookieOptions, ensureSeedUsers, getAuthenticatedUser, issueToken, requireAuth, toPublicUser } = require("../server/auth");
const { sendJson } = require("./_utils");

function serializeCookie(name, value, options) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${options.path || "/"}`, "HttpOnly", `SameSite=${options.sameSite || "Lax"}`];
  if (options.secure) parts.push("Secure");
  if (typeof options.maxAge === "number") parts.push(`Max-Age=${Math.floor(options.maxAge / 1000)}`);
  return parts.join("; ");
}

function setAuthCookie(response, token) {
  response.setHeader("Set-Cookie", serializeCookie(COOKIE_NAME, token, cookieOptions()));
}

function clearAuthCookie(response) {
  response.setHeader("Set-Cookie", `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

async function authenticate(request, response, roles) {
  const db = await getDatabase();
  const user = await requireAuth(request, response, db, sendJson, roles);
  return { db, user };
}

module.exports = {
  authenticate,
  bcrypt,
  clearAuthCookie,
  ensureSeedUsers,
  getAuthenticatedUser,
  getDatabase,
  issueToken,
  setAuthCookie,
  toPublicUser,
};
