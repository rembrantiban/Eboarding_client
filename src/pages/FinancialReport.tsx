import {
    ArrowLeft,
    DollarSign,
    Wallet,
    Percent,
    TrendingUp,
    TrendingDown,
    Calendar,
    ChevronDown,
    Download,
    Printer,
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
} from "recharts";

const stats = [
    {
        label: "Total Income",
        value: "₱245,800.00",
        change: "+12.5% vs last month",
        positive: true,
        icon: DollarSign,
        bg: "bg-blue-50",
        fg: "text-blue-600",
    },
    {
        label: "Total Expenses",
        value: "₱98,450.00",
        change: "+8.3% vs last month",
        positive: false,
        icon: TrendingDown,
        bg: "bg-rose-50",
        fg: "text-rose-600",
    },
    {
        label: "Net Profit",
        value: "₱147,350.00",
        change: "+18.7% vs last month",
        positive: true,
        icon: Wallet,
        bg: "bg-emerald-50",
        fg: "text-emerald-600",
    },
    {
        label: "Collection Rate",
        value: "92.6%",
        change: "+5.4% vs last month",
        positive: true,
        icon: Percent,
        bg: "bg-violet-50",
        fg: "text-violet-600",
    },
];

const chartData = [
    { month: "Dec", income: 158000, expenses: 62000 },
    { month: "Jan", income: 188000, expenses: 74000 },
    { month: "Feb", income: 172000, expenses: 68000 },
    { month: "Mar", income: 232000, expenses: 91000 },
    { month: "Apr", income: 219600, expenses: 84000 },
    { month: "May", income: 245800, expenses: 98450 },
];

const detailedSummary = [
    { category: "Room Fees", thisMonth: 180000, lastMonth: 160000, change: "+12.50%" },
    { category: "Utilities Fees", thisMonth: 35500, lastMonth: 32000, change: "+10.94%" },
    { category: "Other Charges", thisMonth: 20300, lastMonth: 18700, change: "+8.56%" },
    { category: "Late Fees", thisMonth: 10000, lastMonth: 8900, change: "+12.36%" },
];

const totalRow = { category: "Total Income", thisMonth: 245800, lastMonth: 219600, change: "+11.93%" };

const transactions = [
    {
        date: "May 31, 2025",
        desc: "Payment - Room 101",
        type: "Income",
        category: "Room Fees",
        amount: "+₱5,000.00",
        ref: "OR# 20250531-101",
    },
    {
        date: "May 31, 2025",
        desc: "Electric Bill",
        type: "Expense",
        category: "Utilities",
        amount: "-₱2,450.00",
        ref: "INV# 20250531-002",
    },
    {
        date: "May 30, 2025",
        desc: "Payment - Room 105",
        type: "Income",
        category: "Room Fees",
        amount: "+₱4,500.00",
        ref: "OR# 20250530-098",
    },
    {
        date: "May 29, 2025",
        desc: "Staff Salary",
        type: "Expense",
        category: "Staff",
        amount: "-₱15,000.00",
        ref: "PR# 20250529-011",
    },
];

const peso = (n: number) => `₱${n.toLocaleString()}`;
const pesoK = (n: number) => (n === 0 ? "₱0" : `₱${n / 1000}K`);

export default function FinancialReport() {

    const navigate = useNavigate()


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
                            Financial Report
                        </h1>
                        <p className="text-xs text-slate-500">
                            Income, expenses and financial summary of operations
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            May 01 &ndash; May 31, 2025
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                        <button className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-slate-800">
                            <Download className="h-3.5 w-3.5" />
                            Export
                            <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300">
                            <Printer className="h-3.5 w-3.5 text-slate-400" />
                            Print
                        </button>
                    </div>
                </div>

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
                                <p
                                    className={`mt-2 flex items-center gap-1 text-xs font-medium ${s.positive ? "text-emerald-600" : "text-rose-600"
                                        }`}
                                >
                                    {s.positive ? (
                                        <TrendingUp className="h-3 w-3" />
                                    ) : (
                                        <TrendingDown className="h-3 w-3" />
                                    )}
                                    {s.change}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Income vs Expenses chart */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Income vs Expenses
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="h-2 w-2 rounded-full bg-blue-600" />
                                Income
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                <span className="h-2 w-2 rounded-full bg-rose-500" />
                                Expenses
                            </div>
                            <button className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">
                                Monthly
                                <ChevronDown className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                    <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity={0.18} />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="expensesFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.15} />
                                        <stop offset="100%" stopColor="#f43f5e" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
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
                                    width={55}
                                />
                                <Tooltip
                                    formatter={(v) => peso(v as number)}
                                    contentStyle={{
                                        fontSize: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #e2e8f0",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="income"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    fill="url(#incomeFill)"
                                    dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="expenses"
                                    stroke="#f43f5e"
                                    strokeWidth={2}
                                    fill="url(#expensesFill)"
                                    dot={{ r: 3, fill: "#f43f5e", strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Summary */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h2 className="mb-2 text-sm font-semibold text-slate-900">
                        Detailed Summary
                    </h2>
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                <th className="py-2 font-medium">Category</th>
                                <th className="py-2 font-medium">This Month (May 2025)</th>
                                <th className="py-2 font-medium">Last Month (Apr 2025)</th>
                                <th className="py-2 text-right font-medium">Change</th>
                            </tr>
                        </thead>
                        <tbody>
                            {detailedSummary.map((row) => (
                                <tr
                                    key={row.category}
                                    className="border-b border-slate-50 text-xs text-slate-700 hover:bg-slate-50"
                                >
                                    <td className="py-2.5 font-medium text-slate-800">
                                        {row.category}
                                    </td>
                                    <td className="py-2.5">{peso(row.thisMonth)}</td>
                                    <td className="py-2.5 text-slate-400">
                                        {peso(row.lastMonth)}
                                    </td>
                                    <td className="py-2.5 text-right font-medium text-emerald-600">
                                        {row.change}
                                    </td>
                                </tr>
                            ))}
                            <tr className="bg-blue-50 text-xs font-semibold text-blue-700">
                                <td className="rounded-l-lg py-2.5 pl-2">{totalRow.category}</td>
                                <td className="py-2.5">{peso(totalRow.thisMonth)}</td>
                                <td className="py-2.5 text-blue-500">{peso(totalRow.lastMonth)}</td>
                                <td className="rounded-r-lg py-2.5 pr-2 text-right">
                                    {totalRow.change}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Recent Transactions */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Recent Transactions
                        </h2>
                        <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-140 border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                    <th className="py-2 font-medium">Date</th>
                                    <th className="py-2 font-medium">Description</th>
                                    <th className="py-2 font-medium">Type</th>
                                    <th className="py-2 font-medium">Category</th>
                                    <th className="py-2 font-medium">Amount</th>
                                    <th className="py-2 font-medium">Reference</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                                    >
                                        <td className="py-2.5 text-slate-500">{t.date}</td>
                                        <td className="py-2.5 font-medium text-slate-800">
                                            {t.desc}
                                        </td>
                                        <td className="py-2.5">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${t.type === "Income"
                                                        ? "bg-emerald-50 text-emerald-600"
                                                        : "bg-rose-50 text-rose-600"
                                                    }`}
                                            >
                                                {t.type}
                                            </span>
                                        </td>
                                        <td className="py-2.5 text-slate-500">{t.category}</td>
                                        <td
                                            className={`py-2.5 font-medium ${t.type === "Income" ? "text-emerald-600" : "text-rose-600"
                                                }`}
                                        >
                                            {t.amount}
                                        </td>
                                        <td className="py-2.5 text-slate-400">{t.ref}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}