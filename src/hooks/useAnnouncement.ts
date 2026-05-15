import { useAnnouncementStore } from "@/store/useAnnouncementStore";

export const useAnnouncement = () => {
  const loading = useAnnouncementStore((state) => state.loading);
  const unreadCount = useAnnouncementStore((state) => state.unreadCount);
  const announcements = useAnnouncementStore((state) => state.announcements);

  const fetchAnnouncements = useAnnouncementStore((state) => state.fetchAnnouncements);
  const fetchUnreadCount = useAnnouncementStore((state) => state.fetchUnreadCount);
  const markAsRead = useAnnouncementStore((state) => state.markAsRead);
  const createAnnouncement = useAnnouncementStore((state) => state.createAnnouncement);
  const updateAnnouncement = useAnnouncementStore((state) => state.updateAnnouncement);

  return {
    loading,
    unreadCount,
    announcements,
    fetchAnnouncements,
    fetchUnreadCount,
    markAsRead,
    createAnnouncement,
    updateAnnouncement,
  };
};