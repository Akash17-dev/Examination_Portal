export function ExamPanel({ filter, id = "my-exams", onAttempt, setFilter, exams, title }) {
  return (
    <section className="panel wide" id={id}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Exam Desk</p>
          <h2>{title}</h2>
        </div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter exams">
          <option value="all">All courses</option>
          <option value="ai">AI and ML</option>
          <option value="python">Python and SQL</option>
          <option value="cyber">Cybersecurity</option>
        </select>
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
              <strong>{exam.time}</strong>
              <span className="status approved">{exam.status}</span>
              {onAttempt && <button className="primary-btn" onClick={() => onAttempt(exam)}>Attempt Quiz</button>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
