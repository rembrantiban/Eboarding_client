import { create } from "zustand";
import axiosInstance from "@/api/api";
import axios from "axios";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";


export type Boarder = {
  boarder_id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number: string;

  room_number: string;
  bed_number: string;

   price_per_month: number;
   
   
   start_date: string;
   boarder_status: string;
   assigned_by: string;

  amount: number;
  due_date: string;
  payment_status: string;


  assigned_by_first_name?: string;
  assigned_by_last_name?: string;
};


type MyBoarding = {
  boarder_id: number
  room_number: string
  bed_number: string
  price_per_month: number
  start_date: string
  status: "Active" | "Inactive"

  description: string | null
  images: string[]
}

type AssignPayload = {
  user_id: number;
  room_id: number;
  bed_id: number;
};

type BoarderStore = {
  boarders: Boarder[];
  loading: boolean;
   myBoarding: MyBoarding | null,

  getBoarders: () => Promise<void>;
  getMyBoarding: () => Promise<void>;
  assignBoarder: (data: AssignPayload) => Promise<void>;
  notifyBoarder: (boarder_id: number) => Promise<void>; 
  removeBoarder: (boarder_id: number) => Promise<void>;
};


export const useBoarderStore = create<BoarderStore>((set) => ({
  boarders: [],
  loading: false,
  myBoarding: null,


  getMyBoarding: async () => {
  try {
    set({ loading: true })

    const res = await axiosInstance.get("/boarders/my-room")

    set({
      myBoarding: res.data,
      loading: false,
    })

  } catch (error) {
    set({ loading: false })

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        set({ myBoarding: null }) 
      } else {
        toast.error(error.response?.data?.message || "Failed to load room")
      }
    } else {
      toast.error("Something went wrong")
    }
  }
},
  getBoarders: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get("/boarders/getboarders");

      set({
        boarders: res.data,
        loading: false,
      });

    } catch (error) {
      set({ loading: false });

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to load boarders");
      } else {
        toast.error("Something went wrong");
      }
    }
  },

assignBoarder: async (data) => {
  
  try {
    set({ loading: true });

    const toastId = toast.loading("Assigning boarder...");

    const res = await axiosInstance.post("/boarders/assign", data);

    toast.success(res.data.message || "Boarder assigned!", { id: toastId });

    await useAuthStore.getState().getUsers();
    useAuthStore.setState((state) => ({
      users: state.users.map((u) =>
        u.id === data.user_id
          ? {
              ...u,
              is_assigned: true,
              room_number: res.data.room_number,
              bed_number: res.data.bed_number,
            }
          : u
      ),
    }));

    set({ loading: false });

  } catch (error) {
    set({ loading: false });
 
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Error occurred", {});
    } else {
      toast.error("Something went wrong");
    }
  }
},

notifyBoarder: async (boarder_id: number) => {
  try {
    await axiosInstance.post(`/boarders/notify/${boarder_id}`);

    const toastId = toast.loading("Sending notification...");
    toast.success("Notification sent!", { id: toastId });

  } catch (error) {
    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Failed to notify");
    } else {
      toast.error("Something went wrong");
    }
  }
},

removeBoarder: async (boarder_id: number) => {
  try {
    set({ loading: true });

    const res = await axiosInstance.delete(`/boarders/remove/${boarder_id}`);

    const toastId = toast.loading("Removing boarder...");
    toast.success(res.data.message || "Boarder removed!", { id: toastId });

    await useBoarderStore.getState().getBoarders();

  } catch (error) {
    set({ loading: false });

    if (axios.isAxiosError(error)) {
      toast.error(error.response?.data?.message || "Failed to remove boarder");
    } else {
      toast.error("Something went wrong");
    }
  }
},

}));