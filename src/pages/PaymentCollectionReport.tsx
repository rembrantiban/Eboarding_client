import {
    ArrowLeft,
    Wallet,
    CheckCircle2,
    User,
    Percent,
    TrendingUp,
    TrendingDown,
    Calendar,
    ChevronDown,
    FileSpreadsheet,
    Printer,
    Search,
    ChevronLeft,
    ChevronRight,
    BadgeCheck,
    Loader2,
} from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useBilling } from "@/hooks/useBilling";
import { useEffect, useMemo, useState } from "react";
import type {
    BoarderBillingStatus,
    RecentTransaction,
} from "@/store/useBillingStore";
import PrintPaymentCollectionModal from "@/components/PaymentCollectionReport/PrintPaymentCollectionModal";
import { exportPaymentCollectionExcel } from "@/components/PaymentCollectionReport/exportPaymentCollectionExcel";

type PaymentStatus = "Paid" | "Partial" | "Overdue";

const statusBadge: Record<string, { chip: string; dot: string }> = {
    Paid: {
        chip: "border-emerald-200/70 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
    },
    Partial: {
        chip: "border-amber-200/70 bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
    },
    Unpaid: {
        chip: "border-slate-200 bg-slate-50 text-slate-600",
        dot: "bg-slate-400",
    },
    Overdue: {
        chip: "border-rose-200/70 bg-rose-50 text-rose-700",
        dot: "bg-rose-500",
    },
};

function StatusChip({ status }: { status?: string }) {
    const s = statusBadge[status ?? ""] ?? statusBadge.Unpaid;
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none ${s.chip}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {status ?? "—"}
        </span>
    );
}

