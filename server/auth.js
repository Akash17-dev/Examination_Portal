const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const COOKIE_NAME = "leapstart_session";
const DEMO_USERS = [
  { id: "LST26CS014", name: "Aarav Reddy", role: "student", email: "student@leapstart.in", password: "student123", cohort: "Batch 2026", program: "Computer Science - AI and Data Science" },
  { id: "FAC-AI-07", name: "Dr. Meera Iyer", role: "faculty", email: "faculty@leapstart.in", password: "faculty123", department: "AI and Data Science" },
  { id: "ADM-LST-01", name: "Rohan Menon", role: "admin", email: "admin@leapstart.in", password: "admin123", department: "Academic Operations" },
];

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is missing.");
  return secret;
}

function toPublicUser(user) {
  const { passwordHash, _id, ...publicUser } = user;
  return publicUser;
}

async function ensureSeedUsers(db) {
  const collection = db.collection("users");
  if (await collection.countDocuments() > 0) return;

  const seededUsers = await Promise.all(DEMO_USERS.map(async ({ password, ...user }) => ({
    ...user,
    passwordHash: await bcrypt.hash(password, 12),
    createdAt: new Date().toISOString(),
  })));
  await collection.insertMany(seededUsers);
}

function issueToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, email: user.email },
    getJwtSecret(),
    { expiresIn: "7d" }
  );
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  };
}

function parseCookies(request) {
  const header = request.headers?.cookie || "";
  return Object.fromEntries(header.split(";").map((part) => {
    const [key, ...value] = part.trim().split("=");
    return [key, decodeURIComponent(value.join("="))];
  }).filter(([key]) => key));
}

function getTokenFromRequest(request) {
  return request.cookies?.[COOKIE_NAME] || parseCookies(request)[COOKIE_NAME];
}

async function getAuthenticatedUser(request, db) {
  const token = getTokenFromRequest(request);
  if (!token) return null;

  try {
    const payload = jwt.verify(token, getJwtSecret());
    const user = await db.collection("users").findOne({ id: payload.sub });
    return user ? toPublicUser(user) : null;
  } catch {
    return null;
  }
}

async function requireAuth(request, response, db, sendJson, roles) {
  const user = await getAuthenticatedUser(request, db);
  if (!user) {
    sendJson(response, 401, { ok: false, message: "Authentication required." });
    return null;
  }
  if (roles && !roles.includes(user.role)) {
    sendJson(response, 403, { ok: false, message: "You do not have permission for this action." });
    return null;
  }
  return user;
}

module.exports = {
  COOKIE_NAME,
  cookieOptions,
  ensureSeedUsers,
  getAuthenticatedUser,
  issueToken,
  requireAuth,
  toPublicUser,
};
