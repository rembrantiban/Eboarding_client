import { useBillingStore } from "@/store/useBillingStore"

export const useBilling = () => {
    const { billings,
        loading,
        getAllBillings,
        recordPayment,
        applyDiscount,
        applyLateFee,
        paymentHistory,
        getPaymentHistory,
        outstandingBalance,
        getOutstandingBalance,
        getMyPendingBilling,
        myPendingBilling,
        myPaymentHistory,
        myPaymentSummary,
        getMyPaymentHistory,
        paymentsOverview,
        getPaymentsOverview,
        calendarEvents,
        getCalendarEvents,
        activePenalties,
        getActivePenalties,
        cancelBilling,
        getBillingStats,
        billingStats,

        incomeMix,
        getIncomeMix,

        revenueTrend,
        getRevenueTrend,


        detailedSummary,
        getDetailedSummary,


        //Collection Report 
        collectionDashboardStats,
        getCollectionDashboardStats,

        collectionTrend,
        getCollectionTrend,


        recentTransactions,
        getRecentTransactions,

        boarderBillingStatus,
        getBoarderBillingStatus,

        collectionSummary,
        getCollectionSummary,


        //Boarder Report
        getBoarderPaymentSummary,
        boarderPaymentSummary,
        getMyRecentPayments,
        recentPayments,


    } = useBillingStore();

    return {
        billings,
        loading,
        getAllBillings,
        recordPayment,
        applyDiscount,
        applyLateFee,
        paymentHistory,
        getPaymentHistory,
        outstandingBalance,
        getOutstandingBalance,
        getMyPendingBilling,
        myPendingBilling,
        myPaymentHistory,
        myPaymentSummary,
        getMyPaymentHistory,
        paymentsOverview,
        getPaymentsOverview,
        calendarEvents,
        getCalendarEvents,
        activePenalties,
        getActivePenalties,
        cancelBilling,
        getBillingStats,
        billingStats,

        incomeMix,
        getIncomeMix,

        revenueTrend,
        getRevenueTrend,

        detailedSummary,
        getDetailedSummary,

        collectionDashboardStats,
        getCollectionDashboardStats,

        collectionTrend,
        getCollectionTrend,

        recentTransactions,
        getRecentTransactions,

        boarderBillingStatus,
        getBoarderBillingStatus,

        collectionSummary,
        getCollectionSummary,

        getBoarderPaymentSummary,
        boarderPaymentSummary,
        getMyRecentPayments,
        recentPayments,


    };
};