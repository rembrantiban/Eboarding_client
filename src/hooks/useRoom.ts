import { useRoomStore } from "@/store/useRoomStore";

export const useRoom = () => {
  const rooms = useRoomStore((state) => state.rooms);
  const availableRooms = useRoomStore((state) => state.availableRooms);
  const loading = useRoomStore((state) => state.loading);
  const error = useRoomStore((state) => state.error);

  const createRoom = useRoomStore((state) => state.createRoom);
  const updateRoom = useRoomStore((state) => state.updateRoom);
  const getRooms = useRoomStore((state) => state.getRooms);
  const getAvailableRooms = useRoomStore((state) => state.getAvailableRooms);
  const deleteRoom = useRoomStore((state) => state.deleteRoom);
  const dashboardStats = useRoomStore((state) => state.dashboardStats);
  const getDashboardStats = useRoomStore((state) => state.getDashboardStats);
  const occupancyTrend = useRoomStore((state) => state.occupancyTrend);
  const getOccupancyTrend = useRoomStore((state) => state.getOccupancyTrend);
  const getMyDashboard = useRoomStore((state) => state.getMyDashboard);
  const dashboard = useRoomStore((state) => state.dashboard);

  return {
    rooms,
    availableRooms,
    loading,
    error,
    createRoom,
    updateRoom,
    getRooms,
    getAvailableRooms,
    deleteRoom,
    dashboardStats,
    getDashboardStats,
    occupancyTrend,
    getOccupancyTrend,
    getMyDashboard,
    dashboard
  };
};