import { useEffect, useState } from "react";

import BillingStats from "@/components/Billing/BillingStats";
import BillingTable from "@/components/Billing/BillingTable";
import { useBillingStore } from "@/store/useBillingStore";
import RecordPaymentModal from "@/components/Billing/RecordPaymentModal";
import type { Billing as BillingType } from "@/store/useBillingStore";
import ApplyDiscountModal from "@/components/Billing/ApplyDiscountModal";
import ApplyLateFeeModal from "@/components/Billing/ApplyLateFeeModal";

const Billing = () => {

    const {
        loading,
        billings,
        getAllBillings,
        recordPayment,
        applyLateFee,
        applyDiscount,
    } = useBillingStore();
    const [selectedBilling, setSelectedBilling] = useState<BillingType | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);

    const [discountOpen, setDiscountOpen] = useState(false);
    const [lateFeeOpen, setLateFeeOpen] = useState(false);

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

            <div className="space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 pt-2 pb-15 h-screen overflow-auto">

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
                    onRecordPayment={(billing) => {
                        setSelectedBilling(billing);
                        setPaymentOpen(true);
                    }}
                    onApplyDiscount={(billing) => {
                        setSelectedBilling(billing);
                        setDiscountOpen(true);
                    }}

                    onApplyLateFee={(billing) => {
                        setSelectedBilling(billing);
                        setLateFeeOpen(true);
                    }}
                />
                <RecordPaymentModal
                    open={paymentOpen}
                    billing={selectedBilling}
                    onClose={() => {
                        setPaymentOpen(false);
                        setSelectedBilling(null);
                    }}
                    onSubmit={async (data) => {
                        await recordPayment({
                            billingId: data.billing_id,
                            amount: data.amount,
                        });
                    }}
                />

                <ApplyDiscountModal
                    open={discountOpen}
                    onOpenChange={setDiscountOpen}
                    boarder={{
                        first_name: selectedBilling?.first_name ?? "",
                        last_name: selectedBilling?.last_name ?? "",
                        room_number: selectedBilling?.room_number ?? "",
                        bed_number: selectedBilling?.bed_number ?? "",
                        billing_no: selectedBilling?.billing_no ?? "",
                        billing_month: selectedBilling?.billing_month ?? "",
                    }}
                    totalAmount={selectedBilling?.total_amount ?? 0}
                    currentDiscount={selectedBilling?.discount ?? 0}
                    balance={selectedBilling?.balance ?? 0}
                    status={selectedBilling?.status ?? "Pending"}
                    onApply={async (discount) => {
                        if (!selectedBilling) return;

                        const success = await applyDiscount({
                            billingId: selectedBilling.id,
                            discount,
                        });

                        if (success) {
                            setDiscountOpen(false);
                            setSelectedBilling(null);
                        }
                    }}
                />

                <ApplyLateFeeModal
                    open={lateFeeOpen}
                    onOpenChange={setLateFeeOpen}
                    boarder={{
                        first_name: selectedBilling?.first_name ?? "",
                        last_name: selectedBilling?.last_name ?? "",
                        room_number: selectedBilling?.room_number ?? "",
                        bed_number: selectedBilling?.bed_number ?? "",
                        billing_no: selectedBilling?.billing_no ?? "",
                        billing_month: selectedBilling?.billing_month ?? "",
                    }}
                    dueDate={
                        selectedBilling?.due_date
                            ? new Date(selectedBilling.due_date).toLocaleDateString(
                                "en-PH",
                                {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                }
                            )
                            : ""
                    }
                    totalAmount={selectedBilling?.total_amount ?? 0}
                    currentLateFee={selectedBilling?.late_fee ?? 0}
                    balance={selectedBilling?.balance ?? 0}
                    status={selectedBilling?.status ?? "Pending"}
                    onApply={async (lateFee) => {
                        if (!selectedBilling) return;

                        const success = await applyLateFee({
                            billingId: selectedBilling.id,
                            lateFee,
                        });

                        if (success) {
                            setLateFeeOpen(false);
                            setSelectedBilling(null);
                        }
                    }}
                />

            </div>

        </div>
    );
};

export default Billing;