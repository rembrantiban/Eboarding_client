"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Search,
    ChevronDown,
    TriangleAlert,
    Wallet,
    CircleCheck,
    Clock3,
    ShieldCheck,
    Inbox,
    LoaderCircle,
    Eye,
} from "lucide-react";
import { usePenalty } from "@/hooks/usePenalty";
import type { Penalty, PenaltyStatus } from "@/store/usePenaltyStore";
import BoarderPenaltyDetailModal from "@/components/penalty/BoarderPenaltyDetailModal";

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
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(d);
};

const num = (v: unknown) => {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
};

const isOverdue = (p: Penalty) => {
    if (!p.due_date) return false;
    if (p.status === "Paid" || p.status === "Waived") return false;
    return new Date(p.due_date) < new Date();
};

const STATUS_STYLE: Record<PenaltyStatus, string> = {
    Pending: "bg-amber-50 text-amber-700 ring-amber-100",
    "Partially Paid": "bg-blue-50 text-blue-700 ring-blue-100",
    Paid: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    Waived: "bg-slate-100 text-slate-600 ring-slate-200",
};

const STATUS_FILTERS: ("All Status" | PenaltyStatus)[] = [
    "All Status",
    "Pending",
    "Partially Paid",
    "Paid",
    "Waived",
];

/* ============================================================
   PAGE  (c. Boarder — 5.12 / 5.13 / 5.14)
   ============================================================ */

export default function BoarderPenalties() {
    const navigate = useNavigate();
    const {
        myPenaltyRecords,
        myPenaltyRecordsLoading,
        getMyPenaltyRecords,
    } = usePenalty();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"All Status" | PenaltyStatus>("All Status");
    const [active, setActive] = useState<Penalty | null>(null);

    useEffect(() => {
        getMyPenaltyRecords();
    }, [getMyPenaltyRecords]);

    /* ---------- summary (5.14 at a glance) ---------- */
    const summary = useMemo(() => {
        const outstanding = myPenaltyRecords
            .filter((p) => p.status === "Pending" || p.status === "Partially Paid")
            .reduce((t, p) => t + (num(p.amount) - num(p.amount_paid)), 0);

        const settled = myPenaltyRecords.filter(
            (p) => p.status === "Paid" || p.status === "Waived",
        ).length;

        return {
            total: myPenaltyRecords.length,
            totalAmount: myPenaltyRecords.reduce((t, p) => t + num(p.amount), 0),
            outstanding,
            settled,
        };
    }, [myPenaltyRecords]);

    /* ---------- 5.12 view + search + filter ---------- */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return myPenaltyRecords.filter((p) => {
            const matchesStatus = status === "All Status" || p.status === status;
            const matchesQuery =
                !q ||
                (p.penalty_name ?? "").toLowerCase().includes(q) ||
                (p.reason ?? "").toLowerCase().includes(q) ||
                (p.assigned_by ?? "").toLowerCase().includes(q) ||
                p.status.toLowerCase().includes(q);

            return matchesStatus && matchesQuery;
        });
    }, [myPenaltyRecords, search, status]);

    const isFiltered = search !== "" || status !== "All Status";
    const loading = myPenaltyRecordsLoading && myPenaltyRecords.length === 0;

    return (
        <div className="min-h-screen bg-white px-1 py-1">
            <div className="mx-auto max-w-5xl space-y-6">
                {/* ===== Header ===== */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={16} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            My Penalties
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Every penalty on your account, its details and payment status
                        </p>
                    </div>
                </div>

                {/* ===== Summary ===== */}
                <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <SummaryTile
                        icon={TriangleAlert}
                        iconClass="text-slate-300"
                        label="Total Penalties"
                        value={String(summary.total)}
                        meta={`${peso(summary.totalAmount)} issued`}
                    />
                    <SummaryTile
                        icon={Wallet}
                        iconClass="text-amber-400"
                        label="Outstanding"
                        value={peso(summary.outstanding)}
                        meta="Amount still due"
                        emphasize={summary.outstanding > 0}
                    />
                    <SummaryTile
                        icon={ShieldCheck}
                        iconClass="text-emerald-400"
                        label="Settled"
                        value={String(summary.settled)}
                        meta="Paid or waived"
                    />
                    <SummaryTile
                        icon={Clock3}
                        iconClass="text-blue-400"
                        label="Active"
                        value={String(
                            myPenaltyRecords.filter(
                                (p) =>
                                    p.status === "Pending" ||
                                    p.status === "Partially Paid",
                            ).length,
                        )}
                        meta="Needs payment"
                    />
                </section>

                {/* ===== Toolbar ===== */}
                <section className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search rule, reason, or status"
                            className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value as typeof status)
                                }
                                className="h-10 appearance-none rounded-xl border border-slate-200 bg-white pl-3 pr-8 text-[12.5px] font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                            >
                                {STATUS_FILTERS.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown
                                size={13}
                                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                        </div>

                        <span className="hidden text-xs text-slate-400 sm:inline">
                            {filtered.length} of {myPenaltyRecords.length}
                        </span>
                    </div>
                </section>

                {/* ===== List (5.12) ===== */}
                <section className="space-y-2.5">
                    {loading ? (
                        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white py-16 text-center text-slate-400">
                            <LoaderCircle size={20} className="animate-spin" />
                            <p className="mt-3 text-sm">Loading your penalties…</p>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center rounded-2xl border border-slate-200 bg-white py-16 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 ring-1 ring-inset ring-emerald-100">
                                {isFiltered ? (
                                    <Inbox size={22} className="text-slate-400" />
                                ) : (
                                    <CircleCheck size={22} className="text-emerald-500" />
                                )}
                            </div>
                            <p className="mt-3 text-[13.5px] font-semibold text-slate-800">
                                {isFiltered
                                    ? "No matching penalties"
                                    : "No penalties on record"}
                            </p>
                            <p className="mt-1 text-[12px] text-slate-400">
                                {isFiltered
                                    ? "Try a different search or filter."
                                    : "You're all clear — keep it up!"}
                            </p>
                        </div>
                    ) : (
                        filtered.map((p) => (
                            <PenaltyCard
                                key={p.penalty_id}
                                penalty={p}
                                onView={() => setActive(p)}
                            />
                        ))
                    )}
                </section>
            </div>

            {/* ===== 5.13 / 5.14 Detail modal ===== */}
            <BoarderPenaltyDetailModal
                open={active !== null}
                penalty={active}
                onClose={() => setActive(null)}
            />
        </div>
    );
}

