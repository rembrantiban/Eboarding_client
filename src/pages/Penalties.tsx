"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Filter,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    MoreVertical,
    Eye,
    Pencil,
    BadgeCheck,
    Ban,
    Trash2,
    ScrollText,
    Clock3,
    CreditCard,
    CircleCheck,
    ShieldOff,
    Inbox,
    Plus,
    LoaderCircle,
} from "lucide-react";
import { usePenalty } from "@/hooks/usePenalty";
import type { Penalty, PenaltyStatus } from "@/store/usePenaltyStore";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AssignPenaltyModal from "@/components/penalty/AssignPenaltyModal";
import EditPenaltyModal from "@/components/penalty/EditPenaltyModal";
import ViewPenaltyModal from "@/components/penalty/ViewPenaltyModal";
import ConfirmPenaltyModal from "@/components/penalty/ConfirmPenaltyModal";
import { useQuickAction } from "@/hooks/useQuickAction";
import SettlePenaltyModal from "@/components/penalty/SettlePenaltyModal";
import PenaltyRulesModal from "@/components/penalty/PenaltyRulesModal";
import { useAuth } from "@/hooks/useAuth";

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

const n = (v: unknown) => {
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

const PAGE_SIZE = 5;

type ModalKind = "view" | "edit" | "settle" | "waive" | "remove" | null;

/* ============================================================
   PAGE
   ============================================================ */

export default function PenaltiesPage() {
    const { isAdmin } = useAuth();
    const {
        penalties,
        loading,
        getAllPenalties,
        removePenalty,
        waivePenalty,
    } = usePenalty();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"All Status" | PenaltyStatus>("All Status");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useState(1);

    const [rulesOpen, setRulesOpen] = useState(false);
    const quickAssign = useQuickAction("assign-penalty");
    const [assignOpen, setAssignOpen] = useState(quickAssign);
    const [modal, setModal] = useState<ModalKind>(null);
    const [active, setActive] = useState<Penalty | null>(null);

    useEffect(() => {
        getAllPenalties();
    }, [getAllPenalties]);

    /* ---------- stats ---------- */
    const stats = useMemo(() => {
        const by = (s: PenaltyStatus) => penalties.filter((p) => p.status === s);
        const outstandingSum = (list: Penalty[]) =>
            list.reduce((t, p) => t + (n(p.amount) - n(p.amount_paid)), 0);

        const pending = by("Pending");
        const partial = by("Partially Paid");
        const paid = by("Paid");
        const waived = by("Waived");

        return {
            total: penalties.length,
            totalAmount: penalties.reduce((t, p) => t + n(p.amount), 0),
            pending: { count: pending.length, amount: outstandingSum(pending) },
            partial: { count: partial.length, amount: outstandingSum(partial) },
            paid: {
                count: paid.length,
                amount: paid.reduce((t, p) => t + n(p.amount_paid), 0),
            },
            waived: {
                count: waived.length,
                amount: waived.reduce((t, p) => t + n(p.amount), 0),
            },
        };
    }, [penalties]);

    /* ---------- filtering (5.6 Search Penalty Records) ---------- */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return penalties.filter((p) => {
            const name = `${p.first_name} ${p.last_name}`.toLowerCase();
            const matchesQuery =
                !q ||
                name.includes(q) ||
                (p.email ?? "").toLowerCase().includes(q) ||
                (p.penalty_name ?? "").toLowerCase().includes(q) ||
                (p.reason ?? "").toLowerCase().includes(q) ||
                p.status.toLowerCase().includes(q);

            const matchesStatus = status === "All Status" || p.status === status;

            const d = new Date(p.penalty_date).getTime();
            const afterFrom = !fromDate || d >= new Date(fromDate).getTime();
            const beforeTo = !toDate || d <= new Date(toDate).getTime();

            return matchesQuery && matchesStatus && afterFrom && beforeTo;
        });
    }, [penalties, search, status, fromDate, toDate]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const isFiltered =
        search !== "" || status !== "All Status" || fromDate !== "" || toDate !== "";

    const resetFilters = () => {
        setSearch("");
        setStatus("All Status");
        setFromDate("");
        setToDate("");
        setPage(1);
    };

    const openModal = (kind: Exclude<ModalKind, null>, p: Penalty) => {
        setActive(p);
        setModal(kind);
    };
    const closeModal = () => {
        setModal(null);
        setActive(null);
    };

    return (
        <div className="h-full overflow-y-hidden">
            <div className="h-full overflow-y-auto space-y-2 px-10 pb-15 pt-4 bg-gray-50">
                {/* ===== Page actions ===== */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h1 className="text-[15px] font-semibold tracking-tight text-slate-900">
                            Penalty Management
                        </h1>
                        <p className="text-[11.5px] text-slate-400">
                            Rules, assignments and settlements
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {isAdmin && (
                            <button
                                type="button"
                                onClick={() => setRulesOpen(true)}
                                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                <ScrollText size={13.5} />
                                Penalty
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setAssignOpen(true)}
                            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-slate-800"
                        >
                            <Plus size={13.5} />
                            Assign Penalty
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <StatCard
                        tone="slate"
                        icon={ScrollText}
                        label="Total Penalties"
                        value={String(stats.total)}
                        meta="All time records"
                    />
                    <StatCard
                        tone="amber"
                        icon={Clock3}
                        label="Pending"
                        value={String(stats.pending.count)}
                        meta={`Outstanding ${peso(stats.pending.amount)}`}
                    />
                    <StatCard
                        tone="blue"
                        icon={CreditCard}
                        label="Partially Paid"
                        value={String(stats.partial.count)}
                        meta={`Remaining ${peso(stats.partial.amount)}`}
                    />
                    <StatCard
                        tone="emerald"
                        icon={CircleCheck}
                        label="Collected"
                        value={String(stats.paid.count)}
                        meta={`Settled ${peso(stats.paid.amount)}`}
                    />
                </div>

                {/* ===== Records ===== */}
                <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                    {/* header */}
                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900">
                                <ScrollText size={14} className="text-white" />
                            </span>
                            <div className="min-w-0">
                                <h2 className="truncate text-[13.5px] font-semibold tracking-tight text-slate-900">
                                    Penalty Records
                                </h2>
                                <p className="text-[11px] leading-tight text-slate-400">
                                    {filtered.length} of {penalties.length} records
                                </p>
                            </div>
                        </div>

                        {stats.waived.count > 0 && (
                            <span className="hidden shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-medium text-slate-500 ring-1 ring-inset ring-slate-200 sm:inline-flex">
                                <ShieldOff size={11} />
                                {stats.waived.count} waived
                            </span>
                        )}
                    </div>

                    {/* toolbar */}
                    <div className="flex flex-col gap-2 border-b border-slate-100 px-4 py-2.5 lg:flex-row lg:items-center">
                        <div className="relative flex-1">
                            <Search
                                size={13.5}
                                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search boarder, rule, reason..."
                                className="w-full rounded-lg border border-slate-200 bg-white pr-3 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                style={{ height: "34px", paddingLeft: "2rem" }}
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="relative flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2">
                                <Calendar size={12.5} className="shrink-0 text-slate-400" />
                                <input
                                    type="date"
                                    value={fromDate}
                                    onChange={(e) => {
                                        setFromDate(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-26 bg-transparent py-1.5 text-[11.5px] text-slate-600 outline-none"
                                    style={{ height: "32px" }}
                                />
                                <span className="text-[11px] text-slate-300">–</span>
                                <input
                                    type="date"
                                    value={toDate}
                                    onChange={(e) => {
                                        setToDate(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-26 bg-transparent py-1.5 text-[11.5px] text-slate-600 outline-none"
                                    style={{ height: "32px" }}
                                />
                            </div>

                            <div className="relative">
                                <select
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value as typeof status);
                                        setPage(1);
                                    }}
                                    className="appearance-none rounded-lg border border-slate-200 bg-white pl-2.5 pr-7 text-[11.5px] font-medium text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                    style={{ height: "34px" }}
                                >
                                    {STATUS_FILTERS.map((s) => (
                                        <option key={s} value={s}>
                                            {s}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown
                                    size={12}
                                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={resetFilters}
                                disabled={!isFiltered}
                                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-2.5 text-[11.5px] font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                                style={{ height: "34px" }}
                            >
                                <Filter size={12.5} />
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* table */}
                    <div className="min-h-0 flex-1 overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/70">
                                    <Th className="w-10">ID</Th>
                                    <Th>Boarder</Th>
                                    <Th>Penalty Rule</Th>
                                    <Th className="whitespace-nowrap">Date</Th>
                                    <Th className="text-right">Amount</Th>
                                    <Th>Status</Th>
                                    <Th className="whitespace-nowrap">Due Date</Th>
                                    <Th className="text-right">Actions</Th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading && penalties.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-14">
                                            <div className="flex flex-col items-center text-center text-slate-400">
                                                <LoaderCircle
                                                    size={20}
                                                    className="animate-spin"
                                                />
                                                <p className="mt-3 text-[12px]">
                                                    Loading penalties…
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : paged.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-4 py-14">
                                            <div className="flex flex-col items-center text-center">
                                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 ring-1 ring-inset ring-slate-200/70">
                                                    <Inbox size={17} className="text-slate-400" />
                                                </div>
                                                <p className="mt-3 text-[12.5px] font-semibold text-slate-900">
                                                    No penalties found
                                                </p>
                                                <p className="mt-0.5 text-[11.5px] text-slate-400">
                                                    {isFiltered
                                                        ? "Try adjusting your search or filters."
                                                        : "Recorded penalties will appear here."}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paged.map((p) => {
                                        const overdue = isOverdue(p);
                                        const amt = n(p.amount);
                                        const paid = n(p.amount_paid);

                                        return (
                                            <tr
                                                key={p.penalty_id}
                                                className="border-b border-slate-50 transition-colors last:border-0 hover:bg-slate-50/60"
                                            >
                                                <Td className="text-slate-400 tabular-nums">
                                                    {p.penalty_id}
                                                </Td>

                                                <Td>
                                                    <div className="flex min-w-0 items-center gap-2">
                                                        <Avatar
                                                            name={`${p.first_name} ${p.last_name}`}
                                                        />
                                                        <div className="min-w-0">
                                                            <p className="truncate text-[12px] font-medium text-slate-900">
                                                                {p.first_name} {p.last_name}
                                                            </p>
                                                            <p className="truncate text-[10.5px] text-slate-400">
                                                                {p.email}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Td>

                                                <Td>
                                                    <p className="truncate text-[12px] text-slate-700">
                                                        {p.penalty_name ?? (
                                                            <span className="italic text-slate-400">
                                                                Custom
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="truncate text-[10.5px] text-slate-400">
                                                        by {p.assigned_by ?? "—"}
                                                    </p>
                                                </Td>

                                                <Td className="whitespace-nowrap text-slate-500">
                                                    {fmtDate(p.penalty_date)}
                                                </Td>

                                                <Td className="whitespace-nowrap text-right">
                                                    <span className="font-semibold tabular-nums text-slate-900">
                                                        {peso(amt)}
                                                    </span>
                                                    {paid > 0 && paid < amt && (
                                                        <span className="block text-[10px] tabular-nums text-blue-600">
                                                            {peso(paid)} paid
                                                        </span>
                                                    )}
                                                </Td>

                                                <Td>
                                                    <StatusBadge status={p.status} />
                                                </Td>

                                                <Td className="whitespace-nowrap">
                                                    <span className="text-slate-500">
                                                        {fmtDate(p.due_date)}
                                                    </span>
                                                    {overdue && (
                                                        <span className="block text-[10px] font-medium text-rose-600">
                                                            Overdue
                                                        </span>
                                                    )}
                                                </Td>

                                                <Td className="text-right">
                                                    <RowMenu
                                                        penalty={p}
                                                        isAdmin={isAdmin}
                                                        onView={() => openModal("view", p)}
                                                        onEdit={() => openModal("edit", p)}
                                                        onSettle={() => openModal("settle", p)}
                                                        onWaive={() => openModal("waive", p)}
                                                        onRemove={() => openModal("remove", p)}
                                                    />
                                                </Td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* pagination */}
                    {filtered.length > 0 && (
                        <div className="flex items-center justify-between gap-3 border-t border-slate-100 px-4 py-2.5">
                            <p className="text-[11px] text-slate-400">
                                Showing {(safePage - 1) * PAGE_SIZE + 1} to{" "}
                                {Math.min(safePage * PAGE_SIZE, filtered.length)} of{" "}
                                {filtered.length} records
                            </p>

                            <div className="flex items-center gap-1">
                                <PageBtn
                                    onClick={() => setPage((x) => Math.max(1, x - 1))}
                                    disabled={safePage === 1}
                                >
                                    <ChevronLeft size={13} />
                                </PageBtn>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                    (num) => (
                                        <button
                                            key={num}
                                            onClick={() => setPage(num)}
                                            className={`h-7 min-w-7 rounded-lg px-1.5 text-[11.5px] font-medium tabular-nums transition-colors ${
                                                num === safePage
                                                    ? "bg-slate-900 text-white"
                                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                            }`}
                                        >
                                            {num}
                                        </button>
                                    )
                                )}

                                <PageBtn
                                    onClick={() =>
                                        setPage((x) => Math.min(totalPages, x + 1))
                                    }
                                    disabled={safePage === totalPages}
                                >
                                    <ChevronRight size={13} />
                                </PageBtn>
                            </div>
                        </div>
                    )}
                </section>
            </div>

            {/* ===== Modals ===== */}
            <PenaltyRulesModal open={rulesOpen} onClose={() => setRulesOpen(false)} />

            <AssignPenaltyModal
                open={assignOpen}
                onClose={() => setAssignOpen(false)}
                onDone={getAllPenalties}
            />

            <ViewPenaltyModal
                open={modal === "view"}
                onClose={closeModal}
                penalty={active}
            />

            <EditPenaltyModal
                open={modal === "edit"}
                onClose={closeModal}
                penalty={active}
                onDone={getAllPenalties}
            />

            <SettlePenaltyModal
                open={modal === "settle"}
                onClose={closeModal}
                penalty={active}
                onDone={getAllPenalties}
            />

            <ConfirmPenaltyModal
                open={modal === "waive"}
                mode="waive"
                onClose={closeModal}
                penalty={active}
                onConfirm={waivePenalty}
                onDone={getAllPenalties}
            />

            <ConfirmPenaltyModal
                open={modal === "remove"}
                mode="remove"
                onClose={closeModal}
                penalty={active}
                onConfirm={removePenalty}
                onDone={getAllPenalties}
            />
        </div>
    );
}

/* ============================================================
   SUBCOMPONENTS
   ============================================================ */

type IconType = React.ComponentType<{ size?: number; className?: string }>;

const STAT_TONE = {
    slate: { tile: "bg-slate-100 ring-slate-200/70", icon: "text-slate-600" },
    amber: { tile: "bg-amber-50 ring-amber-100", icon: "text-amber-600" },
    blue: { tile: "bg-blue-50 ring-blue-100", icon: "text-blue-600" },
    emerald: { tile: "bg-emerald-50 ring-emerald-100", icon: "text-emerald-600" },
} as const;

function StatCard({
    tone,
    icon: Icon,
    label,
    value,
    meta,
}: {
    tone: keyof typeof STAT_TONE;
    icon: IconType;
    label: string;
    value: string;
    meta: string;
}) {
    const t = STAT_TONE[tone];

    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-shadow hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.15)]">
            <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${t.tile}`}
            >
                <Icon size={16} className={t.icon} />
            </div>
            <div className="min-w-0">
                <p className="truncate text-[11px] text-slate-500">{label}</p>
                <p className="text-[17px] font-bold leading-tight tabular-nums tracking-tight text-slate-900">
                    {value}
                </p>
                <p className="truncate text-[10.5px] text-slate-400">{meta}</p>
            </div>
        </div>
    );
}

function Avatar({ name }: { name: string }) {
    const initials = name
        .split(" ")
        .map((x) => x[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[10px] font-semibold text-white">
            {initials}
        </div>
    );
}

function StatusBadge({ status }: { status: PenaltyStatus }) {
    return (
        <span
            className={`inline-flex whitespace-nowrap rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ring-inset ${STATUS_STYLE[status]}`}
        >
            {status}
        </span>
    );
}

function RowMenu({
    penalty,
    isAdmin,
    onView,
    onEdit,
    onSettle,
    onWaive,
    onRemove,
}: {
    penalty: Penalty;
    isAdmin: boolean;
    onView: () => void;
    onEdit: () => void;
    onSettle: () => void;
    onWaive: () => void;
    onRemove: () => void;
}) {
    const settleable =
        penalty.status === "Pending" || penalty.status === "Partially Paid";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    aria-label="Row actions"
                    className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 outline-none transition hover:bg-slate-100 hover:text-slate-900 data-[state=open]:bg-slate-100 data-[state=open]:text-slate-900"
                >
                    <MoreVertical size={14} />
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-44 rounded-xl border-slate-200 p-1 text-[12.5px]"
            >
                <DropdownMenuItem onClick={onView} className="gap-2 rounded-lg">
                    <Eye size={14} /> View Details
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onEdit} className="gap-2 rounded-lg">
                    <Pencil size={14} /> Edit
                </DropdownMenuItem>

                {isAdmin && settleable && (
                    <DropdownMenuItem onClick={onSettle} className="gap-2 rounded-lg">
                        <BadgeCheck size={14} /> Record Settlement
                    </DropdownMenuItem>
                )}

                {isAdmin && settleable && (
                    <DropdownMenuItem onClick={onWaive} className="gap-2 rounded-lg">
                        <Ban size={14} /> Waive
                    </DropdownMenuItem>
                )}

                {isAdmin && (
                    <>
                        <DropdownMenuSeparator className="my-1 bg-slate-100" />

                        <DropdownMenuItem
                            onClick={onRemove}
                            variant="destructive"
                            className="gap-2 rounded-lg"
                        >
                            <Trash2 size={14} /> Remove
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function PageBtn({
    children,
    onClick,
    disabled,
}: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
        >
            {children}
        </button>
    );
}

function Th({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <th
            className={`px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 ${className}`}
        >
            {children}
        </th>
    );
}

function Td({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <td className={`px-3 py-2 text-[12px] ${className}`}>{children}</td>;
}
