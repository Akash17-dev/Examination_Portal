import { analytics, scoreTrend, subjectRadar } from "../../data/mockData";

export function AnalyticsPanel() {
  return (
    <section className="panel wide" id="analytics">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Analytics</p>
          <h2>Performance Insights</h2>
        </div>
        <span className="status approved">Cohort percentile 91</span>
      </div>
      <div className="analytics-grid">
        <div>
          <h3>Score Trend</h3>
          <div className="bar-chart">
            {scoreTrend.map((item) => (
              <div className="bar-item" key={item.label}>
                <span>{item.label}</span>
                <div><i style={{ width: `${item.score}%` }} /></div>
                <strong>{item.score}%</strong>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3>Subject Radar</h3>
          <div className="radar-list">
            {subjectRadar.map((item) => (
              <span style={{ "--score": item.score }} key={item.subject}>{item.subject}</span>
            ))}
          </div>
        </div>
        <div>
          <h3>Exam Analytics</h3>
          <p className="muted">Average score: <strong>{analytics.average}</strong></p>
          <div className="distribution">
            {analytics.distribution.map((value, index) => <i style={{ height: `${value * 2}px` }} key={index} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
