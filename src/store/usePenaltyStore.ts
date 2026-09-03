import { create } from "zustand";
import axiosInstance from "@/api/api";
import axios from "axios";
import { useStatusStore } from "./useStatusStore";

export type PenaltyStatus =
    | "Pending"
    | "Partially Paid"
    | "Paid"
    | "Waived";

export interface Penalty {
    penalty_id: number;

    boarder_id: number;
    first_name: string;
    last_name: string;
    email: string;

    penalty_rule_id: number | null;
    penalty_name: string | null;
    penalty_description: string | null;

    amount: number;
    amount_paid: number;
    reason: string | null;
    status: PenaltyStatus;
    penalty_date: string;
    due_date: string | null;
    settled_at: string | null;

    assigned_by: string;
    assigned_by_role: string | null;

    created_at: string;
    updated_at: string;
}

export interface PenaltySettlement {
    id: number;
    penalty_id: number;
    amount_paid: number;
    payment_date: string;
    payment_method: string | null;
    payment_reference: string | null;
    remarks: string | null;
    received_by: number | null;
    received_by_name: string | null;
    created_at: string;
}

export interface PenaltyRule {
    id: number;
    penalty_name: string;
    description: string | null;
    amount: number;
    is_active: boolean;

    created_by: number;
    first_name?: string;
    last_name?: string;

    created_at: string;
    updated_at: string;
}

interface CreatePenaltyData {
    boarder_id: number;
    penalty_rule_id?: number | null;
    amount?: number;
    reason?: string;
    due_date?: string;
}

interface UpdatePenaltyData {
    id: number;
    penalty_rule_id?: number | null;
    amount?: number;
    reason?: string;
    due_date?: string;
    status?: PenaltyStatus;
}

interface SettlePenaltyData {
    id: number;
    amount_paid: number;
    payment_date?: string;
    payment_method?: string;
    payment_reference?: string;
    remarks?: string;
}

interface CreatePenaltyRuleData {
    penalty_name: string;
    description?: string;
    amount: number;
}

interface UpdatePenaltyRuleData {
    id: number;
    penalty_name?: string;
    description?: string;
    amount?: number;
    is_active?: boolean;
}

interface PenaltyStore {
    loading: boolean;

    penalties: Penalty[];
    penaltyRules: PenaltyRule[];
    selectedPenaltyRule: PenaltyRule | null;

    myPenalties: Penalty[];
    myPenaltiesLoading: boolean;

    settlements: PenaltySettlement[];
    settlementsLoading: boolean;

    getAllPenalties: () => Promise<boolean>;
    getMyPenalties: () => Promise<boolean>;
    createPenalty: (data: CreatePenaltyData) => Promise<boolean>;
    updatePenalty: (data: UpdatePenaltyData) => Promise<boolean>;
    removePenalty: (id: number) => Promise<boolean>;
    recordPenaltySettlement: (data: SettlePenaltyData) => Promise<boolean>;
    waivePenalty: (id: number) => Promise<boolean>;
    getPenaltySettlements: (id: number) => Promise<boolean>;

    getAllPenaltyRules: () => Promise<boolean>;
    getPenaltyRuleById: (id: number) => Promise<boolean>;
    createPenaltyRule: (data: CreatePenaltyRuleData) => Promise<boolean>;
    updatePenaltyRule: (data: UpdatePenaltyRuleData) => Promise<boolean>;
    deactivatePenaltyRule: (id: number) => Promise<boolean>;
}

