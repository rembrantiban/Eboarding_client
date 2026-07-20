import PaymentHistoryList from "@/components/History/PaymentHistory";
import { useBilling } from "@/hooks/useBilling";
import { useEffect } from "react";

const History = () => {
    const {
        paymentHistory,
        loading,
        getPaymentHistory
    } = useBilling();

    useEffect(() => {
        getPaymentHistory();
        //eslint-disable-next-line
    }, []);

    return (
        <PaymentHistoryList
            payments={paymentHistory}
            loading={loading}
        />
    );
};

export default History;