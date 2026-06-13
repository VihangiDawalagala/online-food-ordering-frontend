import api from "./axios";
import type {
  FoodItem,
  CreateFoodRequest
} from "../types";

export const getAllFoods = () => {
  return api.get<FoodItem[]>("/foods");
};

export const getFoodById = (id: number) => {
  return api.get<FoodItem>(`/foods/${id}`);
};

export const createFood = (
  food: CreateFoodRequest
) => {
  return api.post("/foods", food);
};

export const updateFood = (
  id: number,
  food: CreateFoodRequest
) => {
  return api.put(`/foods/${id}`, food);
};

export const deleteFood = (id: number) => {
  return api.delete(`/foods/${id}`);
};
