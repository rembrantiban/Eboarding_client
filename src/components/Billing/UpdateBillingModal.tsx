"use client";

import { useMemo, useState } from "react";
import { FilePen, X, CalendarDays, Save } from "lucide-react";
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
import type { Billing } from "@/store/useBillingStore";
import { useAuth } from "@/hooks/useAuth";

export type BillingStatus =
    | "Upcoming"
    | "Pending"
    | "Paid"
    | "Partial"
    | "Overdue"
    | "Cancelled";

export interface UpdateBillingPayload {
    billing_type: string;
    billing_month: string | null;
    due_date: string;
    room_fee: number;
    discount: number;
    late_fee: number;
}

interface UpdateBillingModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    billing: Billing | null;
    onSubmit?: (payload: UpdateBillingPayload) => void;
}

const STATUS_STYLES: Record<BillingStatus, string> = {
    Upcoming: "bg-blue-50 text-blue-600 hover:bg-blue-50",
    Pending: "bg-slate-900 text-slate-100 hover:bg-slate-900",
    Paid: "bg-emerald-50 text-emerald-600 hover:bg-emerald-50",
    Partial: "bg-amber-50 text-amber-600 hover:bg-amber-50",
    Overdue: "bg-rose-50 text-rose-600 hover:bg-rose-50",
    Cancelled: "bg-slate-50 text-slate-600 hover:bg-slate-50",
};

