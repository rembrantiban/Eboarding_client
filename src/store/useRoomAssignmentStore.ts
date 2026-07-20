import { create } from "zustand";
import axiosInstance from "@/api/api";
import axios from "axios";
import { useStatusStore } from "./useStatusStore";


export interface AssignedBoarder {
    id: number;
    user_id_no: string;

    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    avatar_url: string | null;

    assignment_id: number;

    assigned_date: string;
    expected_checkout: string | null;

    status: "Active" | "Transferred" | "Checked-Out";

    room_id: number;
    room_number: string;

    bed_id: number;
    bed_number: string;
    remarks: string;
}

export interface BoarderAssignedRoom {
    assignment_id: number;

    assigned_date: string;
    expected_checkout: string | null;
    actual_checkout: string | null;

    status: "Active" | "Transferred" | "Checked-Out";
    remarks: string | null;


    user_id: number;
    user_id_no: string;
    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    avatar_url: string | null;

    // Room
    room_id: number;
    room_number: string;
    price_per_month: number;
    capacity: number;
    room_status: string;

    // Room Images
    room_images: string[];

    // Bed
    bed_id: number;
    bed_number: string;
    bed_status: string;

    // Assigned By
    assigned_by_id: number | null;
    assigned_by_first_name: string | null;
    assigned_by_last_name: string | null;

    created_at: string;
}


export interface RoomAssignment {
    id: number;

    user_id: number;
    room_id: number;
    bed_id: number;

    assigned_date: string;
    expected_checkout: string | null;

    status: "Active" | "Transferred" | "Checked-Out";

    assigned_by: number | null;

    remarks: string | null;

    created_at: string;
}

export interface AssignRoomPayload {
    user_id: number;
    room_id: number;
    bed_id: number;
    assigned_date?: string,
    expected_checkout?: string;
    remarks?: string;
}

export interface TransferAssignmentPayload {
    assignment_id: number;
    room_id: number;
    bed_id: number;
    expected_checkout?: string;
    remarks?: string;
}

export interface CheckoutAssignmentPayload {
    assignment_id: number;
}

export interface OccupancyHistory {
    assignment_id: number;

    user_id: number;
    user_id_no: string;

    first_name: string;
    last_name: string;
    email: string;
    contact_number: string;
    avatar_url: string | null;

    room_id: number;
    room_number: string;

    bed_id: number;
    bed_number: string;

    assigned_date: string;
    expected_checkout: string | null;
    actual_checkout: string | null;

    status: "Active" | "Transferred" | "Checked-Out";

    remarks: string | null;

    assigned_by: number | null;
    assigned_by_name: string | null;

}

export interface BoarderDashboard {
    room: {
        roomNumber: string;
        bedNumber: string;
        capacity: number;
    } | null;

    monthlyRate: number;

    stay: {
        months: number;
        moveInDate: string;
    } | null;

    upcomingPayment: {
        billingNo: string;
        label: string;
        billingMonth: string | null;
        amount: number;
        balance: number;
        dueDate: string;
        daysLeft: number;
        status: "Pending" | "Partial" | "Paid";
    } | null;
}

export interface UpcomingPayment {
    id: number;
    billing_no: string;
    billing_month: string;
    due_date: string;

    total_amount: number;
    paid_amount: number;
    balance: number;

    status: "Pending" | "Partial" | "Paid";

    due_label: string;
}

interface RoomAssignmentStore {
    loading: boolean;

    assignedBoarders: AssignedBoarder[];
    occupancyHistory: OccupancyHistory[];
    boarderAssignedRoom: BoarderAssignedRoom | null;
    dashboard: BoarderDashboard | null;

    upcomingPayments: UpcomingPayment[];



    assignRoom: (data: AssignRoomPayload) => Promise<boolean>;

    getAssignments: () => Promise<void>;
    transferAssignment: (data: TransferAssignmentPayload) => Promise<boolean>;
    checkoutAssignment: (assignmentId: number) => Promise<boolean>;
    getOccupancyHistory: () => Promise<void>;
    getBoarderAssignedRoom: (userId: number) => Promise<boolean>;
    getDashboard: () => Promise<boolean>;

    getUpcomingPayments: () => Promise<boolean>;


}

