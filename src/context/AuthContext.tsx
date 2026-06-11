import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import type { ReactNode } from "react";

import type { AuthResponse } from "../types";

interface AuthContextType {
  user: AuthResponse | null;
  token: string | null;

  login: (data: AuthResponse) => void;
  logout: () => void;

  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] =
    useState<AuthResponse | null>(null);

  const [token, setToken] =
    useState<string | null>(null);

  useEffect(() => {
    const savedToken =
      localStorage.getItem("token");

    const savedUser =
      localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (data: AuthResponse) => {
    localStorage.setItem("token", data.token);

    localStorage.setItem(
      "user",
      JSON.stringify(data)
    );

    setToken(data.token);
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => !!token;

  const isAdmin = () =>
    user?.role === "ADMIN";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};