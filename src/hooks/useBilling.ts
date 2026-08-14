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

    };
};