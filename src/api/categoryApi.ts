import api from "./axios";
import type { Category } from "../types";

export const getCategories = () =>
  api.get<Category[]>("/categories");

export const createCategory = (data: {
  name: string;
  description?: string;
}) => api.post<Category>("/categories", data);

export const updateCategory = (
  id: number,
  data: {
    name: string;
    description?: string;
  }
) => api.put<Category>(`/categories/${id}`, data);

export const deleteCategory = (id: number) =>
  api.delete(`/categories/${id}`);
