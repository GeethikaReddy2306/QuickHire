import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function getStoredUser() {
  const storedUser = localStorage.getItem("quickhireUser");
  return storedUser ? JSON.parse(storedUser) : null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const isAuthenticated = !!user;

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quickhireUser");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
