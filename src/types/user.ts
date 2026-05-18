import type { ApiResponse } from "./api";
import type { Role } from "./auth";

export interface UserFormData extends UserMe {
  secret?: string;
  additionalPhones: string[];
}

export interface UpdateMePayload {
  name?: string;
  phone?: string;
  secret_code?: string;

  bank_number?: string;
  branch_number?: string;
  account_number?: string;
  account_holder?: string;
}

export type UserMe = {
  id: string;
  name: string;
  phone: string;
  role: Role;
  balance?: string;
  additionalPhones?: string[];
  bankAccount: {
    bankNumber: string;
    branchNumber: string;
    accountNumber: string;
    accountHolder: string;
  };
};

export type UserMeApiResponse = ApiResponse<{
  user: UserMe;
}>;
