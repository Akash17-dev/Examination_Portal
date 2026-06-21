import { useState } from "react";

export function QuizAgentPanel({ onToast }) {
  const [topic, setTopic] = useState("Python loops");
  const [count, setCount] = useState(4);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  async function generateQuiz() {
    setLoading(true);
    try {
      const response = await fetch("/api/agent/create-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          count,
          types: ["mcq", "msq", "theory", "programming", "true-false", "file-drop"],
        }),
      });
      const data = await response.json();
      if (!data.ok) throw new Error(data.message);
      setQuestions(data.quiz);
      onToast(data.fallback ? "Quiz agent used local fallback" : "Quiz agent generated questions");
    } catch (error) {
      onToast(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel wide" id="quiz-agent">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Quiz Making Agent</p>
          <h2>Generate Question Drafts</h2>
        </div>
        <button className="primary-btn" disabled={loading} onClick={generateQuiz}>
          {loading ? "Generating..." : "Generate Quiz"}
        </button>
      </div>

      <div className="quiz-meta">
        <label>
          Topic
          <input value={topic} onChange={(event) => setTopic(event.target.value)} />
        </label>
        <label>
          Number of questions
          <input min="1" max="10" type="number" value={count} onChange={(event) => setCount(Number(event.target.value))} />
        </label>
      </div>

      <div className="mini-list">
        {questions.length === 0 && <p className="muted">The agent can draft MCQ, MSQ, theory, programming, true/false, and file-drop questions.</p>}
        {questions.map((question, index) => (
          <div className="mini-item" key={`${question.type}-${index}`}>
            <strong>{index + 1}. {question.question}</strong>
            <span>{question.type} · {question.marks || 1} marks</span>
          </div>
        ))}
      </div>
    </section>
  );
}
