import api from "./httpApi";
import type { UsersListResponse } from "../types";

export const getAllUsers = async (): Promise<UsersListResponse> => {
  try {
    const { data } = await api.get<UsersListResponse>("/api/admin/users");
    return data;
  } catch (error: any) {
    const server = error?.response?.data;
    if (server) return server;

    return { success: false, message: "שגיאת תקשורת עם השרת." };
  }
};