function formatCurrency(value: number) {
    return `₱${Number(value || 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

const toDateInput = (value: string | null) =>
    value ? String(value).slice(0, 10) : "";

const toMonthInput = (value: string | null) =>
    value ? String(value).slice(0, 7) : "";

const num = (value: string) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : 0;
};

export default function UpdateBillingModal({
    open,
    onOpenChange,
    billing,
    onSubmit,
}: UpdateBillingModalProps) {
    const { user } = useAuth();
    const isAdmin = user?.user_type === "Admin";
    const [billingType, setBillingType] = useState("Monthly Rent");
    const [billingMonth, setBillingMonth] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [roomFee, setRoomFee] = useState("");
    const [discountInput, setDiscountInput] = useState("");
    const [lateFeeInput, setLateFeeInput] = useState("");

    // Re-seed the form from the selected billing each time the modal is
    // opened — the React-recommended "adjust state during render"
    // pattern, no effect required. hydratedId resets when the modal
    // closes so the next open always re-hydrates.
    const [hydratedId, setHydratedId] = useState<number | null>(null);

    if (!billing || !open) {
        if (hydratedId !== null) setHydratedId(null);
    } else if (billing.id !== hydratedId) {
        setHydratedId(billing.id);
        setBillingType(billing.billing_type || "Monthly Rent");
        setBillingMonth(toMonthInput(billing.billing_month));
        setDueDate(toDateInput(billing.due_date));
        setRoomFee(String(Number(billing.room_fee) || 0));
        setDiscountInput(String(Number(billing.discount) || 0));
        setLateFeeInput(String(Number(billing.late_fee) || 0));
    }

    // Utilities & other charges are not edited here — kept as stored.
    const utilitiesFee = Number(billing?.utilities_fee ?? 0);
    const otherCharges = Number(billing?.other_charges ?? 0);
    const paidAmount = Number(billing?.paid_amount ?? 0);

    const discount = num(discountInput);
    const lateFee = num(lateFeeInput);

    const subtotal = num(roomFee) + utilitiesFee + otherCharges;
    const newTotal = subtotal - discount + lateFee;
    const newBalance = newTotal - paidAmount;

    const projectedStatus: BillingStatus = useMemo(() => {
        if (!billing) return "Pending";
        if (newBalance <= 0) return "Paid";
        if (billing.status === "Upcoming") return "Upcoming";
        if (paidAmount > 0) return "Partial";
        if (dueDate && new Date(dueDate) < new Date(new Date().toDateString()))
            return "Overdue";
        return "Pending";
    }, [billing, newBalance, paidAmount, dueDate]);

    const locked =
        billing?.status === "Paid" || billing?.status === "Cancelled";

    const belowPaid = newTotal < paidAmount;
    const negativeTotal = newTotal < 0;

    const canSave =
        !!billing &&
        !locked &&
        !belowPaid &&
        !negativeTotal &&
        dueDate.trim() !== "";

    function handleSave() {
        if (!canSave) return;

        onSubmit?.({
            billing_type: billingType,
            billing_month: billingMonth ? `${billingMonth}-01` : null,
            due_date: dueDate,
            room_fee: num(roomFee),
            discount,
            late_fee: lateFee,
        });
    }

    if (!billing) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                showCloseButton={false}
                className="gap-0 overflow-hidden rounded-2xl border border-slate-100 p-0 sm:max-w-2xl"
            >
                {/* Header */}
                <DialogHeader className="flex-row items-center justify-between space-y-0 border-b border-slate-100 px-5 py-4">
                    <DialogTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <FilePen className="h-4 w-4" />
                        </span>
                        {isAdmin ? "Update Billing Information" : "Update Payment Record "}
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
                            Boarder
                        </p>
                        <div className="rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-3.5">
                            <p className="text-sm font-semibold text-slate-900">
                                {billing.first_name} {billing.last_name}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Room {billing.room_number ?? "—"} · Bed{" "}
                                {billing.bed_number ?? "—"}
                            </p>
                            <div className="mt-2.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                                <span className="font-medium text-slate-600">
                                    {billing.billing_no}
                                </span>
                                <Badge
                                    className={`rounded-full font-medium ${STATUS_STYLES[billing.status]}`}
                                >
                                    {billing.status}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {locked && (
                        <div className="rounded-xl border border-rose-100 bg-rose-50/50 px-4 py-3 text-xs font-medium text-rose-600">
                            This billing is {billing.status.toLowerCase()} and can
                            no longer be edited.
                        </div>
                    )}

                    {/* Schedule */}
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Schedule
                        </p>
                        <div className="grid gap-3 sm:grid-cols-2">
                            <label className="block">
                                <span className="mb-1 block text-[11px] font-medium text-slate-500">
                                    Billing Month
                                </span>
                                <Input
                                    type="month"
                                    value={billingMonth}
                                    onChange={(e) => setBillingMonth(e.target.value)}
                                    disabled={locked}
                                    className="h-11 rounded-xl text-sm font-medium"
                                />
                            </label>

                            <label className="block">
                                <span className="mb-1 block text-[11px] font-medium text-slate-500">
                                    Due Date
                                </span>
                                <div className="relative">
                                    <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                    <Input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) => setDueDate(e.target.value)}
                                        disabled={locked}
                                        className="h-11 rounded-xl pl-9 text-sm font-medium"
                                    />
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Charges */}
                    <div>
                        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                            Amounts
                        </p>
                        <div className={`grid gap-3 ${isAdmin ? "sm:grid-cols-3" : "sm:grid-cols-1"}`}>
                            {[
                                {
                                    label: "Room Fee",
                                    value: roomFee,
                                    set: setRoomFee,
                                    hint: isAdmin
                                        ? "Base monthly charge (not editable)"
                                        : "Base monthly charge",
                                    readOnly: isAdmin,
                                },
                                ...(isAdmin
                                    ? [
                                        {
                                            label: "Discount",
                                            value: discountInput,
                                            set: setDiscountInput,
                                            hint: "Deducted from total",
                                            readOnly: false,
                                        },
                                        {
                                            label: "Late Fee",
                                            value: lateFeeInput,
                                            set: setLateFeeInput,
                                            hint: "Added to total",
                                            readOnly: false,
                                        },
                                    ]
                                    : []),
                            ].map((field) => (
                                <label key={field.label} className="block">
                                    <span className="mb-1 block text-[11px] font-medium text-slate-500">
                                        {field.label}
                                    </span>
                                    <div className="relative">
                                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                                            ₱
                                        </span>
                                        <Input
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={field.value}
                                            onChange={(e) => field.set(e.target.value)}
                                            disabled={locked || field.readOnly}
                                            placeholder="0.00"
                                            className="h-11 rounded-xl pl-8 text-sm font-medium disabled:bg-slate-50 disabled:text-slate-600"
                                        />
                                    </div>
                                    <span className="mt-1 block text-[10px] text-slate-400">
                                        {field.hint}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Recalculated summary */}
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 px-4 py-3.5">
                        <p className="mb-2.5 text-xs font-medium uppercase tracking-wide text-indigo-600">
                            Updated Billing
                        </p>
                        <div className="space-y-1.5 text-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Room Fee</span>
                                <span className="font-medium text-slate-900">
                                    {formatCurrency(num(roomFee))}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Discount</span>
                                <span className="font-medium text-emerald-600">
                                    − {formatCurrency(discount)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Late Fee</span>
                                <span className="font-medium text-rose-600">
                                    + {formatCurrency(lateFee)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-t border-indigo-100 pt-1.5">
                                <span className="font-medium text-slate-700">
                                    New Total Amount
                                </span>
                                <span className="font-semibold text-slate-900">
                                    {formatCurrency(newTotal)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-slate-600">Paid Amount</span>
                                <span className="font-medium text-slate-900">
                                    − {formatCurrency(paidAmount)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-slate-700">
                                    New Balance
                                </span>
                                <span
                                    className={`font-semibold ${newBalance > 0 ? "text-rose-600" : "text-emerald-600"}`}
                                >
                                    {formatCurrency(newBalance)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                                <span className="text-slate-600">Status</span>
                                <Badge
                                    className={`rounded-full font-medium ${STATUS_STYLES[projectedStatus]}`}
                                >
                                    {projectedStatus}
                                </Badge>
                            </div>
                        </div>

                        {belowPaid && !locked && (
                            <p className="mt-2.5 text-xs font-medium text-rose-600">
                                New total is lower than the amount already paid
                                ({formatCurrency(paidAmount)}).
                            </p>
                        )}
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
                        onClick={handleSave}
                        disabled={!canSave}
                        className="h-9 rounded-xl bg-slate-900 text-sm font-medium text-white hover:bg-slate-800"
                    >
                        <Save className="h-3.5 w-3.5" />
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
