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
    "Upcoming"
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
    notes: string | null;
    reason: string | null;
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

export interface OutstandingBalance {
    outstanding_balance: number;
    pending_count: number;
}

export interface PaymentsOverview {
    date: string;
    value: number;
}

export interface MyPaymentSummary {
    totalPaid: number;
    outstanding: number;
    count: number;
}

export interface CalendarEvent {
    id: number;
    date: string;
    label: string;
    type: "payment";
    amount: number;
    boarder: string;
    room: string;
    status:
    | "Pending"
    | "Upcoming"
    | "Overdue"
    | "Paid";
    color: string;
}

export interface ActivePenalty {
    id: number;
    boarder: string;
    initials: string;
    reason: string;
    amount: number;
    date: string;
    room_number: string;
    bed_number: string;
}

interface CancelBillingData {
    billingId: number;
    reason: string;
    notes?: string;
}

//Financial Report Types 

export interface BillingStats {
    totalIncome: number;
    totalIncomeChange: number;

    lateFeesCollected: number;
    lateFeesChange: number;

    amountCollectedThisMonth: number;
    amountCollectedChange: number;

    collectionRate: number;
    collectionRateChange: number;
}

export interface IncomeMix {
    name: string;
    value: number;
    color: string;
}

export interface RevenueTrend {
    month: string;
    income: number;
    lateFees: number;
}




export interface DetailedSummaryItem {
    category: string;
    thisMonth: number;
    lastMonth: number;
    change: number;
    positive: boolean;
}

export interface DetailedSummary {
    totalIncomeThisMonth: number;
    totalIncomeLastMonth: number;
    totalIncomeChange: number;
    rows: DetailedSummaryItem[];
}


// Payment Collection Report  types 
export interface CollectionDashboardStats {
    totalCollections: number;
    totalCollectionsChange: number;

    totalTransactions: number;
    totalTransactionsChange: number;

    paidBoarders: number;
    paidBoardersChange: number;

    collectionRate: number;

    averageCollection: number;
}


export interface CollectionTrend {
    month: string;
    amount: number;
}

export interface RecentTransaction {
    date: string;
    billing: string;
    boarder: string;
    amount: number;
    ref: string;
    status: "Paid" | "Partial";
}

export interface BoarderBillingStatus {
    name: string;
    room: string | null;
    billing: string;
    due: string;
    total: number;
    paid: number;
    balance: number;
    status:
    | "Partial"
    | "Paid"
    | "Overdue"
    paidDate: string;
}


export interface CollectionSummary {
    totalCollections: number;
    totalTransactions: number;
    paidBoarders: number;
    collectionRate: number;
}


interface BillingStore {

    loading: boolean;
    billings: Billing[];
    paymentHistory: PaymentHistory[];
    outstandingBalance: OutstandingBalance | null;
    myPendingBilling: Billing[];

    myPaymentSummary: MyPaymentSummary | null;
    myPaymentHistory: PaymentHistory[];

    paymentsOverview: PaymentsOverview[];
    calendarEvents: CalendarEvent[];

    activePenalties: ActivePenalty[];

    billingStats: BillingStats | null;
    incomeMix: IncomeMix[];
    revenueTrend: RevenueTrend[];
    detailedSummary: DetailedSummary | null;

    collectionDashboardStats: CollectionDashboardStats | null;
    collectionTrend: CollectionTrend[];
    recentTransactions: RecentTransaction[];
    boarderBillingStatus: BoarderBillingStatus[];
    collectionSummary: CollectionSummary | null;


    getAllBillings: () => Promise<void>;
    recordPayment: (data: RecordPaymentData) => Promise<boolean>;
    applyDiscount: (data: ApplyDiscountData) => Promise<boolean>;
    applyLateFee: (data: ApplyLateFeeData) => Promise<boolean>;
    getPaymentHistory: () => Promise<boolean>;
    getOutstandingBalance: () => Promise<boolean>;

    getMyPendingBilling: () => Promise<boolean>;
    getMyPaymentHistory: () => Promise<boolean>;

    getPaymentsOverview: () => Promise<boolean>;
    getCalendarEvents: () => Promise<boolean>;
    getActivePenalties: () => Promise<void>;

    cancelBilling: (data: CancelBillingData) => Promise<boolean>;

    //Fincial Report State
    getBillingStats: () => Promise<boolean>;
    getIncomeMix: () => Promise<boolean>;
    getRevenueTrend: () => Promise<boolean>;
    getDetailedSummary: () => Promise<void>;

