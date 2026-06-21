import React, { useMemo, useState } from "react";

const users = [
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
];

const exams = [
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

const students = [
  { name: "Aarav Reddy", roll: "LST26CS014", exam: "AI Foundations Midterm", score: "88%", status: "Submitted" },
  { name: "Nisha Varma", roll: "LST26CS021", exam: "Data Wrangling Lab", score: "Pending", status: "In progress" },
  { name: "Kabir Shah", roll: "LST26CS032", exam: "Secure Systems Quiz", score: "91%", status: "Submitted" },
];

const questionBank = [
  { module: "Reverse Engineered Curriculum", type: "Case Study", difficulty: "Medium", status: "Approved" },
  { module: "Internship Driven Learning", type: "Project Rubric", difficulty: "Advanced", status: "Review" },
  { module: "Agile Learning Environment", type: "MCQ", difficulty: "Easy", status: "Approved" },
];

function toSectionId(value) {
  return value.toLowerCase().split(" ").join("-");
}

function getInitialUser() {
  try {
    const stored = localStorage.getItem("leapstart-user");
    const parsed = stored ? JSON.parse(stored) : null;
    const validUser = users.find((user) => user.id === parsed?.id && user.role === parsed?.role);
    if (!validUser) return null;

    const sessionUser = { ...validUser };
    delete sessionUser.password;
    return sessionUser;
  } catch {
    return null;
  }
}

function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("student@leapstart.in");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState("");

  function switchRole(nextRole) {
    const demoUser = users.find((user) => user.role === nextRole);
    setRole(nextRole);
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const match = users.find(
      (user) => user.role === role && user.email === email.trim() && user.password === password
    );

    if (!match) {
      setError("Invalid mock credentials for the selected role.");
      return;
    }

    const sessionUser = { ...match };
    delete sessionUser.password;
    localStorage.setItem("leapstart-user", JSON.stringify(sessionUser));
    onLogin(sessionUser);
  }

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <img src="/assets/leapstart-logo-white.webp" alt="LeapStart logo" />
        <span className="status-pill">Prototype Access</span>
        <h1>LeapStart School of Technology Examination Portal</h1>
        <p>
          Login is required before entering the student or faculty workspace. This prototype uses mock
          accounts only.
        </p>
        <div className="login-facts">
          <strong>Four-year on-campus Computer Science program</strong>
          <span>Specialization in Data Science and Artificial Intelligence</span>
          <span>Experiential learning, industry mentors, projects, and internships</span>
        </div>
      </section>

      <section className="login-card" aria-label="Login form">
        <img className="login-logo" src="/assets/leapstart-logo.webp" alt="LeapStart logo" />
        <p className="eyebrow">Secure Access</p>
        <h2>{role === "student" ? "Student Login" : "Faculty Login"}</h2>

        <div className="login-tabs" role="tablist" aria-label="Choose login type">
          <button className={role === "student" ? "active" : ""} onClick={() => switchRole("student")} type="button">
            Student
          </button>
          <button className={role === "faculty" ? "active" : ""} onClick={() => switchRole("faculty")} type="button">
            Faculty
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label>
            Email
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            Password
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="primary-btn" type="submit">Login to Portal</button>
        </form>

        <div className="demo-credentials">
          <strong>Mock credentials</strong>
          <span>Student: student@leapstart.in / student123</span>
          <span>Faculty: faculty@leapstart.in / faculty123</span>
        </div>
      </section>
    </main>
  );
}

function Sidebar({ user }) {
  const navItems =
    user.role === "student"
      ? ["Dashboard", "My Exams", "Schedule", "Results", "College Info"]
      : ["Dashboard", "Exam Control", "Question Bank", "Students", "College Info"];

  return (
    <aside className="sidebar" aria-label="Main navigation">
      <a className="brand" href="#dashboard" aria-label="LeapStart School of Technology home">
        <img src="/assets/leapstart-logo-white.webp" alt="LeapStart logo" />
        <span>{user.role === "student" ? "Student Portal" : "Faculty Portal"}</span>
      </a>

      <nav className="nav-list">
        {navItems.map((item, index) => (
          <a className={`nav-item ${index === 0 ? "active" : ""}`} href={`#${toSectionId(item)}`} key={item}>
            {item}
          </a>
        ))}
      </nav>

      <div className="source-card">
        <span className="label">Signed in</span>
        <strong>{user.name}</strong>
        <p>{user.id} · {user.role === "student" ? user.cohort : user.department}</p>
      </div>
    </aside>
  );
}

