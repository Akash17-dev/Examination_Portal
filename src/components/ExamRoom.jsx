import { useEffect, useMemo, useRef, useState } from "react";
import { examQuestions } from "../data/mockData";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function getQuestionType(question) {
  return String(question.type || "").toLowerCase();
}

export function ExamRoom({ examTitle = "AI Foundations Midterm", durationMinutes = 24, questions, fullWindow = false, onExit, onToast }) {
  const questionSet = Array.isArray(questions) && questions.length > 0 ? questions : examQuestions;
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState((Number(durationMinutes) || 24) * 60);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [focusLosses, setFocusLosses] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [online, setOnline] = useState(navigator.onLine);
  const [lastSaved, setLastSaved] = useState("Not saved yet");
  const [result, setResult] = useState(null);
  const wasFullscreen = useRef(Boolean(document.fullscreenElement));
  const activeQuestion = questionSet[activeIndex];

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  useEffect(() => {
    setSecondsLeft((Number(durationMinutes) || 24) * 60);
  }, [durationMinutes]);

  useEffect(() => {
    const timer = window.setInterval(() => setSecondsLeft((current) => Math.max(current - 1, 0)), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const autosave = window.setInterval(() => {
      setLastSaved(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 4000);
    return () => window.clearInterval(autosave);
  }, []);

  useEffect(() => {
    function handleVisibilityChange() {
      if (document.hidden) {
        setTabWarnings((count) => count + 1);
        onToast("Tab switch detected and logged");
      }
    }

    function handleFullscreenChange() {
      const fullscreenNow = Boolean(document.fullscreenElement);
      setIsFullscreen(fullscreenNow);

      if (fullWindow && wasFullscreen.current && !fullscreenNow) {
        setFullscreenExits((count) => count + 1);
        onToast("Fullscreen exit detected and logged");
      }

      wasFullscreen.current = fullscreenNow;
    }

    function handleBlur() {
      if (fullWindow) {
        setFocusLosses((count) => count + 1);
        onToast("Window focus loss detected and logged");
      }
    }

    function handleOnline() {
      setOnline(true);
      onToast("Back online. Offline answers synced.");
    }

    function handleOffline() {
      setOnline(false);
      onToast("Offline mode enabled. Answers will sync later.");
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [fullWindow, onToast]);

  function updateAnswer(value) {
    setAnswers((current) => ({ ...current, [activeQuestion.id]: value }));
  }

  function toggleFlag() {
    setFlagged((current) =>
      current.includes(activeQuestion.id)
        ? current.filter((id) => id !== activeQuestion.id)
        : [...current, activeQuestion.id]
    );
  }

  function requestFullscreen() {
    document.documentElement.requestFullscreen?.().then(() => {
      wasFullscreen.current = true;
      setIsFullscreen(true);
      onToast("Fullscreen enabled");
    }).catch(() => {
      onToast("Fullscreen request was blocked by the browser");
    });
  }

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 3);
  }

  function meaningScore(studentAnswer, expectedAnswer) {
    const studentWords = new Set(normalizeText(studentAnswer));
    const expectedWords = normalizeText(expectedAnswer);
    if (expectedWords.length === 0) return studentAnswer ? 1 : 0;

    const matches = expectedWords.filter((word) => studentWords.has(word)).length;
    return matches / expectedWords.length;
  }

  function evaluateQuestion(question) {
    const studentAnswer = answers[question.id];
    const questionType = getQuestionType(question);

    if (["mcq", "true-false"].includes(questionType)) {
      const correct = studentAnswer === question.answer;
      return {
        id: question.id,
        title: question.title,
        score: correct ? Number(question.marks) || 1 : 0,
        max: Number(question.marks) || 1,
        feedback: correct ? "Correct answer." : `Expected: ${question.answer}`,
      };
    }

    if (questionType === "msq") {
      const expected = Array.isArray(question.answer)
        ? question.answer
        : String(question.answer || "").split(",").map((item) => item.trim()).filter(Boolean);
      const selected = Array.isArray(studentAnswer) ? studentAnswer : [];
      const correct = expected.length > 0 && expected.every((item) => selected.includes(item)) && selected.every((item) => expected.includes(item));
      return {
        id: question.id,
        title: question.title,
        score: correct ? Number(question.marks) || 1 : 0,
        max: Number(question.marks) || 1,
        feedback: correct ? "Correct answer." : `Expected: ${expected.join(", ")}`,
      };
    }

    if (["theory", "programming", "code", "drag"].includes(questionType)) {
      const ratio = meaningScore(studentAnswer, question.answer);
      const marks = Number(question.marks) || 1;
      const score = ratio >= 0.55 ? 1 : ratio >= 0.32 ? 0.5 : 0;
      return {
        id: question.id,
        title: question.title,
        score: score * marks,
        max: marks,
        feedback: score === 1
          ? "Good answer. Meaning matches the expected answer."
          : score === 0.5
            ? "Partially correct. Add more key concepts from the expected answer."
            : `Needs improvement. Expected meaning: ${question.answer}`,
      };
    }

    return {
      id: question.id,
      title: question.title,
      score: studentAnswer ? 1 : 0,
      max: 1,
      feedback: studentAnswer ? "File received for review." : "No file submitted.",
    };
  }

  function submitExam() {
    const details = questionSet.map(evaluateQuestion);
    const score = details.reduce((total, item) => total + item.score, 0);
    const max = details.reduce((total, item) => total + item.max, 0);
    const percentage = Math.round((score / max) * 100);

    setResult({ details, score, max, percentage });
    onToast(`Exam submitted. Score: ${percentage}%`);
  }

  function renderQuestionInput() {
    const questionType = getQuestionType(activeQuestion);

    if (["mcq", "true-false"].includes(questionType)) {
      const choices = activeQuestion.choices || activeQuestion.options || [];
      return (
        <div className="choice-list">
          {choices.map((choice) => (
            <label className="choice-card" key={choice}>
              <input
                checked={answers[activeQuestion.id] === choice}
                name={activeQuestion.id}
                onChange={() => updateAnswer(choice)}
                type="radio"
              />
              {choice}
            </label>
          ))}
        </div>
      );
    }

    if (questionType === "msq") {
      const choices = activeQuestion.choices || activeQuestion.options || [];
      const current = Array.isArray(answers[activeQuestion.id]) ? answers[activeQuestion.id] : [];

      return (
        <div className="choice-list">
          {choices.map((choice) => (
            <label className="choice-card" key={choice}>
              <input
                checked={current.includes(choice)}
                onChange={(event) => {
                  updateAnswer(
                    event.target.checked
                      ? [...current, choice]
                      : current.filter((item) => item !== choice)
                  );
                }}
                type="checkbox"
              />
              {choice}
            </label>
          ))}
        </div>
      );
    }

    if (["code", "programming"].includes(questionType)) {
      return (
        <textarea
          className="code-editor"
          value={answers[activeQuestion.id] || activeQuestion.starter || ""}
          onChange={(event) => updateAnswer(event.target.value)}
          spellCheck="false"
        />
      );
    }

    if (questionType === "theory") {
      return (
        <textarea
          className="code-editor"
          value={answers[activeQuestion.id] || ""}
          onChange={(event) => updateAnswer(event.target.value)}
          placeholder="Write your answer in your own words"
        />
      );
    }

    if (questionType === "drag") {
      return (
        <div className="drag-mock">
          {activeQuestion.pairs.map((pair) => <span draggable key={pair}>{pair}</span>)}
          <textarea
            className="code-editor"
            value={answers[activeQuestion.id] || ""}
            onChange={(event) => updateAnswer(event.target.value)}
            placeholder="Write the correct matches here"
          />
        </div>
      );
    }

    return (
      <label className="upload-box">
        Upload diagram
        <input type="file" accept="image/*,.pdf" onChange={(event) => updateAnswer(event.target.files[0]?.name || "")} />
        <span>{answers[activeQuestion.id] || "No file selected"}</span>
      </label>
    );
  }

  return (
    <section className={`panel wide exam-room ${fullWindow ? "full-window-exam" : ""}`} id="exam-room">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Live Exam Room</p>
          <h2>{examTitle}</h2>
        </div>
        <div className="exam-room-actions">
          <span className="timer">{formatTime(secondsLeft)}</span>
          <button className="secondary-btn" onClick={requestFullscreen}>
            {isFullscreen ? "Fullscreen Active" : "Return Fullscreen"}
          </button>
          {fullWindow && <button className="secondary-btn" onClick={onExit}>Exit Exam</button>}
        </div>
      </div>

      <div className="exam-guard">
        <span className={online ? "status approved" : "status review"}>{online ? "Online sync" : "Offline mode"}</span>
        <span className="status review">Tab switches: {tabWarnings}</span>
        {fullWindow && <span className="status review">Fullscreen exits: {fullscreenExits}</span>}
        {fullWindow && <span className="status review">Focus losses: {focusLosses}</span>}
        <span className="status approved">Auto-saved: {lastSaved}</span>
        <button className="secondary-btn" onClick={() => onToast("Webcam snapshot prompt sent")}>Webcam Check</button>
      </div>

      <div className="exam-room-grid">
        <aside className="question-nav">
          {questionSet.map((question, index) => (
            <button
              className={`${activeIndex === index ? "active" : ""} ${flagged.includes(question.id) ? "flagged" : ""}`}
              onClick={() => setActiveIndex(index)}
              key={question.id}
            >
              {index + 1}
            </button>
          ))}
        </aside>

        <article className="question-stage">
          <span className="course-tag">{activeQuestion.type}</span>
          <h3>{activeQuestion.title}</h3>
          {renderQuestionInput()}
          <div className="question-actions">
            <button className="secondary-btn" onClick={toggleFlag}>
              {flagged.includes(activeQuestion.id) ? "Unflag" : "Flag for Review"}
            </button>
            <button className="secondary-btn" onClick={() => setActiveIndex(Math.max(activeIndex - 1, 0))}>Previous</button>
            <button className="primary-btn" onClick={() => setActiveIndex(Math.min(activeIndex + 1, questionSet.length - 1))}>Next</button>
            <button className="primary-btn" onClick={submitExam}>Submit Exam</button>
          </div>
        </article>
      </div>

      <p className="muted">Answered {answeredCount} of {questionSet.length}. Flagged {flagged.length} for review.</p>
      {result && (
        <section className="exam-result-panel" aria-label="Exam result">
          <div>
            <p className="eyebrow">Instant Evaluation</p>
            <h2>{result.percentage}%</h2>
            <p className="muted">Scored {result.score} out of {result.max}</p>
          </div>
          <div className="mini-list">
            {result.details.map((item) => (
              <div className="mini-item" key={item.id}>
                <strong>{item.title}</strong>
                <span>{item.score}/{item.max} · {item.feedback}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
