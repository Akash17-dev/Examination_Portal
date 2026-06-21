import { studyMaterials } from "../../data/mockData";

export function MaterialsPanel() {
  return (
    <section className="panel" id="materials">
      <p className="eyebrow">Study Material</p>
      <h2>Exam Resources</h2>
      <div className="mini-list">
        {studyMaterials.map((item) => (
          <a className="mini-item link-card" href={item.href} key={`${item.exam}-${item.title}`}>
            <strong>{item.title}</strong>
            <span>{item.type} · {item.exam}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
