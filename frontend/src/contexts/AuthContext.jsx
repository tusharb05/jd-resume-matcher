import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { storage } from "../utils/storage.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const t = storage.getToken();
    const u = storage.getUser();
    if (t && u) {
      setToken(t);
      setUser(u);
    }
  }, []);

  const isAuthed = !!token && !!user;

  const login = ({ token: newToken, user: newUser }) => {
    storage.setToken(newToken);
    storage.setUser(newUser);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    storage.clearAll();
    setToken("");
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthed, login, logout }),
    [token, user, isAuthed]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
