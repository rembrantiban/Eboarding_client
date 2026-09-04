"use client";

import { useEffect } from "react";
import {
    X,
    TriangleAlert,
    ReceiptText,
    LoaderCircle,
    CalendarDays,
    CircleCheck,
    Clock3,
    UserRound,
    FileText,
} from "lucide-react";
import { usePenalty } from "@/hooks/usePenalty";
import type { Penalty, PenaltyStatus } from "@/store/usePenaltyStore";

/* ============================================================
   HELPERS
   ============================================================ */

const peso = (v: number) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(Number.isFinite(v) ? v : 0);

const fmtDate = (v?: string | null) => {
    if (!v) return "—";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    }).format(d);
};

const num = (v: unknown) => {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
};

const STATUS_STYLE: Record<PenaltyStatus, string> = {
    Pending: "bg-amber-50 text-amber-700 ring-amber-100",
    "Partially Paid": "bg-blue-50 text-blue-700 ring-blue-100",
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Waived: "bg-slate-100 text-slate-600 ring-slate-200",
};

const isOverdue = (p: Penalty) => {
    if (!p.due_date) return false;
    if (p.status === "Paid" || p.status === "Waived") return false;
    return new Date(p.due_date) < new Date();
};

/* ============================================================
   MODAL
   ============================================================ */

type Props = {
    open: boolean;
    onClose: () => void;
    penalty: Penalty | null;
};

