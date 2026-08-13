import {
    ArrowLeft,
    Wallet,
    CheckCircle2,
    User,
    Percent,
    TrendingUp,
    Calendar,
    ChevronDown,
    FileDown,
    FileSpreadsheet,
    Printer,
    Search,
    SlidersHorizontal,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    BadgeCheck,
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

type PaymentStatus =
  | "Paid"
  | "Partial"
  | "Unpaid"
  | "Overdue";

const statusBadge: Record<PaymentStatus, string> = {
  Paid: "bg-emerald-50 text-emerald-600",
  Partial: "bg-amber-50 text-amber-600",
  Unpaid: "bg-rose-50 text-rose-600",
  Overdue: "bg-red-50 text-red-600",
};


const peso = (n: number) =>
    `₱${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const pesoK = (n: number) => (n === 0 ? "₱0" : `₱${Math.round(n / 1000)}K`);

const stats = [
    {
        label: "Total Collections",
        value: "₱256,780.00",
        change: "+18.4% vs last month",
        icon: Wallet,
        bg: "bg-blue-50",
        fg: "text-blue-600",
    },
    {
        label: "Total Transactions",
        value: "152",
        change: "+14.6% vs last month",
        icon: CheckCircle2,
        bg: "bg-emerald-50",
        fg: "text-emerald-600",
    },
    {
        label: "Paid Boarders",
        value: "96",
        change: "+10.9% vs last month",
        icon: User,
        bg: "bg-indigo-50",
        fg: "text-indigo-600",
    },
    {
        label: "Collection Rate",
        value: "92.6%",
        change: "+6.3% vs last month",
        icon: Percent,
        bg: "bg-amber-50",
        fg: "text-amber-600",
    },
    {
        label: "Average Collection",
        value: "₱1,784.58",
        change: "+10.7% vs last month",
        icon: TrendingUp,
        bg: "bg-rose-50",
        fg: "text-rose-600",
    },
];

const chartData = [
    { month: "Dec", amount: 192450 },
    { month: "Jan", amount: 195320 },
    { month: "Feb", amount: 201870 },
    { month: "Mar", amount: 218950 },
    { month: "Apr", amount: 217450 },
    { month: "May", amount: 256780 },
];

type Transaction = {
  date: string;
  billing: string;
  boarder: string;
  amount: number;
  method: MethodStatus;
  ref: string;
  status: PaymentStatus;
};

const transactions: Transaction[] = [
    { date: "May 31, 2025", billing: "BILL-2025-051", boarder: "Juan Dela Cruz", amount: 2500, method: "GCash", ref: "GC-1224567890", status: "Paid" },
    { date: "May 31, 2025", billing: "BILL-2025-052", boarder: "Maria Santos", amount: 2300, method: "Cash", ref: "—", status: "Paid" },
    { date: "May 30, 2025", billing: "BILL-2025-053", boarder: "Pedro Reyes", amount: 2930, method: "Bank Transfer", ref: "MBT-987654321", status: "Paid" },
    { date: "May 30, 2025", billing: "BILL-2025-054", boarder: "Ana Garcia", amount: 2230, method: "GCash", ref: "GC-1122334455", status: "Paid" },
    { date: "May 29, 2025", billing: "BILL-2025-055", boarder: "Luis Mendoza", amount: 2500, method: "Cash", ref: "—", status: "Paid" },
];

type MethodStatus =
  | "GCash"
  | "Cash"
  | "Bank Transfer"
  | "Card Payment";

const methodBadge: Record<MethodStatus, string> = {
    GCash: "bg-blue-50 text-blue-600",
    Cash: "bg-emerald-50 text-emerald-600",
    "Bank Transfer": "bg-violet-50 text-violet-600",
    "Card Payment": "bg-amber-50 text-amber-600",
};



const filters = ["All", "Paid", "Partial", "Unpaid", "Overdue"];

 type Boarders = {
    name: string;
    room: string;
    billing: string;
    due: string;
    total: number;
    paid: number;
    balance: number;
    status: PaymentStatus;
    paidDate: string;
};

const boarders : Boarders[] = [
    { name: "Juan Dela Cruz", room: "101", billing: "BILL-2025-051", due: "May 31, 2025", total: 2500, paid: 2500, balance: 0, status: "Paid", paidDate: "May 31, 2025" },
    { name: "Maria Santos", room: "203", billing: "BILL-2025-052", due: "May 31, 2025", total: 2500, paid: 1200, balance: 1300, status: "Partial", paidDate: "May 31, 2025" },
    { name: "Pedro Reyes", room: "105", billing: "BILL-2025-053", due: "May 30, 2025", total: 2930, paid: 0, balance: 2930, status: "Unpaid", paidDate: "—" },
    { name: "Ana Garcia", room: "302", billing: "BILL-2025-054", due: "May 30, 2025", total: 2230, paid: 2230, balance: 0, status: "Paid", paidDate: "May 30, 2025" },
    { name: "Luis Mendoza", room: "201", billing: "BILL-2025-055", due: "May 29, 2025", total: 2500, paid: 1500, balance: 1000, status: "Partial", paidDate: "May 29, 2025" },
];

export default function PaymentCollectionReport() {
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
                            Payment Collection Report
                        </h1>
                        <p className="text-xs text-slate-500">
                            Track payment collections and transaction records
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            May 01 &ndash; May 31, 2025
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                        <button className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-rose-700">
                            <FileDown className="h-3.5 w-3.5" />
                            Export PDF
                        </button>
                        <button className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700">
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                            Export Excel
                        </button>
                        <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300">
                            <Printer className="h-3.5 w-3.5 text-slate-400" />
                            Print
                        </button>
                    </div>
                </div>

                {/* Stat cards */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
                                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-emerald-600">
                                    <TrendingUp className="h-3 w-3" />
                                    {s.change}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Collection Trend */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-2 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Collection Trend
                        </h2>
                        <button className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">
                            Monthly
                            <ChevronDown className="h-3 w-3" />
                        </button>
                    </div>
                    <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="collectionFill" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                                        <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
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
                                    width={45}
                                />
                                <Tooltip
                                    formatter={(v) => [peso(v as number), "Total Collections"]}
                                    contentStyle={{
                                        fontSize: "12px",
                                        borderRadius: "8px",
                                        border: "1px solid #e2e8f0",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    fill="url(#collectionFill)"
                                    dot={{ r: 3, fill: "#6366f1", strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                        <span className="h-2 w-2 rounded-full bg-indigo-500" />
                        Total Collections (₱)
                    </div>
                </div>

                {/* Transactions + Summary */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Recent Collection Transactions */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
                        <h2 className="mb-2 text-sm font-semibold text-slate-900">
                            Recent Collection Transactions
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-130 border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                        <th className="py-2 font-medium">Date</th>
                                        <th className="py-2 font-medium">Boarder</th>
                                        <th className="py-2 font-medium">Amount</th>
                                        <th className="py-2 font-medium">Method</th>
                                        <th className="py-2 text-right font-medium">Status</th>
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
                                                {t.boarder}
                                            </td>
                                            <td className="py-2.5 font-medium text-slate-800">
                                                {peso(t.amount)}
                                            </td>
                                            <td className="py-2.5">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${methodBadge[t.method]}`}
                                                >
                                                    {t.method}
                                                </span>
                                            </td>
                                            <td className="py-2.5 text-right">
                                                <span
                                                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[t.status]}`}
                                                >
                                                    {t.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button className="mt-2 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                            View All Transactions
                            <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>

                    {/* Collection Summary */}
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                                <BadgeCheck className="h-3.5 w-3.5 text-indigo-600" />
                            </div>
                            <h2 className="text-sm font-semibold text-indigo-900">
                                Collection Summary
                            </h2>
                        </div>

                        <p className="mb-1.5 text-xs font-semibold text-indigo-900">
                            This Month Summary
                        </p>
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-indigo-700">Total Collections</span>
                                <span className="font-medium text-indigo-900">₱256,780.00</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-indigo-700">Total Transactions</span>
                                <span className="font-medium text-indigo-900">152</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-indigo-700">Paid Boarders</span>
                                <span className="font-medium text-indigo-900">96</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-indigo-700">Collection Rate</span>
                                <span className="font-medium text-indigo-900">92.6%</span>
                            </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2.5 rounded-lg bg-white p-2.5 shadow-sm">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50">
                                <TrendingUp className="h-4 w-4 text-indigo-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs text-slate-400">Compared to last month</p>
                                <p className="text-xs font-semibold text-emerald-600">
                                    +18.4% increase in total collections
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Boarders Collection Status */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Boarders Collection Status
                        </h2>
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-1">
                                {filters.map((f) => (
                                    <button
                                        key={f}
                                        className={`rounded-md px-2.5 py-1 text-xs font-medium ${f === "All"
                                                ? "bg-indigo-600 text-white shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5">
                                <Search className="h-3.5 w-3.5 text-slate-400" />
                                <input
                                    placeholder="Search boarder"
                                    className="w-28 bg-transparent text-xs text-slate-600 outline-none placeholder:text-slate-400"
                                />
                            </div>
                            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:border-slate-300">
                                <SlidersHorizontal className="h-3.5 w-3.5" />
                                Filter
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-180 border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                    <th className="py-2 font-medium">Boarder</th>
                                    <th className="py-2 font-medium">Room</th>
                                    <th className="py-2 font-medium">Due Date</th>
                                    <th className="py-2 font-medium">Total</th>
                                    <th className="py-2 font-medium">Paid</th>
                                    <th className="py-2 font-medium">Balance</th>
                                    <th className="py-2 font-medium">Status</th>
                                    <th className="py-2 text-right font-medium">Payment Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {boarders.map((b) => (
                                    <tr
                                        key={b.name}
                                        className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                                    >
                                        <td className="py-2.5 font-medium text-slate-800">
                                            {b.name}
                                        </td>
                                        <td className="py-2.5">{b.room}</td>
                                        <td className="py-2.5 text-slate-500">{b.due}</td>
                                        <td className="py-2.5">{peso(b.total)}</td>
                                        <td className="py-2.5">{peso(b.paid)}</td>
                                        <td className="py-2.5">{peso(b.balance)}</td>
                                        <td className="py-2.5">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[b.status]}`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="py-2.5 text-right text-slate-500">
                                            {b.paidDate}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-400">Showing 1 to 5 of 96 boarders</p>
                        <div className="flex items-center gap-1">
                            <button className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            {[1, 2, 3].map((p) => (
                                <button
                                    key={p}
                                    className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium ${p === 1
                                            ? "bg-indigo-600 text-white"
                                            : "text-slate-500 hover:bg-slate-100"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <span className="px-0.5 text-xs text-slate-400">&hellip;</span>
                            <button className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium text-slate-500 hover:bg-slate-100">
                                20
                            </button>
                            <button className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
                                <ChevronRight className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}