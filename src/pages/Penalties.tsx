"use client";

import { useMemo, useState } from "react";
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
    ScrollText,
    Clock3,
    CreditCard,
    CircleCheck,
    ShieldOff,
    PhilippinePeso,
    ReceiptText,
    Inbox,
} from "lucide-react";



type PenaltyStatus = "Pending" | "Partially Paid" | "Paid" | "Waived";



type Penalty = {
    id: number;
    penalty_rule_id: number | null;
    penalty_rule_name: string | null;
    boarder_id: number;
    boarder_name: string;
    boarder_code: string;
    boarder_avatar?: string | null;
    assigned_by: number;
    assigned_by_name: string;
    assigned_by_role: string;
    penalty_date: string;
    amount: number;
    amount_paid: number;
    reason: string | null;
    status: PenaltyStatus;
    due_date: string | null;
};



const PENALTIES: Penalty[] = [
    { id: 12, penalty_rule_id: 1, penalty_rule_name: "Late Payment Fee", boarder_id: 25, boarder_name: "John Dela Cruz", boarder_code: "B0025", assigned_by: 3, assigned_by_name: "Maria Santos", assigned_by_role: "Staff", penalty_date: "2025-05-14", amount: 500, amount_paid: 0, reason: "Rent for May paid past the grace period.", status: "Pending", due_date: "2025-05-21" },
    { id: 11, penalty_rule_id: 2, penalty_rule_name: "Noise Violation", boarder_id: 18, boarder_name: "Ana Reyes", boarder_code: "B0018", assigned_by: 4, assigned_by_name: "Jose Garcia", assigned_by_role: "Staff", penalty_date: "2025-05-12", amount: 300, amount_paid: 150, reason: "Loud music reported after 10PM.", status: "Partially Paid", due_date: "2025-05-26" },
    { id: 10, penalty_rule_id: 3, penalty_rule_name: "Property Damage", boarder_id: 12, boarder_name: "Michael Lee", boarder_code: "B0012", assigned_by: 1, assigned_by_name: "Admin User", assigned_by_role: "Administrator", penalty_date: "2025-05-10", amount: 1500, amount_paid: 1500, reason: "Broken window latch in Room 204.", status: "Paid", due_date: "2025-05-17" },
    { id: 9, penalty_rule_id: 1, penalty_rule_name: "Late Payment Fee", boarder_id: 31, boarder_name: "Jessica Tan", boarder_code: "B0031", assigned_by: 3, assigned_by_name: "Maria Santos", assigned_by_role: "Staff", penalty_date: "2025-05-08", amount: 500, amount_paid: 0, reason: null, status: "Pending", due_date: "2025-05-15" },
    { id: 8, penalty_rule_id: 2, penalty_rule_name: "Noise Violation", boarder_id: 22, boarder_name: "Kevin Salazar", boarder_code: "B0022", assigned_by: 4, assigned_by_name: "Jose Garcia", assigned_by_role: "Staff", penalty_date: "2025-05-05", amount: 300, amount_paid: 300, reason: "Repeated disturbance in common area.", status: "Paid", due_date: "2025-05-12" },
    { id: 7, penalty_rule_id: null, penalty_rule_name: null, boarder_id: 27, boarder_name: "Liza Moreno", boarder_code: "B0027", assigned_by: 1, assigned_by_name: "Admin User", assigned_by_role: "Administrator", penalty_date: "2025-05-03", amount: 250, amount_paid: 0, reason: "Waived after review of CCTV footage.", status: "Waived", due_date: "2025-05-10" },
];

/* ============================================================
   HELPERS
   ============================================================ */

const peso = (v: number) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
        minimumFractionDigits: 2,
    }).format(v);

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



