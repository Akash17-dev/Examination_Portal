export const users = [
  {
    id: "LST26CS014",
    name: "Aarav Reddy",
    role: "student",
    email: "student@leapstart.in",
    password: "student123",
    cohort: "Batch 2026",
    program: "Computer Science - AI and Data Science",
  },
  {
    id: "FAC-AI-07",
    name: "Dr. Meera Iyer",
    role: "faculty",
    email: "faculty@leapstart.in",
    password: "faculty123",
    department: "AI and Data Science",
  },
  {
    id: "ADM-LST-01",
    name: "Rohan Menon",
    role: "admin",
    email: "admin@leapstart.in",
    password: "admin123",
    department: "Academic Operations",
  },
];

export const exams = [
  {
    id: 1,
    course: "ai",
    tag: "AI and ML",
    title: "AI Foundations Midterm",
    detail: "60 questions, coding task, and short case analysis.",
    date: "Jun 24, 2026",
    time: "10:00 AM",
    status: "Ready",
  },
  {
    id: 2,
    course: "python",
    tag: "Python and SQL",
    title: "Data Wrangling Lab",
    detail: "Hands-on notebook submission with SQL validation.",
    date: "Jun 28, 2026",
    time: "2:00 PM",
    status: "Scheduled",
  },
  {
    id: 3,
    course: "cyber",
    tag: "Cybersecurity",
    title: "Secure Systems Quiz",
    detail: "Scenario-based questions on threat models and access control.",
    date: "Jul 02, 2026",
    time: "11:30 AM",
    status: "Draft",
  },
];

export const students = [
  { name: "Aarav Reddy", roll: "LST26CS014", exam: "AI Foundations Midterm", score: "88%", status: "Submitted" },
  { name: "Nisha Varma", roll: "LST26CS021", exam: "Data Wrangling Lab", score: "Pending", status: "In progress" },
  { name: "Kabir Shah", roll: "LST26CS032", exam: "Secure Systems Quiz", score: "91%", status: "Submitted" },
];

export const questionBank = [
  { module: "Reverse Engineered Curriculum", type: "Case Study", difficulty: "Medium", status: "Approved" },
  { module: "Internship Driven Learning", type: "Project Rubric", difficulty: "Advanced", status: "Review" },
  { module: "Agile Learning Environment", type: "MCQ", difficulty: "Easy", status: "Approved" },
];

export const examQuestions = [
  {
    id: "q1",
    type: "MCQ",
    title: "Which evaluation metric is most useful for imbalanced classification?",
    choices: ["Accuracy", "F1 score", "Mean squared error", "Silhouette score"],
    answer: "F1 score",
  },
  {
    id: "q2",
    type: "Code",
    title: "Write a Python function that normalizes a list of numeric values.",
    starter: "def normalize(values):\n    # return min-max normalized values\n    pass",
  },
  {
    id: "q3",
    type: "Drag",
    title: "Match each model concept to the correct description.",
    pairs: ["Overfitting -> Low training error, poor test generalization", "Regularization -> Penalizes complexity"],
  },
  {
    id: "q4",
    type: "Upload",
    title: "Upload a confusion-matrix diagram for the given prediction set.",
  },
];

export const scoreTrend = [
  { label: "Python", score: 78 },
  { label: "SQL", score: 84 },
  { label: "ML Lab", score: 88 },
  { label: "AI Midterm", score: 91 },
];

export const subjectRadar = [
  { subject: "AI", score: 88 },
  { subject: "Python", score: 82 },
  { subject: "SQL", score: 76 },
  { subject: "Security", score: 71 },
  { subject: "Projects", score: 94 },
];

export const studyMaterials = [
  { exam: "AI Foundations Midterm", type: "Syllabus", title: "Unit 1-4 AI Foundations", href: "#" },
  { exam: "AI Foundations Midterm", type: "Past Paper", title: "2025 Midterm Practice Set", href: "#" },
  { exam: "Data Wrangling Lab", type: "Faculty Notes", title: "Pandas + SQL Join Cheatsheet", href: "#" },
];

export const notifications = [
  { id: 1, title: "AI Foundations starts in 30 min", time: "Today, 9:30 AM", unread: true },
  { id: 2, title: "ML Lab feedback released", time: "Yesterday", unread: true },
  { id: 3, title: "Data Wrangling study notes added", time: "Jun 20", unread: false },
];

export const attemptHistory = [
  { exam: "Machine Learning Lab 1", date: "Jun 14, 2026", score: "88%", review: "Published" },
  { exam: "Python Diagnostic", date: "May 30, 2026", score: "82%", review: "Published" },
  { exam: "SQL Joins Quiz", date: "May 18, 2026", score: "76%", review: "Published" },
];

export const auditLogs = [
  { actor: "Dr. Meera Iyer", action: "Published AI Foundations draft", time: "Jun 21, 2026 10:40 AM" },
  { actor: "Rohan Menon", action: "Added Batch 2026 cohort", time: "Jun 20, 2026 5:15 PM" },
  { actor: "Dr. Meera Iyer", action: "Updated grading rubric", time: "Jun 19, 2026 3:20 PM" },
];

export const analytics = {
  average: "82%",
  distribution: [8, 14, 26, 31, 19],
  hardestQuestions: [
    { question: "Gradient descent learning rate", wrongRate: "64%" },
    { question: "Bias-variance tradeoff", wrongRate: "52%" },
    { question: "SQL window functions", wrongRate: "47%" },
  ],
};

export const cohorts = [
  { name: "Batch 2026", students: 128, faculty: 8, activeExams: 12 },
  { name: "Batch 2027", students: 142, faculty: 9, activeExams: 7 },
];
