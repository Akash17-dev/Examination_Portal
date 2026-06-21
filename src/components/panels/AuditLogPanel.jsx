import { auditLogs } from "../../data/mockData";

export function AuditLogPanel() {
  return (
    <section className="panel" id="audit-log">
      <p className="eyebrow">Audit Log</p>
      <h2>Faculty Actions</h2>
      <div className="mini-list">
        {auditLogs.map((item) => (
          <div className="mini-item" key={`${item.actor}-${item.time}`}>
            <strong>{item.action}</strong>
            <span>{item.actor} · {item.time}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
