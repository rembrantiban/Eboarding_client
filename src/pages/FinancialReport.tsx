import { useState, useEffect } from "react";
import {
    ArrowLeft,
    Wallet,
    Percent,
    TrendingUp,
    TrendingDown,
    Calendar,
    ChevronDown,
    Printer,
    AlertTriangle,
    Clock,
} from "lucide-react";
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
import { useBilling } from "@/hooks/useBilling";
import PrintFinancialReportModal from "@/components/FinancialReport/PrintFinancialReportModal"
import ExportMenu from "@/components/FinancialReport/ExportMenu";

const peso = (n: number) => `₱${n.toLocaleString()}`;
const pesoK = (n: number) => (n === 0 ? "₱0" : `₱${n / 1000}K`);

type ChartTooltipProps = {
    active?: boolean;
    label?: string;
    payload?: Array<{
        name?: string;
        value?: number | string;
        color?: string;
    }>;
};

function ChartTooltip({
    active,
    payload,
    label,
}: ChartTooltipProps) {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white/95 px-3 py-2 shadow-lg backdrop-blur">
            {label && (
                <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                </p>
            )}

            <div className="space-y-1">
                {payload.map(
                    (
                        item: {
                            name?: string;
                            value?: number | string;
                            color?: string;
                        },
                        index: number
                    ) => (
                        <div
                            key={`${item.name}-${index}`}
                            className="flex items-center justify-between gap-4 text-[11.5px]"
                        >
                            <span className="flex items-center gap-1.5 text-slate-500">
                                <span
                                    className="h-1.5 w-1.5 rounded-full"
                                    style={{ background: item.color }}
                                />
                                {item.name}
                            </span>

                            <span className="font-semibold tabular-nums text-slate-900">
                                {peso(Number(item.value ?? 0))}
                            </span>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

interface DonutSlice {
    name: string;
    value: number;
    color: string;
    boarders?: number;
}

function DonutCard({
    title,
    subtitle,
    data,
    centerLabel,
    footer,
}: {
    title: string;
    subtitle: string;
    data: DonutSlice[];
    centerLabel: string;
    footer?: React.ReactNode;
}) {
    const [active, setActive] = useState<number | null>(null);
    const total = data.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mb-1">
                <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                    {title}
                </h2>
                <p className="mt-0.5 text-[11.5px] text-slate-400">{subtitle}</p>
            </div>

            <div className="relative mx-auto h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            innerRadius="66%"
                            outerRadius="94%"
                            paddingAngle={2.5}
                            cornerRadius={5}
                            stroke="none"
                            onMouseEnter={(_, i) => setActive(i)}
                            onMouseLeave={() => setActive(null)}
                        >
                            {data.map((slice, i) => (
                                <Cell
                                    key={slice.name}
                                    fill={slice.color}
                                    fillOpacity={active === null || active === i ? 1 : 0.25}
                                    className="transition-all duration-200 outline-none"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<ChartTooltip />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center readout — follows the hovered slice */}
                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                        {active === null ? centerLabel : data[active].name}
                    </p>
                    <p className="text-[15px] font-bold tabular-nums tracking-tight text-slate-900">
                        {peso(active === null ? total : data[active].value)}
                    </p>
                    {active !== null && (
                        <p className="text-[10.5px] font-medium tabular-nums text-slate-400">
                            {((data[active].value / total) * 100).toFixed(1)}% of total
                        </p>
                    )}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-3 space-y-1.5">
                {data.map((slice, i) => (
                    <div
                        key={slice.name}
                        onMouseEnter={() => setActive(i)}
                        onMouseLeave={() => setActive(null)}
                        className="flex cursor-default items-center justify-between rounded-lg px-1.5 py-1 transition-colors hover:bg-slate-50"
                    >
                        <span className="flex items-center gap-2 text-[11.5px] text-slate-600">
                            <span
                                className="h-2 w-2 shrink-0 rounded-sm"
                                style={{ background: slice.color }}
                            />
                            {slice.name}
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="text-[11.5px] font-semibold tabular-nums text-slate-900">
                                {peso(slice.value)}
                            </span>
                            <span className="w-10 text-right text-[10.5px] tabular-nums text-slate-400">
                                {((slice.value / total) * 100).toFixed(1)}%
                            </span>
                        </span>
                    </div>
                ))}
            </div>

            {footer && (
                <div className="mt-auto border-t border-slate-100 pt-2.5">{footer}</div>
            )}
        </div>
    );
}



export default function FinancialReport() {
    const navigate = useNavigate();
    const [printOpen, setPrintOpen] = useState(false);
    const { getBillingStats, getIncomeMix, getRevenueTrend, billingStats, incomeMix, revenueTrend, detailedSummary, getDetailedSummary } = useBilling();


    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                getBillingStats(),
                getIncomeMix(),
                getRevenueTrend(),
                getDetailedSummary(),
            ]);
        };

        loadData();
        //eslint-disable-next-line
    }, []);

    const stats = billingStats
        ? [
            {
                label: "Total income",
                value: peso(billingStats.totalIncome),
                change: `${billingStats.totalIncomeChange}%`,
                note: "vs last month",
                positive: billingStats.totalIncomeChange >= 0,
                icon: Wallet,
            },
            {
                label: "Late fees collected",
                value: peso(billingStats.lateFeesCollected),
                change: `${billingStats.lateFeesChange}%`,
                note: "vs last month",
                positive: billingStats.lateFeesChange >= 0,
                icon: AlertTriangle,
            },
            {
                label: "Amount Collected (This Month)",
                value: peso(
                    billingStats.amountCollectedThisMonth
                ),
                change: `${billingStats.amountCollectedChange}%`,
                note: "vs last month",
                positive:
                    billingStats.amountCollectedChange >= 0,
                icon: Clock,
            },
            {
                label: "Collection rate",
                value: `${billingStats.collectionRate}%`,
                change: `${billingStats.collectionRateChange}%`,
                note: "vs last month",
                positive:
                    billingStats.collectionRateChange >= 0,
                icon: Percent,
            },
        ]
        : [];

    const totalIncomeRow = detailedSummary
        ? {
            category: "Total Income",
            thisMonth:
                detailedSummary.totalIncomeThisMonth,
            lastMonth:
                detailedSummary.totalIncomeLastMonth,
            change:
                detailedSummary.totalIncomeChange,
            positive:
                detailedSummary.totalIncomeChange >= 0,
        }
        : null;


    const currentMonth = new Date().toLocaleString(
        "en-US",
        {
            month: "long",
            year: "numeric",
        }
    );

     const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastDay = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
    );

    const dateRange = `${firstDay.toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
    })} – ${lastDay.toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    })}`;

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
                            Reports · Finance
                        </p>
                        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                            Financial Report
                        </h1>
                        <p className="mt-0.5 text-[11.5px] text-slate-500">
                            Income, late fees and collection summary for the boarding house
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {dateRange}
                        </button>
                        <button
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                            onClick={() => setPrintOpen(true)}
                        >
                            <Printer className="h-3.5 w-3.5 text-slate-400" />
                            Print
                        </button>
                       

                        <ExportMenu
                            billingStats={billingStats}
                            incomeMix={incomeMix}
                            revenueTrend={revenueTrend}
                            detailedSummary={detailedSummary}
                            onPrint={() => setPrintOpen(true)}
                        />
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    {stats.map((s) => {
                        const Icon = s.icon;
                        return (
                            <div
                                key={s.label}
                                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
                                        {s.label}
                                    </p>
                                    <Icon className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
                                </div>

                                <p className="mt-2 text-lg font-bold tabular-nums tracking-tight text-slate-900">
                                    {s.value}
                                </p>

                                <div className="mt-2 flex items-center gap-1.5">
                                    <span
                                        className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums ${s.positive
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-rose-50 text-rose-700"
                                            }`}
                                    >
                                        {s.positive ? (
                                            <TrendingUp className="h-2.5 w-2.5" />
                                        ) : (
                                            <TrendingDown className="h-2.5 w-2.5" />
                                        )}
                                        {s.change}
                                    </span>
                                    <span className="text-[10.5px] text-slate-400">{s.note}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Trend + income mix */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2">
                        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                    Income vs late fees
                                </h2>
                                <p className="mt-0.5 text-[11.5px] text-slate-400">
                                    Last six months of collections
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                                    Income
                                </span>
                                <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                                    Late fees
                                </span>
                                <button className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[11px] font-medium text-slate-500 transition-colors hover:bg-slate-50">
                                    Monthly
                                    <ChevronDown className="h-3 w-3" />
                                </button>
                            </div>
                        </div>

                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={revenueTrend}
                                    margin={{ top: 5, right: 5, left: -12, bottom: 0 }}
                                >
                                    <defs>
                                        <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#0f172a" stopOpacity={0.16} />
                                            <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="lateFeeFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.16} />
                                            <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
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
                                        width={52}
                                    />
                                    <Tooltip
                                        content={<ChartTooltip />}
                                        cursor={{ stroke: "#cbd5e1", strokeDasharray: "4 4" }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#0f172a"
                                        strokeWidth={2}
                                        fill="url(#incomeFill)"
                                        dot={false}
                                        activeDot={{ r: 4, fill: "#0f172a", stroke: "#fff", strokeWidth: 2 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="lateFees"
                                        stroke="#f43f5e"
                                        strokeWidth={2}
                                        fill="url(#lateFeeFill)"
                                        dot={false}
                                        activeDot={{ r: 4, fill: "#f43f5e", stroke: "#fff", strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <DonutCard
                        title="Income mix"
                        subtitle={
                            detailedSummary
                                ? `Where ${currentMonth.split(" ")[0]
                                }'s ${peso(
                                    detailedSummary.totalIncomeThisMonth
                                )} came from`
                                : "Loading income mix..."
                        }
                        data={incomeMix}
                        centerLabel="Total income"
                        footer={
                            <p className="text-[11px] text-slate-400">
                                Room fees carry{" "}
                                <span className="font-semibold text-slate-600">80.7%</span> of
                                monthly income.
                            </p>
                        }
                    />
                </div>



                {/* Detailed summary */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <div>
                            <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                Detailed summary
                            </h2>
                            <p className="mt-0.5 text-[11.5px] text-slate-400">
                                {new Date().toLocaleString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}{" "}
                                compared with{" "}
                                {new Date(
                                    new Date().setMonth(
                                        new Date().getMonth() - 1
                                    )
                                ).toLocaleString("en-US", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-[10.5px] uppercase tracking-wider text-slate-400">
                                    <th className="py-2.5 font-medium">Category</th>
                                    <th className="py-2.5 text-right font-medium">
                                        This month
                                    </th>
                                    <th className="py-2.5 text-right font-medium">
                                        Last month
                                    </th>
                                    <th className="py-2.5 text-right font-medium">Change</th>
                                </tr>
                            </thead>
                            <tbody>
                                {detailedSummary?.rows?.map((row) => (
                                    <tr
                                        key={row.category}
                                        className="border-b border-slate-50 text-[12.5px] text-slate-700 transition-colors hover:bg-slate-50/70"
                                    >
                                        <td className="py-2.5 font-medium text-slate-800">
                                            {row.category}
                                        </td>
                                        <td className="py-2.5 text-right font-semibold tabular-nums text-slate-900">
                                            {peso(row.thisMonth)}
                                        </td>
                                        <td className="py-2.5 text-right tabular-nums text-slate-400">
                                            {peso(row.lastMonth)}
                                        </td>
                                        <td className="py-2.5 text-right">
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums ${row.positive
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-rose-50 text-rose-700"
                                                    }`}
                                            >
                                                {row.positive ? (
                                                    <TrendingUp className="h-2.5 w-2.5" />
                                                ) : (
                                                    <TrendingDown className="h-2.5 w-2.5" />
                                                )}
                                                {row.change}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {totalIncomeRow && (
                                    <tr className="text-[12.5px] font-semibold text-white">
                                        <td className="rounded-l-xl bg-slate-900 py-3 pl-3">
                                            {totalIncomeRow.category}
                                        </td>

                                        <td className="bg-slate-900 py-3 text-right tabular-nums">
                                            {peso(totalIncomeRow.thisMonth)}
                                        </td>

                                        <td className="bg-slate-900 py-3 text-right tabular-nums text-slate-300">
                                            {peso(totalIncomeRow.lastMonth)}
                                        </td>

                                        <td
                                            className={`rounded-r-xl bg-slate-900 py-3 pr-3 text-right tabular-nums ${totalIncomeRow.positive
                                                ? "text-emerald-400"
                                                : "text-rose-400"
                                                }`}
                                        >
                                            {totalIncomeRow.positive ? "+" : ""}
                                            {totalIncomeRow.change}%
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <PrintFinancialReportModal
                open={printOpen}
                onClose={() => setPrintOpen(false)}
                billingStats={billingStats}
                incomeMix={incomeMix}
                revenueTrend={revenueTrend}
                detailedSummary={detailedSummary}
            />
            <ExportMenu
                billingStats={billingStats}
                incomeMix={incomeMix}
                revenueTrend={revenueTrend}
                detailedSummary={detailedSummary}
                onPrint={() => setPrintOpen(true)}
            />
        </div>
    );
}