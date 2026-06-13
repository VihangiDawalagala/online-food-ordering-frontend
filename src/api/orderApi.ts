import api from "./axios";

export const placeOrder = (userId: number) => {
  return api.post("/orders/place", {
    userId,
  });
};

export const getOrders = (userId: number) => {
  return api.get(`/orders/${userId}`);
};