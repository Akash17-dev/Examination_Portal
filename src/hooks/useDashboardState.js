import { useMemo, useState } from "react";
import { useSharedExams } from "./useSharedExams";

export function useDashboardState() {
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [examList] = useSharedExams();

  const filteredExams = useMemo(
    () => examList.filter((exam) => filter === "all" || exam.course === filter),
    [examList, filter]
  );

  return {
    filter,
    filteredExams,
    modalOpen,
    setFilter,
    setModalOpen,
  };
}
