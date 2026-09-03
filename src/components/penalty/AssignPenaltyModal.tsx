"use client";

import { useEffect, useMemo, useState } from "react";
import { Gavel, ChevronDown, LoaderCircle, Send } from "lucide-react";
import axiosInstance from "@/api/api";
import { usePenalty } from "@/hooks/usePenalty";
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
    onDone?: () => void;
};

type ActiveBoarder = {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    room_number: string;
    bed_number: string;
    assignment_status: string;
};

const CUSTOM = "custom";
const todayStr = () => new Date().toISOString().slice(0, 10);

const AssignPenaltyModal = ({ open, onClose, onDone }: Props) => {
    const { createPenalty, penaltyRules, getAllPenaltyRules } = usePenalty();

    const [boarders, setBoarders] = useState<ActiveBoarder[]>([]);
    const [boardersLoading, setBoardersLoading] = useState(false);
    const [boardersError, setBoardersError] = useState("");

    const [boarderId, setBoarderId] = useState("");
    const [ruleId, setRuleId] = useState("");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) {
            setBoarderId("");
            setRuleId("");
            setAmount("");
            setReason("");
            setDueDate("");
            setErrors({});
            return;
        }

        getAllPenaltyRules();

        let cancelled = false;
        setBoardersLoading(true);
        setBoardersError("");

        const loadBoarders = async () => {
            // Preferred: dedicated endpoint (room_assignments.status = 'Active')
            try {
                const res = await axiosInstance.get("/boarders/active");
                if (!cancelled) setBoarders(res.data || []);
                return;
            } catch (err) {
                console.warn(
                    "[AssignPenalty] /boarders/active failed, falling back to /boarders/getboarders",
                    err
                );
            }

            // Fallback: full boarder list filtered to active assignments
            try {
                const res = await axiosInstance.get("/boarders/getboarders");
                const rows = (res.data || []) as Array<Record<string, unknown>>;
                const mapped: ActiveBoarder[] = rows
                    .filter(
                        (b) =>
                            String(b.boarder_status ?? "").toLowerCase() ===
                            "active"
                    )
                    .map((b) => ({
                        user_id: Number(b.user_id ?? b.boarder_id),
                        first_name: String(b.first_name ?? ""),
                        last_name: String(b.last_name ?? ""),
                        email: String(b.email ?? ""),
                        room_number: String(b.room_number ?? ""),
                        bed_number: String(b.bed_number ?? ""),
                        assignment_status: "Active",
                    }));
                if (!cancelled) setBoarders(mapped);
            } catch (err) {
                console.error("[AssignPenalty] boarder load failed", err);
                if (!cancelled) {
                    setBoarders([]);
                    setBoardersError(
                        "Could not load boarders. Make sure the server is running the latest build."
                    );
                }
            }
        };

        loadBoarders().finally(() => {
            if (!cancelled) setBoardersLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [open, getAllPenaltyRules]);

    const activeRules = useMemo(
        () => penaltyRules.filter((r) => r.is_active),
        [penaltyRules]
    );

    const isCustom = ruleId === CUSTOM;
    const selectedRule = activeRules.find((r) => String(r.id) === ruleId);
    const effectiveAmount = isCustom
        ? Number(amount || 0)
        : Number(selectedRule?.amount ?? 0);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!boarderId) e.boarderId = "Select a boarder";
        if (!ruleId) e.ruleId = "Select a penalty rule";
        if (isCustom) {
            if (!amount.trim()) e.amount = "Enter an amount";
            else if (Number.isNaN(Number(amount)) || Number(amount) <= 0)
                e.amount = "Enter a valid amount";
        }
        if (dueDate && dueDate < todayStr()) {
            e.dueDate = "Due date cannot be in the past";
        }
        return e;
    };

    const handleSubmit = async () => {
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            return;
        }
        setSubmitting(true);
        const ok = await createPenalty({
            boarder_id: Number(boarderId),
            penalty_rule_id: isCustom ? null : Number(ruleId),
            amount: isCustom ? Number(amount) : undefined,
            reason: reason.trim() || undefined,
            due_date: dueDate || undefined,
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
            title="Assign Penalty"
            subtitle="Issue a penalty to a boarder with an active room assignment"
            icon={Gavel}
            footer={
                <>
                    <CancelButton onClick={onClose} disabled={submitting} />
                    <PrimaryButton
                        onClick={handleSubmit}
                        disabled={submitting || boarders.length === 0}
                        tone="slate"
                    >
                        {submitting ? (
                            <>
                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                Assigning...
                            </>
                        ) : (
                            <>
                                <Send className="h-3.5 w-3.5" />
                                Assign Penalty
                            </>
                        )}
                    </PrimaryButton>
                </>
            }
        >
            <Field label="Boarder" error={errors.boarderId}>
                <div className="relative">
                    <select
                        value={boarderId}
                        onChange={(e) => {
                            setBoarderId(e.target.value);
                            setErrors((p) => ({ ...p, boarderId: "" }));
                        }}
                        disabled={boardersLoading || boarders.length === 0}
                        className={`${inputClass(errors.boarderId)} appearance-none pr-8 disabled:bg-slate-50 ${
                            boarderId ? "text-slate-800" : "text-slate-400"
                        }`}
                    >
                        <option value="">
                            {boardersLoading
                                ? "Loading boarders…"
                                : "Select a boarder…"}
                        </option>
                        {boarders.map((b) => (
                            <option key={b.user_id} value={b.user_id}>
                                {b.first_name} {b.last_name}
                                {b.room_number
                                    ? ` · Room ${b.room_number}${
                                          b.bed_number ? ` / Bed ${b.bed_number}` : ""
                                      }`
                                    : ""}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                </div>
                <p
                    className={`mt-1 text-[11px] ${
                        boardersError ? "text-rose-500" : "text-slate-400"
                    }`}
                >
                    {boardersLoading
                        ? "Checking active room assignments…"
                        : boardersError
                        ? boardersError
                        : boarders.length === 0
                        ? "No boarders currently have an active room assignment."
                        : `${boarders.length} boarder${
                              boarders.length === 1 ? "" : "s"
                          } with an active room assignment.`}
                </p>
            </Field>

            <Field label="Penalty Rule" error={errors.ruleId}>
                <div className="relative">
                    <select
                        value={ruleId}
                        onChange={(e) => {
                            setRuleId(e.target.value);
                            setErrors((p) => ({ ...p, ruleId: "" }));
                        }}
                        className={`${inputClass(errors.ruleId)} appearance-none pr-8 ${
                            ruleId ? "text-slate-800" : "text-slate-400"
                        }`}
                    >
                        <option value="">Select a rule…</option>
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

            <Field
                label="Amount"
                error={errors.amount}
                optional={!isCustom}
            >
                <input
                    value={isCustom ? amount : effectiveAmount ? String(effectiveAmount) : ""}
                    onChange={(e) => {
                        setAmount(e.target.value);
                        setErrors((p) => ({ ...p, amount: "" }));
                    }}
                    disabled={!isCustom}
                    inputMode="decimal"
                    placeholder="0.00"
                    className={`${inputClass(errors.amount)} tabular-nums ${
                        !isCustom ? "bg-slate-50 text-slate-500" : ""
                    }`}
                />
                {!isCustom && selectedRule && (
                    <p className="mt-1 text-[11px] text-slate-400">
                        Amount is taken from the selected rule.
                    </p>
                )}
            </Field>

            <div className="grid grid-cols-2 gap-3">
                <Field label="Due Date" optional error={errors.dueDate}>
                    <input
                        type="date"
                        value={dueDate}
                        min={todayStr()}
                        onChange={(e) => {
                            setDueDate(e.target.value);
                            setErrors((p) => ({ ...p, dueDate: "" }));
                        }}
                        className={inputClass(errors.dueDate)}
                    />
                </Field>
            </div>

            <Field label="Reason / Notes" optional>
                <textarea
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Describe why this penalty is being issued…"
                    className={textareaClass()}
                />
            </Field>
        </ModalShell>
    );
};

export default AssignPenaltyModal;