/* ============================================================
   SUBCOMPONENTS
   ============================================================ */

type IconType = React.ComponentType<{ size?: number; className?: string }>;

function SummaryTile({
    icon: Icon,
    iconClass,
    label,
    value,
    meta,
    emphasize = false,
}: {
    icon: IconType;
    iconClass: string;
    label: string;
    value: string;
    meta: string;
    emphasize?: boolean;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 sm:p-5">
            <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-400">{label}</p>
                <Icon size={20} className={iconClass} />
            </div>
            <p
                className={`mt-2.5 truncate text-lg font-semibold tabular-nums tracking-tight sm:text-xl ${
                    emphasize ? "text-amber-300" : "text-slate-50"
                }`}
            >
                {value}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-slate-500">{meta}</p>
        </div>
    );
}

function PenaltyCard({
    penalty,
    onView,
}: {
    penalty: Penalty;
    onView: () => void;
}) {
    const amount = num(penalty.amount);
    const paid = num(penalty.amount_paid);
    const outstanding = Math.max(amount - paid, 0);
    const pct = amount > 0 ? Math.min(Math.round((paid / amount) * 100), 100) : 0;
    const overdue = isOverdue(penalty);
    const waived = penalty.status === "Waived";
    const active = penalty.status === "Pending" || penalty.status === "Partially Paid";

    return (
        <div className="group rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_10px_28px_-18px_rgba(15,23,42,0.25)] sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                    <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${
                            active
                                ? "bg-amber-50 ring-amber-100"
                                : "bg-emerald-50 ring-emerald-100"
                        }`}
                    >
                        {active ? (
                            <TriangleAlert size={17} className="text-amber-500" />
                        ) : (
                            <CircleCheck size={17} className="text-emerald-500" />
                        )}
                    </div>

                    <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-semibold tracking-tight text-slate-900">
                            {penalty.penalty_name ?? "Custom penalty"}
                        </p>
                        <p className="mt-0.5 truncate text-[11.5px] text-slate-400">
                            Issued {fmtDate(penalty.penalty_date)}
                            {penalty.assigned_by ? ` · by ${penalty.assigned_by}` : ""}
                        </p>
                    </div>
                </div>

                <span
                    className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${STATUS_STYLE[penalty.status]}`}
                >
                    {penalty.status}
                </span>
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <div className="min-w-0">
                    <p className="text-[10.5px] uppercase tracking-wide text-slate-400">
                        {waived ? "Amount" : outstanding > 0 ? "Outstanding" : "Amount"}
                    </p>
                    <p
                        className={`text-[17px] font-bold tabular-nums tracking-tight ${
                            waived
                                ? "text-slate-500"
                                : outstanding > 0
                                  ? "text-amber-600"
                                  : "text-emerald-600"
                        }`}
                    >
                        {peso(waived ? amount : outstanding > 0 ? outstanding : amount)}
                    </p>
                    {!waived && paid > 0 && outstanding > 0 && (
                        <p className="text-[10.5px] text-slate-400">
                            {peso(paid)} of {peso(amount)} paid
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {overdue && (
                        <span className="text-[10.5px] font-semibold text-rose-600">
                            Overdue · due {fmtDate(penalty.due_date)}
                        </span>
                    )}
                    <button
                        onClick={onView}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    >
                        <Eye size={13} />
                        View details
                    </button>
                </div>
            </div>

            {!waived && (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                        className={`h-full rounded-full transition-all ${
                            pct >= 100 ? "bg-emerald-500" : "bg-blue-500"
                        }`}
                        style={{ width: `${pct}%` }}
                    />
                </div>
            )}
        </div>
    );
}
