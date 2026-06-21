import { useState } from "react";
import { analytics } from "../../data/mockData";

export function FacultyAdvancedPanel({ onToast }) {
  const [topic, setTopic] = useState("Gradient Descent");
  const [generated, setGenerated] = useState(null);
  const [csvName, setCsvName] = useState("");

  function generateQuestions() {
    setGenerated({
      question: `Which statement best explains ${topic}?`,
      options: ["It optimizes model parameters", "It stores raw data", "It encrypts datasets", "It deploys APIs"],
      rubric: "Award full marks for identifying optimization and partial derivatives.",
    });
    onToast("Mock AI question generated");
  }

  return (
    <section className="panel wide" id="faculty-ai">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Faculty Power Tools</p>
          <h2>AI, CSV Import, Plagiarism, Grading</h2>
        </div>
      </div>

      <div className="tool-grid">
        <div className="tool-box">
          <h3>AI Question Generator</h3>
          <input value={topic} onChange={(event) => setTopic(event.target.value)} />
          <button className="primary-btn" onClick={generateQuestions}>Generate MCQ + Rubric</button>
          {generated && (
            <div className="generated-card">
              <strong>{generated.question}</strong>
              <span>{generated.options.join(" · ")}</span>
              <p>{generated.rubric}</p>
            </div>
          )}
        </div>

        <div className="tool-box">
          <h3>Bulk Student Import</h3>
          <label className="upload-box">
            CSV upload
            <input accept=".csv" type="file" onChange={(event) => setCsvName(event.target.files[0]?.name || "")} />
            <span>{csvName || "No CSV selected"}</span>
          </label>
        </div>

        <div className="tool-box">
          <h3>Similarity Checker</h3>
          <div className="similarity-meter"><i style={{ width: "27%" }} /></div>
          <p className="muted">Submission similarity: 27%. No severe plagiarism pattern detected.</p>
        </div>

        <div className="tool-box">
          <h3>Inline Grading</h3>
          <textarea className="annotation-box" defaultValue="Student explains normalization correctly, but misses edge case for equal values." />
          <button className="secondary-btn" onClick={() => onToast("Annotation saved")}>Save Annotation</button>
        </div>
      </div>

      <div className="hardest-list">
        <h3>Hardest Questions</h3>
        {analytics.hardestQuestions.map((item) => (
          <div className="mini-item" key={item.question}>
            <strong>{item.question}</strong>
            <span>Wrong-answer rate: {item.wrongRate}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
