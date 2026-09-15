import { create } from "zustand";
import axiosInstance from "@/api/api";
import axios from "axios";
import { useStatusStore } from "./useStatusStore";


export interface Room {
  id: number;
  room_number: string;
  capacity: number;
  price_per_month: number;
  description?: string;
  status: "Available" | "Occupied" | "Under Maintenance";
  images?: string[];

  occupied_beds?: number;
  available_beds?: number;
  total_beds?: number;
}

export interface DeletedRoom {
  id: number;
  room_number: string;
  capacity: number;
  price_per_month: number;
  status: "Available" | "Occupied" | "Under Maintenance";
  total_beds: number;

  deleted_at: string;
  deleted_by_name?: string;
  deleted_by_avatar?: string;
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
  status: "Available" | "Occupied" | "Under Maintenance";
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
  status?:
  | "Available"
  | "Occupied"
  | "Under Maintenance";
  existingImages?: string[];
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
  total_beds: number;
  price_per_month: number;

  description?: string;

  images: string[];

  available_beds: number;

  beds: AvailableBed[];
}

export type OccupancyTrend = {
  month: string
  occupied: number
}

export interface DashboardData {
  room: {
    roomNumber: string;
    bedNumber: string;
    capacity: number;
  };

  monthlyRate: number;

  stay: {
    months: number;
    moveInDate: string;
  };
}


export interface RoomAvailabilityChart {
  room: string;
  total: number;
  available: number;
  occupied: number;
}


export interface BedOccupancyChart {
  name: string;
  value: number;
  color: string;
}

export interface RoomOccupancyChart {
  name: string;
  value: number;
  color: string;
}


//Occupancy Report 
export interface RoomReportStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  occupancyRate: string;
}

export interface RoomStatusReport {
  name: string;
  value: number;
  color: string;
}

export interface RoomReport {
  number: string;
  capacity: number;
  occupied: number;
  available: number;
  status: "Available" | "Occupied" | "Under Maintenance";
  date: string;
}


export type ActivityAction =
  | "Active"
  | "Checked-Out"
  | "Transferred";

export interface RecentActivity {
  date: string;
  boarder: string;
  room: string;
  bed: string;
  action: ActivityAction;
  by: string;
}

export interface ReportInsights {
  occupancyRate: string;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  maintenanceRooms: number;
  insights: string[];
}

interface RoomState {
  rooms: Room[];
  availableRooms: AvailableRoom[];
  selectedRoomBeds: Bed[];
  dashboardStats: {
    totalRooms: number,
    fullyOccupied: number,
    occupiedBeds: number,
    availableBeds: number,
  };
  roomOccupancyChart: RoomOccupancyChart[];
  roomReport: RoomReport[];


  //Occupancy State
  roomReportStats: RoomReportStats;
  roomStatusReport: RoomStatusReport[];
  recentActivities: RecentActivity[];
  reportInsights: ReportInsights | null;


  getRoomOccupancyChart: () => Promise<boolean>;

  roomAvailabilityChart: RoomAvailabilityChart[];

  dashboard: DashboardData | null;

  bedOccupancyChart: BedOccupancyChart[],

  getMyDashboard: () => Promise<void>;
  occupancyTrend: OccupancyTrend[],

  loading: boolean;
  error: string | null;
  deletedRooms: DeletedRoom[];
  deletedRoomsLoading: boolean;
  getDashboardStats: () => Promise<void>;
  getRooms: () => Promise<void>;
  createRoom: (data: CreateRoomPayload) => Promise<void>;
  updateRoom: (data: UpdateRoomPayload) => Promise<void>;
  deleteRoom: (id: number) => Promise<void>;
  getDeletedRooms: () => Promise<void>;
  restoreRoom: (id: number) => Promise<void>;
  getRoomById: (id: number) => Promise<void>;
  getAvailableRooms: () => Promise<void>;
  getOccupancyTrend: () => Promise<void>
  updateRoomStatus: (id: number, status: "Available" | "Occupied" | "Under Maintenance") => Promise<boolean>;

