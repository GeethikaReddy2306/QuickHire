import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("quickhireUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

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