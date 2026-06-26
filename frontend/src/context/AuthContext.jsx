import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

function getStoredUser() {
  const storedUser = localStorage.getItem("quickhireUser");
  return storedUser ? JSON.parse(storedUser) : null;
}

function normalizeUser(userData) {
  if (!userData) return null;

  return {
    ...userData,
    profile: {
      ...(userData.profile || {}),
    },
    _photoCacheBust: userData._photoCacheBust || Date.now(),
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => normalizeUser(getStoredUser()));
  const isAuthenticated = !!user;

  const updateUser = (userData) => {
    const nextUser = normalizeUser({
      ...userData,
      profile: { ...(userData?.profile || {}) },
      _photoCacheBust: Date.now(),
    });

    console.log("[AuthContext] updateUser called");
    console.log("[AuthContext] incoming profile.photo:", userData?.profile?.photo);
    console.log("[AuthContext] nextUser profile.photo:", nextUser?.profile?.photo);

    setUser(nextUser);
    localStorage.setItem("quickhireUser", JSON.stringify(nextUser));

    console.log(
      "[AuthContext] localStorage after update:",
      JSON.parse(localStorage.getItem("quickhireUser"))?.profile?.photo
    );

    return nextUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("quickhireUser");
  };

  useEffect(() => {
    console.log("[AuthContext] user state:", user);
    console.log("[AuthContext] user.profile.photo:", user?.profile?.photo);
    console.log(
      "[AuthContext] localStorage user:",
      JSON.parse(localStorage.getItem("quickhireUser") || "null")
    );
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, updateUser, isAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
