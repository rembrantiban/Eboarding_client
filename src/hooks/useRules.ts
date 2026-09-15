import { useRulesStore } from "@/store/useRulesStore";

export const useRules = () => {
  const rules = useRulesStore((state) => state.rules);
  const loading = useRulesStore((state) => state.loading);
  const getRules = useRulesStore((state) => state.getRules);
  const createRule = useRulesStore((state) => state.createRule);
  const updateRule = useRulesStore((state) => state.updateRule);
  const deleteRule = useRulesStore((state) => state.deleteRule);
  const publishRule = useRulesStore((state) => state.publishRule);
  const unpublishRule = useRulesStore((state) => state.unpublishRule);
  const getPublishedRules = useRulesStore((state) => state.getPublishedRules);
  const PublishedRule = useRulesStore((state) => state.PublishedRule);
  const acknowledgment = useRulesStore((state) => state.acknowledgment);
  const acknowledging = useRulesStore((state) => state.acknowledging);
  const getAcknowledgmentStatus = useRulesStore((state) => state.getAcknowledgmentStatus);
  const acknowledgeRules = useRulesStore((state) => state.acknowledgeRules);

  return {
    rules,
    loading,
    getRules,
    createRule,
    updateRule,
    deleteRule,
    publishRule,
    unpublishRule,
    getPublishedRules,
    PublishedRule,
    acknowledgment,
    acknowledging,
    getAcknowledgmentStatus,
    acknowledgeRules,

  };
};