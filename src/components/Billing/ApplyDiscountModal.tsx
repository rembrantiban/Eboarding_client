"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
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

export type BillingStatus = "Pending" | "Paid" | "Partial" | "Overdue" | "Cancelled";

interface ApplyDiscountModalProps {
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
    totalAmount: number;
    currentDiscount: number;
    balance: number;
    status: BillingStatus;
    onApply?: (discount: number) => void;
}

function formatCurrency(value: number) {
    return `₱${value.toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

const STATUS_STYLES: Record<BillingStatus, string> = {
    Pending: "bg-slate-900 text-slate-100 hover:bg-slate-900",
    Paid: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    Partial: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    Overdue: "bg-rose-50 text-rose-600 hover:bg-rose-50",
    Cancelled: "bg-slate-50 text-slate-600 hover:bg-slate-50",
};

const formatDate = (date: string | null) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-PH", {
        month: "long",
        day: "2-digit",
        year: "numeric",
    });
};


export default function ApplyDiscountModal({
    open,
    onOpenChange,
    boarder,
    totalAmount,
    currentDiscount,
    balance,
    status,
    onApply,
}: ApplyDiscountModalProps) {
    const [discount, setDiscount] = useState<string>("");

    const discountValue = Math.min(
        Math.max(Number(discount) || 0, 0),
        totalAmount
    );
    const newTotal = totalAmount - discountValue;
    const remainingBalance = Math.max(balance - discountValue, 0);

    function handleApply() {
        onApply?.(discountValue);
        onOpenChange(false);
        setDiscount("");
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
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <Tag className="h-4 w-4" />
                        </span>
                        Apply Discount
                    </DialogTitle>
                    <button
                        onClick={() => onOpenChange(false)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </DialogHeader>

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
                                <span>{formatDate(boarder.billing_month)}</span>
                            </div>
                        </div>
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
                                <span className="text-slate-500">Current Discount</span>
                                <span className="font-medium text-slate-900">
                                    {formatCurrency(currentDiscount)}
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

                    {/* Discount input */}
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Discount Details
                        </p>
                        <div className="relative">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                                ₱
                            </span>
                            <Input
                                type="number"
                                min={0}
                                max={totalAmount}
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                placeholder="0.00"
                                className="h-11 rounded-xl pl-8 text-sm font-medium"
                            />
                        </div>
                    </div>

                    {/* After discount summary */}
                    <div className="rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-3.5">
                        <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-blue-600">
                            After Discount
                        </p>
                        <div className="space-y-1.5 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Discount</span>
                                <span className="font-medium text-slate-900">
                                    {formatCurrency(discountValue)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">New Total Amount</span>
                                <span className="font-medium text-slate-900">
                                    {formatCurrency(newTotal)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Remaining Balance</span>
                                <span className="font-medium text-slate-900">
                                    {formatCurrency(remainingBalance)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-slate-600">Status</span>
                                <Badge className={`rounded-full font-medium ${STATUS_STYLES[status]}`}>
                                    {status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="border-t border-slate-100 px-5 py-4 sm:justify-end">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-9 rounded-xl text-sm font-medium text-slate-600"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleApply}
                        disabled={discountValue <= 0}
                        className="h-9 rounded-xl bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        <Tag className="h-3.5 w-3.5" />
                        Apply Discount
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}