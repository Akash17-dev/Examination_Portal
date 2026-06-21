const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";

async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing in .env");
  }

  const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error?.message || "Gemini request failed");
  }

  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n").trim() || "";
}

function extractJson(text) {
  const match = text.match(/\[[\s\S]*\]|\{[\s\S]*\}/);
  if (!match) throw new Error("Gemini did not return JSON.");
  return JSON.parse(match[0]);
}

module.exports = {
  callGemini,
  extractJson,
};
