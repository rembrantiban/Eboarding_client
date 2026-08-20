import { create } from "zustand"
import axiosInstance from "@/api/api"
import { useStatusStore } from "./useStatusStore";
import axios from "axios";


export type MaintenanceStatus =
    | "Pending"
    | "In Progress"
    | "Completed"
    | "Closed"
    | "Cancelled";

export interface MaintenanceRequest {
    id: number;

    request_number?: string;

    user_id?: number;
    room_id?: number;

    category?: string;
    title?: string;

    description?: string;
    image_url?: string | null;

    status: MaintenanceStatus;

    created_at: string;
    updated_at?: string;

    room_number?: string;
    bed_number?: string;

    room?: string;
    reporter?: string;
    assigned_staff?: string;

    date?: string;
    requested_by: string,
}

export interface MaintenanceRequest {
    id: number;

    title?: string;
    room?: string;
    reporter?: string;
    assigned_staff?: string;

    date?: string;

    status: MaintenanceStatus;

    created_at: string;
}



interface MaintenanceStore {
    loading: boolean;

    submittedMaintenance: MaintenanceRequest[];
    myAssignedMaintenance: MaintenanceRequest[];
    maintenanceRequest: MaintenanceRequest[];
    boarderRequest: MaintenanceRequest[];
    assignedMaintenanceList: MaintenanceRequest[];

    createMaintenanceRequest: (data: FormData) => Promise<boolean>;

    getSubmittedMaintenance: () => Promise<boolean>;

    getMyAssignedMaintenance: () => Promise<boolean>;

    assignMaintenanceRequest: (id: number, assigned_staff_id: number) => Promise<boolean>;

    updateMaintenanceStatus: (id: number, status: string, remarks?: string) => Promise<boolean>;

    updateMaintenanceRequest: (id: number, data: FormData) => Promise<boolean>;
    getMySubmittedRequest: () => Promise<boolean>;

    getBoarderRequestMaintenance: () => Promise<boolean>;

    getAllAssignedMaintenance: () => Promise<boolean>;
    updateAssignedMaintenanceRequest: (id: number, status: MaintenanceStatus, remarks?: string) => Promise<boolean>;
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({

    loading: false,

    submittedMaintenance: [],

    myAssignedMaintenance: [],

    maintenanceRequest: [],

    boarderRequest: [],
    assignedMaintenanceList: [],


    updateAssignedMaintenanceRequest: async (
        id,
        status,
        remarks
    ) => {

        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            set({
                loading: true,
            });

            showLoading(
                "Updating Request",
                "Please wait..."
            );

            await axiosInstance.put(
                `/maintenance/staff/update/${id}`,
                {
                    status,
                    remarks,
                }
            );

            showSuccess(
                "Success",
                "Maintenance request updated successfully."
            );

            /**
             * Refresh Staff Assigned Requests
             */
            const res = await axiosInstance.get(
                "/maintenance/my-assigned"
            );

            set({
                myAssignedMaintenance: res.data,
            });

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Failed",
                    error.response?.data?.message ??
                    "Failed to update request."
                );

            }

            return false;

        } finally {

            set({
                loading: false,
            });

        }

    },
    getAllAssignedMaintenance: async () => {
        try {

            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                "/maintenance/all-staff-assigned"
            );

            set({
                assignedMaintenanceList: res.data,
            });

            return true;

        } catch (error) {

            console.error(
                "Failed to fetch assigned maintenance",
                error
            );

            return false;

        } finally {

            set({
                loading: false,
            });

        }
    },
    getBoarderRequestMaintenance: async () => {

        try {
            set({ loading: true });

            const res = await axiosInstance.get("/maintenance/boarder");

            set({
                boarderRequest: res.data,
            });

            return true;

        } catch {
            return false;
        } finally {

            set({ loading: false });

        }

    },

    getMySubmittedRequest: async () => {

        try {
            set({ loading: true });

            const res = await axiosInstance.get("/maintenance/my-submitted");

            set({
                maintenanceRequest: res.data,
            });

            return true;

        } catch {
            return false;
        } finally {

            set({ loading: false });

        }

    },

    createMaintenanceRequest: async (data) => {

        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            set({ loading: true });

            showLoading(
                "Submitting Request",
                "Please wait..."
            );

            await axiosInstance.post(
                "/maintenance/requests",
                data,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            showSuccess(
                "Success",
                "Maintenance request submitted."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {
                showError(
                    "Failed",
                    error.response?.data?.message ??
                    "Failed to submit request."
                );
            }

            return false;

        } finally {

            set({ loading: false });

        }

    },

    getSubmittedMaintenance: async () => {

        try {

            set({ loading: true });

            const res =
                await axiosInstance.get(
                    "/maintenance/get-requests"
                );

            set({
                submittedMaintenance: res.data,
            });

            return true;

        } catch {

            return false;

        } finally {

            set({ loading: false });

        }

    },


    getMyAssignedMaintenance: async () => {

        try {

            set({ loading: true });

            const res =
                await axiosInstance.get(
                    "/maintenance/my-assigned"
                );

            set({
                myAssignedMaintenance:
                    res.data,
            });

            return true;

        } catch {

            return false;

        } finally {

            set({ loading: false });

        }

    },

    assignMaintenanceRequest: async (id, assigned_staff_id) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        set({ loading: true })
        try {

            showLoading(
                "Assigning",
                "Please wait..."
            );

            await axiosInstance.put(
                `/maintenance/assign/${id}`,
                {
                    assigned_staff_id,
                }
            );

            showSuccess(
                "Assigned",
                "Maintenance request assigned."
            );

            set({ loading: false });
            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Failed",
                    error.response?.data?.message ??
                    "Assignment failed."
                );

            }

            set({ loading: false });

            return false;

        }

    },


    updateMaintenanceStatus: async (id, status, remarks) => {

        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Updating",
                "Please wait..."
            );

            await axiosInstance.put(
                `/maintenance/status/${id}`,
                {
                    status,
                    remarks,
                }
            );

            showSuccess(
                "Success",
                "Status updated."
            );

            return true;

        } catch (error) {
            if (axios.isAxiosError(error)) {
                showError(
                    "Failed",
                    error.response?.data?.message ??
                    "Update failed."
                );
            }
            return false;
        }

    },
    updateMaintenanceRequest: async (id, data) => {

        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Updating",
                "Please wait..."
            );

            await axiosInstance.put(
                `/maintenance/requests/${id}`,
                data,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data",
                    },
                }
            );

            showSuccess(
                "Success",
                "Maintenance request updated."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Failed",
                    error.response?.data?.message ??
                    "Update failed."
                );

            }

            return false;

        }

    },

}))