export type PaymentRequestStatus = "pending" | "approved" | "rejected";

export interface RequestItem {
    id: string;
    status: PaymentRequestStatus;
    created_at: string;
    name: string;
    phone: string;
    amount: string;
}
