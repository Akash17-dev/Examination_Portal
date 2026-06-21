import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { FloatingAgentChat } from "../FloatingAgentChat";
import { NotificationBell } from "../NotificationBell";
import { toSectionId } from "../../utils/toSectionId";

const navItemsByRole = {
  admin: ["Dashboard", "Users", "Cohorts", "Audit Log", "Search"],
  faculty: ["Dashboard", "Exam Control", "Question Bank", "Leaderboard", "Profile", "Search"],
  student: ["Dashboard", "Exams", "History", "Profile", "Schedule", "Leaderboard"],
};

export function PortalLayout({ user, onLogout, children }) {
  const { theme, toggleTheme } = useTheme();
  const [themeWipe, setThemeWipe] = useState(null);
  const wipeTimer = useRef(null);
  const toggleTimer = useRef(null);
  const navItems = navItemsByRole[user.role] || navItemsByRole.student;
  const roleTitle = `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} Portal`;
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const nextTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    return () => {
      window.clearTimeout(wipeTimer.current);
      window.clearTimeout(toggleTimer.current);
    };
  }, []);

  function handleThemeToggle(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    window.clearTimeout(wipeTimer.current);
    window.clearTimeout(toggleTimer.current);
    document.documentElement.style.setProperty("--theme-wipe-x", `${x}px`);
    document.documentElement.style.setProperty("--theme-wipe-y", `${y}px`);
    setThemeWipe(nextTheme);

    toggleTimer.current = window.setTimeout(() => {
      toggleTheme();
    }, 360);

    wipeTimer.current = window.setTimeout(() => {
      setThemeWipe(null);
    }, 860);
  }

  return (
    <div className="app-shell horizontal-shell">
      <header className="site-navbar">
        <div className="nav-main">
          <a className="brand nav-brand" href="#dashboard" aria-label="LeapStart School of Technology home">
            <img src="/assets/leapstart-logo-white.webp" alt="LeapStart logo" />
          </a>
          <nav className="top-nav-list" aria-label={`${user.role} navigation`}>
            {navItems.map((item, index) => (
              <a className={`top-nav-item ${index === 0 ? "active" : ""}`} href={`#${toSectionId(item)}`} key={item}>
                {item}
              </a>
            ))}
          </nav>
          <div className="topbar-actions">
            <NotificationBell />
            <button
              className="theme-toggle"
              onClick={handleThemeToggle}
              aria-label={`Switch to ${nextTheme} mode`}
              title={`Switch to ${nextTheme} mode`}
            >
              {theme === "dark" ? (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-icon">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              ) : (
                <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-icon">
                  <path d="M21 12.79A8.8 8.8 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
                </svg>
              )}
            </button>
            <button className="nav-action-btn logout-btn" onClick={onLogout}>Logout</button>
          </div>
        </div>
      </header>
      <main className="workspace horizontal-workspace">
        <div className="page-title">
          <div>
            <p className="eyebrow">LeapStart School of Technology</p>
            <h1>{user.role === "student" ? "Student Examination Portal" : user.role === "faculty" ? "Faculty Examination Portal" : "Admin Examination Portal"}</h1>
          </div>
          <div className="page-user-card" aria-label="Signed in user">
            <span className="user-avatar">{initials}</span>
            <div>
              <strong>{user.name}</strong>
              <small>{roleTitle}</small>
            </div>
          </div>
        </div>
        {children}
        <FloatingAgentChat role={user.role} />
      </main>
      {themeWipe && <div className={`theme-wipe theme-wipe-${themeWipe}`} aria-hidden="true" />}
    </div>
  );
}
