import { useEffect, useState } from "react";
import { Receipt } from "lucide-react";

import BillingStats from "@/components/Billing/BillingStats";
import BillingTable from "@/components/Billing/BillingTable";
import { useBillingStore } from "@/store/useBillingStore";
import RecordPaymentModal from "@/components/Billing/RecordPaymentModal";
import type { Billing as BillingType } from "@/store/useBillingStore";
import ApplyDiscountModal from "@/components/Billing/ApplyDiscountModal";
import ApplyLateFeeModal from "@/components/Billing/ApplyLateFeeModal";
import ViewBilling from "@/components/Billing/ViewBillingModal"
import CancelBillingModal from "@/components/Billing/CancelBillingModal";
import UpdateBillingModal from "@/components/Billing/UpdateBillingModal";
import OfficialReceiptModal from "@/components/Billing/OfficialReceiptModal";
import type { PaymentHistory } from "@/store/useBillingStore";

const Billing = () => {

    const {
        loading,
        billings,
        getAllBillings,
        recordPayment,
        applyLateFee,
        applyDiscount,
        cancelBilling,
        updateBillingInfo,
        getPaymentHistory,
        paymentHistory,
    } = useBillingStore();
    const [selectedBilling, setSelectedBilling] = useState<BillingType | null>(null);
    const [paymentOpen, setPaymentOpen] = useState(false);

    const [discountOpen, setDiscountOpen] = useState(false);
    const [lateFeeOpen, setLateFeeOpen] = useState(false);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [updateOpen, setUpdateOpen] = useState(false);

    const [officialReceipt, setOfficialReceipt] = useState<PaymentHistory | null>(null);

    const [viewOpen, setViewOpen] = useState(false);

    useEffect(() => {
        getAllBillings();
        getPaymentHistory();
    }, [getAllBillings, getPaymentHistory]);

    const openReceiptFor = (billing: BillingType) => {
        const latest = paymentHistory
            .filter((p) => p.billing_id === billing.id)
            .sort(
                (a, b) => new Date(b.received_at).getTime() - new Date(a.received_at).getTime()
            )[0];

        if (latest) setOfficialReceipt(latest);
    };

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

            <div className="h-screen space-y-4 overflow-auto rounded-tl-2xl border-l-2 border-t-2 px-4 pb-16 pt-3">

                {/* Page header */}
                <div className="flex items-start gap-3 border-b border-slate-100 pb-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <Receipt className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-base font-semibold tracking-tight text-slate-900">
                            Billing &amp; Payments
                        </h1>
                        <p className="mt-0.5 max-w-2xl text-[12px] leading-5 text-slate-500">
                            Track boarder billings, record payments, manage discounts and
                            penalties, and issue receipts from one place.
                        </p>
                    </div>
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
                    onUpdateBilling={(billing) => {
                        setSelectedBilling(billing);
                        setUpdateOpen(true);
                    }}
                    onApplyDiscount={(billing) => {
                        setSelectedBilling(billing);
                        setDiscountOpen(true);
                    }}

                    onApplyLateFee={(billing) => {
                        setSelectedBilling(billing);
                        setLateFeeOpen(true);
                    }}

                    onViewBilling={(billing) => {
                        setSelectedBilling(billing);
                        setViewOpen(true);
                    }}

                    onCancelBilling={(billing) => {
                        setSelectedBilling(billing);
                        setCancelOpen(true);
                    }}

                    onGenerateReceipt={openReceiptFor}
                />
                <RecordPaymentModal
                    open={paymentOpen}
                    billing={selectedBilling}
                    onClose={() => {
                        setPaymentOpen(false);
                        setSelectedBilling(null);
                    }}
                    onSubmit={async (data) => {
                        const success = await recordPayment({
                            billingId: data.billing_id,
                            amount: data.amount,
                        });

                        if (success) {
                            await getPaymentHistory();
                            const latest = useBillingStore.getState().paymentHistory[0];
                            if (latest?.billing_id === data.billing_id) {
                                setOfficialReceipt(latest);
                            }
                        }
                    }}
                />

                <OfficialReceiptModal
                    payment={officialReceipt}
                    onClose={() => setOfficialReceipt(null)}
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

                <ViewBilling
                    open={viewOpen}
                    onOpenChange={(open) => {
                        setViewOpen(open);

                        if (!open) {
                            setSelectedBilling(null);
                        }
                    }}
                    billing={selectedBilling}
                    onRecordPayment={(billing) => {
                        setViewOpen(false);
                        setSelectedBilling(billing);
                        setPaymentOpen(true);
                    }}
                    onApplyDiscount={(billing) => {
                        setViewOpen(false);
                        setSelectedBilling(billing);
                        setDiscountOpen(true);
                    }}
                    onApplyLateFee={(billing) => {
                        setViewOpen(false);
                        setSelectedBilling(billing);
                        setLateFeeOpen(true);
                    }}
                    onGenerateReceipt={openReceiptFor}
                />

                <CancelBillingModal
                    open={cancelOpen}
                    billing={selectedBilling}
                    onOpenChange={(open) => {
                        setCancelOpen(open);
                        if (!open) setSelectedBilling(null);
                    }}
                    onConfirm={async ({ billingId, reason, notes }) => {
                        await cancelBilling({
                            billingId: Number(billingId),
                            reason,
                            notes,
                        });
                    }}
                />

                <UpdateBillingModal
                    open={updateOpen}
                    billing={selectedBilling}
                    onOpenChange={(open) => {
                        setUpdateOpen(open);
                        if (!open) setSelectedBilling(null);
                    }}
                    onSubmit={async (payload) => {
                        if (!selectedBilling) return;

                        const success = await updateBillingInfo({
                            billingId: selectedBilling.id,
                            ...payload,
                        });

                        if (success) {
                            setUpdateOpen(false);
                            setSelectedBilling(null);
                        }
                    }}
                />
            </div>

        </div>
    );
};

export default Billing;