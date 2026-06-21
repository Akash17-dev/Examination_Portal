import { useEffect, useRef } from "react";

const focusableSelector = "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])";

export function ExamModal({ onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    const modal = modalRef.current;
    const focusableElements = Array.from(modal.querySelectorAll(focusableSelector));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const previouslyFocused = document.activeElement;

    firstElement?.focus();

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key !== "Tab" || focusableElements.length === 0) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="exam-modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="mock-exam-title">
        <div className="modal-head">
          <img src="/assets/leapstart-logo.webp" alt="LeapStart logo" />
          <button aria-label="Close dialog" onClick={onClose}>x</button>
        </div>
        <h2 id="mock-exam-title">Mock Exam Ready</h2>
        <p>
          This prototype flow verifies the learner, locks the test window, loads the question set, and
          starts the timer.
        </p>
        <div className="modal-actions">
          <button className="secondary-btn" onClick={onClose}>Cancel</button>
          <button className="primary-btn" onClick={onClose}>Enter Exam Room</button>
        </div>
      </section>
    </div>
  );
}