function StudentDashboard({ user, onLogout }) {
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const filteredExams = useMemo(
    () => exams.filter((exam) => filter === "all" || exam.course === filter),
    [filter]
  );

  return (
    <PortalLayout user={user} onLogout={onLogout}>
      <section className="hero-panel" id="dashboard">
        <div className="hero-copy">
          <span className="status-pill">Student Workspace</span>
          <h2>Welcome back, {user.name}. Your next AI assessment is ready.</h2>
          <p>{user.program}. Complete device checks before the exam window opens.</p>
          <div className="metric-row" aria-label="Student metrics">
            <div><strong>3</strong><span>Upcoming exams</span></div>
            <div><strong>88%</strong><span>Latest score</span></div>
            <div><strong>96%</strong><span>Attendance</span></div>
          </div>
        </div>
        <div className="readiness-panel" aria-label="Exam readiness">
          <div className="readiness-header">
            <span>Today</span>
            <strong>AI Foundations Midterm</strong>
          </div>
          <ul className="check-list">
            <li className="done">Identity verified</li>
            <li className="done">Device check passed</li>
            <li className="done">Question set synced</li>
            <li>Exam window opens at 10:00 AM</li>
          </ul>
          <button className="secondary-btn" onClick={() => setModalOpen(true)}>Start Mock Exam</button>
        </div>
      </section>

      <section className="content-grid">
        <ExamPanel filter={filter} setFilter={setFilter} exams={filteredExams} title="My Upcoming Exams" />
        <TimelinePanel />
        <ResultPanel />
        <CollegeInfoPanel />
      </section>

      {modalOpen && <ExamModal onClose={() => setModalOpen(false)} />}
    </PortalLayout>
  );
}

function FacultyDashboard({ user, onLogout }) {
  return (
    <PortalLayout user={user} onLogout={onLogout}>
      <section className="hero-panel" id="dashboard">
        <div className="hero-copy">
          <span className="status-pill">Faculty Workspace</span>
          <h2>Manage assessments, question banks, and cohort performance.</h2>
          <p>{user.department} faculty dashboard for project-first evaluation and exam operations.</p>
          <div className="metric-row" aria-label="Faculty metrics">
            <div><strong>12</strong><span>Active exams</span></div>
            <div><strong>128</strong><span>Students mapped</span></div>
            <div><strong>40+</strong><span>Rubrics ready</span></div>
          </div>
        </div>
        <div className="readiness-panel" aria-label="Faculty actions">
          <div className="readiness-header">
            <span>Needs Review</span>
            <strong>Data Wrangling Lab submissions</strong>
          </div>
          <ul className="check-list">
            <li className="done">Question set approved</li>
            <li className="done">Invigilators assigned</li>
            <li>14 submissions pending review</li>
            <li>Results draft closes Jun 30, 2026</li>
          </ul>
          <button className="secondary-btn">Publish Result Draft</button>
        </div>
      </section>

      <section className="content-grid">
        <ExamControlPanel />
        <QuestionBankPanel />
        <StudentsPanel />
        <CollegeInfoPanel />
      </section>
    </PortalLayout>
  );
}

