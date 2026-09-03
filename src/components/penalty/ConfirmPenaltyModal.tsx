"use client";

import { useState } from "react";
import { Trash2, Ban, LoaderCircle, AlertTriangle } from "lucide-react";
import type { Penalty } from "@/store/usePenaltyStore";
import {
    ModalShell,
    CancelButton,
    PrimaryButton,
    peso,
} from "./PenaltyFormBits";

type Props = {
    open: boolean;
    onClose: () => void;
    penalty: Penalty | null;
    mode: "remove" | "waive";
    onConfirm: (id: number) => Promise<boolean>;
    onDone?: () => void;
};

const ConfirmPenaltyModal = ({
    open,
    onClose,
    penalty,
    mode,
    onConfirm,
    onDone,
}: Props) => {
    const [submitting, setSubmitting] = useState(false);

    const isRemove = mode === "remove";

    const handleConfirm = async () => {
        if (!penalty) return;
        setSubmitting(true);
        const ok = await onConfirm(penalty.penalty_id);
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
            title={isRemove ? "Remove Penalty" : "Waive Penalty"}
            subtitle={
                penalty
                    ? `#${penalty.penalty_id} · ${penalty.first_name} ${penalty.last_name}`
                    : ""
            }
            icon={isRemove ? Trash2 : Ban}
            maxWidth="sm:max-w-md"
            footer={
                <>
                    <CancelButton onClick={onClose} disabled={submitting} />
                    <PrimaryButton
                        onClick={handleConfirm}
                        disabled={submitting}
                        tone={isRemove ? "rose" : "slate"}
                    >
                        {submitting ? (
                            <>
                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                Please wait...
                            </>
                        ) : isRemove ? (
                            <>
                                <Trash2 className="h-3.5 w-3.5" />
                                Remove Penalty
                            </>
                        ) : (
                            <>
                                <Ban className="h-3.5 w-3.5" />
                                Waive Penalty
                            </>
                        )}
                    </PrimaryButton>
                </>
            }
        >
            <div
                className={`flex gap-3 rounded-xl border p-3.5 ${
                    isRemove
                        ? "border-rose-100 bg-rose-50/50"
                        : "border-amber-100 bg-amber-50/50"
                }`}
            >
                <AlertTriangle
                    className={`h-5 w-5 shrink-0 ${
                        isRemove ? "text-rose-500" : "text-amber-500"
                    }`}
                />
                <p className="text-[12.5px] leading-relaxed text-slate-600">
                    {isRemove
                        ? "This penalty record will be removed from the active list. This action is restricted to administrators."
                        : "Waiving cancels the remaining balance on this penalty. It will be marked as Waived and can no longer receive settlements."}
                </p>
            </div>

            {penalty && (
                <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50 px-3.5 py-3 text-[12px] ring-1 ring-inset ring-slate-200/70">
                    <Row label="Boarder" value={`${penalty.first_name} ${penalty.last_name}`} />
                    <Row label="Rule" value={penalty.penalty_name ?? "Custom penalty"} />
                    <Row label="Amount" value={peso(Number(penalty.amount))} />
                    <Row
                        label="Paid"
                        value={peso(Number(penalty.amount_paid))}
                    />
                    <Row label="Status" value={penalty.status} />
                </div>
            )}
        </ModalShell>
    );
};

const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between gap-3">
        <span className="text-slate-400">{label}</span>
        <span className="font-medium text-slate-700">{value}</span>
    </div>
);

export default ConfirmPenaltyModal;
