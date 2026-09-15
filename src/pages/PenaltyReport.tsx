import { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Receipt,
    Users,
    AlertCircle,
    Clock,
    Calendar,
    ChevronDown,
    FileSpreadsheet,
    Printer,
    TriangleAlert,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Loader2,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LabelList,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { usePenalty } from "@/hooks/usePenalty";
import type { Penalty, PenaltyStatus } from "@/store/usePenaltyStore";
import PrintPenaltyModal from "@/components/PenaltyReport/PrintPenaltyModal";
import { exportPenaltyExcel } from "@/components/PenaltyReport/exportPenaltyExcel";

const peso = (n: number) =>
    `₱${Number(n ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const pesoK = (value: string | number | undefined) => {
    const n = Number(value ?? 0);
    return n === 0 ? "₱0" : `₱${n / 1000}K`;
};

// Same status vocabulary/colors used on the main Penalties page.
const statusBadge: Record<PenaltyStatus, string> = {
    Pending: "bg-amber-50 text-amber-700",
    "Partially Paid": "bg-blue-50 text-blue-700",
    Paid: "bg-emerald-50 text-emerald-700",
    Waived: "bg-slate-100 text-slate-600",
};

type BoarderStatus = "Paid" | "Partial" | "Unpaid";

const boarderStatusBadge: Record<BoarderStatus, string> = {
    Paid: "bg-emerald-50 text-emerald-700",
    Partial: "bg-amber-50 text-amber-700",
    Unpaid: "bg-rose-50 text-rose-700",
};

const TYPE_COLORS = ["#ea580c", "#2563eb", "#d97706", "#0891b2", "#7c3aed", "#dc2626"];

const BOARDERS_PER_PAGE = 5;

type TrendPeriod = "monthly" | "weekly";

const formatDate = (value?: string | null) => {
    if (!value) return "N/A";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-PH", { month: "short", day: "2-digit", year: "numeric" });
};

export default function PenaltyReport() {
    const navigate = useNavigate();
    const { penalties, loading, getAllPenalties } = usePenalty();

    useEffect(() => {
        getAllPenalties();
        // eslint-disable-next-line
    }, []);

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const dateRange = `${firstDay.toLocaleDateString("en-PH", { month: "short", day: "2-digit" })} – ${lastDay.toLocaleDateString("en-PH", { month: "short", day: "2-digit", year: "numeric" })}`;
    const periodLabel = now.toLocaleString("en-PH", { month: "long", year: "numeric" });

    /* ---------------- Derived data (all sourced from real penalties) ---------------- */

    const totalPenaltiesAmount = useMemo(
        () => penalties.reduce((sum, p) => sum + Number(p.amount ?? 0), 0),
        [penalties]
    );

    const penalizedBoarders = useMemo(
        () => new Set(penalties.map((p) => p.boarder_id)).size,
        [penalties]
    );

    const outstandingCount = useMemo(
        () => penalties.filter((p) => p.status === "Pending" || p.status === "Partially Paid").length,
        [penalties]
    );

    const averagePenalty = penalties.length ? totalPenaltiesAmount / penalties.length : 0;

    const stats = [
        {
            label: "Total Penalties",
            value: peso(totalPenaltiesAmount),
            icon: Receipt,
            bg: "bg-orange-50",
            fg: "text-orange-600",
        },
        {
            label: "Penalized Boarders",
            value: String(penalizedBoarders),
            icon: Users,
            bg: "bg-rose-50",
            fg: "text-rose-600",
        },
        {
            label: "Outstanding Penalties",
            value: String(outstandingCount),
            icon: AlertCircle,
            bg: "bg-amber-50",
            fg: "text-amber-600",
        },
        {
            label: "Average Penalty",
            value: peso(averagePenalty),
            icon: Clock,
            bg: "bg-violet-50",
            fg: "text-violet-600",
        },
    ];

    /* ---------------- Penalty Amount Overview (Monthly / Weekly) ---------------- */

    const [trendPeriod, setTrendPeriod] = useState<TrendPeriod>("monthly");
    const [trendMenuOpen, setTrendMenuOpen] = useState(false);

    const chartData = useMemo(() => {
        const today = new Date();

        if (trendPeriod === "weekly") {
            const buckets: { start: Date; end: Date; month: string; amount: number }[] = [];
            for (let i = 7; i >= 0; i--) {
                const end = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i * 7);
                const start = new Date(end);
                start.setDate(end.getDate() - 6);
                buckets.push({
                    start,
                    end,
                    month: start.toLocaleDateString("en-PH", { month: "short", day: "2-digit" }),
                    amount: 0,
                });
            }
            penalties.forEach((p) => {
                const d = new Date(p.penalty_date);
                if (Number.isNaN(d.getTime())) return;
                const bucket = buckets.find((b) => d >= b.start && d <= b.end);
                if (bucket) bucket.amount += Number(p.amount ?? 0);
            });
            return buckets.map(({ month, amount }) => ({ month, amount }));
        }

        const buckets: { key: string; month: string; amount: number }[] = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            buckets.push({
                key: `${d.getFullYear()}-${d.getMonth()}`,
                month: d.toLocaleDateString("en-PH", { month: "short" }),
                amount: 0,
            });
        }
        penalties.forEach((p) => {
            const d = new Date(p.penalty_date);
            if (Number.isNaN(d.getTime())) return;
            const key = `${d.getFullYear()}-${d.getMonth()}`;
            const bucket = buckets.find((b) => b.key === key);
            if (bucket) bucket.amount += Number(p.amount ?? 0);
        });
        return buckets.map(({ month, amount }) => ({ month, amount }));
    }, [penalties, trendPeriod]);

    // Breakdown by the penalty's rule name (the closest thing to a "type" in the backend).
    const typeData = useMemo(() => {
        const totals = new Map<string, number>();
        penalties.forEach((p) => {
            const name = p.penalty_name || "Other";
            totals.set(name, (totals.get(name) ?? 0) + Number(p.amount ?? 0));
        });
        const total = Array.from(totals.values()).reduce((s, v) => s + v, 0);
        return Array.from(totals.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([name, value], i) => ({
                name,
                value,
                pct: total ? `${((value / total) * 100).toFixed(1)}%` : "0%",
                color: TYPE_COLORS[i % TYPE_COLORS.length],
            }));
    }, [penalties]);

    const totalPenalties = typeData.reduce((sum, d) => sum + d.value, 0);

    // Most recent penalty records.
    const records = useMemo(
        () =>
            [...penalties]
                .sort((a, b) => new Date(b.penalty_date).getTime() - new Date(a.penalty_date).getTime())
                .slice(0, 5),
        [penalties]
    );

    // Per-boarder rollup — total assessed, paid, unpaid, and penalty count.
    const allBoarders = useMemo(() => {
        const map = new Map<
            number,
            { name: string; total: number; paid: number; count: number }
        >();
        penalties.forEach((p) => {
            const entry = map.get(p.boarder_id) ?? {
                name: `${p.first_name} ${p.last_name}`,
                total: 0,
                paid: 0,
                count: 0,
            };
            entry.total += Number(p.amount ?? 0);
            entry.paid += Number(p.amount_paid ?? 0);
            entry.count += 1;
            map.set(p.boarder_id, entry);
        });
        return Array.from(map.values())
            .map((b) => {
                const unpaid = Math.max(0, b.total - b.paid);
                const status: BoarderStatus = unpaid <= 0 ? "Paid" : b.paid > 0 ? "Partial" : "Unpaid";
                return { ...b, unpaid, status };
            })
            .sort((a, b) => b.total - a.total);
    }, [penalties]);

    const [page, setPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(allBoarders.length / BOARDERS_PER_PAGE));
    const safePage = Math.min(page, totalPages);

    const pagedBoarders = allBoarders.slice(
        (safePage - 1) * BOARDERS_PER_PAGE,
        safePage * BOARDERS_PER_PAGE
    );

    // This month's collection summary.
    const thisMonthPenalties = useMemo(() => {
        const today = new Date();
        return penalties.filter((p) => {
            const d = new Date(p.penalty_date);
            return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth();
        });
    }, [penalties]);

    const collectedThisMonth = thisMonthPenalties.reduce((s, p) => s + Number(p.amount_paid ?? 0), 0);
    const unpaidThisMonth = thisMonthPenalties.reduce(
        (s, p) => s + Math.max(0, Number(p.amount ?? 0) - Number(p.amount_paid ?? 0)),
        0
    );
    const collectionRate =
        collectedThisMonth + unpaidThisMonth > 0
            ? (collectedThisMonth / (collectedThisMonth + unpaidThisMonth)) * 100
            : 0;

    /* ---------------- Print / Export ---------------- */

    const [printOpen, setPrintOpen] = useState(false);
    const [exporting, setExporting] = useState(false);

    const penaltyStatsShape = {
        totalPenalties: totalPenaltiesAmount,
        penalizedBoarders,
        outstandingPenalties: outstandingCount,
        averagePenalty,
    };

    const recentRecordRows = records.map((r: Penalty) => ({
        date: formatDate(r.penalty_date),
        boarder: `${r.first_name} ${r.last_name}`,
        type: r.penalty_name || "Other",
        reason: r.reason || "—",
        amount: r.amount,
        status: r.status,
    }));

    const boarderRows = allBoarders.map((b) => ({
        name: b.name,
        total: b.total,
        paid: b.paid,
        unpaid: b.unpaid,
        count: b.count,
        status: b.status,
    }));

    const monthSummary = {
        collected: collectedThisMonth,
        unpaid: unpaidThisMonth,
        collectionRate,
    };

    const handleExcel = async () => {
        setExporting(true);
        try {
            await exportPenaltyExcel({
                penaltyStats: penaltyStatsShape,
                penaltyTrend: chartData,
                recentRecords: recentRecordRows,
                boarderBreakdown: boarderRows,
                periodLabel,
            });
        } catch (err) {
            console.error("Excel export failed:", err);
        } finally {
            setExporting(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-2 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-15 pt-4 bg-gray-50">
                {/* Back link */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Reports
                </button>

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                            Penalty Report
                        </h1>
                        <p className="text-xs text-slate-500">
                            View penalties and late payment records
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {dateRange}
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                        <button
                            onClick={handleExcel}
                            disabled={exporting}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
                        >
                            {exporting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <FileSpreadsheet className="h-3.5 w-3.5" />
                            )}
                            {exporting ? "Preparing…" : "Export Excel"}
                        </button>
                        <button
                            onClick={() => setPrintOpen(true)}
                            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800"
                        >
                            <Printer className="h-3.5 w-3.5" />
                            Print
                        </button>
                    </div>
                </div>

                {loading && penalties.length === 0 ? (
                    <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-400">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading penalty data...
                    </div>
                ) : (
                    <>
                        {/* Stat cards */}
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            {stats.map((s) => {
                                const Icon = s.icon;
                                return (
                                    <div
                                        key={s.label}
                                        className="rounded-xl border border-slate-200 bg-white p-3"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${s.bg}`}
                                            >
                                                <Icon className={`h-4 w-4 ${s.fg}`} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="truncate text-xs text-slate-400">
                                                    {s.label}
                                                </p>
                                                <p className="text-sm font-bold text-slate-900">
                                                    {s.value}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-400">This period</p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Overview + Type */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            {/* Penalty Amount Overview */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
                                <div className="mb-2 flex items-center justify-between">
                                    <h2 className="text-sm font-semibold text-slate-900">
                                        Penalty Amount Overview
                                    </h2>
                                    <div className="relative">
                                        <button
                                            onClick={() => setTrendMenuOpen((v) => !v)}
                                            className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50"
                                        >
                                            {trendPeriod === "monthly" ? "Monthly" : "Weekly"}
                                            <ChevronDown className="h-3 w-3" />
                                        </button>
                                        {trendMenuOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setTrendMenuOpen(false)}
                                                />
                                                <div className="absolute right-0 top-full z-20 mt-1 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                                    {(["monthly", "weekly"] as TrendPeriod[]).map((opt) => (
                                                        <button
                                                            key={opt}
                                                            onClick={() => {
                                                                setTrendPeriod(opt);
                                                                setTrendMenuOpen(false);
                                                            }}
                                                            className={`block w-full px-3 py-1.5 text-left text-xs font-medium capitalize ${trendPeriod === opt
                                                                ? "bg-orange-50 text-orange-600"
                                                                : "text-slate-600 hover:bg-slate-50"
                                                                }`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="h-44 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                axisLine={{ stroke: "#e2e8f0" }}
                                                tickLine={false}
                                            />
                                            <YAxis
                                                tick={{ fontSize: 11, fill: "#94a3b8" }}
                                                axisLine={false}
                                                tickLine={false}
                                                tickFormatter={pesoK}
                                                width={40}
                                            />
                                            <Tooltip
                                                formatter={(v) => [peso(v as number), "Total Penalty Amount"]}
                                                contentStyle={{
                                                    fontSize: "12px",
                                                    borderRadius: "8px",
                                                    border: "1px solid #e2e8f0",
                                                }}
                                            />
                                            <Bar dataKey="amount" fill="#f97316" radius={[6, 6, 0, 0]} maxBarSize={34}>
                                                <LabelList
                                                    dataKey="amount"
                                                    position="top"
                                                    formatter={(value) => {
                                                        const n = Number(value ?? 0);
                                                        return n === 0 ? "₱0" : `₱${n / 1000}K`;
                                                    }}
                                                    style={{ fontSize: 10, fill: "#94a3b8" }}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                                    Total Penalty Amount
                                </div>
                            </div>

                            {/* Penalties by Type */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4">
                                <h2 className="mb-2 text-sm font-semibold text-slate-900">
                                    Penalties by Type
                                </h2>
                                {typeData.length === 0 ? (
                                    <p className="py-10 text-center text-xs text-slate-400">
                                        No penalty data yet.
                                    </p>
                                ) : (
                                    <>
                                        <div className="relative mx-auto h-32 w-32">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={typeData}
                                                        dataKey="value"
                                                        innerRadius={38}
                                                        outerRadius={56}
                                                        startAngle={90}
                                                        endAngle={-270}
                                                        stroke="none"
                                                    >
                                                        {typeData.map((d) => (
                                                            <Cell key={d.name} fill={d.color} />
                                                        ))}
                                                    </Pie>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-xs text-slate-400">Total</span>
                                                <span className="text-sm font-bold text-slate-900">
                                                    {peso(totalPenalties)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3 space-y-1.5">
                                            {typeData.map((d) => (
                                                <div
                                                    key={d.name}
                                                    className="flex items-center justify-between text-xs"
                                                >
                                                    <div className="flex items-center gap-1.5">
                                                        <span
                                                            className="h-2 w-2 rounded-full"
                                                            style={{ backgroundColor: d.color }}
                                                        />
                                                        <span className="truncate text-slate-500">{d.name}</span>
                                                    </div>
                                                    <span className="shrink-0 font-medium text-slate-700">
                                                        {peso(d.value)} ({d.pct})
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Records + Summary */}
                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                            {/* Recent Penalty Records */}
                            <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
                                <h2 className="mb-2 text-sm font-semibold text-slate-900">
                                    Recent Penalty Records
                                </h2>
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                            <th className="py-2 font-medium">Date</th>
                                            <th className="py-2 font-medium">Boarder</th>
                                            <th className="py-2 font-medium">Type</th>
                                            <th className="py-2 font-medium">Amount</th>
                                            <th className="py-2 text-right font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {records.map((r: Penalty) => (
                                            <tr
                                                key={r.penalty_id}
                                                className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                                            >
                                                <td className="py-2.5 text-slate-500">{formatDate(r.penalty_date)}</td>
                                                <td className="py-2.5 font-medium text-slate-800">
                                                    {r.first_name} {r.last_name}
                                                </td>
                                                <td className="py-2.5">
                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                                                        {r.penalty_name || "Other"}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 font-medium text-slate-800">
                                                    {peso(r.amount)}
                                                </td>
                                                <td className="py-2.5 text-right">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[r.status]}`}
                                                    >
                                                        {r.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}

                                        {records.length === 0 && (
                                            <tr>
                                                <td colSpan={5} className="py-8 text-center text-xs text-slate-400">
                                                    No penalty records yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                                <button
                                    onClick={() => navigate("/penalties")}
                                    className="mt-2 flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
                                >
                                    View All Records
                                    <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>

                            {/* Penalty Summary */}
                            <div className="relative overflow-hidden rounded-xl border border-orange-100 bg-orange-50 p-4">
                                <div className="mb-3 flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                                        <TriangleAlert className="h-3.5 w-3.5 text-orange-600" />
                                    </div>
                                    <h2 className="text-sm font-semibold text-orange-900">
                                        Penalty Summary
                                    </h2>
                                </div>

                                <p className="mb-1.5 text-xs font-semibold text-orange-900">
                                    This Month Summary
                                </p>
                                <div className="mb-3 space-y-1.5">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-orange-700">Total Penalties Collected</span>
                                        <span className="font-medium text-orange-900">{peso(collectedThisMonth)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-orange-700">Total Penalties Unpaid</span>
                                        <span className="font-medium text-orange-900">{peso(unpaidThisMonth)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-orange-700">Collection Rate</span>
                                        <span className="font-medium text-orange-900">{collectionRate.toFixed(1)}%</span>
                                    </div>
                                </div>

                                <p className="mb-1.5 text-xs font-semibold text-orange-900">
                                    Top Penalty Reasons
                                </p>
                                <div className="space-y-1.5">
                                    {typeData.slice(0, 3).map((d) => (
                                        <div key={d.name} className="flex items-center justify-between text-xs">
                                            <span className="truncate text-orange-700">{d.name}</span>
                                            <span className="shrink-0 font-medium text-orange-900">
                                                {peso(d.value)} ({d.pct})
                                            </span>
                                        </div>
                                    ))}
                                    {typeData.length === 0 && (
                                        <p className="text-xs text-orange-700">No data yet.</p>
                                    )}
                                </div>

                                <Receipt className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 text-orange-200 opacity-60" />
                            </div>
                        </div>

                        {/* Penalty Breakdown by Boarder */}
                        <div className="rounded-xl border border-slate-200 bg-white p-4">
                            <h2 className="mb-2 text-sm font-semibold text-slate-900">
                                Penalty Breakdown by Boarder
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-160 border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                            <th className="py-2 font-medium">Boarder</th>
                                            <th className="py-2 font-medium">Total Penalties</th>
                                            <th className="py-2 font-medium">Paid Amount</th>
                                            <th className="py-2 font-medium">Unpaid Amount</th>
                                            <th className="py-2 font-medium">Penalty Count</th>
                                            <th className="py-2 text-right font-medium">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pagedBoarders.map((b) => (
                                            <tr
                                                key={b.name}
                                                className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                                            >
                                                <td className="py-2.5 font-medium text-slate-800">
                                                    {b.name}
                                                </td>
                                                <td className="py-2.5">{peso(b.total)}</td>
                                                <td className="py-2.5">{peso(b.paid)}</td>
                                                <td className="py-2.5">{peso(b.unpaid)}</td>
                                                <td className="py-2.5">{b.count}</td>
                                                <td className="py-2.5 text-right">
                                                    <span
                                                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${boarderStatusBadge[b.status]}`}
                                                    >
                                                        {b.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}

                                        {pagedBoarders.length === 0 && (
                                            <tr>
                                                <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                                                    No boarders with penalties yet.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {allBoarders.length > 0 && (
                                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-xs text-slate-400">
                                        Showing {(safePage - 1) * BOARDERS_PER_PAGE + 1} to{" "}
                                        {Math.min(safePage * BOARDERS_PER_PAGE, allBoarders.length)} of{" "}
                                        {allBoarders.length} boarders
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setPage(Math.max(1, safePage - 1))}
                                            disabled={safePage === 1}
                                            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
                                        >
                                            <ChevronLeft className="h-3.5 w-3.5" />
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium ${p === safePage
                                                    ? "bg-orange-600 text-white"
                                                    : "text-slate-500 hover:bg-slate-100"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                                            disabled={safePage === totalPages}
                                            className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 disabled:pointer-events-none disabled:opacity-40"
                                        >
                                            <ChevronRight className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <PrintPenaltyModal
                open={printOpen}
                onClose={() => setPrintOpen(false)}
                penaltyStats={penaltyStatsShape}
                penaltyTrend={chartData}
                typeBreakdown={typeData}
                recentRecords={recentRecordRows}
                boarderBreakdown={boarderRows}
                monthSummary={monthSummary}
                periodLabel={periodLabel}
            />
        </div>
    );
}
