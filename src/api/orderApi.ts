import api from "./axios";

export const placeOrder = (userId: number) => {
  return api.post("/orders/place", {
    userId,
  });
};

export const getOrders = (userId: number) => {
  return api.get(`/orders/${userId}`);
};

export const getAllOrders = () => {
  return api.get("/orders");
};

export const updateOrderStatus = (
  orderId: number,
  status: string
) => {
  return api.put(`/orders/${orderId}/status`, {
    status,
  });
};
