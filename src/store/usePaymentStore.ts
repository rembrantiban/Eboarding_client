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

type PaymentStore = {
  payments: Payment[];
  Reports : Payment[];
  getMyPaid: Payment[];
  loading: boolean;
  calendarEvents: CalendarEvent[];

  getPayments: () => Promise<void>;
  getReports : () => Promise<void>;
  getUserPaid: () => Promise<void>;
  markAsPaid: (payment_id: number) => Promise<void>;
  getCalendar: () => Promise<void>;
};

export const usePaymentStore = create<PaymentStore>((set) => ({
  payments: [],
  Reports : [],
  getMyPaid: [],
  loading: false,
  calendarEvents: [],




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
      try{
          set({ loading: true})
          const res = await axiosInstance.get("/payments/my-paid-payments")
          set({ getMyPaid: res.data, loading: false })
      } 
      catch(error){
        console.error("User paid fetch error:", error);
        set({ loading: false })
      }
  }, 

  getReports: async () => {
    try{
      set({ loading: true })

      const res = await axiosInstance.get("/payments/getreport")
      set({ Reports: res.data, loading: false })
    }
    catch(error){
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

      await axiosInstance.put(`/payments/mark-as-paid/${payment_id}`);

      toast.success("Payment marked as paid");

      const res = await axiosInstance.get("/payments/report");

      set({
        payments: res.data,
        loading: false,
      });

    } catch (error) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to update payment");
      } else {
        toast.error("Something went wrong");
      }
    }
  },
}));