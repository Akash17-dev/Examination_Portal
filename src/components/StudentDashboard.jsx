import { useState } from "react";
import { ExamModal } from "./ExamModal";
import { ExamRoom } from "./ExamRoom";
import { ToastStack } from "./ToastStack";
import { PortalLayout } from "./layout/PortalLayout";
import { ExamPanel } from "./panels/ExamPanel";
import { HistoryPanel } from "./panels/HistoryPanel";
import { ProfilePanel } from "./panels/ProfilePanel";
import { StudentLeaderboardPanel } from "./panels/StudentLeaderboardPanel";
import { TimelinePanel } from "./panels/TimelinePanel";
import { useDashboardState } from "../hooks/useDashboardState";
import { useToasts } from "../hooks/useToasts";

export function StudentDashboard({ user, onLogout }) {
  const { filter, filteredExams, modalOpen, setFilter, setModalOpen } = useDashboardState();
  const { messages, pushToast } = useToasts();
  const [activeExam, setActiveExam] = useState(null);
  const [pendingExam, setPendingExam] = useState(null);

  function startAttempt(exam) {
    document.documentElement.requestFullscreen?.().catch(() => {});
    setActiveExam(exam);
    pushToast(`${exam.title} attempt started. Tab switches will be recorded.`);
  }

  function requestAttempt(exam) {
    setPendingExam(exam);
    setModalOpen(true);
  }

  function exitAttempt() {
    document.exitFullscreen?.().catch(() => {});
    setActiveExam(null);
    pushToast("Exam attempt closed.");
  }

  if (activeExam) {
    return (
      <>
        <ExamRoom
          examTitle={activeExam.title}
          durationMinutes={activeExam.durationMinutes}
          questions={activeExam.questions}
          fullWindow
          onExit={exitAttempt}
          onToast={pushToast}
        />
        <ToastStack messages={messages} />
      </>
    );
  }

  return (
    <PortalLayout user={user} onLogout={onLogout}>
      <section className="hero-panel" id="dashboard">
        <div className="hero-copy">
          <span className="status-pill">Student Workspace</span>
          <h2>Welcome back, {user.name}. Your next AI assessment is ready.</h2>
          <p>{user.program}. Complete device checks before the exam window opens.</p>
          <div className="metric-row" aria-label="Student metrics">
            <div><strong>3</strong><span>Upcoming exams</span></div>
            <div><strong>88%</strong><span>Latest score</span></div>
            <div><strong>96%</strong><span>Attendance</span></div>
          </div>
        </div>
        <div className="readiness-panel" aria-label="Exam readiness">
          <div className="readiness-header">
            <span>Today</span>
            <strong>AI Foundations Midterm</strong>
          </div>
          <ul className="check-list">
            <li className="done">Identity verified</li>
            <li className="done">Device check passed</li>
            <li className="done">Question set synced</li>
            <li>Exam window opens at 10:00 AM</li>
          </ul>
          <button className="secondary-btn" onClick={() => requestAttempt({ title: "Mock Exam" })}>Start Mock Exam</button>
        </div>
      </section>

      <section className="content-grid">
        <ExamPanel filter={filter} id="exams" onAttempt={requestAttempt} setFilter={setFilter} exams={filteredExams} title="My Upcoming Exams" />
        <HistoryPanel />
        <ProfilePanel user={user} />
        <TimelinePanel />
        <StudentLeaderboardPanel />
      </section>

      {modalOpen && (
        <ExamModal
          onClose={() => setModalOpen(false)}
          onStart={() => {
            setModalOpen(false);
            startAttempt(pendingExam || { title: "Mock Exam" });
            setPendingExam(null);
          }}
          examTitle={pendingExam?.title || "Mock Exam"}
        />
      )}
      <ToastStack messages={messages} />
    </PortalLayout>
  );
}