    //Payment Collection Report 
    getCollectionDashboardStats: () => Promise<boolean>;
    getCollectionTrend: () => Promise<boolean>;
    getRecentTransactions: () => Promise<boolean>;
    getBoarderBillingStatus: () => Promise<boolean>;
    getCollectionSummary: () => Promise<void>;

}

export const useBillingStore = create<BillingStore>((set) => ({

    loading: false,
    billings: [],
    paymentHistory: [],

    outstandingBalance: null,
    myPendingBilling: [],
    myPaymentSummary: null,
    myPaymentHistory: [],
    paymentsOverview: [],
    calendarEvents: [],


    activePenalties: [],

    billingStats: null,
    incomeMix: [],
    revenueTrend: [],
    detailedSummary: null,



    collectionDashboardStats: null,
    collectionTrend: [],
    recentTransactions: [],
    boarderBillingStatus: [],
    collectionSummary: null,

    getCollectionSummary: async () => {
    try {

        const { data } = await axiosInstance.get(
            "/billings/collection-summary"
        );

        set({
            collectionSummary: data,
        });

    } catch (error) {

        console.error(
            "Get Collection Summary Error:",
            error
        );
    }
},

    getBoarderBillingStatus: async () => {
        try {

            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                "/billings/boarder-billing-status"
            );

            set({
                boarderBillingStatus: res.data,
                loading: false,
            });

            return true;

        } catch (error) {

            console.error(
                "Get Boarder Billing Status Error:",
                error
            );

            set({
                loading: false,
            });

            return false;
        }
    },

    getRecentTransactions: async () => {
        try {

            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                "/billings/recent-transactions"
            );

            set({
                recentTransactions: res.data,
                loading: false,
            });

            return true;

        } catch (error) {

            console.error(
                "Get Recent Transactions Error:",
                error
            );

            set({
                loading: false,
            });

            return false;
        }
    },

    getCollectionTrend: async () => {
        try {
            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                "/billings/collection-trend"
            );

            set({
                collectionTrend: res.data,
                loading: false,
            });

            return true;

        } catch (error) {

            console.error(
                "Get Collection Trend Error:",
                error
            );

            set({
                loading: false,
            });

            return false;
        }
    },

    getCollectionDashboardStats: async () => {
        try {

            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                "/billings/collection-dashboard-stats"
            );

            set({
                collectionDashboardStats: {
                    totalCollections: Number(
                        res.data.totalCollections
                    ),

                    totalCollectionsChange: Number(
                        res.data.totalCollectionsChange
                    ),

                    totalTransactions: Number(
                        res.data.totalTransactions
                    ),

                    totalTransactionsChange: Number(
                        res.data.totalTransactionsChange
                    ),

                    paidBoarders: Number(
                        res.data.paidBoarders
                    ),

                    paidBoardersChange: Number(
                        res.data.paidBoardersChange
                    ),

                    collectionRate: Number(
                        res.data.collectionRate
                    ),

                    averageCollection: Number(
                        res.data.averageCollection
                    ),
                },

                loading: false,

            });

            console.log(res.data);

            return true;

        } catch (error) {

            console.error(
                "Get Collection Dashboard Stats Error:",
                error
            );

            set({
                loading: false,
            });

            return false;
        }
    },

    getDetailedSummary: async () => {
        try {
            const response =
                await axiosInstance.get(
                    "/billings/detailed-summary"
                );

            set({
                detailedSummary:
                    response.data,
            });
        } catch (error) {
            console.error(
                "Get Detailed Summary Error:",
                error
            );
        }
    },
    getRevenueTrend: async () => {
        try {

            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                "/billings/revenue-trend"
            );

            set({
                revenueTrend: res.data,
                loading: false,
            });

            return true;

        } catch (error) {

            console.error(
                "Get Revenue Trend Error:",
                error
            );

            set({
                loading: false,
            });

            return false;
        }
    },

    getIncomeMix: async () => {
        try {

            const res = await axiosInstance.get(
                "/billings/income-mix"
            );

            set({
                incomeMix: res.data,
            });

            console.log(res.data);

            return true;

        } catch (error) {

            console.error(
                "Get Income Mix Error:",
                error
            );

            return false;
        }
    },

    getBillingStats: async () => {
        try {
            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                "/billings/stats"
            );

            set({
                billingStats: {
                    totalIncome: Number(res.data.totalIncome),
                    totalIncomeChange: Number(
                        res.data.totalIncomeChange
                    ),

                    lateFeesCollected: Number(
                        res.data.lateFeesCollected
                    ),
                    lateFeesChange: Number(
                        res.data.lateFeesChange ?? 0
                    ),

                    amountCollectedThisMonth: Number(
                        res.data.amountCollectedThisMonth
                    ),
                    amountCollectedChange: Number(
                        res.data.amountCollectedChange ?? 0
                    ),

                    collectionRate: Number(
                        res.data.collectionRate
                    ),
                    collectionRateChange: Number(
                        res.data.collectionRateChange ?? 0
                    ),
                },

                loading: false,
            });
            return true;


        } catch (error) {

            console.error(
                "Get Billing Stats Error:",
                error
            );

            set({
                loading: false,
            });

            return false;
        }
    },

    cancelBilling: async (data) => {

        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Cancelling Billing",
                "Please wait while the billing is being cancelled..."
            );

            await axiosInstance.put(
                `/billings/cancel-billing/${data.billingId}`,
                {
                    reason: data.reason,
                    notes: data.notes,
                }
            );

            await Promise.all([
                useBillingStore
                    .getState()
                    .getAllBillings(),

                useBillingStore
                    .getState()
                    .getPaymentHistory(),
            ]);

            showSuccess(
                "Billing Cancelled",
                "Billing has been cancelled successfully."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Cancel Billing Failed",
                    error.response?.data?.message ??
                    "Unable to cancel billing."
                );

            } else {

                showError(
                    "Cancel Billing Failed",
                    "Unable to cancel billing."
                );

            }

            return false;
        }
    },


    getActivePenalties: async () => {
        try {
            const res = await axiosInstance.get(
                "/billings/all-active-penalties"
            );

            set({
                activePenalties: res.data,
            });

        } catch (error) {
            console.error(error);
        }
    },
    getCalendarEvents: async (): Promise<boolean> => {
        try {
            const res = await axiosInstance.get("/billings/calendar-events");

            set({
                calendarEvents: res.data,
            });
            return true;

        } catch (error) {
            console.error(error);

            return false;
        }
    },

    getPaymentsOverview: async () => {
        try {

            set({ loading: true });
            const res = await axiosInstance.get(
                "/billings/payments-overview"
            );

            set({
                paymentsOverview: res.data,
                loading: false
            });

            return true;

        } catch (error) {

            console.error(error);
            set({ loading: false });
            return false;

        }
    },

    getMyPaymentHistory: async () => {
        try {
            set({ loading: true });

            const res = await axiosInstance.get(
                "/billings/my-payment-history"
            );

            console.log(res.data);

            set({
                myPaymentHistory: res.data.payments,
                myPaymentSummary: {
                    totalPaid: res.data.payments.reduce(
                        (sum: number, payment: PaymentHistory) =>
                            sum + Number(payment.amount),
                        0
                    ),
                    outstanding: res.data.payments.reduce(
                        (sum: number, payment: PaymentHistory) =>
                            sum + Number(payment.balance),
                        0
                    ),
                    count: res.data.total,
                },
            });

            return true;

        } catch (error) {

            console.error(
                "Get My Payment History:",
                error
            );

            return false;

        } finally {

            set({
                loading: false,
            });

        }
    },
    getMyPendingBilling: async () => {
        try {

            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                "/billings/my-billing"
            );

            set({
                myPendingBilling: Array.isArray(res.data.billing)
                    ? res.data.billing
                    : [],
            });

            return true;

        } catch (error) {

            console.error(
                "Get My Pending Billing:",
                error
            );

            return false;

        } finally {

            set({
                loading: false,
            });

        }
    },

    getOutstandingBalance: async () => {
        try {

            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                "/billings/outstanding-balance"
            );

            set({
                outstandingBalance: {
                    outstanding_balance: Number(
                        res.data.outstanding_balance
                    ),
                    pending_count: Number(
                        res.data.pending_count
                    ),
                },
            });

            return true;

        } catch (error) {

            console.error(
                "Get Outstanding Balance Error:",
                error
            );

            return false;

        } finally {

            set({
                loading: false,
            });

        }
    },
    getPaymentHistory: async () => {

        const {
            showError,
        } = useStatusStore.getState();

        try {
            set({ loading: true });
            const res = await axiosInstance.get(
                "/billings/payment-history"
            );

            set({
                loading: false,
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