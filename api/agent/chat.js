const { callGemini } = require("../../server/gemini");
const { methodNotAllowed, readBody, sendJson } = require("../_utils");

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    methodNotAllowed(response, ["POST"]);
    return;
  }

  try {
    const { message, role } = await readBody(request);

    if (!message) {
      sendJson(response, 400, { ok: false, message: "Message is required." });
      return;
    }

    const reply = await callGemini(
      `You are a concise general website chatbot for the LeapStart online examination portal.
Role: ${role || "student"}.
Help with navigation, login roles, exam attempts, faculty quiz creation, grading, results, and portal usage.
Keep the answer short.

User: ${message}`
    );

    sendJson(response, 200, { ok: true, reply });
  } catch (error) {
    sendJson(response, 200, {
      ok: true,
      fallback: true,
      reply: "I can help with this examination portal. Ask about logging in, attempting exams, creating quizzes, results, or faculty workflows.",
      message: error.message,
    });
  }
};
