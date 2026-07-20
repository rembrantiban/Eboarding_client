import axiosInstance from "@/api/api";
import { create } from "zustand";

export interface Rule {
  id: number;
  title: string;
  description: string;

  status: "Published" | "Unpublished";

  created_by: number;

  first_name?: string;
  last_name?: string;

  created_at: string;
  updated_at: string;
}

interface CreateRulePayload {
  title: string;
  description: string;
  status?: "Published" | "Unpublished";
}

interface UpdateRulePayload {
  title: string;
  description: string;
  status: "Published" | "Unpublished";
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
    data: UpdateRulePayload
  ) => Promise<void>;

  deleteRule: (
    id: number
  ) => Promise<void>;

  publishRule: (
    id: number
  ) => Promise<void>;

  unpublishRule: (
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
      "/rules/getallRules"
    );

    set({
      rules: res.data,
      loading: false,
    });

  } catch (error) {

    console.error("Get rules error:", error);

    set({
      loading: false,
    });

  }
},

  publishRule: async (id) => {
    try {
      await axiosInstance.put(
        `/rules/publish/${id}`
      );

      await get().getRules();

    } catch (error) {
      console.error(
        "Publish rule error:",
        error
      );
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
    console.error(error);
  }
},

updateRule: async (id, data) => {
  try {
    await axiosInstance.put(
      `/rules/update/${id}`,
      data
    );

    await get().getRules();

  } catch (error) {
    console.error(error);
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

unpublishRule: async (id) => {
  try {
    await axiosInstance.put(
      `/rules/unpublish/${id}`
    );

    await get().getRules();

  } catch (error) {
    console.error(
      "Unpublish rule error:",
      error
    );
  }
},

}));