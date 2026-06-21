import { questionBank } from "../../data/mockData";
import { Table } from "../Table";

export function QuestionBankPanel() {
  return (
    <section className="panel wide" id="question-bank">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Faculty Tools</p>
          <h2>Question Bank Builder</h2>
        </div>
        <button className="secondary-btn">Add Question</button>
      </div>
      <Table
        headers={["Module", "Type", "Difficulty", "Status"]}
        rows={questionBank.map((item) => [
          item.module,
          item.type,
          item.difficulty,
          <span className={`status ${item.status === "Approved" ? "approved" : "review"}`}>{item.status}</span>,
        ])}
      />
    </section>
  );
}
