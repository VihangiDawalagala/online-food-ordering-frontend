import { useState } from "react";
import type { ReactNode } from "react";

import type { AuthResponse } from "../types";
import { AuthContext } from "./authContextCore";

const normalizeRoleValue = (value: unknown) => {
  if (typeof value !== "string") {
    return "";
  }

  return value.toUpperCase();
};

const getRoleFromToken = (token?: string) => {
  if (!token) {
    return "";
  }

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roleValue =
      payload.role ??
      payload.roles ??
      payload.authority ??
      payload.authorities;

    if (Array.isArray(roleValue)) {
      return roleValue.map(normalizeRoleValue).join(",");
    }

    return normalizeRoleValue(roleValue);
  } catch {
    return "";
  }
};

const normalizeUser = (data: AuthResponse) => {
  const role =
    normalizeRoleValue(data.role) ||
    getRoleFromToken(data.token);

  return {
    ...data,
    role,
  };
};

const getSavedUser = () => {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return normalizeUser(JSON.parse(savedUser) as AuthResponse);
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
    const normalizedUser = normalizeUser(data);

    localStorage.setItem("token", normalizedUser.token);

    localStorage.setItem(
      "user",
      JSON.stringify(normalizedUser)
    );

    setToken(normalizedUser.token);
    setUser(normalizedUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => !!token;

  const isAdmin = () =>
    normalizeRoleValue(user?.role).includes("ADMIN");

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