const peso = (n: number) =>
    `₱${Number(n ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
const pesoK = (n: number) => (n === 0 ? "₱0" : `₱${Math.round(n / 1000)}K`);

const filters: (PaymentStatus | "All")[] = ["All", "Paid", "Partial", "Overdue"];

const TX_PER_PAGE = 5;
const BOARDERS_PER_PAGE = 5;

/* ------------------------------------------------------------------ */
/*  Chart tooltip                                                      */
/* ------------------------------------------------------------------ */

type ChartTooltipProps = {
    active?: boolean;
    label?: string;
    payload?: Array<{ value?: number | string; color?: string }>;
};

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
            <p className="mb-1 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p className="text-[12.5px] font-semibold tabular-nums text-slate-900">
                {peso(Number(payload[0].value ?? 0))}
            </p>
            <p className="text-[10.5px] text-slate-400">Total collections</p>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Pagination                                                         */
/* ------------------------------------------------------------------ */

function getPageItems(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 6) return Array.from({ length: total }, (_, i) => i + 1);

    const items: (number | "ellipsis")[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) items.push("ellipsis");
    for (let p = start; p <= end; p++) items.push(p);
    if (end < total - 1) items.push("ellipsis");
    items.push(total);

    return items;
}

function Pagination({
    page,
    totalPages,
    total,
    perPage,
    noun,
    onChange,
}: {
    page: number;
    totalPages: number;
    total: number;
    perPage: number;
    noun: string;
    onChange: (page: number) => void;
}) {
    const from = total === 0 ? 0 : (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, total);

    if (total === 0) return null;

    return (
        <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-400">
                Showing{" "}
                <span className="font-medium tabular-nums text-slate-600">
                    {from}–{to}
                </span>{" "}
                of <span className="tabular-nums">{total}</span> {noun}
            </p>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-40"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {getPageItems(page, totalPages).map((p, i) =>
                    p === "ellipsis" ? (
                        <span key={`gap-${i}`} className="px-0.5 text-[11px] text-slate-300">
                            &hellip;
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onChange(p)}
                            aria-current={p === page ? "page" : undefined}
                            className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-[11.5px] font-medium tabular-nums transition-colors ${p === page
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-500 hover:bg-slate-100"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page === totalPages || totalPages === 0}
                    aria-label="Next page"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-40"
                >
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function PaymentCollectionReport() {
    const navigate = useNavigate();
    const {
        collectionDashboardStats,
        getCollectionDashboardStats,
        collectionTrend,
        getCollectionTrend,
        recentTransactions,
        getRecentTransactions,
        boarderBillingStatus,
        getBoarderBillingStatus,
        getCollectionSummary,
        collectionSummary,
    } = useBilling();

    const [printOpen, setPrintOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const dateRange = `${firstDay.toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
    })} – ${lastDay.toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    })}`;

    useEffect(() => {
        getCollectionDashboardStats();
        getCollectionTrend();
        getRecentTransactions();
        getBoarderBillingStatus();
        getCollectionSummary();
        //eslint-disable-next-line
    }, []);

    const handleExcel = async () => {
        setExporting(true);
        try {
            await exportPaymentCollectionExcel({
                collectionDashboardStats,
                collectionTrend,
                recentTransactions,
                boarderBillingStatus,
            });
        } catch (err) {
            console.error("Excel export failed:", err);
        } finally {
            setExporting(false);
        }
    };

    /* transactions pagination */
    const [txPage, setTxPage] = useState(1);

    const txTotal = recentTransactions?.length ?? 0;
    const txTotalPages = Math.max(1, Math.ceil(txTotal / TX_PER_PAGE));

    useEffect(() => {
        if (txPage > txTotalPages) setTxPage(1);
    }, [txPage, txTotalPages]);

    const pagedTransactions = useMemo(
        () =>
            (recentTransactions ?? []).slice(
                (txPage - 1) * TX_PER_PAGE,
                txPage * TX_PER_PAGE
            ),
        [recentTransactions, txPage]
    );

    /* boarders filter + search + pagination */
    const [activeFilter, setActiveFilter] = useState<PaymentStatus | "All">("All");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const filteredBoarders = useMemo(() => {
        const q = search.trim().toLowerCase();
        return (boarderBillingStatus ?? []).filter((b: BoarderBillingStatus) => {
            const matchStatus = activeFilter === "All" || b.status === activeFilter;
            const matchSearch =
                q === "" ||
                String(b.name ?? "").toLowerCase().includes(q) ||
                String(b.room ?? "").toLowerCase().includes(q);
            return matchStatus && matchSearch;
        });
    }, [boarderBillingStatus, activeFilter, search]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredBoarders.length / BOARDERS_PER_PAGE)
    );

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [page, totalPages]);

    const pagedBoarders = useMemo(
        () =>
            filteredBoarders.slice(
                (page - 1) * BOARDERS_PER_PAGE,
                page * BOARDERS_PER_PAGE
            ),
        [filteredBoarders, page]
    );

    const stats = [
        {
            label: "Total collections",
            value: peso(collectionDashboardStats?.totalCollections ?? 0),
            change: collectionDashboardStats?.totalCollectionsChange,
            icon: Wallet,
        },
        {
            label: "Transactions",
            value: String(collectionDashboardStats?.totalTransactions ?? 0),
            change: collectionDashboardStats?.totalTransactionsChange,
            icon: CheckCircle2,
        },
        {
            label: "Paid boarders",
            value: String(collectionDashboardStats?.paidBoarders ?? 0),
            change: collectionDashboardStats?.paidBoardersChange,
            icon: User,
        },
        {
            label: "Collection rate",
            value: `${collectionDashboardStats?.collectionRate ?? 0}%`,
            change: undefined,
            icon: Percent,
            highlight: true,
        },
        {
            label: "Average collection",
            value: peso(collectionDashboardStats?.averageCollection ?? 0),
            change: undefined,
            icon: TrendingUp,
        },
    ];

    return (
        <div className="h-full overflow-hidden">
            <div className="h-full space-y-4 overflow-y-auto bg-slate-50/70 px-10 pb-15 pt-4">
                {/* Back link */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                    <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                    Back to reports
                </button>

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Reports · Collections
                        </p>
                        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                            Payment Collection Report
                        </h1>
                        <p className="mt-0.5 text-[11.5px] text-slate-500">
                            Collections, transaction records and boarder balances
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {dateRange}
                        </button>
                        <button
                            onClick={handleExcel}
                            disabled={exporting}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                        >
                            {exporting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin text-slate-400" />
                            ) : (
                                <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                            )}
                            {exporting ? "Preparing…" : "Excel"}
                        </button>
                        <button
                            onClick={() => setPrintOpen(true)}
                            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-[11.5px] font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print
                        </button>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        const up = (s.change ?? 0) >= 0;
                        return (
                            <div
                                key={s.label}
                                className="group rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
                                        {s.label}
                                    </p>
                                    <Icon className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
                                </div>

                                <p
                                    className={`mt-2 text-lg font-bold tabular-nums tracking-tight ${s.highlight ? "text-emerald-700" : "text-slate-900"
                                        }`}
                                >
                                    {s.value}
                                </p>

                                {s.change !== undefined ? (
                                    <div className="mt-2 flex items-center gap-1.5">
                                        <span
                                            className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums ${up
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-rose-50 text-rose-700"
                                                }`}
                                        >
                                            {up ? (
                                                <TrendingUp className="h-2.5 w-2.5" />
                                            ) : (
                                                <TrendingDown className="h-2.5 w-2.5" />
                                            )}
                                            {up ? "+" : ""}
                                            {s.change}%
                                        </span>
                                        <span className="text-[10.5px] text-slate-400">
                                            vs last month
                                        </span>
                                    </div>
                                ) : (
                                    <p className="mt-2 text-[10.5px] text-slate-400">
                                        This period
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Collection Trend */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                Collection trend
                            </h2>
                            <p className="mt-0.5 text-[11.5px] text-slate-400">
                                Total collections over the period
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                                Collections
                            </span>
                            <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-50">
                                Monthly
                                <ChevronDown className="h-3 w-3" />
                            </button>
                        </div>
                    </div>

                    <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={collectionTrend}
                                margin={{ top: 10, right: 5, left: -12, bottom: 0 }}
                            >
                                <defs>
                                    <linearGradient id="collectionFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#0f172a" stopOpacity={0.16} />
                                        <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid
                                    strokeDasharray="4 4"
                                    stroke="#f1f5f9"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    dy={6}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={pesoK}
                                    width={50}
                                />
                                <Tooltip
                                    content={<ChartTooltip />}
                                    cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#0f172a"
                                    strokeWidth={2}
                                    fill="url(#collectionFill)"
                                    dot={false}
                                    activeDot={{
                                        r: 4,
                                        fill: "#0f172a",
                                        stroke: "#fff",
                                        strokeWidth: 2,
                                    }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Transactions + Summary */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                    {/* Recent Collection Transactions */}
                    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2">
                        <div className="mb-3">
                            <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                Recent transactions
                            </h2>
                            <p className="mt-0.5 text-[11.5px] text-slate-400">
                                Latest payments received
                            </p>
                        </div>

                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full min-w-130 border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-[10.5px] uppercase tracking-wider text-slate-400">
                                        <th className="py-2.5 font-medium">Date</th>
                                        <th className="py-2.5 font-medium">Boarder</th>
                                        <th className="py-2.5 text-right font-medium">Amount</th>
                                        <th className="py-2.5 text-right font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagedTransactions.map((t: RecentTransaction, i: number) => (
                                        <tr
                                            key={`${t.date}-${t.boarder}-${i}`}
                                            className="border-b border-slate-50 text-[12.5px] text-slate-700 transition-colors last:border-0 hover:bg-slate-50/70"
                                        >
                                            <td className="py-3 text-[11px] tabular-nums text-slate-400">
                                                {t.date}
                                            </td>
                                            <td className="py-3 font-medium text-slate-900">
                                                {t.boarder}
                                            </td>
                                            <td className="py-3 text-right font-semibold tabular-nums text-slate-900">
                                                {peso(t.amount)}
                                            </td>
                                            <td className="py-3 text-right">
                                                <StatusChip status={t.status} />
                                            </td>
                                        </tr>
                                    ))}

                                    {pagedTransactions.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={4}
                                                className="py-12 text-center text-[12px] text-slate-400"
                                            >
                                                No transactions recorded yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            page={txPage}
                            totalPages={txTotalPages}
                            total={txTotal}
                            perPage={TX_PER_PAGE}
                            noun="transactions"
                            onChange={setTxPage}
                        />
                    </div>

                    {/* Collection Summary */}
                    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white">
                                <BadgeCheck className="h-4 w-4" />
                            </span>
                            <div>
                                <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                    Collection summary
                                </h2>
                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    This month at a glance
                                </p>
                            </div>
                        </div>

                        <dl className="space-y-0">
                            {[
                                {
                                    label: "Total collections",
                                    value: peso(collectionSummary?.totalCollections ?? 0),
                                    strong: true,
                                },
                                {
                                    label: "Total transactions",
                                    value: String(collectionSummary?.totalTransactions ?? 0),
                                },
                                {
                                    label: "Paid boarders",
                                    value: String(collectionSummary?.paidBoarders ?? 0),
                                },
                                {
                                    label: "Collection rate",
                                    value: `${collectionSummary?.collectionRate ?? 0}%`,
                                },
                            ].map((row) => (
                                <div
                                    key={row.label}
                                    className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-0"
                                >
                                    <dt className="text-[11.5px] text-slate-500">{row.label}</dt>
                                    <dd
                                        className={`tabular-nums ${row.strong
                                                ? "text-[13px] font-bold text-slate-900"
                                                : "text-[12.5px] font-semibold text-slate-900"
                                            }`}
                                    >
                                        {row.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>

                        <div className="mt-auto flex items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 ring-1 ring-slate-200">
                                <TrendingUp className="h-4 w-4" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[10.5px] uppercase tracking-wider text-slate-400">
                                    Compared to last month
                                </p>
                                <p className="text-[12px] font-semibold tabular-nums text-emerald-700">
                                    {(collectionDashboardStats?.totalCollectionsChange ?? 0) >= 0
                                        ? "+"
                                        : ""}
                                    {collectionDashboardStats?.totalCollectionsChange ?? 0}% in
                                    total collections
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Boarders Collection Status */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                Boarder collection status
                            </h2>
                            <p className="mt-0.5 text-[11.5px] text-slate-400">
                                {filteredBoarders.length} of{" "}
                                {boarderBillingStatus?.length ?? 0} boarders shown
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-0.5 rounded-xl border border-slate-200 bg-slate-50 p-0.5">
                                {filters.map((f) => (
                                    <button
                                        key={f}
                                        onClick={() => {
                                            setActiveFilter(f);
                                            setPage(1);
                                        }}
                                        className={`rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium transition-colors ${f === activeFilter
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>

                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => {
                                        setSearch(e.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Search boarder or room"
                                    className="h-9 w-52 rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-[12.5px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-300 focus:bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-180 border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-[10.5px] uppercase tracking-wider text-slate-400">
                                    <th className="py-2.5 font-medium">Boarder</th>
                                    <th className="py-2.5 font-medium">Room</th>
                                    <th className="py-2.5 font-medium">Due date</th>
                                    <th className="py-2.5 text-right font-medium">Total</th>
                                    <th className="py-2.5 text-right font-medium">Paid</th>
                                    <th className="py-2.5 text-right font-medium">Balance</th>
                                    <th className="py-2.5 pl-4 font-medium">Status</th>
                                    <th className="py-2.5 text-right font-medium">Paid on</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedBoarders.map((b: BoarderBillingStatus, i: number) => (
                                    <tr
                                        key={`${b.name}-${i}`}
                                        className="border-b border-slate-50 text-[12.5px] text-slate-700 transition-colors last:border-0 hover:bg-slate-50/70"
                                    >
                                        <td className="py-3 font-medium text-slate-900">
                                            {b.name}
                                        </td>
                                        <td className="py-3 tabular-nums">{b.room}</td>
                                        <td className="py-3 text-[11px] tabular-nums text-slate-400">
                                            {b.due}
                                        </td>
                                        <td className="py-3 text-right tabular-nums">
                                            {peso(b.total)}
                                        </td>
                                        <td className="py-3 text-right font-medium tabular-nums text-emerald-700">
                                            {peso(b.paid)}
                                        </td>
                                        <td
                                            className={`py-3 text-right tabular-nums ${b.balance > 0
                                                    ? "font-semibold text-rose-600"
                                                    : "text-slate-400"
                                                }`}
                                        >
                                            {peso(b.balance)}
                                        </td>
                                        <td className="py-3 pl-4">
                                            <StatusChip status={b.status} />
                                        </td>
                                        <td className="py-3 text-right text-[11px] tabular-nums text-slate-400">
                                            {b.paidDate || "—"}
                                        </td>
                                    </tr>
                                ))}

                                {pagedBoarders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="py-12 text-center text-[12px] text-slate-400"
                                        >
                                            No boarders match this filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        total={filteredBoarders.length}
                        perPage={BOARDERS_PER_PAGE}
                        noun="boarders"
                        onChange={setPage}
                    />
                </div>
            </div>

            <PrintPaymentCollectionModal
                open={printOpen}
                onClose={() => setPrintOpen(false)}
                collectionDashboardStats={collectionDashboardStats}
                collectionTrend={collectionTrend}
                recentTransactions={recentTransactions}
                boarderBillingStatus={boarderBillingStatus}
            />
        </div>
    );
}