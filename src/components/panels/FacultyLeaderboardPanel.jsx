import { students } from "../../data/mockData";

const leaderboard = students
  .filter((student) => student.score !== "Pending")
  .map((student) => ({
    ...student,
    numericScore: Number.parseInt(student.score, 10),
  }))
  .sort((first, second) => second.numericScore - first.numericScore);

export function FacultyLeaderboardPanel({ teacher }) {
  return (
    <section className="panel wide" id="leaderboard">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Student Leaderboard</p>
          <h2>{teacher.department} Exam Performance</h2>
        </div>
        <span className="course-tag">Faculty exams</span>
      </div>

      <div className="leaderboard-list">
        {leaderboard.map((student, index) => (
          <div className="leaderboard-row" key={student.roll}>
            <span className="leaderboard-rank">{index + 1}</span>
            <div>
              <strong>{student.name}</strong>
              <small>{student.roll} · {student.exam}</small>
            </div>
            <b>{student.score}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
