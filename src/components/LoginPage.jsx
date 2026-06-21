import { useState } from "react";
import { users } from "../data/mockData";

export function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("student@leapstart.in");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchRole(nextRole) {
    const demoUser = users.find((user) => user.role === nextRole);
    setRole(nextRole);
    setEmail(demoUser.email);
    setPassword(demoUser.password);
    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      onLogin({ role, email, password });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
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
          <button className={role === "admin" ? "active" : ""} onClick={() => switchRole("admin")} type="button">
            Admin
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
          <button className="primary-btn" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Checking..." : "Login to Portal"}
          </button>
        </form>

        <div className="demo-credentials">
          <strong>Mock credentials</strong>
          <span>Student: student@leapstart.in / student123</span>
          <span>Faculty: faculty@leapstart.in / faculty123</span>
          <span>Admin: admin@leapstart.in / admin123</span>
        </div>
      </section>
    </main>
  );
}
