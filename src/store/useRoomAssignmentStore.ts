import { create } from "zustand";
import axiosInstance from "@/api/api";
import axios  from "axios";
import { useStatusStore } from "./useStatusStore";

export interface RoomAssignment {
    id: number;

    user_id: number;
    room_id: number;
    bed_id: number;

    assigned_date: string;
    expected_checkout: string | null;
    actual_checkout: string | null;

    status: "Active" | "Transferred" | "Checked-Out";

    assigned_by: number | null;

    remarks: string | null;

    created_at: string;
}

export interface AssignRoomPayload {
    user_id: number;
    room_id: number;
    bed_id: number;
    assigned_date?:string,
    expected_checkout?: string;
    remarks?: string;
}

interface RoomAssignmentStore {
    loading: boolean;

    assignments: RoomAssignment[];

    assignRoom: (
        data: AssignRoomPayload
    ) => Promise<boolean>;

    getAssignments: () => Promise<void>;
}

export const useRoomAssignmentStore = create<RoomAssignmentStore>((set) => ({

        loading: false,

        assignments: [],

        assignRoom: async (data) => {
            const { showLoading, showError, showSuccess } = useStatusStore.getState();
            try {

                showLoading("Assigning Room", "Please wait...");

                set({
                    loading: true,
                });

                const res =
                    await axiosInstance.post(
                        "/room-assignment/assign",
                        data
                    );

                showSuccess("Room Assigned", res.data.message);

                return true;

            } catch (error: unknown) {

                if (axios.isAxiosError(error)) {
                   showError("Failed to assign room.", error.response?.data?.message);
                } else {
                    showError("Failed to assign room.", "An unexpected error occurred.");
                }
                return false;
            }


        },

        getAssignments: async () => {

            try {

                set({
                    loading: true,
                });

                const res =
                    await axiosInstance.get(
                        "/room-assignments"
                    );

                set({
                    assignments: res.data,
                });

            } catch (error) {

                console.error(error);

            } finally {

                set({
                    loading: false,
                });

            }

        },

    }));