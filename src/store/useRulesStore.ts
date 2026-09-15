import axiosInstance from "@/api/api";
import { create } from "zustand";
import { useStatusStore } from "@/store/useStatusStore";

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

interface AcknowledgmentStatus {
  acknowledgedAt: string | null;
  latestRuleUpdate: string | null;
  needsAcknowledgment: boolean;
}

interface RulesState {
  rules: Rule[];
  loading: boolean;
  PublishedRule: Rule[];
  acknowledgment: AcknowledgmentStatus | null;
  acknowledging: boolean;

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

  getPublishedRules:() => Promise<Rule | undefined>

  getAcknowledgmentStatus: () => Promise<void>;

  acknowledgeRules: () => Promise<void>;

}


export const useRulesStore = create<RulesState>((set, get) => ({
  rules: [],
  loading: false,
  PublishedRule: [],
  acknowledgment: null,
  acknowledging: false,




getPublishedRules: async () => {
  try {
    set({ loading: true });

    const res = await axiosInstance.get(
      "/rules/published"
    );

    set({
      PublishedRule: res.data,
      loading: false,
    });

  } catch (error) {
    console.error("Get published rules error:", error);

    set({
      loading: false,
    });
  }
},

  
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
    const { showLoading, showError, showSuccess } = useStatusStore.getState();

    try {
      showLoading("Loading...", "publishing rule");

      await axiosInstance.put(
        `/rules/publish/${id}`
      );

      await get().getRules();

      showSuccess("Success", "Rule published successfully.");

    } catch (error) {
      console.error(
        "Publish rule error:",
        error
      );

      showError("Error", "Failed to publish rule.");
    }
  },
  createRule: async (data) => {
    const { showLoading, showError, showSuccess } = useStatusStore.getState();

  try {
    showLoading("Loading...", "creating new House Rule");

    await axiosInstance.post(
      "/rules/create",
      data
    );

    await get().getRules();


    showSuccess("Success", "Rule created successfully.");

  } catch (error) {
    console.error(error);
    showError("Error", "Failed to create rule.");
  }
},

updateRule: async (id, data) => {
  const { showLoading, showError, showSuccess } = useStatusStore.getState();
  try {
    showLoading("Loading...", "updating rule");

    await axiosInstance.put(
      `/rules/update/${id}`,
      data
    );

    await get().getRules();

    showSuccess("Success", "Rule updated successfully.");
  } catch (error) {
    console.error(error);
    showError("Error", "Failed to update rule.");
  }
},

  deleteRule: async (id) => {
    const { showLoading, showError, showSuccess } = useStatusStore.getState();

    try {
    showLoading("Loading...", "deleting rule")

      await axiosInstance.delete(
        `/rules/delete/${id}`
      );

      set({
        rules: get().rules.filter(
          (rule) => rule.id !== id
        ),
      });


      showSuccess("Success", "Rule deleted successfully.");

    } catch (error) {
      console.error("Delete rule error:", error);
      showError("Error", "Failed to delete rule.");
    }
  },

unpublishRule: async (id) => {
  const { showLoading, showError, showSuccess } = useStatusStore.getState();

  try {
    showLoading("Loading...", "unpublishing rule");

    await axiosInstance.put(
      `/rules/unpublish/${id}`
    );

    await get().getRules();

    showSuccess("Success", "Rule unpublished successfully.");

  } catch (error) {
    console.error(
      "Unpublish rule error:",
      error
    );

    showError("Error", "Failed to unpublish rule.");
  }
},

getAcknowledgmentStatus: async () => {
  try {
    const res = await axiosInstance.get(
      "/rules/acknowledgment/status"
    );

    set({ acknowledgment: res.data });

  } catch (error) {
    console.error("Get acknowledgment status error:", error);
  }
},

acknowledgeRules: async () => {
  const { showError } = useStatusStore.getState();

  try {
    set({ acknowledging: true });

    const res = await axiosInstance.post(
      "/rules/acknowledge"
    );

    set({
      acknowledgment: {
        acknowledgedAt: res.data.acknowledgedAt,
        latestRuleUpdate: get().acknowledgment?.latestRuleUpdate ?? null,
        needsAcknowledgment: false,
      },
      acknowledging: false,
    });

  } catch (error) {
    console.error("Acknowledge rules error:", error);

    set({ acknowledging: false });

    showError("Error", "Failed to acknowledge rules.");
  }
},

}));