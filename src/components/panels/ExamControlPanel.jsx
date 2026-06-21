import { useState } from "react";
import { useSharedExams } from "../../hooks/useSharedExams";
import { useSavedQuizzes } from "../../hooks/useSavedQuizzes";
import { formatDisplayDate, formatDisplayTime, toCourseId } from "../../utils/examStore";
import { normalizeQuizQuestion } from "../../utils/quizStore";

export function ExamControlPanel() {
  const [examList, examActions] = useSharedExams();
  const [savedQuizzes] = useSavedQuizzes();
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    tag: "Linux",
    title: "",
    detail: "",
    date: "2026-07-10",
    time: "10:00",
    durationMinutes: 60,
    attemptLimit: 1,
    questionsText: "",
    answersText: "",
    savedQuizId: "",
  });
  const [formError, setFormError] = useState("");

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  async function createExam(event) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    const selectedQuiz = savedQuizzes.find((quiz) => String(quiz.id) === String(draft.savedQuizId));
    const importedQuestions = selectedQuiz?.questions?.map(normalizeQuizQuestion) || [];
    const questionLines = draft.questionsText.split("\n").map((line) => line.trim()).filter(Boolean);
    const answerLines = draft.answersText.split("\n").map((line) => line.trim()).filter(Boolean);

    if (!selectedQuiz && questionLines.length === 0) {
      setFormError("Import a saved quiz or add at least one question before posting the exam.");
      return;
    }

    if (!selectedQuiz && answerLines.length < questionLines.length) {
      setFormError("Add an expected answer for every question so theory answers can be evaluated by meaning.");
      return;
    }

    try {
      await examActions.addExam({
          ...draft,
          id: Date.now(),
          course: toCourseId(draft.tag),
          date: formatDisplayDate(draft.date),
          time: formatDisplayTime(draft.time),
          detail: draft.detail || "Faculty-created assessment draft.",
          scheduledAt: `${draft.date}T${draft.time}`,
          durationMinutes: Number(draft.durationMinutes) || 60,
          attemptLimit: Number(draft.attemptLimit) || 1,
          source: "faculty",
          quizId: selectedQuiz?.id || null,
          questions: selectedQuiz
            ? importedQuestions
            : questionLines.map((question, index) => ({
                id: `faculty-${Date.now()}-${index}`,
                type: "theory",
                question,
                title: question,
                answer: answerLines[index],
                marks: 1,
              })),
          status: "Posted",
        });
      setDraft({
        tag: "Linux",
        title: "",
        detail: "",
        date: "2026-07-10",
        time: "10:00",
        durationMinutes: 60,
        attemptLimit: 1,
        questionsText: "",
        answersText: "",
        savedQuizId: "",
      });
      setFormError("");
      setCreating(false);
    } catch (error) {
      setFormError(error.message);
    }
  }

  async function removeExam(examId) {
    try {
      await examActions.removeExam(examId);
    } catch (error) {
      setFormError(error.message);
    }
  }

  function importSavedQuiz(quizId) {
    const selectedQuiz = savedQuizzes.find((quiz) => String(quiz.id) === String(quizId));

    setDraft((current) => ({
      ...current,
      savedQuizId: quizId,
      title: selectedQuiz && !current.title ? selectedQuiz.title : current.title,
      detail: selectedQuiz ? `Imported from saved quiz: ${selectedQuiz.title}` : current.detail,
      questionsText: selectedQuiz ? "" : current.questionsText,
      answersText: selectedQuiz ? "" : current.answersText,
    }));
    setFormError("");
  }

  return (
    <section className="panel wide" id="exam-control">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Exam Control</p>
          <h2>Assessment Operations</h2>
        </div>
        <button className="secondary-btn" onClick={() => setCreating((value) => !value)}>
          {creating ? "Close" : "Create Exam"}
        </button>
      </div>
      {creating && (
        <form className="create-exam-form" onSubmit={createExam}>
          <label>
            Subject
            <select value={draft.tag} onChange={(event) => updateDraft("tag", event.target.value)}>
              <option>Linux</option>
              <option>Networking</option>
              <option>Database</option>
              <option>Frontend</option>
              <option>AI and ML</option>
            </select>
          </label>
          <label>
            Import saved quiz
            <select value={draft.savedQuizId} onChange={(event) => importSavedQuiz(event.target.value)}>
              <option value="">Manual questions</option>
              {savedQuizzes.map((quiz) => (
                <option value={quiz.id} key={quiz.id}>{quiz.title} ({quiz.questions.length})</option>
              ))}
            </select>
          </label>
          <label>
            Exam title
            <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} placeholder="Example: Linux Shell Test" />
          </label>
          <label>
            Date
            <input type="date" value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} />
          </label>
          <label>
            Start time
            <input type="time" value={draft.time} onChange={(event) => updateDraft("time", event.target.value)} />
          </label>
          <label>
            Duration limit
            <input min="10" type="number" value={draft.durationMinutes} onChange={(event) => updateDraft("durationMinutes", event.target.value)} />
          </label>
          <label>
            Attempt limit
            <input min="1" type="number" value={draft.attemptLimit} onChange={(event) => updateDraft("attemptLimit", event.target.value)} />
          </label>
          <label className="wide-field">
            Description
            <textarea value={draft.detail} onChange={(event) => updateDraft("detail", event.target.value)} placeholder="Short exam instructions" />
          </label>
          <label className="wide-field">
            Questions
            <textarea
              disabled={Boolean(draft.savedQuizId)}
              value={draft.questionsText}
              onChange={(event) => updateDraft("questionsText", event.target.value)}
              placeholder={draft.savedQuizId ? "Using imported saved quiz questions" : "Add one question per line\nExample: Explain Linux file permissions."}
            />
          </label>
          <label className="wide-field">
            Expected answers
            <textarea
              disabled={Boolean(draft.savedQuizId)}
              value={draft.answersText}
              onChange={(event) => updateDraft("answersText", event.target.value)}
              placeholder={draft.savedQuizId ? "Using imported saved quiz answers" : "Add one expected answer per line in the same order\nExample: Permissions define read, write, and execute access for user, group, and others."}
            />
          </label>
          {draft.savedQuizId && (
            <p className="muted wide-field">
              Imported quiz will be posted with {savedQuizzes.find((quiz) => String(quiz.id) === String(draft.savedQuizId))?.questions.length || 0} questions.
            </p>
          )}
          {formError && <p className="form-error wide-field">{formError}</p>}
          <button className="primary-btn" type="submit">Post Exam</button>
        </form>
      )}
      <div className="exam-list">
        {examList.map((exam) => (
          <article className="exam-card" key={exam.id}>
            <div>
              <span className="course-tag">{exam.tag}</span>
              <h3>{exam.title}</h3>
              <p>{exam.detail}</p>
            </div>
            <div className="exam-meta">
              <span>{exam.date}</span>
              <span>{exam.time}</span>
              <span>{exam.durationMinutes} min · {exam.attemptLimit} attempt{exam.attemptLimit === 1 ? "" : "s"}</span>
              <span>{exam.questions?.length || 0} questions</span>
              <strong>{exam.status}</strong>
              {exam.source === "faculty" && (
                <button className="secondary-btn" onClick={() => removeExam(exam.id)}>Remove</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
