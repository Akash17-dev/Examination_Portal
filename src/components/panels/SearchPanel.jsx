import { useMemo, useState } from "react";
import { exams, students } from "../../data/mockData";

export function SearchPanel() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const source = [
      ...exams.map((exam) => ({ type: "Exam", title: exam.title, detail: exam.tag })),
      ...students.map((student) => ({ type: "Student", title: student.name, detail: student.roll })),
    ];
    return source.filter((item) => `${item.title} ${item.detail}`.toLowerCase().includes(query.toLowerCase()));
  }, [query]);

  return (
    <section className="panel wide" id="search">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Search</p>
          <h2>Find Exams, Students, Results</h2>
        </div>
        <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search portal..." />
      </div>
      <div className="mini-list">
        {results.map((item) => (
          <div className="mini-item" key={`${item.type}-${item.title}`}>
            <strong>{item.title}</strong>
            <span>{item.type} · {item.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
