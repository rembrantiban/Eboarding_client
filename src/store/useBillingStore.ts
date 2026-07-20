import { create } from "zustand";
import axiosInstance from "@/api/api";
import { useStatusStore } from "./useStatusStore";
import axios from "axios";


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

interface RecordPaymentData {
    billingId: number;
    amount: number;
}

interface ApplyDiscountData {
    billingId: number;
    discount: number;
}

interface ApplyLateFeeData {
    billingId: number;
    lateFee: number;
}

export interface PaymentHistory {
    id: number;
    billing_id: number;

    billing_no: string;
    billing_month: string | null;
    billing_type: string;
    due_date: string;
    updated_at: string;

    status:
        | "Pending"
        | "Partial"
        | "Paid"
        | "Overdue"
        | "Cancelled";

    amount: number;
    received_at: string;

    room_fee: number;
    utilities_fee: number;
    other_charges: number;
    discount: number;
    late_fee: number;

    total_amount: number;
    paid_amount: number;
    balance: number;

    boarder_id: number;
    boarder_user_id_no: string;
    boarder_first_name: string;
    boarder_last_name: string;
    boarder_email: string;
    boarder_contact_number: string;
    boarder_avatar_url: string | null;

    room_number: string;
    bed_number: string;

    received_by_id: number;
    user_id_no: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
}


interface BillingStore {

    loading: boolean;
    billings: Billing[];
    paymentHistory: PaymentHistory[];

    getAllBillings: () => Promise<void>;
    recordPayment: (data: RecordPaymentData) => Promise<boolean>;
    applyDiscount: (data: ApplyDiscountData) => Promise<boolean>;
    applyLateFee: (data: ApplyLateFeeData) => Promise<boolean>;
    getPaymentHistory: () => Promise<boolean>;

}

export const useBillingStore = create<BillingStore>((set) => ({

    loading: false,
    billings: [],
    paymentHistory: [],

    getPaymentHistory: async () => {

        const {
            showError,
        } = useStatusStore.getState();

        try {
            set({ loading: true });
            const res = await axiosInstance.get(
                "/billings/payment-history"
            );

            set({ loading: false,
                paymentHistory: res.data,
            });

            return true;

        } catch (error) {

            console.error(error);

            if (axios.isAxiosError(error)) {

                showError(
                    "Failed",
                    error.response?.data?.message ??
                    "Unable to load payment history."
                );

            } else {

                showError(
                    "Failed",
                    "Unable to load payment history."
                );

            }

            return false;

        }

    },

    applyLateFee: async (data) => {

        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Applying Late Fee",
                "Please wait while the late payment fee is being applied..."
            );

            await axiosInstance.put(
                `/billings/apply-late-fee/${data.billingId}`,
                {
                    late_fee: data.lateFee,
                }
            );

            await useBillingStore
                .getState()
                .getAllBillings();

            showSuccess(
                "Late Fee Applied",
                "Late payment fee applied successfully."
            );

            return true;

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Apply Late Fee Failed",
                    error.response?.data?.message ??
                    "Unable to apply late payment fee."
                );

            } else {

                showError(
                    "Apply Late Fee Failed",
                    "Unable to apply late payment fee."
                );

            }

            return false;

        }

    },
    applyDiscount: async (data) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Applying Discount",
                "Please wait while the discount is being applied..."
            );

            await axiosInstance.put(
                `/billings/apply-discount/${data.billingId}`,
                {
                    discount: data.discount,
                }
            );

            await useBillingStore
                .getState()
                .getAllBillings();

            showSuccess(
                "Discount Applied",
                "Discount has been applied successfully."
            );

            return true;

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Apply Discount Failed",
                    error.response?.data?.message ??
                    "Unable to apply discount."
                );

            } else {

                showError(
                    "Apply Discount Failed",
                    "Unable to apply discount."
                );

            }

            return false;

        }

    },
    recordPayment: async (data) => {

        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Recording Payment",
                "Please wait while payment is being processed..."
            );

            await axiosInstance.put(
                `/billings/record-payment/${data.billingId}`,
                {
                    amount: data.amount,
                }
            );

            await useBillingStore
                .getState()
                .getAllBillings();

            showSuccess(
                "Payment Recorded",
                "Billing has been updated successfully."
            );

            return true;

        } catch (error: unknown) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Payment Failed",
                    error.response?.data?.message ??
                    "Unable to record payment."
                );

            } else {

                showError(
                    "Payment Failed",
                    "Unable to record payment."
                );

            }

            return false;


        }

    },
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