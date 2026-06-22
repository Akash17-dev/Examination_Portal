require("dotenv").config();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const express = require("express");
const bcrypt = require("bcryptjs");
const { closeDatabase, connectToDatabase, getDatabase } = require("./db");
const { defaultExams } = require("./defaultData");
const { callGemini, extractJson } = require("./gemini");
const { COOKIE_NAME, cookieOptions, ensureSeedUsers, getAuthenticatedUser, issueToken, requireAuth, toPublicUser } = require("./auth");

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(cookieParser());
app.use(express.json());

async function authGuard(request, response, next) {
  const db = await getDatabase();
  const user = await getAuthenticatedUser(request, db);
  if (!user) {
    response.status(401).json({ ok: false, message: "Authentication required." });
    return;
  }
  request.user = user;
  next();
}

function allowRoles(...roles) {
  return (request, response, next) => {
    if (!roles.includes(request.user.role)) {
      response.status(403).json({ ok: false, message: "You do not have permission for this action." });
      return;
    }
    next();
  };
}

app.post("/api/auth/login", async (request, response) => {
  try {
    const { email, password, role } = request.body;
    const db = await getDatabase();
    await ensureSeedUsers(db);
    const user = await db.collection("users").findOne({ email: String(email || "").trim().toLowerCase() });

    if (!user || (role && user.role !== role) || !(await bcrypt.compare(password || "", user.passwordHash))) {
      response.status(401).json({ ok: false, message: "Invalid email, password, or role." });
      return;
    }

    response.cookie(COOKIE_NAME, issueToken(user), cookieOptions());
    response.json({ ok: true, user: toPublicUser(user) });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.post("/api/auth/register", async (request, response) => {
  try {
    const { name, email, password } = request.body;
    if (!name || !email || !password || password.length < 8) {
      response.status(400).json({ ok: false, message: "Name, email, and a password of at least 8 characters are required." });
      return;
    }

    const db = await getDatabase();
    await ensureSeedUsers(db);
    const normalizedEmail = String(email).trim().toLowerCase();
    if (await db.collection("users").findOne({ email: normalizedEmail })) {
      response.status(409).json({ ok: false, message: "An account already exists for this email." });
      return;
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
    response.cookie(COOKIE_NAME, issueToken(user), cookieOptions());
    response.status(201).json({ ok: true, user: toPublicUser(user) });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.get("/api/auth/me", authGuard, (request, response) => {
  response.json({ ok: true, user: request.user });
});

app.post("/api/auth/logout", (_request, response) => {
  response.clearCookie(COOKIE_NAME, { ...cookieOptions(), maxAge: undefined });
  response.json({ ok: true });
});

app.get("/api/health", async (_request, response) => {
  try {
    const db = await getDatabase();
    const collections = await db.listCollections().toArray();

    response.json({
      ok: true,
      database: db.databaseName,
      collections: collections.map((collection) => collection.name),
      checkedAt: new Date().toISOString(),
    });
  } catch (error) {
    response.status(500).json({
      ok: false,
      message: error.message,
      checkedAt: new Date().toISOString(),
    });
  }
});

app.get("/api/exams", authGuard, async (_request, response) => {
  try {
    const db = await getDatabase();
    const collection = db.collection("exams");
    const count = await collection.countDocuments();
    if (count === 0) {
      await collection.insertMany(defaultExams.map((exam) => ({ ...exam, seeded: true })));
    }
    const exams = await collection.find({}).sort({ createdAt: -1, id: -1 }).limit(100).toArray();
    response.json({ ok: true, exams });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.post("/api/exams", authGuard, allowRoles("faculty", "admin"), async (request, response) => {
  try {
    const db = await getDatabase();
    const nextExam = {
      ...request.body,
      id: request.body.id || Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.collection("exams").insertOne(nextExam);
    response.status(201).json({ ok: true, exam: nextExam });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.delete("/api/exams", authGuard, allowRoles("faculty", "admin"), async (request, response) => {
  try {
    const id = request.query.id;
    if (!id) {
      response.status(400).json({ ok: false, message: "Exam id is required." });
      return;
    }

    const db = await getDatabase();
    await db.collection("exams").deleteOne({ id: Number.isNaN(Number(id)) ? id : Number(id) });
    response.json({ ok: true });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.get("/api/quizzes", authGuard, allowRoles("faculty", "admin"), async (_request, response) => {
  try {
    const db = await getDatabase();
    const quizzes = await db.collection("quizzes").find({}).sort({ createdAt: -1, id: -1 }).limit(100).toArray();
    response.json({ ok: true, quizzes });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.post("/api/quizzes", authGuard, allowRoles("faculty", "admin"), async (request, response) => {
  try {
    const db = await getDatabase();
    const nextQuiz = {
      ...request.body,
      id: request.body.id || Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.collection("quizzes").insertOne(nextQuiz);
    response.status(201).json({ ok: true, quiz: nextQuiz });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.delete("/api/quizzes", authGuard, allowRoles("faculty", "admin"), async (request, response) => {
  try {
    const id = request.query.id;
    if (!id) {
      response.status(400).json({ ok: false, message: "Quiz id is required." });
      return;
    }

    const db = await getDatabase();
    await db.collection("quizzes").deleteOne({ id: Number.isNaN(Number(id)) ? id : Number(id) });
    response.json({ ok: true });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.post("/api/exams/seed", authGuard, allowRoles("admin"), async (_request, response) => {
  try {
    const db = await getDatabase();
    await db.collection("exams").deleteMany({});
    await db.collection("exams").insertMany(defaultExams.map((exam) => ({ ...exam, seeded: true })));
    response.json({ ok: true, inserted: defaultExams.length });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.post("/api/agent/chat", authGuard, async (request, response) => {
  const { message, role } = request.body;

  if (!message) {
    response.status(400).json({ ok: false, message: "Message is required." });
    return;
  }

  try {
    const reply = await callGemini(
      `You are a concise general website chatbot for the LeapStart online examination portal.
Role: ${role || "faculty"}.
Help with navigation, login roles, exam attempts, faculty quiz creation, grading, results, and portal usage.
Keep the answer short.

User: ${message}`
    );
    response.json({ ok: true, reply });
  } catch (error) {
    response.json({
      ok: true,
      fallback: true,
      reply: "I can help with this examination portal. Ask about logging in, attempting exams, creating quizzes, results, or faculty workflows.",
      message: error.message,
    });
  }
});

app.post("/api/agent/create-quiz", authGuard, allowRoles("faculty", "admin"), async (request, response) => {
  const { count, topic, types } = request.body;
  const selectedTypes = Array.isArray(types) && types.length > 0
    ? types
    : ["mcq", "msq", "theory", "programming", "true-false", "file-drop"];

  try {
    const text = await callGemini(
      `Create quiz questions for an online exam conductor.
Return only valid JSON. No markdown.
Return a JSON array with ${Number(count) || 5} objects.
Topic: ${topic || "General aptitude"}.
Allowed question types: ${selectedTypes.join(", ")}.
Each object must have:
{
  "type": "mcq | msq | theory | programming | true-false | file-drop",
  "question": "string",
  "options": ["array only for mcq, msq, true-false"],
  "answer": "string or array",
  "marks": number
}`
    );
    response.json({ ok: true, quiz: extractJson(text) });
  } catch (error) {
    const fallbackQuiz = [
      {
        type: "mcq",
        question: `Which option best matches ${topic || "the selected topic"}?`,
        options: ["Correct concept", "Unrelated concept", "Syntax error", "None of these"],
        answer: "Correct concept",
        marks: 1,
      },
      {
        type: "msq",
        question: `Select all valid statements about ${topic || "the selected topic"}.`,
        options: ["It can be assessed objectively", "It may need explanation", "It cannot be graded", "It supports rubrics"],
        answer: ["It can be assessed objectively", "It may need explanation", "It supports rubrics"],
        marks: 2,
      },
      {
        type: "theory",
        question: `Explain ${topic || "the selected topic"} in your own words.`,
        options: [],
        answer: "Evaluate based on clarity, correctness, and examples.",
        marks: 5,
      },
      {
        type: "programming",
        question: `Write a small program related to ${topic || "the selected topic"}.`,
        options: [],
        answer: "Grade for logic, correctness, and edge cases.",
        marks: 10,
      },
      {
        type: "true-false",
        question: `${topic || "This topic"} can be evaluated using a mix of objective and subjective questions.`,
        options: ["True", "False"],
        answer: "True",
        marks: 1,
      },
      {
        type: "file-drop",
        question: `Upload a supporting file or diagram for ${topic || "the selected topic"}.`,
        options: [],
        answer: "Manual review required.",
        marks: 5,
      },
    ].slice(0, Number(count) || 5);

    response.json({
      ok: true,
      fallback: true,
      quiz: fallbackQuiz,
      message: error.message,
    });
  }
});

connectToDatabase()
  .then((db) => {
    app.listen(port, () => {
      console.log(`API server ready on http://localhost:${port}`);
      console.log(`MongoDB connected to database "${db.databaseName}"`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect MongoDB:", error.message);
    process.exitCode = 1;
  });

process.on("SIGINT", async () => {
  await closeDatabase();
  process.exit(0);
});