  getRoomAvailabilityChart: () => Promise<void>;
  getBedOccupancyChart: () => Promise<boolean>;


  //Occupancy Report State
  getRoomReportStats: () => Promise<boolean>;
  getRoomStatusReport: () => Promise<boolean>;
  getRoomReport: () => Promise<void>;

  getRecentActivities: () => Promise<void>;
  getReportInsights: () => Promise<void>;

}


export const useRoomStore = create<RoomState>((set, get) => ({
  rooms: [],
  selectedRoomBeds: [],
  loading: false,
  error: null,
  deletedRooms: [],
  deletedRoomsLoading: false,
  availableRooms: [],
  occupancyTrend: [],
  dashboard: null,

  dashboardStats: {
    totalRooms: 0,
    fullyOccupied: 0,
    occupiedBeds: 0,
    availableBeds: 0,
  },

  roomAvailabilityChart: [],
  bedOccupancyChart: [],
  roomOccupancyChart: [],
  roomReportStats: {
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    occupancyRate: "0%",
  },
  roomStatusReport: [],
  roomReport: [],
  recentActivities: [],
  reportInsights: null,


  getReportInsights: async () => {
  try {
    const res = await axiosInstance.get(
      "/rooms/report-insights"
    );

    set({
      reportInsights: res.data,
    });

  } catch (error) {
    console.error(
      "Report insights error:",
      error
    );
  }
},

  getRecentActivities: async () => {
    try {
      const res = await axiosInstance.get(
        "/rooms/recent-activities"
      );

      set({
        recentActivities: res.data,
      });

    } catch (error) {
      console.error(
        "Recent activities error:",
        error
      );
    }
  },
  getRoomReport: async () => {
    try {
      const res = await axiosInstance.get(
        "/rooms/room-report"
      );

      set({
        roomReport: res.data,
      });

    } catch (error) {
      console.error(
        "Room report error:",
        error
      );
    }
  },
  getRoomStatusReport: async () => {
    try {

      const response = await axiosInstance.get(
        "/rooms/room-status-report"
      );

      set({
        roomStatusReport: response.data,
      });

      return true;

    } catch (error) {

      console.error(
        "Room status report error:",
        error
      );

      return false;
    }
  },
  getRoomReportStats: async () => {
    try {

      const response = await axiosInstance.get(
        "/rooms/room-report-stats"
      );

      set({
        roomReportStats: response.data,
      });

      return true;

    } catch (error) {

      console.error(
        "Room report stats error:",
        error
      );

      return false;
    }
  },
  getRoomOccupancyChart: async () => {
    try {
      set({ loading: true })
      const response = await axiosInstance.get(
        "/rooms/room-occupancy-chart"
      );

      set({
        roomOccupancyChart: response.data,
        loading: false
      });

      return true;
    } catch (error) {
      console.error(error);
      set({ loading: false });
      return false;
    }
  },

  getBedOccupancyChart: async () => {
    try {
      const response = await axiosInstance.get(
        "/rooms/bed-occupancy-chart"
      );

      set({
        bedOccupancyChart: response.data,
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  getRoomAvailabilityChart: async () => {
    try {
      set({ loading: true });
      const res = await axiosInstance.get(
        "/rooms/availability-chart"
      );

      set({
        roomAvailabilityChart: res.data,
        loading: false
      });


    } catch (error) {
      console.error(
        "Room availability chart error:",
        error
      );

      set({ loading: false });
    }
  },

  updateRoomStatus: async (id, status) => {

    const {
      showLoading,
      showSuccess,
      showError,
    } = useStatusStore.getState();

    try {

      showLoading(
        "Updating Room Status",
        "Please wait..."
      );

      set({
        loading: true,
      });

      const res = await axiosInstance.put(
        `/rooms/status/${id}`,
        {
          status,
        }
      );

      showSuccess(
        "Status Updated",
        res.data.message
      );

      // Update only the changed room
      set((state) => ({
        rooms: state.rooms.map((room) =>
          room.id === id
            ? res.data.room
            : room
        ),
        loading: false,
      }));

      return true;

    } catch (error) {

      if (axios.isAxiosError(error)) {

        showError(
          "Update Failed",
          error.response?.data?.message ??
          "Unable to update room status."
        );

      } else {

        showError(
          "Update Failed",
          "Unexpected error."
        );

      }

      set({
        loading: false,
      });

      return false;
    }
  },

  getMyDashboard: async () => {
    try {
      const res = await axiosInstance.get("/rooms/my-stats-dashboard");

      set({
        dashboard: res.data,
      });
    } catch (error) {
      console.error(error);
    }
  },

  getOccupancyTrend: async () => {
    try {

      const res =
        await axiosInstance.get(
          "/rooms/occupancy-trend"
        )

      set({
        occupancyTrend: res.data,
      })

    } catch (error) {

      console.error(
        "Occupancy trend error:",
        error
      )
    }
  },

  getDashboardStats: async () => {
    try {

      const res = await axiosInstance.get(
        "/rooms/dashboard-stats"
      );

      set({
        dashboardStats: res.data,
      });

    } catch (error) {
      console.error(error);
    }
  },
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
        "/rooms/available-rooms"
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
    const { showLoading, showError, showSuccess } = useStatusStore.getState();
    try {
      showLoading("Creating Room", "Please wait...");
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

      showSuccess("Room Created", "Room created successfully");


    } catch (error: unknown) {
      let message = "Failed to create room";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      showError("Failed to create room", message);
      set({ loading: false, error: message });
      throw new Error(message);
    }
  },


  updateRoom: async (data) => {
    const { showLoading, showError, showSuccess } = useStatusStore.getState();

    try {
      showLoading("Updating Room", "Please wait...");
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

      formData.append(
        "existingImages",
        JSON.stringify(data.existingImages ?? [])
      );

      data.images?.forEach((file) => {
        formData.append("images", file);
      });
      await axiosInstance.put(`/rooms/update-room/${data.id}`, formData);

      const res = await axiosInstance.get("/rooms/get-all");

      set({
        rooms: res.data,
        loading: false,
      });

      showSuccess("Room Updated", "Room updated successfully");

    } catch (error: unknown) {
      let message = "Failed to update room";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      showError("Failed to update room", message);
      set({ loading: false, error: message });
      throw new Error(message); // 🔥 THIS FIXES YOUR TOAST ISSUE
    }
  },

  deleteRoom: async (id: number) => {
    const { showLoading, showError, showSuccess } = useStatusStore.getState();
    try {
      set({ loading: true, error: null });
      showLoading("Moving to Trash", "Please wait...");

      await axiosInstance.delete(`/rooms/delete/${id}`);

      set((state) => ({
        rooms: state.rooms.filter((room) => room.id !== id),
        loading: false,
      }));
      showSuccess("Room Moved to Trash", "You can restore it anytime from Deleted Rooms");

    } catch (error: unknown) {
      let message = "Failed to delete room";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }
      showError("Failed to delete room", message);
      set({ loading: false, error: message });
      throw new Error(message); // 🔥 IMPORTANT for toast
    }
  },

  getDeletedRooms: async () => {
    try {
      set({ deletedRoomsLoading: true });

      const res = await axiosInstance.get("/rooms/deleted");

      set({
        deletedRooms: res.data,
        deletedRoomsLoading: false,
      });

    } catch (error) {
      console.error("Get deleted rooms error:", error);

      set({ deletedRoomsLoading: false });
    }
  },

  restoreRoom: async (id: number) => {
    const { showError, showSuccess } = useStatusStore.getState();

    try {
      await axiosInstance.put(`/rooms/restore/${id}`);

      set((state) => ({
        deletedRooms: state.deletedRooms.filter((room) => room.id !== id),
      }));

      showSuccess("Room Restored", "The room is active again");

      await get().getRooms();

    } catch (error: unknown) {
      let message = "Failed to restore room";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      } else if (error instanceof Error) {
        message = error.message;
      }

      showError("Failed to restore room", message);
      throw new Error(message);
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