export default function PenaltiesPage() {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"All Status" | PenaltyStatus>("All Status");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [page, setPage] = useState(1);

    // Settlement form
    const [selectedId, setSelectedId] = useState<number | null>(12);
    const [payAmount, setPayAmount] = useState("500.00");
    const [settleDate, setSettleDate] = useState("2025-05-14");
    const [method, setMethod] = useState("Cash");
    const [reference, setReference] = useState("OR-2025-00012");
    const [notes, setNotes] = useState("");

    /* ---------- stats ---------- */
    const stats = useMemo(() => {
        const by = (s: PenaltyStatus) => PENALTIES.filter((p) => p.status === s);
        const sum = (list: Penalty[]) =>
            list.reduce((t, p) => t + (p.amount - p.amount_paid), 0);

        const pending = by("Pending");
        const partial = by("Partially Paid");
        const paid = by("Paid");
        const waived = by("Waived");

        return {
            total: PENALTIES.length,
            totalAmount: PENALTIES.reduce((t, p) => t + p.amount, 0),
            pending: { count: pending.length, amount: sum(pending) },
            partial: { count: partial.length, amount: sum(partial) },
            paid: {
                count: paid.length,
                amount: paid.reduce((t, p) => t + p.amount_paid, 0),
            },
            waived: {
                count: waived.length,
                amount: waived.reduce((t, p) => t + p.amount, 0),
            },
        };
    }, []);

    /* ---------- filtering ---------- */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();

        return PENALTIES.filter((p) => {
            const matchesQuery =
                !q ||
                p.boarder_name.toLowerCase().includes(q) ||
                p.boarder_code.toLowerCase().includes(q) ||
                (p.penalty_rule_name ?? "").toLowerCase().includes(q) ||
                (p.reason ?? "").toLowerCase().includes(q) ||
                p.status.toLowerCase().includes(q);

            const matchesStatus = status === "All Status" || p.status === status;

            const d = new Date(p.penalty_date).getTime();
            const afterFrom = !fromDate || d >= new Date(fromDate).getTime();
            const beforeTo = !toDate || d <= new Date(toDate).getTime();

            return matchesQuery && matchesStatus && afterFrom && beforeTo;
        });
    }, [search, status, fromDate, toDate]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    const selected = PENALTIES.find((p) => p.id === selectedId) ?? null;
    const outstanding = selected ? selected.amount - selected.amount_paid : 0;

    const isFiltered =
        search !== "" || status !== "All Status" || fromDate !== "" || toDate !== "";

    const resetFilters = () => {
        setSearch("");
        setStatus("All Status");
        setFromDate("");
        setToDate("");
        setPage(1);
    };

    return (
       <div className="h-screen overflow-y-hidden">
            <div className="h-full overflow-y-auto space-y-2 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-15 pt-4 bg-gray-50">
               
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

                {/* ===== Main grid ===== */}
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                    {/* ---------- Records ---------- */}
                    <section className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] xl:col-span-2">
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
                                        {filtered.length} of {PENALTIES.length} records
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
                                    className="h-8.5 w-full rounded-lg border border-slate-200 bg-white pl-8.5 pr-3 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                    style={{ height: "34px", paddingLeft: "2rem" }}
                                />
                            </div>

                            <div className="flex items-center gap-2">
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
                                    {paged.length === 0 ? (
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
                                            const active = p.id === selectedId;

                                            return (
                                                <tr
                                                    key={p.id}
                                                    onClick={() => setSelectedId(p.id)}
                                                    className={`cursor-pointer border-b border-slate-50 transition-colors last:border-0 ${
                                                        active
                                                            ? "bg-slate-50"
                                                            : "hover:bg-slate-50/60"
                                                    }`}
                                                >
                                                    <Td className="text-slate-400 tabular-nums">
                                                        {p.id}
                                                    </Td>

                                                    <Td>
                                                        <div className="flex min-w-0 items-center gap-2">
                                                            <Avatar
                                                                name={p.boarder_name}
                                                                src={p.boarder_avatar}
                                                            />
                                                            <div className="min-w-0">
                                                                <p className="truncate text-[12px] font-medium text-slate-900">
                                                                    {p.boarder_name}
                                                                </p>
                                                                <p className="truncate text-[10.5px] text-slate-400">
                                                                    #{p.boarder_code}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Td>

                                                    <Td>
                                                        <p className="truncate text-[12px] text-slate-700">
                                                            {p.penalty_rule_name ?? (
                                                                <span className="italic text-slate-400">
                                                                    Custom
                                                                </span>
                                                            )}
                                                        </p>
                                                        <p className="truncate text-[10.5px] text-slate-400">
                                                            by {p.assigned_by_name}
                                                        </p>
                                                    </Td>

                                                    <Td className="whitespace-nowrap text-slate-500">
                                                        {fmtDate(p.penalty_date)}
                                                    </Td>

                                                    <Td className="whitespace-nowrap text-right">
                                                        <span className="font-semibold tabular-nums text-slate-900">
                                                            {peso(p.amount)}
                                                        </span>
                                                        {p.amount_paid > 0 &&
                                                            p.amount_paid < p.amount && (
                                                                <span className="block text-[10px] tabular-nums text-blue-600">
                                                                    {peso(p.amount_paid)} paid
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
                                                        <RowMenu />
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
                                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                                        disabled={safePage === 1}
                                    >
                                        <ChevronLeft size={13} />
                                    </PageBtn>

                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                                        (n) => (
                                            <button
                                                key={n}
                                                onClick={() => setPage(n)}
                                                className={`h-7 min-w-7 rounded-lg px-1.5 text-[11.5px] font-medium tabular-nums transition-colors ${
                                                    n === safePage
                                                        ? "bg-slate-900 text-white"
                                                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                                }`}
                                            >
                                                {n}
                                            </button>
                                        )
                                    )}

                                    <PageBtn
                                        onClick={() =>
                                            setPage((p) => Math.min(totalPages, p + 1))
                                        }
                                        disabled={safePage === totalPages}
                                    >
                                        <ChevronRight size={13} />
                                    </PageBtn>
                                </div>
                            </div>
                        )}
                    </section>

                    {/* ---------- Settlement panel ---------- */}
                    <aside className="h-fit overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.03)] xl:sticky xl:top-4">
                        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900">
                                <ReceiptText size={14} className="text-white" />
                            </span>
                            <div>
                                <h2 className="text-[13.5px] font-semibold tracking-tight text-slate-900">
                                    Record Settlement
                                </h2>
                                <p className="text-[11px] leading-tight text-slate-400">
                                    Log a payment against a penalty
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 px-4 py-3.5">
                            {/* Select penalty */}
                            <Field label="Select Penalty">
                                <div className="relative">
                                    <select
                                        value={selectedId ?? ""}
                                        onChange={(e) => setSelectedId(Number(e.target.value))}
                                        className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-[12px] text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                    >
                                        <option value="">Choose a penalty…</option>
                                        {PENALTIES.filter(
                                            (p) =>
                                                p.status === "Pending" ||
                                                p.status === "Partially Paid"
                                        ).map((p) => (
                                            <option key={p.id} value={p.id}>
                                                #{p.id} · {p.boarder_name} ·{" "}
                                                {p.penalty_rule_name ?? "Custom"}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown
                                        size={13}
                                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                    />
                                </div>
                            </Field>

                            {/* Outstanding */}
                            <div className="rounded-xl bg-slate-50 px-3 py-2.5 ring-1 ring-inset ring-slate-200/70">
                                <div className="flex items-baseline justify-between">
                                    <p className="text-[10.5px] font-medium uppercase tracking-wide text-slate-500">
                                        Outstanding
                                    </p>
                                    {selected && (
                                        <StatusBadge status={selected.status} />
                                    )}
                                </div>
                                <p
                                    className={`mt-1 text-[19px] font-bold tabular-nums tracking-tight ${
                                        outstanding > 0 ? "text-amber-600" : "text-emerald-600"
                                    }`}
                                >
                                    {peso(outstanding)}
                                </p>
                                {selected && (
                                    <p className="mt-0.5 text-[10.5px] text-slate-400">
                                        {peso(selected.amount_paid)} of {peso(selected.amount)}{" "}
                                        settled
                                    </p>
                                )}
                            </div>

                            <Field label="Payment Amount">
                                <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 transition focus-within:border-slate-300 focus-within:ring-4 focus-within:ring-slate-100">
                                    <span className="flex w-8 items-center justify-center border-r border-slate-200 bg-slate-50 text-slate-400">
                                        <PhilippinePeso size={12.5} />
                                    </span>
                                    <input
                                        value={payAmount}
                                        onChange={(e) => setPayAmount(e.target.value)}
                                        inputMode="decimal"
                                        placeholder="0.00"
                                        className="w-full px-2.5 py-2 text-[12px] tabular-nums text-slate-800 outline-none placeholder:text-slate-400"
                                    />
                                </div>
                            </Field>

                            <div className="grid grid-cols-2 gap-2.5">
                                <Field label="Settlement Date">
                                    <input
                                        type="date"
                                        value={settleDate}
                                        onChange={(e) => setSettleDate(e.target.value)}
                                        className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[12px] text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                    />
                                </Field>

                                <Field label="Method">
                                    <div className="relative">
                                        <select
                                            value={method}
                                            onChange={(e) => setMethod(e.target.value)}
                                            className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-2.5 pr-7 text-[12px] text-slate-700 outline-none transition focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                        >
                                            <option>Cash</option>
                                            <option>GCash</option>
                                            <option>Bank Transfer</option>
                                            <option>Maya</option>
                                        </select>
                                        <ChevronDown
                                            size={13}
                                            className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                                        />
                                    </div>
                                </Field>
                            </div>

                            <Field label="Reference / OR No.">
                                <input
                                    value={reference}
                                    onChange={(e) => setReference(e.target.value)}
                                    placeholder="OR-2025-00012"
                                    className="w-full rounded-lg border border-slate-200 px-2.5 py-2 text-[12px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                />
                            </Field>

                            <Field label="Notes" optional>
                                <textarea
                                    rows={2}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add a short remark…"
                                    className="w-full resize-none rounded-lg border border-slate-200 px-2.5 py-2 text-[12px] leading-relaxed text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                />
                            </Field>
                        </div>

                        <div className="space-y-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3">
                            <button
                                type="button"
                                disabled={!selected || outstanding <= 0}
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2.5 text-[12px] font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                            >
                                <BadgeCheck size={14} />
                                Record Settlement
                            </button>

                            <button
                                type="button"
                                disabled={!selected || outstanding <= 0}
                                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[11.5px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Ban size={13} />
                                Waive Penalty
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
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

function Avatar({ name, src }: { name: string; src?: string | null }) {
    if (src) {
        return (
            <img
                src={src}
                alt={name}
                className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
            />
        );
    }

    const initials = name
        .split(" ")
        .map((n) => n[0])
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

function RowMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative inline-block"
            onClick={(e) => e.stopPropagation()}
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Row actions"
            >
                <MoreVertical size={14} />
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-left shadow-lg">
                        <MenuItem icon={Eye} label="View Details" />
                        <MenuItem icon={Pencil} label="Edit" />
                        <MenuItem icon={BadgeCheck} label="Settle" />
                        <div className="my-1 h-px bg-slate-100" />
                        <MenuItem icon={Ban} label="Waive" danger />
                    </div>
                </>
            )}
        </div>
    );
}

function MenuItem({
    icon: Icon,
    label,
    danger,
}: {
    icon: IconType;
    label: string;
    danger?: boolean;
}) {
    return (
        <button
            type="button"
            className={`flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[11.5px] transition-colors ${
                danger
                    ? "text-rose-600 hover:bg-rose-50"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
        >
            <Icon size={13} />
            {label}
        </button>
    );
}

function Field({
    label,
    optional,
    children,
}: {
    label: string;
    optional?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="mb-1 block text-[10.5px] font-medium text-slate-600">
                {label}
                {optional && (
                    <span className="ml-1 font-normal text-slate-400">(optional)</span>
                )}
            </label>
            {children}
        </div>
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