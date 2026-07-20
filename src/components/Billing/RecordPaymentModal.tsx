"use client";

import { useEffect, useMemo, useState } from "react";
import { Banknote, X, User, Receipt, CalendarDays } from "lucide-react";
import type { Billing } from "@/store/useBillingStore";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";


type PaymentMethod = "Cash" | "GCash" | "Bank Transfer" | "Check";

interface RecordPaymentModalProps {
    open: boolean;
    onClose: () => void;
    billing: Billing | null;
    onSubmit: (payload: {
        billing_id: number;
        amount: number;
        method: PaymentMethod;
        reference_no: string;
        remarks: string;
    }) => Promise<void> | void;
}

function formatCurrency(value: number) {
    return `₱${value.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatMonth(date: string | null) {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-PH", { month: "long", year: "numeric" });
}

const statusBadgeStyles: Record<string, string> = {
    Paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Partial: "bg-amber-50 text-amber-700 border-amber-200",
    Pending: "bg-slate-100 text-slate-700 border-slate-200",
    Overdue: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function RecordPaymentModal({
    open,
    onClose,
    billing,
    onSubmit,
}: RecordPaymentModalProps) {
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState<PaymentMethod>("Cash");
    const [referenceNo, setReferenceNo] = useState("");
    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!open) return;
        setAmount("");
        setMethod("Cash");
        setReferenceNo("");
        setRemarks("");
    }, [open, billing?.id]);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [open, onClose]);

    const amountPaid = Number(amount) || 0;

    const { newPaidAmount, remainingBalance, newStatus } = useMemo(() => {
        if (!billing) {
            return {
                newPaidAmount: 0,
                remainingBalance: 0,
                newStatus: "Pending",
            };
        }

        const totalAmount = Number(billing.total_amount);
        const paidAmount = Number(billing.paid_amount);
        const payment = Number(amount) || 0;

        const paid = paidAmount + payment;
        const remaining = Math.max(0, totalAmount - paid);

        const status =
            remaining === 0
                ? "Paid"
                : paid > 0
                    ? "Partial"
                    : "Pending";

        return {
            newPaidAmount: paid,
            remainingBalance: remaining,
            newStatus: status,
        };
    }, [billing, amount]);

    const isValid = billing !== null && amountPaid > 0 && amountPaid <= billing.balance;

    const handleSubmit = async () => {
        if (!billing || !isValid) return;
        setIsSubmitting(true);
        try {
            await onSubmit({
                billing_id: billing.id,
                amount: amountPaid,
                method,
                reference_no: referenceNo,
                remarks,
            });
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open || !billing) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

            {/* Overlay */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative flex w-full max-w-2xl max-h-[90vh] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200">

                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <Banknote size={16} />
                        </span>
                        <h2 className="text-base font-semibold text-slate-900">Record Payment</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="overflow-y-auto px-5 py-5">

                    {/* Boarder Information */}
                    <div>
                        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            <User size={12} />
                            Boarder Information
                        </p>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                            <p className="text-sm font-semibold text-slate-900">
                                {billing.first_name} {billing.last_name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Room {billing.room_number} &middot; Bed {billing.bed_number}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Receipt size={11} />
                                    {billing.billing_no}
                                </span>
                                <span className="flex items-center gap-1">
                                    <CalendarDays size={11} />
                                    {formatMonth(billing.billing_month)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Summary */}
                    <div className="mt-4">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Payment Summary
                        </p>
                        <div className="space-y-1.5 rounded-xl border border-slate-100 p-3.5 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Total Bill</span>
                                <span className="font-medium text-slate-900">{formatCurrency(billing.total_amount)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Already Paid</span>
                                <span className="font-medium text-slate-900">{formatCurrency(billing.paid_amount)}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                                <span className="text-slate-500">Remaining Balance</span>
                                <span className="font-semibold text-slate-900">{formatCurrency(billing.balance)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="mt-4 space-y-3.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Payment Details
                        </p>

                        <div>
                            <label className="mb-1.5 block text-xs font-medium text-slate-600">Amount Paid</label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                                    ₱
                                </span>
                                <Input
                                    type="number"
                                    inputMode="decimal"
                                    min={0}
                                    max={billing.balance}
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="h-10 rounded-xl pl-7 text-sm"
                                />
                            </div>
                            {amountPaid > billing.balance && (
                                <p className="mt-1 text-xs text-rose-600">
                                    Amount can&apos;t exceed the remaining balance.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* After Payment preview */}
                    <div className="mt-4">
                        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            After Payment
                        </p>
                        <div className="space-y-1.5 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">New Paid Amount</span>
                                <span className="font-medium text-slate-900">{formatCurrency(newPaidAmount)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Remaining Balance</span>
                                <span className="font-medium text-slate-900">{formatCurrency(remainingBalance)}</span>
                            </div>
                            <div className="flex items-center justify-between border-t border-emerald-100 pt-1.5">
                                <span className="text-slate-500">New Status</span>
                                <Badge className={`rounded-full border font-medium ${statusBadgeStyles[newStatus] ?? statusBadgeStyles.Pending}`}>
                                    {newStatus}
                                </Badge>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="flex shrink-0 justify-end gap-2.5 border-t border-slate-100 px-5 py-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="h-9 rounded-xl text-sm font-medium text-slate-600"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={!isValid || isSubmitting}
                        className="h-9 rounded-xl bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400"
                    >
                        {isSubmitting ? "Recording..." : "Record Payment"}
                    </Button>
                </div>

            </div>
        </div>
    );
}