export const useRoomAssignmentStore = create<RoomAssignmentStore>((set) => ({

    loading: false,
    assignedBoarders: [],
    occupancyHistory: [],
    boarderAssignedRoom: null,
    dashboard: null,
    upcomingPayments: [],
    
    getUpcomingPayments: async () => {

    const { showError } = useStatusStore.getState();

    try {

        set({
            loading: true,
        });

        const res =
            await axiosInstance.get(
                "/room-assignment/get-my-upcoming-payments"
            );
        

        set({
            upcomingPayments: res.data,
        });

        return true;

    } catch (error) {

        if (axios.isAxiosError(error)) {

            showError(
                "Unable to Load Dashboard",
                error.response?.data?.message ??
                "Failed to retrieve dashboard."
            );

        } else {

            showError(
                "Unable to Load Dashboard",
                "Failed to retrieve dashboard."
            );

        }

        return false;

    } finally {

        set({
            loading: false,
        });

    }

},

    getDashboard: async () => {

    const { showError } = useStatusStore.getState();

    try {

        set({
            loading: true,
        });

        const res =
            await axiosInstance.get(
                "/room-assignment/dashboard-stats"
            );

        set({
            dashboard: res.data,
        });

        return true;

    } catch (error) {

        if (axios.isAxiosError(error)) {

            showError(
                "Unable to Load Dashboard",
                error.response?.data?.message ??
                "Failed to retrieve dashboard."
            );

        } else {

            showError(
                "Unable to Load Dashboard",
                "Failed to retrieve dashboard."
            );

        }

        return false;

    } finally {

        set({
            loading: false,
        });

    }

},

    getBoarderAssignedRoom: async (userId) => {

        const {
            showError,
        } = useStatusStore.getState();

        try {
            set({
                loading: true,
            });

            const res = await axiosInstance.get(
                `/room-assignment/boarder-assigned-room/${userId}`
            );

            set({
                boarderAssignedRoom: res.data,
            });

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Unable to Load",
                    error.response?.data?.message ??
                    "Unable to retrieve assigned room."
                );

            } else {

                showError(
                    "Unable to Load",
                    "Unable to retrieve assigned room."
                );

            }

            return false;

        } finally {

            set({
                loading: false,
            });

        }

    },
    getOccupancyHistory: async () => {
        try {

            set({
                loading: true,
            });

            const res =
                await axiosInstance.get(
                    "/room-assignment/occupancy-history"
                );

            set({
                occupancyHistory: res.data,
            });

        } catch (error) {

            console.error(error);

        } finally {

            set({
                loading: false,
            });

        }

    },

    transferAssignment: async (data) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {
            showLoading(
                "Transferring Boarder",
                "Please wait..."
            );

            set({ loading: true });

            const res = await axiosInstance.put(
                `/room-assignment/transfer/${data.assignment_id}`,
                {
                    room_id: data.room_id,
                    bed_id: data.bed_id,
                    expected_checkout: data.expected_checkout,
                    remarks: data.remarks,
                }
            );

            showSuccess(
                "Transfer Successful",
                res.data.message
            );

            set((state) => ({
                assignedBoarders: state.assignedBoarders.map((b) =>
                    b.assignment_id === data.assignment_id
                        ? res.data.assignment
                        : b
                ),
            }));

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {
                showError(
                    "Transfer Failed",
                    error.response?.data?.message
                );
            } else {
                showError(
                    "Transfer Failed",
                    "Unexpected error."
                );
            }

            return false;

        } finally {

            set({ loading: false });

        }
    },

    checkoutAssignment: async (
        assignmentId
    ) => {

        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Checking Out",
                "Please wait..."
            );

            set({ loading: true });

            const res = await axiosInstance.put(
                `/room-assignment/checkout/${assignmentId}`
            );

            showSuccess(
                "Checkout Complete",
                res.data.message
            );

            set((state) => ({
                assignedBoarders: state.assignedBoarders.filter(
                    (b) => b.assignment_id !== assignmentId
                ),
            }));

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Checkout Failed",
                    error.response?.data?.message
                );

            } else {

                showError(
                    "Checkout Failed",
                    "Unexpected error."
                );

            }

            return false;

        } finally {

            set({ loading: false });

        }
    },
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

            set((state) => ({
                assignedBoarders: [
                    ...state.assignedBoarders,
                    res.data.assignment,
                ],
            }));
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
                    "/room-assignment/get-assigned-boarders"
                );

            set({
                assignedBoarders: res.data,
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