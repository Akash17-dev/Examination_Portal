import { exams } from "../../data/mockData";
import { useState } from "react";

export function ExamControlPanel() {
  const [examList, setExamList] = useState(exams);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState({
    tag: "Linux",
    title: "",
    detail: "",
    date: "Jul 10, 2026",
    status: "Draft",
  });

  function updateDraft(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function createExam(event) {
    event.preventDefault();
    if (!draft.title.trim()) return;

    setExamList((current) => [
      {
        ...draft,
        id: Date.now(),
        course: draft.tag.toLowerCase().replaceAll(" ", "-"),
        detail: draft.detail || "Faculty-created assessment draft.",
      },
      ...current,
    ]);
    setDraft({ tag: "Linux", title: "", detail: "", date: "Jul 10, 2026", status: "Draft" });
    setCreating(false);
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
            Exam title
            <input value={draft.title} onChange={(event) => updateDraft("title", event.target.value)} placeholder="Example: Linux Shell Test" />
          </label>
          <label>
            Date
            <input value={draft.date} onChange={(event) => updateDraft("date", event.target.value)} />
          </label>
          <label className="wide-field">
            Description
            <textarea value={draft.detail} onChange={(event) => updateDraft("detail", event.target.value)} placeholder="Short exam instructions" />
          </label>
          <button className="primary-btn" type="submit">Add Exam</button>
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
              <strong>{exam.status}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
