"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
    X,
    Ban,
    TriangleAlert,
    Loader2,
    ReceiptText,
    ShieldAlert,
} from "lucide-react";
import type { Billing } from "@/store/useBillingStore";

interface CancelBillingModalProps {
    open: boolean;
    billing: Billing | null;
    onOpenChange: (open: boolean) => void;
   onConfirm: (data: {
    billingId: number;
    reason: string;
    notes?: string;
}) => Promise<void>;
}

const REASONS = [
    "Duplicate billing",
    "Incorrect amount",
    "Boarder moved out",
    "Created in error",
    "Other",
];

const peso = (v: number | string) =>
    `₱${Number(v ?? 0).toLocaleString("en-PH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;

const formatDate = (date?: string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    });
};

function Row({
    label,
    value,
    accent = "text-slate-900",
}: {
    label: string;
    value: React.ReactNode;
    accent?: string;
}) {
    return (
        <div className="flex items-baseline justify-between gap-3 py-1">
            <span className="text-[11.5px] text-slate-500">{label}</span>
            <span className={`text-[12.5px] font-medium tabular-nums ${accent}`}>
                {value}
            </span>
        </div>
    );
}

export default function CancelBillingModal({
    open,
    billing,
    onOpenChange,
    onConfirm,
}: CancelBillingModalProps) {
    const [reason, setReason] = useState("");
    const [notes, setNotes] = useState("");
    const [confirmText, setConfirmText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);

    const paid = Number(billing?.paid_amount ?? 0);
    const hasPayments = paid > 0;

    /** Extra friction only when money has already changed hands. */
    const confirmMatches = hasPayments
        ? confirmText.trim().toUpperCase() === (billing?.billing_no ?? "").toUpperCase()
        : true;

    const canSubmit = useMemo(
        () =>
            !!billing &&
            reason !== "" &&
            confirmMatches &&
            (reason !== "Other" || notes.trim().length > 0) &&
            !submitting,
        [billing, reason, notes, confirmMatches, submitting]
    );

    /* reset on close */
    useEffect(() => {
        if (!open) {
            setReason("");
            setNotes("");
            setConfirmText("");
            setSubmitting(false);
        }
    }, [open]);

    /* esc to close + scroll lock */
    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !submitting) onOpenChange(false);
        };

        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        panelRef.current?.focus();

        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open, submitting, onOpenChange]);

    if (!open || !billing) return null;

    const handleConfirm = async () => {
        if (!canSubmit) return;
        try {
            setSubmitting(true);
            await onConfirm({
                billingId: billing.id,
                reason,
                notes: notes.trim(),
            });
            onOpenChange(false);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget && !submitting) onOpenChange(false);
            }}
        >
            <style>{`
                @keyframes cb-in {
                    from { opacity: 0; transform: translateY(8px) scale(.985); }
                    to   { opacity: 1; transform: none; }
                }
            `}</style>

            <div
                ref={panelRef}
                tabIndex={-1}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cancel-billing-title"
                className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5 outline-none motion-safe:animate-[cb-in_.18s_ease-out]"
            >
                {/* Header */}
                <div className="flex items-start gap-3 border-b border-slate-100 px-4 py-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600 ring-1 ring-rose-100">
                        <Ban className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                        <h2
                            id="cancel-billing-title"
                            className="text-[14px] font-semibold tracking-tight text-slate-900"
                        >
                            Cancel billing
                        </h2>
                        <p className="mt-0.5 text-[12px] leading-5 text-slate-500">
                            This voids the billing and stops further penalties. It can&apos;t be
                            undone.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                        aria-label="Close"
                        className="-mr-1 -mt-0.5 shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="max-h-[70vh] space-y-3.5 overflow-y-auto px-4 py-3.5">
                    {/* Billing summary */}
                    <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                        <div className="flex items-center gap-2 border-b border-slate-200/70 pb-2">
                            <ReceiptText className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-[12.5px] font-semibold text-slate-900">
                                {billing.billing_no}
                            </span>
                            <span className="ml-auto rounded-md bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                                {billing.room_number} · {billing.bed_number}
                            </span>
                        </div>

                        <div className="mt-1.5 divide-y divide-slate-200/60">
                            <Row
                                label="Boarder"
                                value={`${billing.first_name} ${billing.last_name}`}
                            />
                            <Row
                                label="Billing month"
                                value={formatDate(billing.billing_month)}
                            />
                            <Row label="Due date" value={formatDate(billing.due_date)} />
                            <Row label="Total" value={peso(billing.total_amount)} />
                            <Row
                                label="Paid"
                                value={peso(billing.paid_amount)}
                                accent={hasPayments ? "text-emerald-600" : "text-slate-400"}
                            />
                            <Row
                                label="Outstanding balance"
                                value={peso(billing.balance)}
                                accent={
                                    Number(billing.balance) > 0
                                        ? "text-rose-600"
                                        : "text-slate-400"
                                }
                            />
                        </div>
                    </div>

                    {/* Payment warning */}
                    {hasPayments && (
                        <div className="flex gap-2.5 rounded-xl border border-amber-100 bg-amber-50/70 p-3">
                            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                            <div className="min-w-0">
                                <p className="text-[12.5px] font-medium text-amber-900">
                                    {peso(paid)} has already been collected
                                </p>
                                <p className="mt-0.5 text-[11.5px] leading-5 text-amber-700">
                                    Cancelling won&apos;t refund anything. Record the refund
                                    separately so the ledger stays balanced.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Reason */}
                    <div>
                        <label className="text-[12px] font-medium text-slate-700">
                            Reason for cancelling
                        </label>
                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                            {REASONS.map((r) => {
                                const active = reason === r;
                                return (
                                    <button
                                        key={r}
                                        type="button"
                                        onClick={() => setReason(r)}
                                        className={`rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1 ${
                                            active
                                                ? "bg-slate-900 text-white shadow-sm"
                                                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                                        }`}
                                    >
                                        {r}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <div className="flex items-baseline justify-between">
                            <label
                                htmlFor="cancel-notes"
                                className="text-[12px] font-medium text-slate-700"
                            >
                                Notes{" "}
                                <span className="font-normal text-slate-400">
                                    {reason === "Other" ? "(required)" : "(optional)"}
                                </span>
                            </label>
                            <span className="text-[11px] tabular-nums text-slate-400">
                                {notes.length}/200
                            </span>
                        </div>
                        <textarea
                            id="cancel-notes"
                            rows={2}
                            maxLength={200}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Add context for the audit trail"
                            className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-[12.5px] text-slate-800 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0"
                        />
                    </div>

                    {/* Type-to-confirm, only when payments exist */}
                    {hasPayments && (
                        <div>
                            <label
                                htmlFor="cancel-confirm"
                                className="text-[12px] font-medium text-slate-700"
                            >
                                Type{" "}
                                <span className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11.5px] text-slate-900">
                                    {billing.billing_no}
                                </span>{" "}
                                to confirm
                            </label>
                            <input
                                id="cancel-confirm"
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                                autoComplete="off"
                                spellCheck={false}
                                className="mt-1.5 w-full rounded-lg border border-slate-200 px-2.5 py-2 font-mono text-[12.5px] tracking-wide text-slate-800 placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-0"
                                placeholder="Billing number"
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 border-t border-slate-100 bg-slate-50/50 px-4 py-3">
                    <p className="flex min-w-0 flex-1 items-center gap-1.5 text-[11.5px] text-slate-500">
                        <TriangleAlert className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                        Recorded in the billing history
                    </p>

                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        disabled={submitting}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1"
                    >
                        Keep billing
                    </button>

                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={!canSubmit}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-[12.5px] font-medium text-white shadow-sm transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 focus-visible:ring-offset-1"
                    >
                        {submitting && (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        )}
                        {submitting ? "Cancelling" : "Cancel billing"}
                    </button>
                </div>
            </div>
        </div>
    );
}