import { useBillingStore } from "@/store/useBillingStore"

export const useBilling = ( ) => {
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
        };
};