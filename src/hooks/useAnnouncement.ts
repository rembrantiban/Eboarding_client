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
    deleteAnnouncement,
    getAnnouncements,
    markAsRead,
    getUnreadCount,
    markAllAsRead,
    archiveAnnouncement,
    restoreAnnouncement,
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
    deleteAnnouncement,
    getAnnouncements,
    markAsRead,
    getUnreadCount,
    archiveAnnouncement,
    restoreAnnouncement,
  };
};
