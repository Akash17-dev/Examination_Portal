import { useMemo, useState } from "react";
import { exams } from "../data/mockData";

export function useDashboardState() {
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredExams = useMemo(
    () => exams.filter((exam) => filter === "all" || exam.course === filter),
    [filter]
  );

  return {
    filter,
    filteredExams,
    modalOpen,
    setFilter,
    setModalOpen,
  };
}
