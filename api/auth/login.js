const { readBody, sendJson } = require("../_utils");
const { bcrypt, ensureSeedUsers, getDatabase, issueToken, setAuthCookie, toPublicUser } = require("../_auth");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") return sendJson(response, 405, { ok: false, message: "Method not allowed." });

  try {
    const { email, password, role } = await readBody(request);
    const db = await getDatabase();
    await ensureSeedUsers(db);
    const user = await db.collection("users").findOne({ email: String(email || "").trim().toLowerCase() });
    if (!user || (role && user.role !== role) || !(await bcrypt.compare(password || "", user.passwordHash))) {
      return sendJson(response, 401, { ok: false, message: "Invalid email, password, or role." });
    }
    setAuthCookie(response, issueToken(user));
    sendJson(response, 200, { ok: true, user: toPublicUser(user) });
  } catch (error) {
    sendJson(response, 500, { ok: false, message: error.message });
  }
};
