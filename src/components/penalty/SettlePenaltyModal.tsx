"use client";

import { useEffect, useState } from "react";
import { BadgeCheck, ChevronDown, LoaderCircle, PhilippinePeso } from "lucide-react";
import { usePenalty } from "@/hooks/usePenalty";
import type { Penalty } from "@/store/usePenaltyStore";
import {
    Field,
    ModalShell,
    CancelButton,
    PrimaryButton,
    inputClass,
    textareaClass,
    peso,
} from "./PenaltyFormBits";

type Props = {
    open: boolean;
    onClose: () => void;
    penalty: Penalty | null;
    onDone?: () => void;
};

const METHODS = ["Cash", "GCash", "Bank Transfer", "Maya", "Other"];

const today = () => new Date().toISOString().slice(0, 10);

const SettlePenaltyModal = ({ open, onClose, penalty, onDone }: Props) => {
    const { recordPenaltySettlement } = usePenalty();

    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(today());
    const [method, setMethod] = useState("Cash");
    const [reference, setReference] = useState("");
    const [remarks, setRemarks] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const outstanding = penalty
        ? Number(penalty.amount) - Number(penalty.amount_paid)
        : 0;

    useEffect(() => {
        if (open && penalty) {
            setAmount(outstanding > 0 ? outstanding.toFixed(2) : "");
            setDate(today());
            setMethod("Cash");
            setReference("");
            setRemarks("");
            setError("");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, penalty]);

    const handleSubmit = async () => {
        if (!penalty) return;
        const val = Number(amount);
        if (!amount.trim() || Number.isNaN(val) || val <= 0) {
            setError("Enter a valid payment amount");
            return;
        }
        if (val > outstanding + 0.001) {
            setError(`Amount cannot exceed the outstanding balance (${peso(outstanding)})`);
            return;
        }
        setSubmitting(true);
        const ok = await recordPenaltySettlement({
            id: penalty.penalty_id,
            amount_paid: val,
            payment_date: date || undefined,
            payment_method: method,
            payment_reference: reference.trim() || undefined,
            remarks: remarks.trim() || undefined,
        });
        setSubmitting(false);
        if (ok) {
            onDone?.();
            onClose();
        }
    };

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title="Record Settlement"
            subtitle={
                penalty
                    ? `#${penalty.penalty_id} · ${penalty.first_name} ${penalty.last_name}`
                    : ""
            }
            icon={BadgeCheck}
            maxWidth="sm:max-w-md"
            footer={
                <>
                    <CancelButton onClick={onClose} disabled={submitting} />
                    <PrimaryButton
                        onClick={handleSubmit}
                        disabled={submitting || outstanding <= 0}
                        tone="emerald"
                    >
                        {submitting ? (
                            <>
                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                Recording...
                            </>
                        ) : (
                            <>
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Record Settlement
                            </>
                        )}
                    </PrimaryButton>
                </>
            }
        >
            {penalty && (
                <div className="rounded-xl bg-slate-50 px-3.5 py-3 ring-1 ring-inset ring-slate-200/70">
                    <p className="text-[10.5px] font-medium uppercase tracking-wide text-slate-500">
                        Outstanding
                    </p>
                    <p
                        className={`mt-1 text-[18px] font-bold tabular-nums tracking-tight ${
                            outstanding > 0 ? "text-amber-600" : "text-emerald-600"
                        }`}
                    >
                        {peso(outstanding)}
                    </p>
                    <p className="mt-0.5 text-[10.5px] text-slate-400">
                        {peso(Number(penalty.amount_paid))} of{" "}
                        {peso(Number(penalty.amount))} settled
                    </p>
                </div>
            )}

            <Field label="Payment Amount" error={error}>
                <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-500/20">
                    <span className="flex w-8 items-center justify-center border-r border-slate-200 bg-slate-50 text-slate-400">
                        <PhilippinePeso className="h-3.5 w-3.5" />
                    </span>
                    <input
                        value={amount}
                        onChange={(e) => {
                            setAmount(e.target.value);
                            setError("");
                        }}
                        inputMode="decimal"
                        placeholder="0.00"
                        className="w-full px-2.5 py-2 text-[13px] tabular-nums text-slate-800 outline-none placeholder:text-slate-300"
                    />
                </div>
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Settlement Date">
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className={inputClass()}
                    />
                </Field>

                <Field label="Method">
                    <div className="relative">
                        <select
                            value={method}
                            onChange={(e) => setMethod(e.target.value)}
                            className={`${inputClass()} appearance-none pr-8`}
                        >
                            {METHODS.map((m) => (
                                <option key={m}>{m}</option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    </div>
                </Field>
            </div>

            <Field label="Reference / OR No." optional>
                <input
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="OR-2025-00012"
                    className={inputClass()}
                />
            </Field>

            <Field label="Remarks" optional>
                <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add a short remark…"
                    className={textareaClass()}
                />
            </Field>
        </ModalShell>
    );
};

export default SettlePenaltyModal;
