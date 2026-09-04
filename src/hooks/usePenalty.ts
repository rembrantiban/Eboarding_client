import { usePenaltyStore } from "@/store/usePenaltyStore";

export const usePenalty = () => {
    const {
        loading,

        penalties,
        getAllPenalties,
        createPenalty,
        updatePenalty,
        removePenalty,
        recordPenaltySettlement,
        waivePenalty,

        myPenalties,
        myPenaltiesLoading,
        getMyPenalties,

        myPenaltyRecords,
        myPenaltyRecordsLoading,
        getMyPenaltyRecords,

        settlements,
        settlementsLoading,
        getPenaltySettlements,

        penaltyRules,
        selectedPenaltyRule,
        getAllPenaltyRules,
        getPenaltyRuleById,
        createPenaltyRule,
        updatePenaltyRule,
        deactivatePenaltyRule,

    } = usePenaltyStore();

    return {
        loading,

        penalties,
        getAllPenalties,
        createPenalty,
        updatePenalty,
        removePenalty,
        recordPenaltySettlement,
        waivePenalty,

        myPenalties,
        myPenaltiesLoading,
        getMyPenalties,

        myPenaltyRecords,
        myPenaltyRecordsLoading,
        getMyPenaltyRecords,

        settlements,
        settlementsLoading,
        getPenaltySettlements,

        penaltyRules,
        selectedPenaltyRule,
        getAllPenaltyRules,
        getPenaltyRuleById,
        createPenaltyRule,
        updatePenaltyRule,
        deactivatePenaltyRule,

    };
};