function PortalLayout({ user, onLogout, children }) {
  return (
    <div className="app-shell">
      <Sidebar user={user} />
      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">LeapStart School of Technology</p>
            <h1>{user.role === "student" ? "Student Examination Portal" : "Faculty Examination Portal"}</h1>
          </div>
          <div className="topbar-actions">
            <div className="session-chip">
              <span>{user.name}</span>
              <strong>{user.role}</strong>
            </div>
            <button className="secondary-btn" onClick={onLogout}>Logout</button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function ExamPanel({ filter, setFilter, exams: examItems, title }) {
  return (
    <section className="panel wide" id="my-exams">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Exam Desk</p>
          <h2>{title}</h2>
        </div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter exams">
          <option value="all">All courses</option>
          <option value="ai">AI and ML</option>
          <option value="python">Python and SQL</option>
          <option value="cyber">Cybersecurity</option>
        </select>
      </div>
      <div className="exam-list">
        {examItems.map((exam) => (
          <article className="exam-card" key={exam.id}>
            <div>
              <span className="course-tag">{exam.tag}</span>
              <h3>{exam.title}</h3>
              <p>{exam.detail}</p>
            </div>
            <div className="exam-meta">
              <span>{exam.date}</span>
              <strong>{exam.time}</strong>
              <span className="status approved">{exam.status}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function TimelinePanel() {
  return (
    <section className="panel" id="schedule">
      <p className="eyebrow">Schedule</p>
      <h2>Assessment Timeline</h2>
      <div className="timeline">
        <div><span>Year 01</span><strong>Engineering, Mathematics, Python, SQL</strong></div>
        <div><span>Year 02</span><strong>AI, Machine Learning, Cybersecurity</strong></div>
        <div><span>Year 03</span><strong>Real-time projects and leadership</strong></div>
        <div><span>Year 04</span><strong>Capstone, internship, placement readiness</strong></div>
      </div>
    </section>
  );
}

function ResultPanel() {
  return (
    <section className="panel" id="results">
      <p className="eyebrow">Performance</p>
      <h2>Latest Result</h2>
      <div className="score-ring" aria-label="Latest score 88 percent"><span>88%</span></div>
      <p className="muted">Machine Learning Lab 1 scored above cohort average. Faculty feedback is ready.</p>
    </section>
  );
}

function ExamControlPanel() {
  return (
    <section className="panel wide" id="exam-control">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Exam Control</p>
          <h2>Assessment Operations</h2>
        </div>
        <button className="secondary-btn">Create Exam</button>
      </div>
      <div className="exam-list">
        {exams.map((exam) => (
          <article className="exam-card" key={exam.id}>
            <div>
              <span className="course-tag">{exam.tag}</span>
              <h3>{exam.title}</h3>
              <p>{exam.detail}</p>
            </div>
            <div className="exam-meta">
              <span>{exam.date}</span>
              <strong>{exam.status}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function QuestionBankPanel() {
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

function StudentsPanel() {
  return (
    <section className="panel" id="students">
      <p className="eyebrow">Students</p>
      <h2>Cohort Snapshot</h2>
      <div className="mini-list">
        {students.map((student) => (
          <div className="mini-item" key={student.roll}>
            <strong>{student.name}</strong>
            <span>{student.roll} · {student.status} · {student.score}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CollegeInfoPanel() {
  return (
    <section className="panel" id="college-info">
      <p className="eyebrow">College Info</p>
      <h2>About LeapStart</h2>
      <p>
        LeapStart helps students become industry-ready through experiential learning, mentorship, and
        project-first AI and Data Science education.
      </p>
      <dl className="info-list">
        <div><dt>Organization</dt><dd>LeapStart Ed Tech Private Limited</dd></div>
        <div><dt>Contact</dt><dd>info@leapstart.in</dd></div>
        <div><dt>Address</dt><dd>6th Floor, Sanpra's Corporate Capital, Rd No.2, Hyderabad, India</dd></div>
      </dl>
    </section>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => <td key={cellIndex}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExamModal({ onClose }) {
  return (
    <div className="dialog-backdrop" role="presentation">
      <section className="exam-modal" role="dialog" aria-modal="true" aria-labelledby="mock-exam-title">
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

export default function App() {
  const [user, setUser] = useState(getInitialUser);

  function handleLogout() {
    localStorage.removeItem("leapstart-user");
    setUser(null);
  }

  if (!user) {
    return <LoginPage onLogin={setUser} />;
  }

  if (user.role === "faculty") {
    return <FacultyDashboard user={user} onLogout={handleLogout} />;
  }

  return <StudentDashboard user={user} onLogout={handleLogout} />;
}
