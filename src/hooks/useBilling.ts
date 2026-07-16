import { useBillingStore } from "@/store/useBillingStore"

export const useBilling = ( ) => {
    const { billings, loading, getAllBillings } = useBillingStore();
    
    return { 
            billings,
            loading, 
            getAllBillings 
        };
};