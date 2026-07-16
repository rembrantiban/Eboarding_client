import { create } from "zustand";
import axiosInstance from "@/api/api";
import { useStatusStore } from "./useStatusStore";


export interface Billing {
    id: number;

    billing_no: string;

    billing_type: string;
    billing_month: string | null;
    due_date: string;

    room_fee: number;
    utilities_fee: number;
    other_charges: number;

    discount: number;
    late_fee: number;

    total_amount: number;
    paid_amount: number;
    balance: number;

    status:
        | "Pending"
        | "Partial"
        | "Paid"
        | "Overdue"
        | "Cancelled";

    created_at: string;
    updated_at: string;

    user_id: number;
    user_id_no: string;

    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    avatar_url: string | null;

    assignment_id: number | null;
    assigned_date: string | null;
    expected_checkout: string | null;

    room_id: number | null;
    room_number: string | null;

    bed_id: number | null;
    bed_number: string | null;
}

interface BillingStore {

    loading: boolean;

    billings: Billing[];

    getAllBillings: () => Promise<void>;

}

export const useBillingStore = create<BillingStore>((set) => ({

    loading: false,
    billings: [],

    getAllBillings: async () => {
        const { showError } = useStatusStore.getState();
        try {

            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                "/billings/get-all"
            );

            set({
                billings: res.data,
            });

        } catch (error) {

            console.error(error);
            showError("Failed to fetch billings.");

        } finally {

            set({
                loading: false,
            });

        }

    },

}));