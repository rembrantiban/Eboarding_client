"use client";

import { useEffect } from "react";
import { Eye, ReceiptText, LoaderCircle } from "lucide-react";
import { usePenalty } from "@/hooks/usePenalty";
import type { Penalty } from "@/store/usePenaltyStore";
import {
    ModalShell,
    CancelButton,
    peso,
    fmtDate,
} from "./PenaltyFormBits";

type Props = {
    open: boolean;
    onClose: () => void;
    penalty: Penalty | null;
};

const ViewPenaltyModal = ({ open, onClose, penalty }: Props) => {
    const { settlements, settlementsLoading, getPenaltySettlements } = usePenalty();

    useEffect(() => {
        if (open && penalty) getPenaltySettlements(penalty.penalty_id);
    }, [open, penalty, getPenaltySettlements]);

    const outstanding = penalty
        ? Number(penalty.amount) - Number(penalty.amount_paid)
        : 0;

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title="Penalty Details"
            subtitle={penalty ? `Record #${penalty.penalty_id}` : ""}
            icon={Eye}
            footer={<CancelButton onClick={onClose} />}
        >
            {penalty && (
                <>
                    <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-inset ring-slate-200/70">
                        <div className="flex items-baseline justify-between">
                            <p className="text-[10.5px] font-medium uppercase tracking-wide text-slate-500">
                                Outstanding
                            </p>
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10.5px] font-medium text-slate-600 ring-1 ring-inset ring-slate-200">
                                {penalty.status}
                            </span>
                        </div>
                        <p
                            className={`mt-1 text-[20px] font-bold tabular-nums tracking-tight ${
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

                    <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12.5px]">
                        <Info label="Boarder" value={`${penalty.first_name} ${penalty.last_name}`} />
                        <Info label="Email" value={penalty.email} />
                        <Info label="Penalty Rule" value={penalty.penalty_name ?? "Custom penalty"} />
                        <Info label="Amount" value={peso(Number(penalty.amount))} />
                        <Info label="Penalty Date" value={fmtDate(penalty.penalty_date)} />
                        <Info label="Due Date" value={fmtDate(penalty.due_date)} />
                        <Info label="Assigned By" value={penalty.assigned_by ?? "—"} />
                        <Info label="Settled At" value={fmtDate(penalty.settled_at)} />
                    </dl>

                    <div>
                        <p className="mb-1 text-[12px] font-medium text-slate-600">Reason</p>
                        <p className="rounded-lg bg-slate-50 px-3 py-2 text-[12.5px] leading-relaxed text-slate-600 ring-1 ring-inset ring-slate-200/70">
                            {penalty.reason || "—"}
                        </p>
                    </div>

                    <div>
                        <div className="mb-2 flex items-center gap-2">
                            <ReceiptText className="h-3.5 w-3.5 text-slate-400" />
                            <p className="text-[12px] font-semibold text-slate-700">
                                Settlement History
                            </p>
                        </div>

                        {settlementsLoading ? (
                            <div className="flex items-center gap-2 py-4 text-[12px] text-slate-400">
                                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                Loading…
                            </div>
                        ) : settlements.length === 0 ? (
                            <p className="rounded-lg border border-dashed border-slate-200 px-3 py-4 text-center text-[12px] text-slate-400">
                                No settlements recorded yet.
                            </p>
                        ) : (
                            <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg ring-1 ring-inset ring-slate-200/70">
                                {settlements.map((s) => (
                                    <li
                                        key={s.id}
                                        className="flex items-center justify-between gap-3 bg-white px-3 py-2"
                                    >
                                        <div className="min-w-0">
                                            <p className="text-[12px] font-medium tabular-nums text-slate-800">
                                                {peso(Number(s.amount_paid))}
                                                <span className="ml-2 font-normal text-slate-400">
                                                    {s.payment_method || "—"}
                                                </span>
                                            </p>
                                            <p className="truncate text-[10.5px] text-slate-400">
                                                {fmtDate(s.payment_date)}
                                                {s.payment_reference
                                                    ? ` · ${s.payment_reference}`
                                                    : ""}
                                                {s.received_by_name
                                                    ? ` · by ${s.received_by_name}`
                                                    : ""}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            )}
        </ModalShell>
    );
};

const Info = ({ label, value }: { label: string; value: string }) => (
    <div>
        <dt className="text-[10.5px] uppercase tracking-wide text-slate-400">
            {label}
        </dt>
        <dd className="mt-0.5 break-words font-medium text-slate-700">{value}</dd>
    </div>
);

export default ViewPenaltyModal;
