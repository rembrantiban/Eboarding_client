import axiosInstance from "@/api/api";
import { create } from "zustand";

export interface Rule {
  id: number;
  title: string;
  description: string;
  is_active: boolean;

  created_by: number;

  first_name?: string;
  last_name?: string;

  created_at: string;
  updated_at: string;
}

interface CreateRulePayload {
  title: string;
  description: string;
}

interface UpdateRulePayload {
  title: string;
  description: string;
  is_active?: boolean;
}

interface RulesState {
  rules: Rule[];
  loading: boolean;

  getRules: () => Promise<void>;

  createRule: (
    data: CreateRulePayload
  ) => Promise<void>;

  updateRule: (
    id: number,
    dataRule: UpdateRulePayload
  ) => Promise<void>;

  deleteRule: (
    id: number
  ) => Promise<void>;
}

export const useRulesStore = create<RulesState>((set, get) => ({
  rules: [],
  loading: false,


  getRules: async () => {
    try {
      set({ loading: true });

      const res = await axiosInstance.get(
        "/rules/getAllRules"
      );

      set({
        rules: res.data,
        loading: false,
      });

    } catch (error) {
      console.error("Get rules error:", error);

      set({ loading: false });
    }
  },

  createRule: async (data) => {
    try {
      await axiosInstance.post(
        "/rules/create",
        data
      );

      await get().getRules();

    } catch (error) {
      console.error("Create rule error:", error);
    }
  },


  updateRule: async (id, dataRule) => {
    try {
      await axiosInstance.put(
        `/rules/update/${id}`,
        dataRule
      );

      await get().getRules();

    } catch (error) {
      console.error("Update rule error:", error);
    }
  },


  deleteRule: async (id) => {
    try {
      await axiosInstance.delete(
        `/rules/delete/${id}`
      );

      set({
        rules: get().rules.filter(
          (rule) => rule.id !== id
        ),
      });

    } catch (error) {
      console.error("Delete rule error:", error);
    }
  },
}));