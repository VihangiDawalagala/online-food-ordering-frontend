import api from "./axios";
import type { AuthResponse } from "../types";

export const signUp = (data: {
  name: string;
  email: string;
  password: string;
  role: string;
}) =>
  api.post<AuthResponse>("/auth/signup", data);

export const signIn = (data: {
  
  email: string;
  password: string;
}) =>
  api.post<AuthResponse>("/auth/signin", data);