import { useState } from "react";
import { users } from "../data/mockData";
import { clearSession, getInitialUser, saveSession, withoutPassword } from "../utils/session";

export function useAuth() {
  const [user, setUser] = useState(getInitialUser);

  function login({ role, email, password }) {
    const match = users.find(
      (candidate) => candidate.role === role && candidate.email === email.trim() && candidate.password === password
    );

    if (!match) {
      throw new Error("Invalid mock credentials for the selected role.");
    }

    const sessionUser = withoutPassword(match);
    saveSession(match);
    setUser(sessionUser);
    return sessionUser;
  }

  function logout() {
    clearSession();
    setUser(null);
  }

  return {
    isAuthenticated: Boolean(user),
    login,
    logout,
    user,
  };
}
