import { useState } from "react";
import { subjectLeaderboards } from "../../data/mockData";

const subjects = [
  { id: "overall", label: "Overall" },
  { id: "linux", label: "Linux" },
  { id: "networking", label: "Networking" },
  { id: "database", label: "Database" },
  { id: "frontend", label: "Frontend" },
];

export function StudentLeaderboardPanel() {
  const [subject, setSubject] = useState("overall");
  const rows = subjectLeaderboards[subject] || subjectLeaderboards.overall;

  return (
    <section className="panel wide" id="leaderboard">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Leaderboard</p>
          <h2>Subject Rankings</h2>
        </div>
        <select value={subject} onChange={(event) => setSubject(event.target.value)}>
          {subjects.map((item) => (
            <option key={item.id} value={item.id}>{item.label}</option>
          ))}
        </select>
      </div>

      <div className="leaderboard-list">
        {rows.map((student, index) => (
          <div className="leaderboard-row" key={`${subject}-${student.roll}`}>
            <span className="leaderboard-rank">{index + 1}</span>
            <div>
              <strong>{student.name}</strong>
              <small>{student.roll} · {subjects.find((item) => item.id === subject)?.label}</small>
            </div>
            <b>{student.score}%</b>
          </div>
        ))}
      </div>
    </section>
  );
}
