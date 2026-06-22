const { getDatabase } = require("../server/db");
const { defaultExams } = require("../server/defaultData");
const { methodNotAllowed, readBody, sendJson } = require("./_utils");
const { authenticate } = require("./_auth");

async function ensureDefaultExams(collection) {
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertMany(defaultExams.map((exam) => ({ ...exam, seeded: true })));
  }
}

module.exports = async function handler(request, response) {
  const roles = request.method === "POST" || request.method === "DELETE" ? ["faculty", "admin"] : undefined;
  const { db, user } = await authenticate(request, response, roles);
  if (!user) return;
  const collection = db.collection("exams");

  if (request.method === "GET") {
    await ensureDefaultExams(collection);
    const exams = await collection.find({}).sort({ createdAt: -1, id: -1 }).limit(100).toArray();
    sendJson(response, 200, { ok: true, exams });
    return;
  }

  if (request.method === "POST") {
    const exam = await readBody(request);
    const nextExam = {
      ...exam,
      id: exam.id || Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await collection.insertOne(nextExam);
    sendJson(response, 201, { ok: true, exam: nextExam });
    return;
  }

  if (request.method === "DELETE") {
    const id = request.query?.id;
    if (!id) {
      sendJson(response, 400, { ok: false, message: "Exam id is required." });
      return;
    }

    await collection.deleteOne({ id: Number.isNaN(Number(id)) ? id : Number(id) });
    sendJson(response, 200, { ok: true });
    return;
  }

  methodNotAllowed(response, ["GET", "POST", "DELETE"]);
};
