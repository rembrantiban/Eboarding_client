import { useEffect } from "react";

import BillingStats from "@/components/Billing/BillingStats";
import BillingTable from "@/components/Billing/BillingTable";
import { useBillingStore } from "@/store/useBillingStore";

const Billing = () => {

    const {
        loading,
        billings,
        getAllBillings,
    } = useBillingStore();

    useEffect(() => {
        getAllBillings();
    }, [getAllBillings]);

    // Temporary until you build a backend stats endpoint
    const stats = {
        total_billings: billings.reduce(
            (sum, b) => sum + Number(b.total_amount),
            0
        ),

        total_billings_period_label: "All Billings",

        paid_amount: billings
            .filter((b) => b.status === "Paid")
            .reduce(
                (sum, b) => sum + Number(b.paid_amount),
                0
            ),

        paid_percentage: 0,

        partial_amount: billings
            .filter((b) => b.status === "Partial")
            .reduce(
                (sum, b) => sum + Number(b.paid_amount),
                0
            ),

        partial_percentage: 0,

        overdue_amount: billings
            .filter((b) => b.status === "Overdue")
            .reduce(
                (sum, b) => sum + Number(b.balance),
                0
            ),

        overdue_percentage: 0,
    };

    return (
        <div className="h-full overflow-hidden">

            <div className="space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 pt-10 pb-15 h-screen overflow-auto">

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                    <h1 className="text-2xl font-bold text-slate-900">
                        Billing & Payment Management
                    </h1>

                    <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-500">
                        Track boarder billings, monitor payment progress,
                        record payments, manage discounts and penalties,
                        generate billing statements, and issue official
                        receipts from a centralized billing dashboard.
                    </p>

                </div>

                <BillingStats
                    data={stats}
                    loading={loading}
                />

                <BillingTable
                    billings={billings}
                    loading={loading}
                />

            </div>

        </div>
    );
};

export default Billing;