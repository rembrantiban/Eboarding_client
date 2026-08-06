import { create } from "zustand"
import axiosInstance from "@/api/api"
import { useStatusStore } from "./useStatusStore";
import axios from "axios";


export interface MaintenanceRequest {
    id: number;
    request_number: string;
    category: string;
    description: string;
    image_url: string | null;
    status: string;
    created_at: string;

    room_number: string;
    boarder?: string;
    assigned_staff?: string;
}

interface MaintenanceStore {
    loading: boolean;

    submittedMaintenance: MaintenanceRequest[];
    myAssignedMaintenance: MaintenanceRequest[];
    maintenanceRequest: MaintenanceRequest[];

    createMaintenanceRequest: (data: FormData) => Promise<boolean>;

    getSubmittedMaintenance: () => Promise<boolean>;

    getMyAssignedMaintenance: () => Promise<boolean>;

    assignMaintenanceRequest: (id: number, assigned_staff_id: number) => Promise<boolean>;

    updateMaintenanceStatus: (id: number, status: string, remarks?: string) => Promise<boolean>;

    updateMaintenanceRequest: (id: number, data: FormData) => Promise<boolean>;
    getMySubmittedRequest: () => Promise<boolean>;
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({

    loading: false,

    submittedMaintenance: [],

    myAssignedMaintenance: [],

    maintenanceRequest: [],


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

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Failed",
                    error.response?.data?.message ??
                    "Assignment failed."
                );

            }

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