export const usePenaltyStore = create<PenaltyStore>((set) => ({
    loading: false,

    penalties: [],
    penaltyRules: [],
    selectedPenaltyRule: null,

    myPenalties: [],
    myPenaltiesLoading: false,

    settlements: [],
    settlementsLoading: false,

    getAllPenalties: async () => {
        const { showError } = useStatusStore.getState();

        try {
            set({ loading: true });

            const res = await axiosInstance.get(
                "/penalties/get-all"
            );

            set({
                penalties: res.data.penalties || [],
            });

            return true;

        } catch (error) {

            console.error("Get All Penalties Error:", error);
            showError("Failed to fetch penalties.");

            return false;

        } finally {

            set({ loading: false });

        }
    },

    getMyPenalties: async () => {
        try {

            set({ myPenaltiesLoading: true });

            const res = await axiosInstance.get(
                "/penalties/my"
            );

            set({
                myPenalties: res.data.penalties || [],
            });

            return true;

        } catch (error) {

            console.error("Get My Penalties Error:", error);

            return false;

        } finally {

            set({ myPenaltiesLoading: false });

        }
    },

    createPenalty: async (data) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Assigning Penalty",
                "Please wait while the penalty is being assigned..."
            );

            await axiosInstance.post(
                "/penalties/create",
                data
            );

            await usePenaltyStore.getState().getAllPenalties();

            showSuccess(
                "Penalty Assigned",
                "Penalty has been assigned successfully."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Assign Penalty Failed",
                    error.response?.data?.message ??
                    "Unable to assign penalty."
                );

            } else {

                showError(
                    "Assign Penalty Failed",
                    "Unable to assign penalty."
                );

            }

            return false;
        }
    },

    updatePenalty: async (data) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Updating Penalty",
                "Please wait while the penalty is being updated..."
            );

            const { id, ...body } = data;

            await axiosInstance.put(
                `/penalties/update/${id}`,
                body
            );

            await usePenaltyStore.getState().getAllPenalties();

            showSuccess(
                "Penalty Updated",
                "Penalty has been updated successfully."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Update Penalty Failed",
                    error.response?.data?.message ??
                    "Unable to update penalty."
                );

            } else {

                showError(
                    "Update Penalty Failed",
                    "Unable to update penalty."
                );

            }

            return false;
        }
    },

    removePenalty: async (id) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Removing Penalty",
                "Please wait while the penalty is being removed..."
            );

            await axiosInstance.delete(
                `/penalties/remove/${id}`
            );

            await usePenaltyStore.getState().getAllPenalties();

            showSuccess(
                "Penalty Removed",
                "Penalty has been removed successfully."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Remove Penalty Failed",
                    error.response?.data?.message ??
                    "Unable to remove penalty."
                );

            } else {

                showError(
                    "Remove Penalty Failed",
                    "Unable to remove penalty."
                );

            }

            return false;
        }
    },

    recordPenaltySettlement: async (data) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Recording Settlement",
                "Please wait while the settlement is being recorded..."
            );

            const { id, ...body } = data;

            await axiosInstance.put(
                `/penalties/settle/${id}`,
                body
            );

            await usePenaltyStore.getState().getAllPenalties();

            showSuccess(
                "Settlement Recorded",
                "Penalty settlement has been recorded successfully."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Record Settlement Failed",
                    error.response?.data?.message ??
                    "Unable to record settlement."
                );

            } else {

                showError(
                    "Record Settlement Failed",
                    "Unable to record settlement."
                );

            }

            return false;
        }
    },

    waivePenalty: async (id) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Waiving Penalty",
                "Please wait while the penalty is being waived..."
            );

            await axiosInstance.put(
                `/penalties/update/${id}`,
                { status: "Waived" }
            );

            await usePenaltyStore.getState().getAllPenalties();

            showSuccess(
                "Penalty Waived",
                "Penalty has been waived successfully."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Waive Penalty Failed",
                    error.response?.data?.message ??
                    "Unable to waive penalty."
                );

            } else {

                showError(
                    "Waive Penalty Failed",
                    "Unable to waive penalty."
                );

            }

            return false;
        }
    },

    getPenaltySettlements: async (id) => {
        try {

            set({ settlementsLoading: true, settlements: [] });

            const res = await axiosInstance.get(
                `/penalties/settlements/${id}`
            );

            set({
                settlements: res.data.settlements || [],
            });

            return true;

        } catch (error) {

            console.error("Get Penalty Settlements Error:", error);

            return false;

        } finally {

            set({ settlementsLoading: false });

        }
    },

    getAllPenaltyRules: async () => {
        const { showError } = useStatusStore.getState();

        try {

            set({ loading: true });

            const res = await axiosInstance.get(
                "/penalty-rules/get-all"
            );

            set({
                penaltyRules: res.data.penaltyRules || [],
            });

            return true;

        } catch (error) {

            console.error("Get All Penalty Rules Error:", error);
            showError("Failed to fetch penalty rules.");

            return false;

        } finally {

            set({ loading: false });

        }
    },

    getPenaltyRuleById: async (id) => {
        try {

            const res = await axiosInstance.get(
                `/penalty-rules/${id}`
            );

            set({
                selectedPenaltyRule: res.data.penaltyRule,
            });

            return true;

        } catch (error) {

            console.error("Get Penalty Rule By Id Error:", error);

            return false;
        }
    },

    createPenaltyRule: async (data) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Creating Penalty Rule",
                "Please wait while the penalty rule is being created..."
            );

            await axiosInstance.post(
                "/penalty-rules/create",
                data
            );

            await usePenaltyStore.getState().getAllPenaltyRules();

            showSuccess(
                "Penalty Rule Created",
                "Penalty rule has been created successfully."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Create Penalty Rule Failed",
                    error.response?.data?.message ??
                    "Unable to create penalty rule."
                );

            } else {

                showError(
                    "Create Penalty Rule Failed",
                    "Unable to create penalty rule."
                );

            }

            return false;
        }
    },

    updatePenaltyRule: async (data) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Updating Penalty Rule",
                "Please wait while the penalty rule is being updated..."
            );

            const { id, ...body } = data;

            await axiosInstance.put(
                `/penalty-rules/update/${id}`,
                body
            );

            await usePenaltyStore.getState().getAllPenaltyRules();

            showSuccess(
                "Penalty Rule Updated",
                "Penalty rule has been updated successfully."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Update Penalty Rule Failed",
                    error.response?.data?.message ??
                    "Unable to update penalty rule."
                );

            } else {

                showError(
                    "Update Penalty Rule Failed",
                    "Unable to update penalty rule."
                );

            }

            return false;
        }
    },

    deactivatePenaltyRule: async (id) => {
        const {
            showLoading,
            showSuccess,
            showError,
        } = useStatusStore.getState();

        try {

            showLoading(
                "Deactivating Penalty Rule",
                "Please wait while the penalty rule is being deactivated..."
            );

            await axiosInstance.put(
                `/penalty-rules/deactivate/${id}`
            );

            await usePenaltyStore.getState().getAllPenaltyRules();

            showSuccess(
                "Penalty Rule Deactivated",
                "Penalty rule has been deactivated successfully."
            );

            return true;

        } catch (error) {

            if (axios.isAxiosError(error)) {

                showError(
                    "Deactivate Penalty Rule Failed",
                    error.response?.data?.message ??
                    "Unable to deactivate penalty rule."
                );

            } else {

                showError(
                    "Deactivate Penalty Rule Failed",
                    "Unable to deactivate penalty rule."
                );

            }

            return false;
        }
    },

}));
