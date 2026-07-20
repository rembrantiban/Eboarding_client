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
        } = useBillingStore();
    
    return { 
            billings,
            loading, 
            getAllBillings,
            recordPayment,
            applyDiscount,
            applyLateFee,
            paymentHistory,
            getPaymentHistory
        };
};