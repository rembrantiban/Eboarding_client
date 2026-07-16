import { useRoomAssignmentStore } from "@/store/useRoomAssignmentStore";
import { useRoomStore } from "@/store/useRoomStore";

export const useRoomAssignment = () => {
    const assignRoom = useRoomAssignmentStore((state) => state.assignRoom);
    const getAssignments = useRoomAssignmentStore((state) => state.getAssignments);
    const loading = useRoomStore((state) => state.loading);

    return {
        assignRoom,
        getAssignments,
        loading,
    };
};