"use client";

import {
    X,
    Receipt,
    CalendarClock,
    BedDouble,
    BanknoteArrowDown,
    BanknoteArrowUp,
    Tag,
    Printer,
    User,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Billing } from "@/store/useBillingStore";

export type BillingStatus = "Pending" | "Paid" | "Partial" | "Overdue" | "Cancelled";

interface ViewBillingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    billing: Billing | null;
    onRecordPayment?: (billing: Billing) => void;
    onApplyDiscount?: (billing: Billing) => void;
    onApplyLateFee?: (billing: Billing) => void;
    onPrint?: (billing: Billing) => void;
}

function formatCurrency(value: number) {
    return `₱${value.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

function formatDate(date: string | null | undefined) {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-PH", {
        month: "long",
        day: "2-digit",
        year: "numeric",
    });
}

const STATUS_STYLES: Record<BillingStatus, string> = {
    Pending: "bg-slate-900 text-slate-100 hover:bg-slate-900",
    Paid: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    Partial: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    Overdue: "bg-rose-50 text-rose-600 hover:bg-rose-50",
    Cancelled: "bg-slate-50 text-slate-600 hover:bg-slate-50",
};

export default function ViewBillingModal({
    open,
    onOpenChange,
    billing,
    onRecordPayment,
    onApplyDiscount,
    onApplyLateFee,
    onPrint,
}: ViewBillingModalProps) {
    if (!billing) return null;

    // TODO: wire up once the Billing type/store exposes a late fee field.
    const lateFee = (billing as unknown as { late_fee?: number }).late_fee ?? 0;

    const status = billing.status as BillingStatus;
    const total = Number(billing.total_amount);
    const paid = Number(billing.paid_amount);
    const balance = Number(billing.balance);
    const discount = Number(billing.discount);

    const paidPercent = total > 0 ? Math.min(100, Math.round((paid / total) * 100)) : 0;

    function handleClose() {
        onOpenChange(false);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="gap-0 overflow-hidden rounded-2xl border border-slate-100 p-0 sm:max-w-2xl"
            >
                {/* Header */}
                <DialogHeader className="flex-row items-center justify-between space-y-0 border-b border-slate-100 px-5 py-4">
                    <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-slate-100">
                            <Receipt className="h-4 w-4" />
                        </span>
                        Billing Details
                    </DialogTitle>
                    <button
                        onClick={handleClose}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </DialogHeader>

                {/* Body */}
                <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-5">
                    {/* Billing identity strip */}
                    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Billing No.
                            </p>
                            <p className="mt-0.5 text-sm font-semibold text-slate-900">
                                {billing.billing_no}
                            </p>
                        </div>
                        <Badge className={`rounded-full font-medium ${STATUS_STYLES[status]}`}>
                            {status}
                        </Badge>
                    </div>

                    {/* Boarder information */}
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Boarder Information
                        </p>
                        <div className="rounded-xl border border-slate-100 px-4 py-3.5">
                            <div className="flex items-start gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
                                    <User className="h-4 w-4" />
                                </span>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {billing.first_name} {billing.last_name}
                                    </p>
                                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                                        <BedDouble className="h-3.5 w-3.5" />
                                        Room {billing.room_number} · Bed {billing.bed_number}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Billing period */}
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Billing Period
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="rounded-xl border border-slate-100 px-4 py-3">
                                <p className="text-xs text-slate-400">Billing Month</p>
                                <p className="mt-0.5 text-sm font-medium text-slate-900">
                                    {formatDate(billing.billing_month)}
                                </p>
                            </div>
                            <div className="rounded-xl border border-slate-100 px-4 py-3">
                                <p className="flex items-center gap-1 text-xs text-slate-400">
                                    <CalendarClock className="h-3 w-3" />
                                    Due Date
                                </p>
                                <p className="mt-0.5 text-sm font-medium text-slate-900">
                                    {formatDate(billing.due_date)}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment progress */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Payment Progress
                            </p>
                            <span className="text-xs font-medium text-slate-500">
                                {paidPercent}% paid
                            </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{ width: `${paidPercent}%` }}
                            />
                        </div>
                    </div>

                    {/* Financial summary */}
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Financial Summary
                        </p>
                        <div className="space-y-1.5 rounded-xl border border-slate-100 px-4 py-3.5 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Total Amount</span>
                                <span className="font-medium text-slate-900">
                                    {formatCurrency(total)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">Amount Paid</span>
                                <span className="font-medium text-emerald-600">
                                    {formatCurrency(paid)}
                                </span>
                            </div>
                            {discount > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Discount</span>
                                    <span className="font-medium text-blue-600">
                                        -{formatCurrency(discount)}
                                    </span>
                                </div>
                            )}
                            {lateFee > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500">Late Fee</span>
                                    <span className="font-medium text-rose-600">
                                        +{formatCurrency(lateFee)}
                                    </span>
                                </div>
                            )}
                            <div className="mt-1.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
                                <span className="font-medium text-slate-700">Balance Due</span>
                                <span className="text-base font-semibold text-slate-900">
                                    {formatCurrency(balance)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="flex-col gap-2 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-between">
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={() => onPrint?.(billing)}
                            className="h-9 rounded-xl text-sm font-medium text-slate-600"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onApplyDiscount?.(billing)}
                            className="h-9 rounded-xl text-sm font-medium text-blue-600"
                        >
                            <Tag className="h-3.5 w-3.5" />
                            Discount
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => onApplyLateFee?.(billing)}
                            className="h-9 rounded-xl text-sm font-medium text-rose-600"
                        >
                            <BanknoteArrowUp className="h-3.5 w-3.5" />
                            Late Fee
                        </Button>
                    </div>
                    <Button
                        onClick={() => onRecordPayment?.(billing)}
                        className="h-9 rounded-xl bg-emerald-600 text-sm font-medium text-white hover:bg-emerald-700"
                    >
                        <BanknoteArrowDown className="h-3.5 w-3.5" />
                        Record Payment
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}