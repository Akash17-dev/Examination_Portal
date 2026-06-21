import { attemptHistory } from "../../data/mockData";

export function HistoryPanel() {
  return (
    <section className="panel" id="history">
      <p className="eyebrow">Attempts</p>
      <h2>Exam History</h2>
      <div className="mini-list">
        {attemptHistory.map((item) => (
          <div className="mini-item" key={item.exam}>
            <strong>{item.exam}</strong>
            <span>{item.date} · {item.score} · Review {item.review}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
