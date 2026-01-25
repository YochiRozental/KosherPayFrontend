import api from "./httpApi";
import type { ApiResponse, ListResponse, RequestItem } from "../types";

export const getBalance = async (): Promise<ApiResponse<any>> => {
  const res = await api.get("/api/web/balance");
  return res.data;
};

export const getHistory = async (limit = 20, offset = 0): Promise<ApiResponse<any>> => {
  const res = await api.get("/api/web/history", {
    params: { limit, offset },
  });
  return res.data;
};

export const depositFunds = async (amount: number): Promise<ApiResponse<any>> => {
  const res = await api.post("/api/web/deposit", { amount });
  return res.data;
};

export const withdrawFunds = async (amount: number): Promise<ApiResponse<any>> => {
  const res = await api.post("/api/web/withdraw", { amount });
  return res.data;
};

export const transferFunds = async (recipientPhone: string, amount: number): Promise<ApiResponse<any>> => {
  const res = await api.post("/api/web/transfer", {
    recipient_phone: recipientPhone,
    amount,
  });
  return res.data;
};

export const requestPayment = async (recipientPhone: string, amount: number): Promise<ApiResponse<any>> => {
  const res = await api.post("/api/web/request_payment", {
    recipient_phone: recipientPhone,
    amount,
  });
  return res.data;
};

export const respondToPaymentRequest = async (requestId: string | number, accept: boolean): Promise<ApiResponse<any>> => {
  const url = accept
    ? `/api/web/payment_requests/${requestId}/approve`
    : `/api/web/payment_requests/${requestId}/reject`;

  const res = await api.post(url);
  return res.data;
};

export const getIncomingPaymentRequests = async (): Promise<ListResponse<RequestItem>> => {
  const res = await api.get("/api/web/payment_requests");
  return res.data;
};

export const getSentPaymentRequests = async (): Promise<ListResponse<RequestItem>> => {
  const res = await api.get("/api/web/payment_requests_sent");
  return res.data;
};
