const roleButtons = document.querySelectorAll(".role-btn");
const examFilter = document.querySelector("#examFilter");
const examCards = document.querySelectorAll(".exam-card");
const modal = document.querySelector("#examModal");
const openExamBtn = document.querySelector("#openExamBtn");

roleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    roleButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    document.body.dataset.role = button.dataset.role;
  });
});

examFilter.addEventListener("change", () => {
  const value = examFilter.value;

  examCards.forEach((card) => {
    const shouldShow = value === "all" || card.dataset.course === value;
    card.hidden = !shouldShow;
  });
});

openExamBtn.addEventListener("click", () => {
  if (typeof modal.showModal === "function") {
    modal.showModal();
    return;
  }

  alert("Mock exam ready. This browser does not support dialog modals.");
});
