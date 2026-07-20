import { useRoomAssignmentStore } from "@/store/useRoomAssignmentStore";
import { useRoomStore } from "@/store/useRoomStore";

export const useRoomAssignment = () => {
    const assignRoom = useRoomAssignmentStore((state) => state.assignRoom);
    const getAssignments = useRoomAssignmentStore((state) => state.getAssignments);
    const loading = useRoomStore((state) => state.loading);
    const assignedBoarders = useRoomAssignmentStore((state) => state.assignedBoarders);
    const transferAssignment = useRoomAssignmentStore((state) => state.transferAssignment);
    const checkoutAssignment = useRoomAssignmentStore((state) => state.checkoutAssignment);
    const getOccupancyHistory = useRoomAssignmentStore((state) => state.getOccupancyHistory);
    const occupancyHistory = useRoomAssignmentStore((state) => state.occupancyHistory);
    const boarderAssignedRoom = useRoomAssignmentStore((state) => state.boarderAssignedRoom);   
    const getBoarderAssignedRoom = useRoomAssignmentStore((state) => state.getBoarderAssignedRoom);
    const getDashboard = useRoomAssignmentStore((state) => state.getDashboard);
    const dashboard = useRoomAssignmentStore((state) => state.dashboard);
    
    
    return {
        assignRoom,
        getAssignments,
        loading,
        assignedBoarders,
        transferAssignment,
        checkoutAssignment,
        getOccupancyHistory,
        occupancyHistory,
        getBoarderAssignedRoom,
        boarderAssignedRoom,
        getDashboard,
        dashboard,
    };
};