import api from "./axios";
import type { Cart } from "../types";

export const getCart = (userId: number) =>
  api.get<Cart>(`/cart/${userId}`);

export const addToCart = (
  userId: number,
  foodId: number,
  quantity: number
) =>
  api.post<Cart>("/cart/add", {
    userId,
    foodId,
    quantity,
  });