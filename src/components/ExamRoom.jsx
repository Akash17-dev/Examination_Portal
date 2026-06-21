import { useEffect, useMemo, useRef, useState } from "react";
import { examQuestions } from "../data/mockData";

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

export function ExamRoom({ examTitle = "AI Foundations Midterm", fullWindow = false, onExit, onToast }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState([]);
  const [secondsLeft, setSecondsLeft] = useState(24 * 60);
  const [tabWarnings, setTabWarnings] = useState(0);
  const [fullscreenExits, setFullscreenExits] = useState(0);
  const [focusLosses, setFocusLosses] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(Boolean(document.fullscreenElement));
  const [online, setOnline] = useState(navigator.onLine);
  const [lastSaved, setLastSaved] = useState("Not saved yet");
  const wasFullscreen = useRef(Boolean(document.fullscreenElement));
  const activeQuestion = examQuestions[activeIndex];

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

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

  function renderQuestionInput() {
    if (activeQuestion.type === "MCQ") {
      return (
        <div className="choice-list">
          {activeQuestion.choices.map((choice) => (
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

    if (activeQuestion.type === "Code") {
      return (
        <textarea
          className="code-editor"
          value={answers[activeQuestion.id] || activeQuestion.starter}
          onChange={(event) => updateAnswer(event.target.value)}
          spellCheck="false"
        />
      );
    }

    if (activeQuestion.type === "Drag") {
      return (
        <div className="drag-mock">
          {activeQuestion.pairs.map((pair) => <span draggable key={pair}>{pair}</span>)}
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
          {examQuestions.map((question, index) => (
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
            <button className="primary-btn" onClick={() => setActiveIndex(Math.min(activeIndex + 1, examQuestions.length - 1))}>Next</button>
          </div>
        </article>
      </div>

      <p className="muted">Answered {answeredCount} of {examQuestions.length}. Flagged {flagged.length} for review.</p>
    </section>
  );
}
