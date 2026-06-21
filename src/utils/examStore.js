import { exams } from "../data/mockData";
import { readJsonResponse } from "./api";

const EXAMS_EVENT = "leapstart-exams-updated";

export function toCourseId(subject) {
  return subject.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function formatDisplayDate(value) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export function formatDisplayTime(value) {
  if (!value) return "";
  return new Date(`2026-01-01T${value}`).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function normalizeExam(exam) {
  return {
    durationMinutes: 60,
    attemptLimit: 1,
    status: "Posted",
    questions: [],
    ...exam,
  };
}

export function getDefaultExams() {
  return exams.map(normalizeExam);
}

export async function fetchSharedExams() {
  const response = await fetch("/api/exams");
  const data = await readJsonResponse(response);
  if (!data.ok) throw new Error(data.message || "Failed to load exams");
  return data.exams.map(normalizeExam);
}

export async function createSharedExam(exam) {
  const response = await fetch("/api/exams", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(exam),
  });
  const data = await readJsonResponse(response);
  if (!data.ok) throw new Error(data.message || "Failed to create exam");
  window.dispatchEvent(new CustomEvent(EXAMS_EVENT));
  return normalizeExam(data.exam);
}

export async function deleteSharedExam(examId) {
  const response = await fetch(`/api/exams?id=${encodeURIComponent(examId)}`, {
    method: "DELETE",
  });
  const data = await readJsonResponse(response);
  if (!data.ok) throw new Error(data.message || "Failed to delete exam");
  window.dispatchEvent(new CustomEvent(EXAMS_EVENT));
  return data;
}

export function subscribeToExamUpdates(callback) {
  async function handleUpdate() {
    callback(await fetchSharedExams());
  }

  window.addEventListener(EXAMS_EVENT, handleUpdate);
  window.addEventListener("storage", handleUpdate);

  return () => {
    window.removeEventListener(EXAMS_EVENT, handleUpdate);
    window.removeEventListener("storage", handleUpdate);
  };
}
