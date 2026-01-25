import { createAsyncThunk } from "@reduxjs/toolkit";
import * as paymentsApi from "../../api/paymentsApi";
import type { UserMe } from "../../types";

export const fetchTransactions = createAsyncThunk(
    "transactions/fetchTransactions",
    async ({ limit = 20, offset = 0 }: { limit?: number; offset?: number }, { rejectWithValue }) => {
        try {
            const res = await paymentsApi.getHistory(limit, offset);

            if (!res.success) {
                return rejectWithValue(res.message || "שגיאה בטעינת היסטוריה");
            }

            return Array.isArray(res.history) ? res.history : [];
        } catch (e: any) {
            return rejectWithValue(e?.message || "שגיאה בטעינת היסטוריה");
        }
    }
);

export const createTransaction = createAsyncThunk(
    "transactions/createTransaction",
    async (
        { amount, type, toPhone }: { user: UserMe; amount: number; type: string; toPhone?: string },
        { rejectWithValue }
    ) => {
        let res;

        if (type === "deposit") {
            res = await paymentsApi.depositFunds(amount);
        } else if (type === "withdraw") {
            res = await paymentsApi.withdrawFunds(amount);
        } else if (type === "transfer" && toPhone) {
            res = await paymentsApi.transferFunds(toPhone, amount);
        } else {
            return rejectWithValue("סוג טרנזקציה לא חוקי");
        }

        if (!res.success) return rejectWithValue(res.message);
        return res.data || {};

    }
);
