"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, ChevronDown, LoaderCircle, Save } from "lucide-react";
import { usePenalty } from "@/hooks/usePenalty";
import type { Penalty, PenaltyStatus } from "@/store/usePenaltyStore";
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

const CUSTOM = "custom";
const STATUSES: PenaltyStatus[] = [
    "Pending",
    "Partially Paid",
    "Paid",
    "Waived",
];

const EditPenaltyModal = ({ open, onClose, penalty, onDone }: Props) => {
    const { updatePenalty, penaltyRules, getAllPenaltyRules } = usePenalty();

    const [ruleId, setRuleId] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [status, setStatus] = useState<PenaltyStatus>("Pending");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (open) getAllPenaltyRules();
    }, [open, getAllPenaltyRules]);

    useEffect(() => {
        if (open && penalty) {
            setRuleId(penalty.penalty_rule_id ? String(penalty.penalty_rule_id) : CUSTOM);
            setAmount(String(penalty.amount ?? ""));
            setReason(penalty.reason ?? "");
            setDueDate(penalty.due_date ? penalty.due_date.slice(0, 10) : "");
            setStatus(penalty.status);
            setError("");
        }
    }, [open, penalty]);

    const activeRules = useMemo(
        () => penaltyRules.filter((r) => r.is_active),
        [penaltyRules]
    );
    const isCustom = ruleId === CUSTOM;

    const handleSubmit = async () => {
        if (!penalty) return;
        if (Number.isNaN(Number(amount)) || Number(amount) < 0) {
            setError("Enter a valid amount");
            return;
        }
        setSubmitting(true);
        const ok = await updatePenalty({
            id: penalty.penalty_id,
            penalty_rule_id: isCustom ? null : Number(ruleId),
            amount: Number(amount),
            reason: reason.trim(),
            due_date: dueDate || undefined,
            status,
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
            title="Update Penalty"
            subtitle={
                penalty
                    ? `#${penalty.penalty_id} · ${penalty.first_name} ${penalty.last_name}`
                    : ""
            }
            icon={Pencil}
            footer={
                <>
                    <CancelButton onClick={onClose} disabled={submitting} />
                    <PrimaryButton onClick={handleSubmit} disabled={submitting}>
                        {submitting ? (
                            <>
                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-3.5 w-3.5" />
                                Save Changes
                            </>
                        )}
                    </PrimaryButton>
                </>
            }
        >
            <Field label="Penalty Rule">
                <div className="relative">
                    <select
                        value={ruleId}
                        onChange={(e) => setRuleId(e.target.value)}
                        className={`${inputClass()} appearance-none pr-8`}
                    >
                        {activeRules.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.penalty_name} — {peso(Number(r.amount))}
                            </option>
                        ))}
                        <option value={CUSTOM}>Custom penalty (no rule)</option>
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>
            </Field>

            <Field label="Amount" error={error}>
                <input
                    value={amount}
                    onChange={(e) => {
                        setAmount(e.target.value);
                        setError("");
                    }}
                    inputMode="decimal"
                    className={`${inputClass(error)} tabular-nums`}
                />
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Due Date" optional>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className={inputClass()}
                    />
                </Field>

                <Field label="Status">
                    <div className="relative">
                        <select
                            value={status}
                            onChange={(e) =>
                                setStatus(e.target.value as PenaltyStatus)
                            }
                            className={`${inputClass()} appearance-none pr-8`}
                        >
                            {STATUSES.map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                    </div>
                </Field>
            </div>

            <Field label="Reason / Notes" optional>
                <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={textareaClass()}
                />
            </Field>
        </ModalShell>
    );
};

export default EditPenaltyModal;
