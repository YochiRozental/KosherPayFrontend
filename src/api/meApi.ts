import api from "./httpApi";

import type { UpdateMePayload, UserMeApiResponse, ApiResponse } from "../types";

export const getMe = async (): Promise<UserMeApiResponse> => {
    const res = await api.get<UserMeApiResponse>("/api/web/me");
    return res.data;
};

export const updateMe = async (payload: UpdateMePayload): Promise<ApiResponse<any>> => {
    const res = await api.put("/api/web/me", payload);
    return res.data;
};
