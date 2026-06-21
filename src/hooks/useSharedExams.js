import { useEffect, useState } from "react";
import { createSharedExam, deleteSharedExam, fetchSharedExams, getDefaultExams, subscribeToExamUpdates } from "../utils/examStore";

export function useSharedExams() {
  const [examList, setExamList] = useState(getDefaultExams);

  useEffect(() => {
    let active = true;

    fetchSharedExams()
      .then((exams) => {
        if (active) setExamList(exams);
      })
      .catch(() => {
        if (active) setExamList(getDefaultExams());
      });

    const unsubscribe = subscribeToExamUpdates((exams) => {
      if (active) setExamList(exams);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function addExam(exam) {
    const saved = await createSharedExam(exam);
    setExamList((current) => [saved, ...current]);
    return saved;
  }

  async function removeExam(examId) {
    await deleteSharedExam(examId);
    setExamList((current) => current.filter((exam) => String(exam.id) !== String(examId)));
  }

  return [examList, { addExam, removeExam }];
}
