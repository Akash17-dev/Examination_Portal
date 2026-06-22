const { callGemini, extractJson } = require("../../server/gemini");
const { methodNotAllowed, readBody, sendJson } = require("../_utils");
const { authenticate } = require("../_auth");

function createFallbackQuiz(topic, count) {
  return [
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
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    methodNotAllowed(response, ["POST"]);
    return;
  }

  const { user } = await authenticate(request, response, ["faculty", "admin"]);
  if (!user) return;

  const { count, topic, types } = await readBody(request);
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

    sendJson(response, 200, { ok: true, quiz: extractJson(text) });
  } catch (error) {
    sendJson(response, 200, {
      ok: true,
      fallback: true,
      quiz: createFallbackQuiz(topic, count),
      message: error.message,
    });
  }
};
