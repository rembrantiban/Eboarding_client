import { create } from "zustand";
import axiosInstance from "@/api/api";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useStatusStore } from "./useStatusStore";

export type Announcement = {
  id: number;
  title: string;
  description: string;
  category: "General" | "Maintenance" | "Billing";
  audience: "Boarders" | "Staff" | "All";
  status: "Active" | "Archived";
  created_by: number;
  created_by_name: string;
  created_by_avatar: string | null;
  created_at: string;
  updated_at: string;
};


export type NotificationAnnouncement = {
  notification_id: number;
  announcement_id: number;

  title: string;
  description: string;

  category: "General" | "Maintenance" | "Billing";
  audience: "Boarders" | "Staff" | "All";
  status: "Active" | "Archived";

  created_by: number;
  created_by_name: string;

  created_by_avatar: string | null;

  is_read: boolean;

  created_at: string;
  updated_at: string;
  notified_at: string;
};

type AnnouncementPayload = {
  title: string;
  description: string;
  category: "General" | "Maintenance" | "Billing";
  audience?: "Boarders" | "Staff" | "All";
};

type ApiError = {
  message: string;
};

type AnnouncementStore = {
  loading: boolean;

  // State
  myAnnouncements: Announcement[];
  announcements: NotificationAnnouncement[];
  unreadCount: number;

  // Admin / Staff
  getMyAnnouncements: () => Promise<void>;
  createAnnouncement: (data: AnnouncementPayload) => Promise<void>;
  updateAnnouncement: (id: number, data: AnnouncementPayload) => Promise<void>;
  deleteAnnouncement: (id: number) => Promise<void>;

  markAllAsRead: () => Promise<void>;
  // Boarder
  getAnnouncements: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  getUnreadCount: () => Promise<void>;

  restoreAnnouncement: (id: number) => Promise<void>;
  archiveAnnouncement: (id: number) => Promise<void>;
};



export const useAnnouncementStore = create<AnnouncementStore>((set) => ({
  loading: false,

  myAnnouncements: [],
  announcements: [],

  unreadCount: 0,

  archiveAnnouncement: async (id) => {
    const {
      showLoading,
      showError,
      showSuccess,
    } = useStatusStore.getState();

    try {
      set({ loading: true });

      showLoading(
        "Archiving Announcement",
        "Please wait..."
      );

      await axiosInstance.put(
        `/announcements/archive/${id}`
      );  

      set((state) => ({
        myAnnouncements: state.myAnnouncements.map((a) =>
          a.id === id
            ? {
              ...a,
              status: "Archived",
            }
            : a
        ),
        loading: false,
      }));

      showSuccess(
        "Success",
        "Announcement archived successfully."
      );

    } catch (error) {
      set({ loading: false });

      const err = error as AxiosError<ApiError>;

      showError(
        err.response?.data?.message ??
        "Failed to archive announcement."
      );
    }
  },
  restoreAnnouncement: async (id) => {
    const {
      showLoading,
      showError,
      showSuccess,
    } = useStatusStore.getState();

    try {
      set({ loading: true });

      showLoading(
        "Restoring Announcement",
        "Please wait..."
      );

      await axiosInstance.put(
        `/announcements/restore/${id}`
      );

      set((state) => ({
        myAnnouncements: state.myAnnouncements.map((a) =>
          a.id === id
            ? {
              ...a,
              status: "Active",
            }
            : a
        ),
        loading: false,
      }));

      showSuccess(
        "Success",
        "Announcement restored successfully."
      );

    } catch (error) {
      set({ loading: false });

      const err = error as AxiosError<ApiError>;

      showError(
        err.response?.data?.message ??
        "Failed to restore announcement."
      );
    }
  },

  markAllAsRead: async () => {
    try {
      await axiosInstance.put("/announcements/read-all");

      set((state) => ({
        announcements: state.announcements.map((a) => ({
          ...a,
          is_read: true,
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      const err = error as AxiosError<ApiError>;
      toast.error(err.response?.data.message ?? "Failed to mark announcements.");
    }
  },

  getMyAnnouncements: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get<Announcement[]>(
        "/announcements/my-announcements"
      );

      set({
        myAnnouncements: res.data,
        loading: false,
      });

    } catch (error) {
      set({ loading: false });

      const err = error as AxiosError<ApiError>;

      toast.error(
        err.response?.data?.message ??
        "Failed to load your announcements."
      );
    }
  },

  createAnnouncement: async (data) => {
    const { showLoading, showError, showSuccess } = useStatusStore.getState();

    try {
      set({ loading: true });
      showLoading("Loading", "please wait...")


      await axiosInstance.post(
        "/announcements",
        data
      );

      // Refresh the admin list
      const res = await axiosInstance.get(
        "/announcements/my-announcements"
      );

      set({
        myAnnouncements: res.data,
        loading: false,
      });

      showSuccess("Success", "Announcement created successfully.");

    } catch (error) {
      set({ loading: false });

      const err = error as AxiosError<ApiError>;

      showError(
        err.response?.data?.message ??
        "Failed to create announcement."
      );
    }
  },

  updateAnnouncement: async (id, data) => {
    const { showLoading, showError, showSuccess } = useStatusStore.getState();
    try {
      set({ loading: true });
      showLoading("Loading", "please wait...")

      await axiosInstance.put(
        `/announcements/${id}`,
        data
      );

      // Refresh the list
      await useAnnouncementStore
        .getState()
        .getMyAnnouncements();

      set({ loading: false });

      showSuccess("Success", "Announcement updated successfully.");

    } catch (error) {
      set({ loading: false });

      const err = error as AxiosError<ApiError>;

      showError(
        err.response?.data?.message ??
        "Failed to update announcement."
      );
    }
  },

  deleteAnnouncement: async (id) => {
    const { showLoading, showError, showSuccess } = useStatusStore.getState();

    try {
      set({ loading: true });
      showLoading("Loading", "please wait...")

      await axiosInstance.delete(
        `/announcements/${id}`
      );

      set((state) => ({
        myAnnouncements: state.myAnnouncements.filter((a) => a.id !== id),
        announcements: state.announcements.filter((a) => a.announcement_id !== id),
        loading: false,
      }));

      showSuccess("Success", "Announcement deleted successfully.");

    } catch (error) {
      set({ loading: false });

      const err = error as AxiosError<ApiError>;

      showError(
        err.response?.data?.message ??
        "Failed to delete announcement."
      );
    }
  },

  getAnnouncements: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get<NotificationAnnouncement[]>(
        "/announcements"
      );

      set({
        announcements: res.data,
        loading: false,
      });

    } catch (error) {
      set({ loading: false });

      const err = error as AxiosError<ApiError>;

      toast.error(
        err.response?.data?.message ??
        "Failed to load announcements."
      );
    }
  },

  getUnreadCount: async () => {
    try {
      const res = await axiosInstance.get<{
        unread: number;
      }>("/announcements/unread/count");

      set({
        unreadCount: res.data.unread,
      });

    } catch (error) {
      const err = error as AxiosError<ApiError>;

      toast.error(
        err.response?.data?.message ??
        "Failed to load unread count."
      );
    }
  },

  markAsRead: async (notificationId) => {
    try {
      await axiosInstance.put(
        `/announcements/read/${notificationId}`
      );

      // Refresh notifications
      await useAnnouncementStore
        .getState()
        .getAnnouncements();

      // Refresh badge count
      await useAnnouncementStore
        .getState()
        .getUnreadCount();

    } catch (error) {
      const err = error as AxiosError<ApiError>;

      toast.error(
        err.response?.data?.message ??
        "Failed to update notification."
      );
    }
  },
}));
