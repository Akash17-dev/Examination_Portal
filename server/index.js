require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { closeDatabase, connectToDatabase, getDatabase } = require("./db");
const { callGemini, extractJson } = require("./gemini");

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"] }));
app.use(express.json());

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

app.get("/api/exams", async (_request, response) => {
  try {
    const db = await getDatabase();
    const exams = await db.collection("exams").find({}).limit(50).toArray();
    response.json({ ok: true, exams });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.post("/api/exams/seed", async (_request, response) => {
  const sampleExams = [
    {
      course: "ai",
      tag: "AI and ML",
      title: "AI Foundations Midterm",
      detail: "60 questions, coding task, and short case analysis.",
      date: "2026-06-24",
      time: "10:00 AM",
      status: "Ready",
    },
    {
      course: "python",
      tag: "Python and SQL",
      title: "Data Wrangling Lab",
      detail: "Hands-on notebook submission with SQL validation.",
      date: "2026-06-28",
      time: "2:00 PM",
      status: "Scheduled",
    },
  ];

  try {
    const db = await getDatabase();
    await db.collection("exams").deleteMany({});
    await db.collection("exams").insertMany(sampleExams);
    response.json({ ok: true, inserted: sampleExams.length });
  } catch (error) {
    response.status(500).json({ ok: false, message: error.message });
  }
});

app.post("/api/agent/chat", async (request, response) => {
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

app.post("/api/agent/create-quiz", async (request, response) => {
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
