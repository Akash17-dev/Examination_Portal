import { readJsonResponse } from "./api";

const QUIZZES_EVENT = "leapstart-quizzes-updated";

export function normalizeQuizQuestion(question, index = 0) {
  const type = question.type || "theory";
  const prompt = question.question || question.title || "";
  const options = Array.isArray(question.options) ? question.options.filter(Boolean) : [];

  return {
    id: question.id || `quiz-question-${Date.now()}-${index}`,
    type,
    question: prompt,
    title: prompt,
    options,
    choices: options,
    answer: question.answer || "",
    marks: Number(question.marks) || 1,
    starter: question.starter || "",
  };
}

export async function fetchSavedQuizzes() {
  const response = await fetch("/api/quizzes");
  const data = await readJsonResponse(response);
  if (!data.ok) throw new Error(data.message || "Failed to load saved quizzes");
  return data.quizzes;
}

export async function createSavedQuiz(quiz) {
  const response = await fetch("/api/quizzes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...quiz,
      questions: quiz.questions.map(normalizeQuizQuestion),
    }),
  });
  const data = await readJsonResponse(response);
  if (!data.ok) throw new Error(data.message || "Failed to save quiz");
  window.dispatchEvent(new CustomEvent(QUIZZES_EVENT));
  return data.quiz;
}

export async function deleteSavedQuiz(quizId) {
  const response = await fetch(`/api/quizzes?id=${encodeURIComponent(quizId)}`, {
    method: "DELETE",
  });
  const data = await readJsonResponse(response);
  if (!data.ok) throw new Error(data.message || "Failed to delete quiz");
  window.dispatchEvent(new CustomEvent(QUIZZES_EVENT));
  return data;
}

export function subscribeToQuizUpdates(callback) {
  async function handleUpdate() {
    callback(await fetchSavedQuizzes());
  }

  window.addEventListener(QUIZZES_EVENT, handleUpdate);
  window.addEventListener("storage", handleUpdate);

  return () => {
    window.removeEventListener(QUIZZES_EVENT, handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}
