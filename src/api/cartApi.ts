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

export const updateCartItem = (
  cartItemId: number,
  quantity: number
) =>
  api.put<Cart>(`/cart/update/${cartItemId}`, {
    quantity,
  });

export const removeCartItem = (cartItemId: number) =>
  api.delete(`/cart/remove/${cartItemId}`);
