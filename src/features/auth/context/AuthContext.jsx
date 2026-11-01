import { createContext, useContext, useState } from "react";
import { mockLogin } from "../services/authService";

const AuthContext = createContext(null);
const STORAGE_KEY = "gate-dashboard-user";

function readStoredUser() {
  try {
    const item = sessionStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (username, password) => {
    setIsLoading(true);
    try {
      const session = await mockLogin(username, password);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      setUser(session);
      return session;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const hasRole = (requiredRole) => {
    if (!user) return false;
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
