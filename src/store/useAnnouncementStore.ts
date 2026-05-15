import axiosInstance from "@/api/api";
import { create } from "zustand";

export interface Announcement {
  notification_id: number;
  announcement_id: number;
  title: string;
  description: string;
  is_read: boolean;
  created_at: string;
}

interface AnnouncementState {
  announcements: Announcement[];
  unreadCount: number;
  loading: boolean;

  fetchAnnouncements: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  createAnnouncement: (data: {
    title: string;
    description: string;
  }) => Promise<void>;
  updateAnnouncement: (
  id: number,
  data: {
    title?: string;
    description?: string;
    is_active?: boolean;
  }
) => Promise<void>;
}

export const useAnnouncementStore = create<AnnouncementState>((set, get) => ({
  announcements: [],
  unreadCount: 0,
  loading: false,

  fetchAnnouncements: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/announcements/getAnnouncements");
      set({ announcements: res.data });
    } catch (error) {
      console.error("Fetch announcements error:", error);
    } finally {
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await axiosInstance.get("/announcements/unread/count");
      set({ unreadCount: res.data.unread });
    } catch (error) {
      console.error("Unread count error:", error);
    }
  },

  markAsRead: async (id) => {
    try {
      await axiosInstance.put(`/announcements/read/${id}`);

      const updated = get().announcements.map((a) =>
        a.notification_id === id ? { ...a, is_read: true } : a
      );

      set({
        announcements: updated,
        unreadCount: Math.max(0, get().unreadCount - 1),
      });

    } catch (error) {
      console.error("Mark as read error:", error);
    }
  },

  createAnnouncement: async ({ title, description }) => {
    try {
      await axiosInstance.post("/announcements/create", {
        title,
        description,
      });

      await get().fetchAnnouncements();
      await get().fetchUnreadCount();

    } catch (error) {
      console.error("Create announcement error:", error);
    }
  },

  updateAnnouncement: async (id, data) => {
  try {
    const res = await axiosInstance.put(
      `/announcements/update/${id}`,
      data
    );

    const updatedAnnouncement = res.data.announcement;

    const updatedList = get().announcements.map((a) =>
      a.announcement_id === updatedAnnouncement.id
        ? {
            ...a,
            title: updatedAnnouncement.title,
            description: updatedAnnouncement.description,
          }
        : a
    );

    set({ announcements: updatedList });

  } catch (error) {
    console.error("Update announcement error:", error);
  }
},

}));