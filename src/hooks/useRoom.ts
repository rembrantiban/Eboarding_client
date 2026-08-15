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
  const roomAvailability = useRoomStore((state) => state.roomAvailabilityChart);
  const getRoomAvailabilityChart = useRoomStore((state) => state.getRoomAvailabilityChart);
  const bedOccupancyChart = useRoomStore((state) => state.bedOccupancyChart);
  const getBedOccupancyChart = useRoomStore((state) => state.getBedOccupancyChart);
  const roomOccupancyChart = useRoomStore((state) => state.roomOccupancyChart);
  const getRoomOccupancyChart = useRoomStore((state) => state.getRoomOccupancyChart);
  const roomAvailabilityChart = useRoomStore((state) => state.roomAvailabilityChart);

  //Occupancy Report
  const roomReportStats = useRoomStore((state) => state.roomReportStats);
  const getRoomReportStats = useRoomStore((state) => state.getRoomReportStats);

  const roomStatusReport = useRoomStore((state) => state.roomStatusReport);
  const getRoomStatusReport = useRoomStore((state) => state.getRoomStatusReport);
  const roomReport = useRoomStore((state) => state.roomReport);
  const getRoomReport = useRoomStore((state) => state.getRoomReport);
  const recentActivities = useRoomStore((state) => state.recentActivities);
  const getRecentActivities = useRoomStore((state) => state.getRecentActivities);
  const reportInsights = useRoomStore((state) => state.reportInsights);
  const getReportInsights = useRoomStore((state) => state.getReportInsights);



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
    dashboard,
    roomAvailability,
    getRoomAvailabilityChart,
    bedOccupancyChart,
    getBedOccupancyChart,
    roomOccupancyChart,
    getRoomOccupancyChart,
    roomAvailabilityChart,


    roomReportStats,
    getRoomReportStats,

    roomStatusReport,
    getRoomStatusReport,

    roomReport,
    getRoomReport,

    recentActivities,
    getRecentActivities,

    reportInsights,
    getReportInsights

  };
};