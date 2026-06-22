const { readBody, sendJson } = require("../_utils");
const { bcrypt, ensureSeedUsers, getDatabase, issueToken, setAuthCookie, toPublicUser } = require("../_auth");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") return sendJson(response, 405, { ok: false, message: "Method not allowed." });

  try {
    const { name, email, password } = await readBody(request);
    if (!name || !email || !password || password.length < 8) {
      return sendJson(response, 400, { ok: false, message: "Name, email, and a password of at least 8 characters are required." });
    }
    const db = await getDatabase();
    await ensureSeedUsers(db);
    const normalizedEmail = String(email).trim().toLowerCase();
    if (await db.collection("users").findOne({ email: normalizedEmail })) {
      return sendJson(response, 409, { ok: false, message: "An account already exists for this email." });
    }
    const user = {
      id: `LST${Date.now()}`,
      name: String(name).trim(),
      role: "student",
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(password, 12),
      program: "Computer Science - AI and Data Science",
      createdAt: new Date().toISOString(),
    };
    await db.collection("users").insertOne(user);
    setAuthCookie(response, issueToken(user));
    sendJson(response, 201, { ok: true, user: toPublicUser(user) });
  } catch (error) {
    sendJson(response, 500, { ok: false, message: error.message });
  }
};
