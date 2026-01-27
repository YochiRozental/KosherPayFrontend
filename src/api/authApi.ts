import api from "./httpApi";

import type { LoginPayload, RegisterPayload, ApiResponse } from "../types";

export const loginUser = async (phone_number: string, secret_code: string): Promise<ApiResponse<any>> => {
  const payload: LoginPayload = { phone_number, secret_code };
  const res = await api.post("/api/web/login", payload);
  return res.data;
};

export const registerUser = async (payload: RegisterPayload): Promise<ApiResponse<any>> => {
  const res = await api.post("/api/web/open_account", payload);
  return res.data;
};
