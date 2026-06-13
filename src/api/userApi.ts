import api from "./axios";
import type { User } from "../types";

export const getUsers = () => api.get<User[]>("/users");
