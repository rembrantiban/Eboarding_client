import { create } from "zustand";
import axiosInstance from "@/api/api";
import axios from "axios";
import { toast } from "sonner";

export type Payment = {
  payment_id: number;
  amount: number;
  due_date: string;
  status: "Pending" | "Paid" | "Overdue";
  paid_at: string | null;
  boarder_id: number;
  first_name: string;
  last_name: string;
  email: string;

  contact_number: string;
  assigned_by: string;
  payment_status: string,

  price_per_month: number;

  start_date: string;
  boarder_status: string;

  penalty_amount: number;
  room_number: string;
  bed_number: string;
};

export type CalendarEvent = {
  id: number;
  title: string;
  date: string;
  color: string;

  name: string;
  room: string;
  amount: number;
  status: "Pending" | "Paid" | "Overdue";
};

type CalendarApiResponse = {
  id: number;
  title: string;
  date: string;
  color: string;
  extendedProps: {
    name: string;
    room: string;
    amount: number;
    status: "Pending" | "Paid" | "Overdue";
  };
};

export type PaymentAnalytics = {
  name: string;

  current: number;
  previous: number;

  count: number;
  prevCount: number;
};

export type RevenueAnalytics = {
  revenue: {
    month: string;
    revenue: number;
  }[];

  totalRevenue: number;

  paidUsers: number;

  recentPaidUsers: {
    name: string;
    amount: number;
    room: string;
    bed: string;
    paid_at: string;
  }[];
};

export type UpcomingPayment = {
  payment_id: number;

  label: string;

  room: string;
  bed: string;

  amount: number;
  penalty: number;
  totalAmount: number;

  dueDate: string;

  daysLeft: number;

  paymentState: "Upcoming" | "Due Today" | "Overdue";

  status: "Pending" | "Overdue";
};

export type RecentPayment = {
  payment_id: number;
  month: string;
  amount: number;
  penalty: number;
  totalAmount: number;
  paidDate: string;
  status: "Paid";
};

export type UpcomingPaymentResponse = {
  hasUpcomingPayment: boolean;
  payment?: UpcomingPayment;
};


export type PaymentHistoryApi = {
  payment_id: number;
  month: string;
  amount: number;
  penalty: number;
  dueDate: string;
  paidDate: string | null;
  status: "Paid" | "Pending" | "Overdue";
  room?: string;
  bed?: string;
  totalAmount?: number;
};

export type PaymentHistory = {
  payment_id: number;
  month: string;
  amount: number;
  payment_penalty: number;
  dueDate: string;
  paidDate: string | null;
  status: "Paid" | "Pending" | "Overdue";
};


type PaymentStore = {
  payments: Payment[];
  Reports: Payment[];
  getMyPaid: Payment[];
  loading: boolean;
  calendarEvents: CalendarEvent[];
  analytics: PaymentAnalytics[];
  revenueAnalytics: RevenueAnalytics | null;
  upcomingPayment: UpcomingPayment | null;
  recentPayments: RecentPayment[];

  paymentHistory: PaymentHistory[];

  getRecentPayments: () => Promise<void>;
  getUpcomingPayment: () => Promise<void>;

  getRevenueAnalytics: () => Promise<void>;
  getAnalytics: () => Promise<void>;
  getPayments: () => Promise<void>;
  getReports: () => Promise<void>;
  getUserPaid: () => Promise<void>;
  markAsPaid: (payment_id: number) => Promise<void>;
  getCalendar: () => Promise<void>;
  getPaymentHistory: () => Promise<void>;
};

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  Reports: [],
  getMyPaid: [],
  loading: false,
  calendarEvents: [],
  analytics: [],
  revenueAnalytics: null,
  upcomingPayment: null,
  recentPayments: [],
  paymentHistory: [],

getPaymentHistory: async () => {
    try {
        set({ loading: true });

        const res = await axiosInstance.get("/payments/my-paid-payments");

        console.log(res.data);

        const formatted = res.data.map((payment: PaymentHistoryApi) => ({
            payment_id: payment.payment_id,

            // API already sends this
            month: payment.month,

            amount: Number(payment.amount),

            payment_penalty: Number(payment.penalty),

            dueDate: payment.dueDate,

            paidDate: payment.paidDate,

            status: payment.status,
        }));

        set({
            paymentHistory: formatted,
            loading: false,
        });

    } catch (error) {
        set({ loading: false });
        console.error(error);
    }
},
  getRecentPayments: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get<RecentPayment[]>(
        "/payments/my-recent-payments"
      );

      set({
        recentPayments: res.data,
        loading: false,
      });

    } catch (error) {

      set({ loading: false });

      console.error(
        "Recent payments fetch error:",
        error
      );

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ??
          "Failed to load recent payments"
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  },

  getUpcomingPayment: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get<UpcomingPaymentResponse>(
        "/payments/my-upcoming-payment"
      );

      set({
        upcomingPayment: res.data.hasUpcomingPayment
          ? res.data.payment ?? null
          : null,
        loading: false,
      });

    } catch (error) {

      set({ loading: false });

      console.error(
        "Upcoming payment fetch error:",
        error
      );
    }
  },
  getRevenueAnalytics: async () => {
    try {

      set({ loading: true });

      const res = await axiosInstance.get(
        "/payments/revenue-dashboard"
      );

      set({
        revenueAnalytics: res.data,
        loading: false,
      });

    } catch (error) {

      set({ loading: false });

      console.error(
        "Revenue analytics fetch error:",
        error
      );
    }
  },

  getAnalytics: async () => {
    try {

      set({ loading: true });

      const res = await axiosInstance.get(
        "/payments/payment-analytics"
      );

      set({
        analytics: res.data,
        loading: false,
      });

    } catch (error) {

      set({ loading: false });

      console.error(
        "Analytics fetch error:",
        error
      );
    }
  },

  getCalendar: async () => {
    try {
      const res = await axiosInstance.get("/payments/calendar");

      const events = (res.data as CalendarApiResponse[]).map((e) => ({
        id: e.id,
        title: e.title,
        date: e.date,
        color: e.color,

        name: e.extendedProps.name,
        room: e.extendedProps.room,
        amount: e.extendedProps.amount,
        status: e.extendedProps.status,
      }));

      set({ calendarEvents: events });

    } catch (error) {
      console.error("Calendar fetch error:", error);
    }
  },

  getUserPaid: async () => {
    try {
      set({ loading: true })
      const res = await axiosInstance.get("/payments/my-paid-payments")
      set({ getMyPaid: res.data, loading: false })
    }
    catch (error) {
      console.error("User paid fetch error:", error);
      set({ loading: false })
    }
  },

  getReports: async () => {
    try {
      set({ loading: true })

      const res = await axiosInstance.get("/payments/getreport")
      set({ Reports: res.data, loading: false })
    }
    catch (error) {
      console.error("Report fetch error:", error);
      set({ loading: false })
    }
  },

  getPayments: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get("/payments/getpayment");

      set({
        payments: res.data,
        loading: false,
      });

    } catch (error) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to load payments");
      } else {
        toast.error("Something went wrong");
      }
    }
  },

  markAsPaid: async (payment_id) => {
    try {
      set({ loading: true });

      await axiosInstance.put(
        `/payments/mark-as-paid/${payment_id}`
      );

      const res = await axiosInstance.get(
        "/payments/getpayment"
      );

      set({
        payments: res.data,
        loading: false,
      });

      toast.success("Payment marked as paid");
    } catch (error) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
          "Failed to update payment"
        );
      } else {
        toast.error("Something went wrong");
      }
    }
  },
}));