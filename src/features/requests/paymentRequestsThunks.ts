import { createAsyncThunk } from "@reduxjs/toolkit";
import * as paymentsApi from "../../api/paymentsApi";
import type { UserMe, RequestItem } from "../../types";

const normalizeRequest = (r: any, type: "incoming" | "sent"): RequestItem => ({
    id: r.id,
    status: (r.status as "pending" | "approved" | "rejected") || "pending",
    created_at: r.created_at || r.transaction_date || r.request_date || "",
    name: type === "incoming" ? r.requester_name : r.recipient_name,
    phone: type === "incoming" ? r.requester_phone : r.recipient_phone,
    amount: String(Number(r.amount) || 0),
});

export const fetchIncomingRequests = createAsyncThunk(
    "requests/fetchIncoming",
    async (_: void, { rejectWithValue }) => {
        const res = await paymentsApi.getIncomingPaymentRequests();
        if (!res.success) return rejectWithValue(res.message);
        return (res.requests || []).map((r: any) => normalizeRequest(r, "incoming"));
    }
);

export const fetchSentRequests = createAsyncThunk(
    "requests/fetchSent",
    async (_: void, { rejectWithValue }) => {
        const res = await paymentsApi.getSentPaymentRequests();
        if (!res.success) return rejectWithValue(res.message);
        return (res.requests || []).map((r: any) => normalizeRequest(r, "sent"));
    }
);

export const respondToRequest = createAsyncThunk(
    "requests/respond",
    async (
        { requestId, accept }: { user: UserMe; requestId: string; accept: boolean },
        { rejectWithValue }
    ) => {
        const res = await paymentsApi.respondToPaymentRequest(requestId, accept);
        if (!res.success) return rejectWithValue(res.message);
        return { requestId, status: accept ? "approved" : "rejected" };
    }
);

export const sendPaymentRequest = createAsyncThunk(
    "requests/send",
    async (
        {
            recipientPhone,
            amount,
        }: { user: UserMe; recipientPhone: string; amount: number },
        { rejectWithValue }
    ) => {
        const res = await paymentsApi.requestPayment(recipientPhone, amount);
        if (!res.success) return rejectWithValue(res.message);
        return normalizeRequest(res.request, "sent");
    }
);
