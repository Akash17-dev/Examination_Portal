import { exams } from "../../data/mockData";

export function ExamControlPanel() {
  return (
    <section className="panel wide" id="exam-control">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Exam Control</p>
          <h2>Assessment Operations</h2>
        </div>
        <button className="secondary-btn">Create Exam</button>
      </div>
      <div className="exam-list">
        {exams.map((exam) => (
          <article className="exam-card" key={exam.id}>
            <div>
              <span className="course-tag">{exam.tag}</span>
              <h3>{exam.title}</h3>
              <p>{exam.detail}</p>
            </div>
            <div className="exam-meta">
              <span>{exam.date}</span>
              <strong>{exam.status}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