export default function BoarderPenaltyDetailModal({
    open,
    onClose,
    penalty,
}: Props) {
    const { settlements, settlementsLoading, getPenaltySettlements } = usePenalty();

    useEffect(() => {
        if (open && penalty) getPenaltySettlements(penalty.penalty_id);
    }, [open, penalty, getPenaltySettlements]);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open || !penalty) return null;

    const amount = num(penalty.amount);
    const paid = num(penalty.amount_paid);
    const outstanding = Math.max(amount - paid, 0);
    const pct = amount > 0 ? Math.min(Math.round((paid / amount) * 100), 100) : 0;
    const overdue = isOverdue(penalty);
    const waived = penalty.status === "Waived";
    const cleared = penalty.status === "Paid" || waived;

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ===== Header ===== */}
                <div className="relative overflow-hidden bg-slate-900 px-6 py-5">
                    <span className="pointer-events-none absolute -right-6 -top-8 hidden sm:block">
                        <TriangleAlert size={92} strokeWidth={1} className="text-white/5" />
                    </span>

                    <div className="relative flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-widest text-slate-400">
                                Penalty · Record #{penalty.penalty_id}
                            </p>
                            <h2 className="mt-1 truncate text-lg font-semibold text-white">
                                {penalty.penalty_name ?? "Custom penalty"}
                            </h2>
                        </div>

                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                            aria-label="Close"
                        >
                            <X size={15} />
                        </button>
                    </div>
                </div>

                <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-6">
                    {/* ===== 5.14 Payment status ===== */}
                    <section>
                        <SectionLabel icon={ReceiptText} text="Payment status" />

                        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                        {cleared ? "Total" : "Outstanding"}
                                    </p>
                                    <p
                                        className={`mt-1 text-2xl font-bold tabular-nums tracking-tight ${
                                            waived
                                                ? "text-slate-500"
                                                : outstanding > 0
                                                  ? "text-amber-600"
                                                  : "text-emerald-600"
                                        }`}
                                    >
                                        {peso(waived ? amount : cleared ? amount : outstanding)}
                                    </p>
                                </div>

                                <span
                                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ring-inset ${STATUS_STYLE[penalty.status]}`}
                                >
                                    {penalty.status === "Paid" ? (
                                        <CircleCheck size={12} />
                                    ) : penalty.status === "Waived" ? (
                                        <CircleCheck size={12} />
                                    ) : (
                                        <Clock3 size={12} />
                                    )}
                                    {penalty.status}
                                </span>
                            </div>

                            {!waived && (
                                <>
                                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                        <div
                                            className={`h-full rounded-full transition-all ${
                                                pct >= 100 ? "bg-emerald-500" : "bg-blue-500"
                                            }`}
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <p className="mt-1.5 text-[11px] text-slate-400">
                                        {peso(paid)} of {peso(amount)} paid · {pct}%
                                    </p>
                                </>
                            )}

                            {waived && (
                                <p className="mt-2 text-[11.5px] text-slate-500">
                                    This penalty has been waived — no payment is required.
                                </p>
                            )}

                            <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-200 pt-3 text-[12px]">
                                <MiniStat
                                    label="Due date"
                                    value={fmtDate(penalty.due_date)}
                                    tone={overdue ? "danger" : "default"}
                                    hint={overdue ? "Overdue" : undefined}
                                />
                                <MiniStat
                                    label={waived ? "Waived on" : "Settled on"}
                                    value={fmtDate(penalty.settled_at)}
                                />
                            </div>
                        </div>
                    </section>

                    {/* ===== 5.13 Details ===== */}
                    <section>
                        <SectionLabel icon={FileText} text="Penalty details" />

                        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-3.5 text-[12.5px]">
                            <Info label="Penalty rule" value={penalty.penalty_name ?? "Custom penalty"} />
                            <Info label="Amount" value={peso(amount)} />
                            <Info label="Date issued" value={fmtDate(penalty.penalty_date)} icon={CalendarDays} />
                            <Info label="Assigned by" value={penalty.assigned_by ?? "—"} icon={UserRound} />
                        </dl>

                        {penalty.penalty_description && (
                            <div className="mt-3.5">
                                <p className="text-[10.5px] uppercase tracking-wide text-slate-400">
                                    Rule description
                                </p>
                                <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-[12.5px] leading-relaxed text-slate-600 ring-1 ring-inset ring-slate-200/70">
                                    {penalty.penalty_description}
                                </p>
                            </div>
                        )}

                        <div className="mt-3.5">
                            <p className="text-[10.5px] uppercase tracking-wide text-slate-400">
                                Reason
                            </p>
                            <p className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-[12.5px] leading-relaxed text-slate-600 ring-1 ring-inset ring-slate-200/70">
                                {penalty.reason || "No reason provided."}
                            </p>
                        </div>
                    </section>

                    {/* ===== Settlement history ===== */}
                    <section>
                        <SectionLabel icon={ReceiptText} text="Settlement history" />

                        <div className="mt-3">
                            {settlementsLoading ? (
                                <div className="flex items-center gap-2 py-4 text-[12px] text-slate-400">
                                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                                    Loading payments…
                                </div>
                            ) : settlements.length === 0 ? (
                                <p className="rounded-lg border border-dashed border-slate-200 px-3 py-5 text-center text-[12px] text-slate-400">
                                    No payments recorded for this penalty yet.
                                </p>
                            ) : (
                                <ul className="divide-y divide-slate-100 overflow-hidden rounded-lg ring-1 ring-inset ring-slate-200/70">
                                    {settlements.map((s) => (
                                        <li
                                            key={s.id}
                                            className="flex items-center justify-between gap-3 bg-white px-3 py-2.5"
                                        >
                                            <div className="min-w-0">
                                                <p className="text-[12.5px] font-semibold tabular-nums text-slate-800">
                                                    {peso(num(s.amount_paid))}
                                                    <span className="ml-2 text-[11px] font-normal text-slate-400">
                                                        {s.payment_method || "—"}
                                                    </span>
                                                </p>
                                                <p className="mt-0.5 truncate text-[10.5px] text-slate-400">
                                                    {fmtDate(s.payment_date)}
                                                    {s.payment_reference ? ` · Ref ${s.payment_reference}` : ""}
                                                    {s.received_by_name ? ` · by ${s.received_by_name}` : ""}
                                                </p>
                                            </div>
                                            <CircleCheck size={15} className="shrink-0 text-emerald-500" />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </section>
                </div>

                {/* ===== Footer ===== */}
                <div className="flex justify-end border-t border-slate-100 bg-slate-50 px-6 py-3.5">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-[12.5px] font-medium text-white transition-colors hover:bg-slate-800"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ============================================================
   SUBCOMPONENTS
   ============================================================ */

type IconType = React.ComponentType<{ size?: number; className?: string }>;

function SectionLabel({ icon: Icon, text }: { icon: IconType; text: string }) {
    return (
        <div className="flex items-center gap-2">
            <Icon size={14} className="text-slate-400" />
            <p className="text-[12px] font-semibold tracking-tight text-slate-700">
                {text}
            </p>
        </div>
    );
}

function Info({
    label,
    value,
    icon: Icon,
}: {
    label: string;
    value: string;
    icon?: IconType;
}) {
    return (
        <div>
            <dt className="text-[10.5px] uppercase tracking-wide text-slate-400">
                {label}
            </dt>
            <dd className="mt-0.5 flex items-center gap-1.5 break-words font-medium text-slate-700">
                {Icon && <Icon size={13} className="shrink-0 text-slate-400" />}
                {value}
            </dd>
        </div>
    );
}

function MiniStat({
    label,
    value,
    tone = "default",
    hint,
}: {
    label: string;
    value: string;
    tone?: "default" | "danger";
    hint?: string;
}) {
    return (
        <div>
            <p className="text-[10.5px] uppercase tracking-wide text-slate-400">
                {label}
            </p>
            <p
                className={`mt-0.5 font-medium ${
                    tone === "danger" ? "text-rose-600" : "text-slate-700"
                }`}
            >
                {value}
            </p>
            {hint && (
                <p className="text-[10px] font-medium text-rose-600">{hint}</p>
            )}
        </div>
    );
}
