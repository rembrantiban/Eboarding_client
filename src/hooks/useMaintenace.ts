import { useMaintenanceStore } from "@/store/useMaintenanceStore";


export const useMaintenance = () => {
    const {
        loading,
        getSubmittedMaintenance,
        getMaintenanceHistory,
        getMyAssignedMaintenance,
        createMaintenanceRequest,
        updateMaintenanceRequest,
        submittedMaintenance,
        maintenanceHistory,
        myAssignedMaintenance,
        getMySubmittedRequest,
        maintenanceRequest,
        assignMaintenanceRequest,
        updateMaintenanceStatus,
        getBoarderRequestMaintenance,
        boarderRequest,
        getBoarderMaintenanceHistory,
        boarderMaintenanceHistory,
        assignedMaintenanceList,
        getAllAssignedMaintenance,
        updateAssignedMaintenanceRequest,
        updateMySubmittedMaintenanceRequest,
    } = useMaintenanceStore();

    return {
        createMaintenanceRequest,
        updateMaintenanceRequest,
        loading,
        getSubmittedMaintenance,
        getMaintenanceHistory,
        getMyAssignedMaintenance,
        submittedMaintenance,
        maintenanceHistory,
        myAssignedMaintenance,
        getMySubmittedRequest,
        maintenanceRequest,
        assignMaintenanceRequest,
        updateMaintenanceStatus,

        getBoarderRequestMaintenance,
        boarderRequest,
        getBoarderMaintenanceHistory,
        boarderMaintenanceHistory,
        assignedMaintenanceList,
        getAllAssignedMaintenance,
        updateAssignedMaintenanceRequest,
        updateMySubmittedMaintenanceRequest,
    };
};