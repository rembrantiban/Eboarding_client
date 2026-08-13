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

  };
};