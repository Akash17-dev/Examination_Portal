import { useEffect, useState } from "react";
import { createSavedQuiz, deleteSavedQuiz, fetchSavedQuizzes, subscribeToQuizUpdates } from "../utils/quizStore";

export function useSavedQuizzes() {
  const [quizzes, setQuizzes] = useState([]);

  useEffect(() => {
    let active = true;

    fetchSavedQuizzes()
      .then((items) => {
        if (active) setQuizzes(items);
      })
      .catch(() => {
        if (active) setQuizzes([]);
      });

    const unsubscribe = subscribeToQuizUpdates((items) => {
      if (active) setQuizzes(items);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function addQuiz(quiz) {
    const saved = await createSavedQuiz(quiz);
    setQuizzes((current) => [saved, ...current.filter((item) => String(item.id) !== String(saved.id))]);
    return saved;
  }

  async function removeQuiz(quizId) {
    await deleteSavedQuiz(quizId);
    setQuizzes((current) => current.filter((quiz) => String(quiz.id) !== String(quizId)));
  }

  return [quizzes, { addQuiz, removeQuiz }];
}
