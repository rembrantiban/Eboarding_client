import { create } from "zustand";
import axiosInstance from "@/api/api";
import axios from "axios";


export interface Room {
  id: number;
  room_number: string;
  capacity: number;
  price_per_month: number;
  description?: string;
  status: "Available" | "Occupied" | "Full";
  images?: string[];

  occupied_beds?: number;
  total_beds?: number;
}

export interface Bed {
  id: number;
  bed_number: string;
  status: "Available" | "Occupied";
}

interface CreateRoomPayload {
  room_number: string;
  capacity: number;
  bed_count: number;
  price_per_month: number;
  status: "Available" | "Full";
  description?: string;
  images?: File[];
}

interface UpdateRoomPayload {
  id: number;
  room_number?: string;
  capacity?: number;
  bed_count?: number;
  price_per_month?: number;
  description?: string;
  images?: File[];
}

export interface AvailableBed {
  id: number;
  bed_number: string;
}

export interface AvailableRoom {
  id: number;
  room_number: string;
  capacity: number;
  price_per_month: number;

  available_beds: number;
  total_beds: number;

  beds: AvailableBed[];

  images?: string[];      
  description?: string;  
   status?: "Available" | "Full"; 
}

interface RoomState {
  rooms: Room[];
  availableRooms: AvailableRoom[];
  selectedRoomBeds: Bed[];

  loading: boolean;
  error: string | null;

  getRooms: () => Promise<void>;
  createRoom: (data: CreateRoomPayload) => Promise<void>;
  updateRoom: (data: UpdateRoomPayload) => Promise<void>;
  deleteRoom: (id: number) => Promise<void>;
  getRoomById: (id: number) => Promise<void>;
  getAvailableRooms: () => Promise<void>;

}


export const useRoomStore = create<RoomState>((set) => ({
  rooms: [],
  selectedRoomBeds: [],
  loading: false,
  error: null,
  availableRooms: [],


  getRooms: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get("/rooms/get-all");

      set({
        rooms: res.data,
        loading: false,
      });

    } catch (error: unknown) {
      let message = "Failed to fetch rooms";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      set({ loading: false, error: message });
      throw new Error(message);
    }
  },


  getAvailableRooms: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(
        "/rooms/available"
      );

      set({
        availableRooms: res.data,
        loading: false,
      });

    } catch (error: unknown) {
      let message = "Failed to fetch available rooms";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      set({
        loading: false,
        error: message,
      });

      throw new Error(message);
    }
  },


  createRoom: async (data) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();

      formData.append("room_number", data.room_number);
      formData.append("capacity", String(data.capacity));
      formData.append("bed_count", String(data.bed_count));
      formData.append("price_per_month", String(data.price_per_month));

      if (data.status) formData.append("status", data.status);
      if (data.description) formData.append("description", data.description);

      if (data.images?.length) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      await axiosInstance.post("/rooms/create", formData);

      // 🔥 REFRESH
      const res = await axiosInstance.get("/rooms/get-all");

      set({
        rooms: res.data,
        loading: false,
      });

    } catch (error: unknown) {
      let message = "Failed to create room";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      set({ loading: false, error: message });
      throw new Error(message);
    }
  },


  updateRoom: async (data) => {
    try {
      set({ loading: true, error: null });

      const formData = new FormData();

      if (data.room_number)
        formData.append("room_number", data.room_number);

      if (data.capacity !== undefined)
        formData.append("capacity", String(data.capacity));

      if (data.bed_count !== undefined)
        formData.append("bed_count", String(data.bed_count));

      if (data.price_per_month !== undefined)
        formData.append("price_per_month", String(data.price_per_month));

      if (data.description)
        formData.append("description", data.description);

      if (data.images?.length) {
        data.images.forEach((file) => {
          formData.append("images", file);
        });
      }

      await axiosInstance.put(`/rooms/update-room/${data.id}`, formData);

      const res = await axiosInstance.get("/rooms/get-all");

      set({
        rooms: res.data,
        loading: false,
      });

    } catch (error: unknown) {
      let message = "Failed to update room";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      set({ loading: false, error: message });
      throw new Error(message); // 🔥 THIS FIXES YOUR TOAST ISSUE
    }
  },

  deleteRoom: async (id: number) => {
    try {
      set({ loading: true, error: null });

      await axiosInstance.delete(`/rooms/delete/${id}`);

      set((state) => ({
        rooms: state.rooms.filter((room) => room.id !== id),
        loading: false,
      }));

    } catch (error: unknown) {
      let message = "Failed to delete room";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      set({ loading: false, error: message });
      throw new Error(message); // 🔥 IMPORTANT for toast
    }
  },


  getRoomById: async (id: number) => {
    try {
      set({ loading: true, error: null });

      const res = await axiosInstance.get(`/rooms/${id}`);

      set({
        selectedRoomBeds: res.data.beds,
        loading: false,
      });

    } catch (error: unknown) {
      let message = "Failed to fetch room details";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      set({ loading: false, error: message });
      throw new Error(message);
    }
  },
}));