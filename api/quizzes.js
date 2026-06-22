const { getDatabase } = require("../server/db");
const { methodNotAllowed, readBody, sendJson } = require("./_utils");
const { authenticate } = require("./_auth");

module.exports = async function handler(request, response) {
  const { db, user } = await authenticate(request, response, ["faculty", "admin"]);
  if (!user) return;
  const collection = db.collection("quizzes");

  if (request.method === "GET") {
    const quizzes = await collection.find({}).sort({ createdAt: -1, id: -1 }).limit(100).toArray();
    sendJson(response, 200, { ok: true, quizzes });
    return;
  }

  if (request.method === "POST") {
    const quiz = await readBody(request);
    const nextQuiz = {
      ...quiz,
      id: quiz.id || Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await collection.insertOne(nextQuiz);
    sendJson(response, 201, { ok: true, quiz: nextQuiz });
    return;
  }

  if (request.method === "DELETE") {
    const id = request.query?.id;
    if (!id) {
      sendJson(response, 400, { ok: false, message: "Quiz id is required." });
      return;
    }

    await collection.deleteOne({ id: Number.isNaN(Number(id)) ? id : Number(id) });
    sendJson(response, 200, { ok: true });
    return;
  }

  methodNotAllowed(response, ["GET", "POST", "DELETE"]);
};
