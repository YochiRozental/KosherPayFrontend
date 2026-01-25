import type { ApiResponse } from "./api";
import type { Role } from "./auth";

export type AdminUser = {
    id: string;
    name: string;
    role: Role | string;
    status?: string;
    phone_number?: string | null;
    balance?: string | number | null;
    currency?: string | null;
};

export type UsersListResponse = ApiResponse<{
    users: AdminUser[];
}>;
