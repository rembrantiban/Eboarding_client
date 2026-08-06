import { useMaintenanceStore } from "@/store/useMaintenanceStore";


export const useMaintenance = () => {
    const {
        loading,
        getSubmittedMaintenance,
        getMyAssignedMaintenance,
        createMaintenanceRequest,
        updateMaintenanceRequest,
        submittedMaintenance,
        myAssignedMaintenance,
        getMySubmittedRequest,
        maintenanceRequest,
    } = useMaintenanceStore();

    return {
        createMaintenanceRequest,
        updateMaintenanceRequest,
        loading,
        getSubmittedMaintenance,
        getMyAssignedMaintenance,
        submittedMaintenance,
        myAssignedMaintenance,
        getMySubmittedRequest,
        maintenanceRequest,
    };
};