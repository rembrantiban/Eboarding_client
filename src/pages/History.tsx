import PaymentHistoryList from "@/components/History/PaymentHistory";
import { useBilling } from "@/hooks/useBilling";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Navigate } from "react-router-dom";

const History = () => {
    const { user } = useAuth();
    const {
        paymentHistory,
        loading,
        getPaymentHistory
    } = useBilling();

    useEffect(() => {
        getPaymentHistory();
        //eslint-disable-next-line
    }, []);

    // Billing history is Admin-only — Staff share this route group.
    if (user && user.user_type !== "Admin") {
        return <Navigate to="/staff-dashboard" replace />
    }

    return (
        <PaymentHistoryList
            payments={paymentHistory}
            loading={loading}
        />
    );
};

export default History;