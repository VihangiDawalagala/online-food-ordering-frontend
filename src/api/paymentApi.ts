import api from "./axios";
import type { Payment, PaymentRequest } from "../types";

export const makePayment = (data: PaymentRequest) =>
  api.post<Payment>("/payments", data);
