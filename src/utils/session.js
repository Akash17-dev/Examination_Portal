import { users } from "../data/mockData";

const STORAGE_KEY = "leapstart-user";

export function withoutPassword(user) {
  const sessionUser = { ...user };
  delete sessionUser.password;
  return sessionUser;
}

export function getInitialUser() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : null;
    const validUser = users.find((user) => user.id === parsed?.id && user.role === parsed?.role);
    return validUser ? withoutPassword(validUser) : null;
  } catch {
    return null;
  }
}

export function saveSession(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutPassword(user)));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
}
