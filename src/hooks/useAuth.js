import { useEffect, useState } from "react";
import { readJsonResponse } from "../utils/api";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(readJsonResponse)
      .then((data) => setUser(data.ok ? data.user : null))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  async function login({ role, email, password }) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, email, password }),
    });
    const data = await readJsonResponse(response);

    if (!data.ok) {
      throw new Error(data.message || "Login failed.");
    }

    setUser(data.user);
    return data.user;
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
    setUser(null);
  }

  return {
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
    user,
  };
}
