import { useState } from "react";
export function LoginPage({ onLogin }) {
  const [role, setRole] = useState("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function switchRole(nextRole) {
    setRole(nextRole);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onLogin({ role, email, password });
    } catch (loginError) {
      setError(loginError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <main className="login-page">
      <section className="login-brand-panel">
        <div className="login-orb login-orb-one" />
        <div className="login-orb login-orb-two" />
        <div className="login-brand-content">
          <img src="/assets/leapstart-logo-white.webp" alt="LeapStart logo" />
          <span className="status-pill">Online Examination Conductor</span>
          <h1>Conduct exams with calm, clarity, and control.</h1>
          <p>
            A focused portal for students, faculty, and admins to manage secure assessments,
            quiz attempts, results, and academic workflows.
          </p>
        </div>
      </section>

      <section className="login-card" aria-label="Login form">
        <div className="login-card-head">
          <img className="login-logo" src="/assets/leapstart-logo.webp" alt="LeapStart logo" />
          <div>
            <p className="eyebrow">Secure Access</p>
            <h2>{roleLabel} Login</h2>
          </div>
        </div>

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
            <span>Email address</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
          </label>
          <label>
            <span>Password</span>
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="login-submit" disabled={isSubmitting} type="submit">
            <span>{isSubmitting ? "Checking..." : `Enter ${roleLabel} Portal`}</span>
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
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
