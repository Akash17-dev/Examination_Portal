import { QuizBuilder } from "./QuizBuilder";
import { QuizAgentPanel } from "./QuizAgentPanel";
import { ToastStack } from "./ToastStack";
import { PortalLayout } from "./layout/PortalLayout";
import { AnalyticsPanel } from "./panels/AnalyticsPanel";
import { AuditLogPanel } from "./panels/AuditLogPanel";
import { CollegeInfoPanel } from "./panels/CollegeInfoPanel";
import { ExamControlPanel } from "./panels/ExamControlPanel";
import { FacultyAdvancedPanel } from "./panels/FacultyAdvancedPanel";
import { QuestionBankPanel } from "./panels/QuestionBankPanel";
import { SearchPanel } from "./panels/SearchPanel";
import { StudentsPanel } from "./panels/StudentsPanel";
import { useToasts } from "../hooks/useToasts";

export function FacultyDashboard({ user, onLogout }) {
  const { messages, pushToast } = useToasts();

  return (
    <PortalLayout user={user} onLogout={onLogout}>
      <section className="hero-panel" id="dashboard">
        <div className="hero-copy">
          <span className="status-pill">Faculty Workspace</span>
          <h2>Manage assessments, question banks, and cohort performance.</h2>
          <p>{user.department} faculty dashboard for project-first evaluation and exam operations.</p>
          <div className="metric-row" aria-label="Faculty metrics">
            <div><strong>12</strong><span>Active exams</span></div>
            <div><strong>128</strong><span>Students mapped</span></div>
            <div><strong>40+</strong><span>Rubrics ready</span></div>
          </div>
        </div>
        <div className="readiness-panel" aria-label="Faculty actions">
          <div className="readiness-header">
            <span>Needs Review</span>
            <strong>Data Wrangling Lab submissions</strong>
          </div>
          <ul className="check-list">
            <li className="done">Question set approved</li>
            <li className="done">Invigilators assigned</li>
            <li>14 submissions pending review</li>
            <li>Results draft closes Jun 30, 2026</li>
          </ul>
          <button className="secondary-btn">Publish Result Draft</button>
        </div>
      </section>

      <section className="content-grid">
        <ExamControlPanel />
        <QuizBuilder onToast={pushToast} />
        <QuizAgentPanel onToast={pushToast} />
        <QuestionBankPanel />
        <FacultyAdvancedPanel onToast={pushToast} />
        <AnalyticsPanel />
        <StudentsPanel />
        <AuditLogPanel />
        <SearchPanel />
        <CollegeInfoPanel />
      </section>
      <ToastStack messages={messages} />
    </PortalLayout>
  );
}
