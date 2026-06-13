import { useState } from "react";
import type { ReactNode } from "react";

import type { AuthResponse } from "../types";
import { AuthContext } from "./authContextCore";

const getSavedUser = () => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser) as AuthResponse;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] =
    useState<AuthResponse | null>(getSavedUser);

  const [token, setToken] =
    useState<string | null>(() =>
      localStorage.getItem("token")
    );

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
