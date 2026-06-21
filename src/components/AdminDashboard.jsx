import { PortalLayout } from "./layout/PortalLayout";
import { AuditLogPanel } from "./panels/AuditLogPanel";
import { SearchPanel } from "./panels/SearchPanel";
import { cohorts, users } from "../data/mockData";

export function AdminDashboard({ user, onLogout }) {
  return (
    <PortalLayout user={user} onLogout={onLogout}>
      <section className="hero-panel" id="dashboard">
        <div className="hero-copy">
          <span className="status-pill">Admin Workspace</span>
          <h2>Manage users, cohorts, access, and audit visibility.</h2>
          <p>Role-based access control for LeapStart School of Technology examination operations.</p>
          <div className="metric-row" aria-label="Admin metrics">
            <div><strong>{users.length}</strong><span>Portal users</span></div>
            <div><strong>{cohorts.length}</strong><span>Cohorts</span></div>
            <div><strong>3</strong><span>Roles</span></div>
          </div>
        </div>
        <div className="readiness-panel">
          <div className="readiness-header">
            <span>RBAC</span>
            <strong>Student · Faculty · Admin</strong>
          </div>
          <ul className="check-list">
            <li className="done">Session guard active</li>
            <li className="done">MongoDB connected</li>
            <li>Production permissions pending backend policies</li>
          </ul>
        </div>
      </section>

      <section className="content-grid">
        <section className="panel" id="users">
          <p className="eyebrow">Users</p>
          <h2>Role Management</h2>
          <div className="mini-list">
            {users.map((portalUser) => (
              <div className="mini-item" key={portalUser.id}>
                <strong>{portalUser.name}</strong>
                <span>{portalUser.id} · {portalUser.role}</span>
              </div>
            ))}
          </div>
        </section>
        <section className="panel" id="cohorts">
          <p className="eyebrow">Cohorts</p>
          <h2>Academic Batches</h2>
          <div className="mini-list">
            {cohorts.map((cohort) => (
              <div className="mini-item" key={cohort.name}>
                <strong>{cohort.name}</strong>
                <span>{cohort.students} students · {cohort.faculty} faculty · {cohort.activeExams} exams</span>
              </div>
            ))}
          </div>
        </section>
        <AuditLogPanel />
        <SearchPanel />
      </section>
    </PortalLayout>
  );
}
