import { useAnnouncementStore } from "@/store/useAnnouncementStore";

export const useAnnouncement = () => {
  const {
    myAnnouncements,
    announcements,
    unreadCount,
    loading,
    getMyAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    getAnnouncements,
    markAsRead,
    getUnreadCount,
    markAllAsRead,
  } = useAnnouncementStore();

  return {
    myAnnouncements,
    announcements,
    markAllAsRead,
    unreadCount,
    loading,
    getMyAnnouncements,
    createAnnouncement,
    updateAnnouncement,
    getAnnouncements,
    markAsRead,
    getUnreadCount
  };
};