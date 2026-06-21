export function ExamPanel({ filter, id = "my-exams", onAttempt, setFilter, exams, title }) {
  function getExamAvailability(exam) {
    if (exam.scheduledAt && (!exam.questions || exam.questions.length === 0)) {
      return { open: false, label: "No questions added" };
    }

    if (!exam.scheduledAt) return { open: true, label: exam.status };

    const opensAt = new Date(exam.scheduledAt);
    const open = Date.now() >= opensAt.getTime();
    return {
      open,
      label: open ? "Open now" : `Opens ${exam.date} at ${exam.time}`,
    };
  }

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
          <option value="linux">Linux</option>
          <option value="networking">Networking</option>
          <option value="database">Database</option>
          <option value="frontend">Frontend</option>
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
              {(() => {
                const availability = getExamAvailability(exam);

                return (
                  <>
                    <span>{exam.date}</span>
                    <strong>{exam.time}</strong>
                    {exam.durationMinutes && <span>{exam.durationMinutes} min · {exam.attemptLimit || 1} attempt{exam.attemptLimit === 1 ? "" : "s"}</span>}
                    <span className={`status ${availability.open ? "approved" : "review"}`}>{availability.label}</span>
                    {onAttempt && (
                      <button className="primary-btn" disabled={!availability.open} onClick={() => onAttempt(exam)}>
                        {availability.open ? "Attempt Quiz" : "Locked"}
                      </button>
                    )}
                  </>
                );
              })()}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
