import { FacultyDashboard } from "./components/FacultyDashboard";
import { LoginPage } from "./components/LoginPage";
import { StudentDashboard } from "./components/StudentDashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { useAuth } from "./hooks/useAuth";

export default function App() {
  const { isAuthenticated, isLoading, login, logout, user } = useAuth();

  if (isLoading) {
    return <main className="app-loading">Checking secure session...</main>;
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  if (user.role === "faculty") {
    return <FacultyDashboard user={user} onLogout={logout} />;
  }

  if (user.role === "admin") {
    return <AdminDashboard user={user} onLogout={logout} />;
  }

  return <StudentDashboard user={user} onLogout={logout} />;
}
