"use client";

import { useState } from "react";
import { BanknoteArrowUp, X, TriangleAlert, ShieldAlert } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export type BillingStatus = "Upcoming" | "Pending" | "Paid" | "Partial" | "Overdue" | "Cancelled";

interface ApplyLateFeeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    boarder: {
        first_name: string;
        last_name: string;
        room_number: string;
        bed_number: string;
        billing_no: string;
        billing_month: string;
    };
    dueDate: string;
    totalAmount: number;
    currentLateFee: number;
    balance: number;
    status: BillingStatus;
    onApply?: (lateFee: number) => void;
}

function formatCurrency(value: number) {
    return `₱${value.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

const STATUS_STYLES: Record<BillingStatus, string> = {
    Upcoming: "bg-blue-50 text-blue-600 hover:bg-blue-50",
    Pending: "bg-slate-900 text-slate-100 hover:bg-slate-900",
    Paid: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    Partial: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    Overdue: "bg-rose-50 text-rose-600 hover:bg-rose-50",
    Cancelled: "bg-slate-50 text-slate-600 hover:bg-slate-50",
};

const QUICK_AMOUNTS = [100, 200, 500];

export default function ApplyLateFeeModal({
    open,
    onOpenChange,
    boarder,
    dueDate,
    totalAmount,
    currentLateFee,
    balance,
    status,
    onApply,
}: ApplyLateFeeModalProps) {
    const [lateFee, setLateFee] = useState<string>("");

    const feeValue = Math.max(Number(lateFee) || 0, 0);

    const total = Number(totalAmount);
    const currentBalance = Number(balance);

    const newTotal = total + feeValue;
    const newBalance = currentBalance + feeValue;

    const isOverdue = status === "Overdue";

    function handleApply() {
        onApply?.(feeValue);
        onOpenChange(false);
        setLateFee("");
    }

    function handleClose() {
        onOpenChange(false);
        setLateFee("");
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
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                            <BanknoteArrowUp className="h-4 w-4" />
                        </span>
                        Apply Late Payment Fee
                    </DialogTitle>
                    <button
                        onClick={handleClose}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </DialogHeader>

                {!isOverdue ? (
                    /* Blocked state — status isn't Overdue */
                    <>
                        <div className="flex flex-col items-center px-6 py-12 text-center">
                            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-slate-100">
                                <ShieldAlert className="h-8 w-8" />
                            </span>
                            <h3 className="text-base font-semibold text-rose-900">
                                Oops, Sorry!
                            </h3>
                            <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-slate-500">
                                You cannot apply a late fee to this billing. Late fees can
                                only be applied when the payment status is{" "}
                                <span className="font-medium text-rose-700">Overdue</span>.
                            </p>

                            <div className="mt-6 w-full max-w-xs rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5 text-left">
                                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Current Status
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-600">
                                      Billing No.  {boarder.billing_no}
                                    </span>
                                    <Badge
                                        className={`rounded-full font-medium ${STATUS_STYLES[status]}`}
                                    >
                                        {status}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="border-t border-slate-100 px-5 py-4 sm:justify-end">
                            <Button
                                onClick={handleClose}
                                className="h-9 rounded-xl bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
                            >
                                Got it
                            </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <>
                        {/* Body */}
                        <div className="max-h-[75vh] space-y-5 overflow-y-auto px-5 py-5">
                            {/* Boarder information */}
                            <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Boarder Information
                                </p>
                                <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5">
                                    <p className="text-sm font-semibold text-slate-900">
                                        {boarder.first_name} {boarder.last_name}
                                    </p>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        Room {boarder.room_number} · Bed {boarder.bed_number}
                                    </p>
                                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                                        <span className="font-medium text-slate-600">
                                            {boarder.billing_no}
                                        </span>
                                        <span>{boarder.billing_month}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Overdue notice */}
                            <div className="flex items-start gap-2.5 rounded-xl border border-rose-100 bg-rose-50/60 px-4 py-3">
                                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" />
                                <p className="text-xs leading-relaxed text-rose-700">
                                    Payment was due on{" "}
                                    <span className="font-medium">{dueDate}</span>. Applying a
                                    late fee will increase the total amount and balance for
                                    this billing.
                                </p>
                            </div>

                            {/* Current billing */}
                            <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Current Billing
                                </p>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Total Amount</span>
                                        <span className="font-medium text-slate-900">
                                            {formatCurrency(totalAmount)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Current Late Fee</span>
                                        <span className="font-medium text-slate-900">
                                            {formatCurrency(currentLateFee)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500">Balance</span>
                                        <span className="font-medium text-slate-900">
                                            {formatCurrency(balance)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Late fee input */}
                            <div>
                                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                                    Late Fee Details
                                </p>
                                <div className="relative">
                                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                                        ₱
                                    </span>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={lateFee}
                                        onChange={(e) => setLateFee(e.target.value)}
                                        placeholder="0.00"
                                        className="h-11 rounded-xl pl-8 text-sm font-medium"
                                    />
                                </div>
                                <div className="mt-2 flex gap-1.5">
                                    {QUICK_AMOUNTS.map((amount) => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => setLateFee(String(amount))}
                                            className="rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100"
                                        >
                                            +{formatCurrency(amount)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* After fee summary */}
                            <div className="rounded-xl border border-rose-100 bg-rose-50/40 px-4 py-3.5">
                                <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-rose-600">
                                    After Late Fee
                                </p>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">Late Fee</span>
                                        <span className="font-medium text-rose-600">
                                            +{formatCurrency(feeValue)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">New Total Amount</span>
                                        <span className="font-medium text-slate-900">
                                            {formatCurrency(newTotal)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-600">New Balance</span>
                                        <span className="font-medium text-slate-900">
                                            {formatCurrency(newBalance)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-1">
                                        <span className="text-slate-600">Status</span>
                                        <Badge
                                            className={`rounded-full font-medium ${STATUS_STYLES.Overdue}`}
                                        >
                                            Overdue
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <DialogFooter className="border-t border-slate-100 px-5 py-4 sm:justify-end">
                            <Button
                                variant="outline"
                                onClick={handleClose}
                                className="h-9 rounded-xl text-sm font-medium text-slate-600"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleApply}
                                disabled={feeValue <= 0}
                                className="h-9 rounded-xl bg-rose-600 text-sm font-medium text-white hover:bg-rose-700"
                            >
                                <BanknoteArrowUp className="h-3.5 w-3.5" />
                                Apply Late Fee
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}