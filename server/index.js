require("dotenv").config();

const cors = require("cors");
const express = require("express");
const { closeDatabase, connectToDatabase, getDatabase } = require("./db");

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
