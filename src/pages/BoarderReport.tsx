import { useAuth } from "@/hooks/useAuth";
import {
    ArrowLeft,
    Users,
    Mars,
    Venus,
    UserCheck,
    Calendar,
    ChevronDown,
    FileDown,
    FileSpreadsheet,
    Printer,
    Phone,
    Search,
    BarChart3,
    ChevronLeft,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Loader2,
    ArrowRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import PrintBoarderReportModal from "@/components/BoarderReport/PrintBoarderReportModal";
import { exportBoarderReportExcel } from "@/components/BoarderReport/exportBoarderReportExcel";

const statusBadge: Record<string, { chip: string; dot: string }> = {
    Active: {
        chip: "border-emerald-200/70 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
    },
    Deactivate: {
        chip: "border-amber-200/70 bg-amber-50 text-amber-700",
        dot: "bg-amber-500",
    },
    "Checked-out": {
        chip: "border-rose-200/70 bg-rose-50 text-rose-700",
        dot: "bg-rose-500",
    },
};

function StatusChip({ status }: { status?: string }) {
    const s = statusBadge[status ?? ""] ?? {
        chip: "border-slate-200 bg-slate-50 text-slate-600",
        dot: "bg-slate-400",
    };
    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none ${s.chip}`}
        >
            <span className={`h-1 w-1 rounded-full ${s.dot}`} />
            {status ?? "—"}
        </span>
    );
}



function Shimmer({ className = "" }: { className?: string }) {
    return (
        <span
            className={`block animate-pulse rounded-full bg-slate-100 ${className}`}
        />
    );
}

function BoarderRowSkeleton() {
    return (
        <tr className="border-b border-slate-50 last:border-0">
            <td className="py-2">
                <Shimmer className="h-2 w-14" />
            </td>
            <td className="py-2">
                <div className="flex items-center gap-2">
                    <Shimmer className="h-6 w-6 shrink-0 rounded-full" />
                    <Shimmer className="h-2 w-28" />
                </div>
            </td>
            <td className="py-2">
                <Shimmer className="h-2 w-10" />
            </td>
            <td className="py-2">
                <Shimmer className="h-3.5 w-14 rounded-full" />
            </td>
            <td className="py-2">
                <Shimmer className="h-2 w-20" />
            </td>
            <td className="py-2">
                <div className="flex justify-end">
                    <Shimmer className="h-2 w-32" />
                </div>
            </td>
        </tr>
    );
}

type ChartTooltipProps = {
    active?: boolean;
    label?: string;
    payload?: Array<{ value?: number | string }>;
};

function ChartTooltip({ active, payload, label }: ChartTooltipProps) {
    if (!active || !payload?.length) return null;
    return (
        <div className="rounded-lg border border-slate-200 bg-white/95 px-2.5 py-1.5 shadow-lg backdrop-blur">
            <p className="mb-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                {label}
            </p>
            <p className="text-[12px] font-semibold tabular-nums text-slate-900">
                {payload[0].value}
            </p>
            <p className="text-[9.5px] text-slate-400">Total boarders</p>
        </div>
    );
}

const PER_PAGE = 8;

function currentMonthRangeLabel() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return `${firstDay.toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
    })} – ${lastDay.toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    })}`;
}

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

export default function BoarderReport() {
    const navigate = useNavigate();
    const {
        boarderStats,
        getBoarderStats,
        getBoardersOverTime,
        boardersOverTime,
        getRecentBoarders,
        recentBoarders,
        getBoardersList,
        boardersList,
        boardersListLoading,
        boarderSummary,
        getBoarderSummary,
    } = useAuth();

    const [printOpen, setPrintOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [activeSlice, setActiveSlice] = useState<number | null>(null);
    const dateRange = useMemo(() => currentMonthRangeLabel(), []);

    useEffect(() => {
        getBoarderStats();
        getBoardersOverTime();
        getRecentBoarders();
        getBoardersList();
        getBoarderSummary();
        //eslint-disable-next-line
    }, []);

    const handleExcel = async () => {
        setExporting(true);
        try {
            await exportBoarderReportExcel({
                boarderStats,
                boarderSummary,
                boardersOverTime,
                boardersList,
            });
        } catch (err) {
            console.error("Excel export failed:", err);
        } finally {
            setExporting(false);
        }
    };

    const statusData = useMemo(
        () => [
            {
                name: "Active",
                value: boarderSummary?.activeBoarders ?? 0,
                color: "#059669",
            },
            {
                name: "Deactivate",
                value: boarderSummary?.deactivateBoarders ?? 0,
                color: "#eab308",
            },
            {
                name: "Checked-out",
                value: boarderSummary?.checkedOutBoarders ?? 0,
                color: "#e11d48",
            },
        ],
        [boarderSummary]
    );

    const totalBoarders = statusData.reduce((sum, d) => sum + d.value, 0);

    /* Search + pagination over the full list */
    const filtered = useMemo(() => {
        const q = search.trim().toLowerCase();
        if (!q) return boardersList ?? [];
        return (boardersList ?? []).filter(
            (b) =>
                String(b.name ?? "").toLowerCase().includes(q) ||
                String(b.user_id_no ?? "").toLowerCase().includes(q) ||
                String(b.email ?? "").toLowerCase().includes(q)
        );
    }, [boardersList, search]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));

    useEffect(() => {
        if (page > totalPages) setPage(1);
    }, [page, totalPages]);

    const pagedBoarders = useMemo(
        () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
        [filtered, page]
    );

    const from = filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1;
    const to = Math.min(page * PER_PAGE, filtered.length);

    const stats = [
        {
            label: "Total boarders",
            value: boarderStats?.totalBoarders ?? 0,
            sub: "On register",
            icon: Users,
            bar: "bg-indigo-500",
            tint: "bg-indigo-50",
            fg: "text-indigo-600",
            subFg: "text-slate-400",
        },
        {
            label: "Male",
            value: boarderStats?.maleBoarders ?? 0,
            sub: `${boarderStats?.malePercentage ?? 0}% of total`,
            icon: Mars,
            bar: "bg-sky-500",
            tint: "bg-sky-50",
            fg: "text-sky-600",
            subFg: "text-sky-600",
        },
        {
            label: "Female",
            value: boarderStats?.femaleBoarders ?? 0,
            sub: `${boarderStats?.femalePercentage ?? 0}% of total`,
            icon: Venus,
            bar: "bg-pink-500",
            tint: "bg-pink-50",
            fg: "text-pink-600",
            subFg: "text-pink-600",
        },
        {
            label: "Active",
            value: boarderStats?.activeBoarders ?? 0,
            sub: `${boarderStats?.activePercentage ?? 0}% currently active`,
            icon: UserCheck,
            bar: "bg-emerald-500",
            tint: "bg-emerald-50",
            fg: "text-emerald-600",
            subFg: "text-emerald-600",
        },
    ];

    const changeUp = (boarderSummary?.percentageChange ?? 0) >= 0;

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full space-y-2.5 overflow-y-auto rounded-tl-2xl border-l border-t border-slate-200 bg-slate-50/70 px-3.5 pb-15 pt-3">
                {/* Back link */}
                <button
                    onClick={() => navigate(-1)}
                    className="group flex items-center gap-1 text-[11px] font-medium text-slate-500 transition-colors hover:text-slate-900"
                >
                    <ArrowLeft className="h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
                    Back to reports
                </button>

                {/* Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                            Reports · Boarders
                        </p>
                        <h1 className="mt-0.5 text-base font-bold tracking-tight text-slate-900">
                            Boarder Report
                        </h1>
                        <p className="text-[10.5px] text-slate-500">
                            Resident register, status breakdown and contact directory
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5">
                        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50">
                            <Calendar className="h-3 w-3 text-slate-400" />
                            {dateRange}
                        </button>
                        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50">
                            <FileDown className="h-3 w-3 text-rose-500" />
                            PDF
                        </button>
                        <button
                            onClick={handleExcel}
                            disabled={exporting}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[10.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
                        >
                            {exporting ? (
                                <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                            ) : (
                                <FileSpreadsheet className="h-3 w-3 text-emerald-600" />
                            )}
                            {exporting ? "Preparing…" : "Excel"}
                        </button>
                        <button
                            onClick={() => setPrintOpen(true)}
                            className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[10.5px] font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                        >
                            <Printer className="h-3 w-3" />
                            Print
                        </button>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.label}
                                className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 transition-all hover:border-slate-300 hover:shadow-sm"
                            >
                                <span
                                    className={`absolute inset-x-0 top-0 h-0.5 ${s.bar}`}
                                />

                                <div className="flex items-center justify-between gap-2">
                                    <p className="truncate text-[9.5px] font-semibold uppercase tracking-wider text-slate-400">
                                        {s.label}
                                    </p>
                                    <span
                                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${s.tint} ${s.fg}`}
                                    >
                                        <Icon className="h-3 w-3" />
                                    </span>
                                </div>

                                <p className="mt-1 text-lg font-bold leading-none tabular-nums tracking-tight text-slate-900">
                                    {s.value}
                                </p>

                                <p
                                    className={`mt-1 truncate text-[9.5px] font-medium ${s.subFg}`}
                                >
                                    {s.sub}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Trend + Status */}
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
                    {/* Boarders Over Time */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3 lg:col-span-2">
                        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h2 className="text-[12px] font-semibold tracking-tight text-slate-900">
                                    Boarders over time
                                </h2>
                                <p className="text-[10px] text-slate-400">
                                    Register size across the period
                                </p>
                            </div>
                            <div className="flex items-center gap-2.5">
                                <span className="flex items-center gap-1 text-[10px] text-slate-500">
                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
                                    Total boarders
                                </span>
                                <button className="flex items-center gap-1 rounded-md border border-slate-200 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-50">
                                    Monthly
                                    <ChevronDown className="h-2.5 w-2.5" />
                                </button>
                            </div>
                        </div>

                        <div className="h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={boardersOverTime}
                                    margin={{ top: 8, right: 4, left: -20, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="boarderFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="4 4"
                                        stroke="#f1f5f9"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={4}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: "#94a3b8" }}
                                        axisLine={false}
                                        tickLine={false}
                                        width={34}
                                    />
                                    <Tooltip
                                        content={<ChartTooltip />}
                                        cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="total"
                                        stroke="#6366f1"
                                        strokeWidth={2}
                                        fill="url(#boarderFill)"
                                        dot={false}
                                        activeDot={{
                                            r: 3.5,
                                            fill: "#6366f1",
                                            stroke: "#fff",
                                            strokeWidth: 2,
                                        }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Boarders by Status */}
                    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-3">
                        <div>
                            <h2 className="text-[12px] font-semibold tracking-tight text-slate-900">
                                Boarders by status
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                Account status breakdown
                            </p>
                        </div>

                        <div className="relative mx-auto h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius="66%"
                                        outerRadius="94%"
                                        paddingAngle={2.5}
                                        cornerRadius={4}
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="none"
                                        onMouseEnter={(_, i) => setActiveSlice(i)}
                                        onMouseLeave={() => setActiveSlice(null)}
                                    >
                                        {statusData.map((d, i) => (
                                            <Cell
                                                key={d.name}
                                                fill={d.color}
                                                fillOpacity={
                                                    activeSlice === null || activeSlice === i ? 1 : 0.25
                                                }
                                                className="transition-all duration-200 outline-none"
                                            />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>

                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-[9px] font-medium uppercase tracking-wider text-slate-400">
                                    {activeSlice === null ? "Total" : statusData[activeSlice].name}
                                </span>
                                <span className="text-base font-bold leading-tight tabular-nums tracking-tight text-slate-900">
                                    {activeSlice === null
                                        ? totalBoarders
                                        : statusData[activeSlice].value}
                                </span>
                                {activeSlice !== null && totalBoarders > 0 && (
                                    <span className="text-[9.5px] tabular-nums text-slate-400">
                                        {(
                                            (statusData[activeSlice].value / totalBoarders) *
                                            100
                                        ).toFixed(1)}
                                        %
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-2 space-y-0.5">
                            {statusData.map((d, i) => (
                                <div
                                    key={d.name}
                                    onMouseEnter={() => setActiveSlice(i)}
                                    onMouseLeave={() => setActiveSlice(null)}
                                    className="flex cursor-default items-center justify-between rounded-md px-1 py-0.5 transition-colors hover:bg-slate-50"
                                >
                                    <span className="flex items-center gap-1.5 text-[10.5px] text-slate-600">
                                        <span
                                            className="h-1.5 w-1.5 shrink-0 rounded-sm"
                                            style={{ backgroundColor: d.color }}
                                        />
                                        {d.name}
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="text-[10.5px] font-semibold tabular-nums text-slate-900">
                                            {d.value}
                                        </span>
                                        <span className="w-8 text-right text-[9.5px] tabular-nums text-slate-400">
                                            {totalBoarders > 0
                                                ? ((d.value / totalBoarders) * 100).toFixed(1)
                                                : 0}
                                            %
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent + Summary */}
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-3">
                    {/* Recent Boarders */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3 lg:col-span-2">
                        <div className="mb-2 flex items-start justify-between gap-2">
                            <div>
                                <h2 className="text-[12px] font-semibold tracking-tight text-slate-900">
                                    Recent boarders
                                </h2>
                                <p className="text-[10px] text-slate-400">
                                    Latest additions to the register
                                </p>
                            </div>
                            <button className="flex shrink-0 items-center gap-1 text-[10.5px] font-medium text-indigo-600 transition-colors hover:text-indigo-700">
                                View all
                                <ArrowRight className="h-3 w-3" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-[9.5px] uppercase tracking-wider text-slate-400">
                                        <th className="py-1.5 font-medium">ID</th>
                                        <th className="py-1.5 font-medium">Name</th>
                                        <th className="py-1.5 font-medium">Room</th>
                                        <th className="py-1.5 font-medium">Status</th>
                                        <th className="py-1.5 text-right font-medium">Contact</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentBoarders.map((b) => (
                                        <tr
                                            key={b.user_id_no}
                                            className="border-b border-slate-50 text-[11.5px] text-slate-700 transition-colors last:border-0 hover:bg-slate-50/70"
                                        >
                                            <td className="py-2 text-[10px] tabular-nums text-slate-400">
                                                {b.user_id_no}
                                            </td>
                                            <td className="py-2 font-medium text-slate-900">
                                                {b.name}
                                            </td>
                                            <td className="py-2 tabular-nums">{b.room}</td>
                                            <td className="py-2">
                                                <StatusChip status={b.status} />
                                            </td>
                                            <td className="py-2 text-right">
                                                <span className="flex items-center justify-end gap-1 text-[10.5px] tabular-nums text-slate-500">
                                                    <Phone className="h-2.5 w-2.5 text-slate-300" />
                                                    {b.contact}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}

                                    {recentBoarders.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={5}
                                                className="py-8 text-center text-[11px] text-slate-400"
                                            >
                                                No recent boarders.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Boarder Summary */}
                    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-3">
                        <div className="mb-2 flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                <Users className="h-3 w-3" />
                            </span>
                            <div>
                                <h2 className="text-[12px] font-semibold tracking-tight text-slate-900">
                                    Boarder summary
                                </h2>
                                <p className="text-[10px] text-slate-400">
                                    Register at a glance
                                </p>
                            </div>
                        </div>

                        {[
                            {
                                title: "Status",
                                accent: "bg-indigo-400",
                                rows: [
                                    ["Total boarders", boarderSummary?.totalBoarders ?? 0],
                                    ["Active", boarderSummary?.activeBoarders ?? 0],
                                    ["Deactivated", boarderSummary?.deactivateBoarders ?? 0],
                                    ["Checked out", boarderSummary?.checkedOutBoarders ?? 0],
                                ] as [string, number][],
                            },
                            {
                                title: "Gender",
                                accent: "bg-pink-400",
                                rows: [
                                    ["Male", boarderSummary?.maleBoarders ?? 0],
                                    ["Female", boarderSummary?.femaleBoarders ?? 0],
                                ] as [string, number][],
                            },
                            {
                                title: "This month",
                                accent: "bg-emerald-400",
                                rows: [
                                    ["New boarders", boarderSummary?.newThisMonth ?? 0],
                                    ["Checked out", boarderSummary?.checkedOutThisMonth ?? 0],
                                ] as [string, number][],
                            },
                        ].map((group) => (
                            <div key={group.title} className="mb-2">
                                <p className="mb-0.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                                    <span
                                        className={`h-1 w-1 rounded-full ${group.accent}`}
                                    />
                                    {group.title}
                                </p>
                                {group.rows.map(([label, value]) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between border-b border-slate-50 py-1 last:border-0"
                                    >
                                        <span className="text-[10.5px] text-slate-500">{label}</span>
                                        <span className="text-[11.5px] font-semibold tabular-nums text-slate-900">
                                            {value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ))}

                        <div
                            className={`mt-auto flex items-center gap-2 rounded-lg border p-2 ${changeUp
                                    ? "border-emerald-100 bg-emerald-50/60"
                                    : "border-rose-100 bg-rose-50/60"
                                }`}
                        >
                            <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white ${changeUp ? "text-emerald-600" : "text-rose-600"
                                    }`}
                            >
                                <BarChart3 className="h-3.5 w-3.5" />
                            </span>
                            <div className="min-w-0">
                                <p className="text-[9.5px] uppercase tracking-wider text-slate-400">
                                    vs last month
                                </p>
                                <p
                                    className={`flex items-center gap-1 text-[11.5px] font-semibold tabular-nums ${changeUp ? "text-emerald-700" : "text-rose-600"
                                        }`}
                                >
                                    {changeUp ? (
                                        <TrendingUp className="h-2.5 w-2.5" />
                                    ) : (
                                        <TrendingDown className="h-2.5 w-2.5" />
                                    )}
                                    {changeUp ? "+" : ""}
                                    {boarderSummary?.percentageChange ?? 0}%
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Boarders Details */}
                <div className="rounded-xl border border-slate-200 bg-white p-3">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-[12px] font-semibold tracking-tight text-slate-900">
                                Boarder directory
                            </h2>
                            <p className="text-[10px] text-slate-400">
                                {boardersListLoading
                                    ? "Loading boarders…"
                                    : `${filtered.length} of ${boardersList?.length ?? 0} boarders shown`}
                            </p>
                        </div>

                        <div className="relative">
                            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
                            <input
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                                placeholder="Search name, ID or email"
                                className="h-7.5 w-52 rounded-lg border border-slate-200 bg-slate-50/80 py-1.5 pl-7.5 pr-2.5 text-[11px] text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-215 border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 text-left text-[9.5px] uppercase tracking-wider text-slate-400">
                                    <th className="py-1.5 font-medium">ID</th>
                                    <th className="py-1.5 font-medium">Name</th>
                                    <th className="py-1.5 font-medium">Gender</th>
                                    <th className="py-1.5 font-medium">Status</th>
                                    <th className="py-1.5 font-medium">Contact</th>
                                    <th className="py-1.5 text-right font-medium">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boardersListLoading &&
                                    Array.from({ length: PER_PAGE }).map((_, i) => (
                                        <BoarderRowSkeleton key={i} />
                                    ))}

                                {!boardersListLoading &&
                                    pagedBoarders.map((b) => (
                                        <tr
                                            key={b.user_id_no}
                                            className="border-b border-slate-50 text-[11.5px] text-slate-700 transition-colors last:border-0 hover:bg-slate-50/70"
                                        >
                                            <td className="py-2 text-[10px] tabular-nums text-slate-400">
                                                {b.user_id_no}
                                            </td>
                                            <td className="py-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-[9px] font-semibold uppercase text-indigo-600">
                                                        {String(b.name ?? "")
                                                            .split(" ")
                                                            .map((w) => w[0])
                                                            .slice(0, 2)
                                                            .join("")}
                                                    </span>
                                                    <span className="font-medium text-slate-900">
                                                        {b.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-2 text-slate-500">{b.gender}</td>
                                            <td className="py-2">
                                                <StatusChip status={b.account_status} />
                                            </td>
                                            <td className="py-2 tabular-nums text-slate-600">
                                                {b.contact_number}
                                            </td>
                                            <td className="py-2 text-right text-[10.5px] text-slate-400">
                                                {b.email}
                                            </td>
                                        </tr>
                                    ))}

                                {!boardersListLoading && pagedBoarders.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-8 text-center text-[11px] text-slate-400"
                                        >
                                            {search
                                                ? "No boarders match your search."
                                                : "No boarders on the register yet."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!boardersListLoading && filtered.length > 0 && (
                        <div className="mt-2 flex flex-col gap-1.5 border-t border-slate-100 pt-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-[10px] text-slate-400">
                                Showing{" "}
                                <span className="font-medium tabular-nums text-slate-600">
                                    {from}–{to}
                                </span>{" "}
                                of <span className="tabular-nums">{filtered.length}</span>{" "}
                                boarders
                            </p>

                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                    aria-label="Previous page"
                                    className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-40"
                                >
                                    <ChevronLeft className="h-3 w-3" />
                                </button>

                                {getPageItems(page, totalPages).map((p, i) =>
                                    p === "ellipsis" ? (
                                        <span
                                            key={`gap-${i}`}
                                            className="px-0.5 text-[10px] text-slate-300"
                                        >
                                            &hellip;
                                        </span>
                                    ) : (
                                        <button
                                            key={p}
                                            onClick={() => setPage(p)}
                                            aria-current={p === page ? "page" : undefined}
                                            className={`flex h-6 min-w-6 items-center justify-center rounded-md px-1 text-[10.5px] font-medium tabular-nums transition-colors ${p === page
                                                    ? "bg-indigo-600 text-white"
                                                    : "text-slate-500 hover:bg-slate-100"
                                                }`}
                                        >
                                            {p}
                                        </button>
                                    )
                                )}

                                <button
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === totalPages}
                                    aria-label="Next page"
                                    className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-40"
                                >
                                    <ChevronRight className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <PrintBoarderReportModal
                open={printOpen}
                onClose={() => setPrintOpen(false)}
                boarderStats={boarderStats}
                boarderSummary={boarderSummary}
                boardersOverTime={boardersOverTime}
                boardersList={boardersList}
            />
        </div>
    );
}