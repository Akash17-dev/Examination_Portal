import { students } from "../../data/mockData";

export function StudentsPanel() {
  return (
    <section className="panel" id="students">
      <p className="eyebrow">Students</p>
      <h2>Cohort Snapshot</h2>
      <div className="mini-list">
        {students.map((student) => (
          <div className="mini-item" key={student.roll}>
            <strong>{student.name}</strong>
            <span>{student.roll} · {student.status} · {student.score}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
