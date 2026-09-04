import {
    ArrowLeft,
    Receipt,
    Users,
    AlertCircle,
    Clock,
    Calendar,
    ChevronDown,
    FileDown,
    FileSpreadsheet,
    Printer,
    TriangleAlert,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    ArrowUp,
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

const peso = (n: number) =>
    `₱${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const pesoK = (value: string | number | undefined) => {
    const n = Number(value ?? 0);
    return n === 0 ? "₱0" : `₱${n / 1000}K`;
};

const stats = [
    {
        label: "Total Penalties",
        value: "₱23,450.00",
        change: "+18.5% vs last month",
        icon: Receipt,
        bg: "bg-orange-50",
        fg: "text-orange-600",
    },
    {
        label: "Penalized Boarders",
        value: "18",
        change: "+12.5% vs last month",
        icon: Users,
        bg: "bg-rose-50",
        fg: "text-rose-600",
    },
    {
        label: "Late Payments",
        value: "27",
        change: "+15.2% vs last month",
        icon: AlertCircle,
        bg: "bg-amber-50",
        fg: "text-amber-600",
    },
    {
        label: "Average Penalty",
        value: "₱868.52",
        change: "+7.8% vs last month",
        icon: Clock,
        bg: "bg-violet-50",
        fg: "text-violet-600",
    },
];

const chartData = [
    { month: "Dec", amount: 15200 },
    { month: "Jan", amount: 17850 },
    { month: "Feb", amount: 15430 },
    { month: "Mar", amount: 22100 },
    { month: "Apr", amount: 19780 },
    { month: "May", amount: 22450 },
];

const typeData = [
    { name: "Late Payment", value: 16450, pct: "70.1%", color: "#ea580c" },
    { name: "Policy Violation", value: 4800, pct: "20.5%", color: "#d97706" },
    { name: "Other Charges", value: 2200, pct: "9.4%", color: "#fb923c" },
];

const totalPenalties = typeData.reduce((sum, d) => sum + d.value, 0);

type Records = {
    date: string;
    boarder: string;
    room: string;
    type: PenaltyType;
    reason: string;
    amount: number;
    status: PenaltyStatus;
}

 
const records: Records[] = [
    { date: "May 31, 2025", boarder: "Juan Dela Cruz", room: "101", type: "Late Payment", reason: "Payment 5 days late", amount: 500, status: "Unpaid" },
    { date: "May 31, 2025", boarder: "Maria Santos", room: "203", type: "Policy Violation", reason: "Unauthorized Visitor", amount: 300, status: "Unpaid" },
    { date: "May 30, 2025", boarder: "Pedro Reyes", room: "105", type: "Late Payment", reason: "Payment 3 days late", amount: 450, status: "Paid" },
    { date: "May 30, 2025", boarder: "Ana Garcia", room: "302", type: "Other Charges", reason: "Damaged Property", amount: 750, status: "Unpaid" },
    { date: "May 29, 2025", boarder: "Luis Mendoza", room: "201", type: "Late Payment", reason: "Payment 7 days late", amount: 600, status: "Paid" },
];

type PenaltyType =
    | "Late Payment"
    | "Policy Violation"
    | "Other Charges";


const typeBadge : Record<PenaltyType, string> = {
    "Late Payment": "bg-orange-50 text-orange-600",
    "Policy Violation": "bg-amber-50 text-amber-600",
    "Other Charges": "bg-rose-50 text-rose-600",
};

type PenaltyStatus =
    | "Unpaid"
    | "Paid"
    | "Partial";

const statusBadge : Record<PenaltyStatus, string> = {
    Unpaid: "bg-rose-50 text-rose-600",
    Paid: "bg-emerald-50 text-emerald-600",
    Partial: "bg-amber-50 text-amber-600",
};

    type Boarders =  {
    name: string;
    room: string;
    total: number;
    paid: number;
    unpaid: number;
    count: number;
    status: PenaltyStatus;
}


const boarders : Boarders[] = [
    { name: "Juan Dela Cruz", room: "101", total: 1200, paid: 700, unpaid: 500, count: 2, status: "Partial" },
    { name: "Maria Santos", room: "203", total: 600, paid: 0, unpaid: 600, count: 1, status: "Unpaid" },
    { name: "Pedro Reyes", room: "105", total: 450, paid: 450, unpaid: 0, count: 1, status: "Paid" },
    { name: "Ana Garcia", room: "302", total: 750, paid: 0, unpaid: 750, count: 1, status: "Unpaid" },
    { name: "Luis Mendoza", room: "201", total: 600, paid: 600, unpaid: 0, count: 0, status: "Paid" },
];

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

const toCSV = (rows: (string | number)[][]) =>
    rows
        .map((r) =>
            r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
        )
        .join("\r\n");

const downloadCSV = (filename: string, rows: (string | number)[][]) => {
    const blob = new Blob(["﻿" + toCSV(rows)], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

export default function PenaltyReport() {

    const navigate = useNavigate()

    const handleExportCSV = () => {
        const rows: (string | number)[][] = [
            ["Penalty Report", dateRange],
            [],
            ["Recent Penalty Records"],
            ["Date", "Boarder", "Room", "Type", "Reason", "Amount", "Status"],
            ...records.map((r) => [
                r.date,
                r.boarder,
                r.room,
                r.type,
                r.reason,
                r.amount,
                r.status,
            ]),
            [],
            ["Penalty Breakdown by Boarder"],
            [
                "Boarder",
                "Room",
                "Total Penalties",
                "Paid Amount",
                "Unpaid Amount",
                "Late Payment Count",
                "Status",
            ],
            ...boarders.map((b) => [
                b.name,
                b.room,
                b.total,
                b.paid,
                b.unpaid,
                b.count,
                b.status,
            ]),
        ];
        downloadCSV("penalty-report.csv", rows);
    };

    const handlePrint = () => {
        const win = window.open("", "_blank", "width=900,height=650");
        if (!win) return;

        const recordRows = records
            .map(
                (r) =>
                    `<tr><td>${r.date}</td><td>${r.boarder}</td><td>${r.room}</td><td>${r.type}</td><td>${r.reason}</td><td class="num">${peso(r.amount)}</td><td>${r.status}</td></tr>`
            )
            .join("");

        const boarderRows = boarders
            .map(
                (b) =>
                    `<tr><td>${b.name}</td><td>${b.room}</td><td class="num">${peso(b.total)}</td><td class="num">${peso(b.paid)}</td><td class="num">${peso(b.unpaid)}</td><td class="num">${b.count}</td><td>${b.status}</td></tr>`
            )
            .join("");

        win.document.write(`
            <html>
                <head>
                    <title>Penalty Report</title>
                    <style>
                        body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; color: #0f172a; }
                        h1 { font-size: 20px; margin: 0 0 2px; }
                        h2 { font-size: 14px; margin: 24px 0 8px; }
                        p.range { font-size: 12px; color: #64748b; margin: 0 0 8px; }
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #e2e8f0; padding: 6px 10px; font-size: 12px; text-align: left; }
                        th { background: #f8fafc; }
                        td.num { text-align: right; }
                    </style>
                </head>
                <body>
                    <h1>Penalty Report</h1>
                    <p class="range">${dateRange}</p>

                    <h2>Recent Penalty Records</h2>
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Boarder</th><th>Room</th><th>Type</th><th>Reason</th><th>Amount</th><th>Status</th></tr>
                        </thead>
                        <tbody>${recordRows}</tbody>
                    </table>

                    <h2>Penalty Breakdown by Boarder</h2>
                    <table>
                        <thead>
                            <tr><th>Boarder</th><th>Room</th><th>Total Penalties</th><th>Paid Amount</th><th>Unpaid Amount</th><th>Late Payment Count</th><th>Status</th></tr>
                        </thead>
                        <tbody>${boarderRows}</tbody>
                    </table>
                </body>
            </html>
        `);
        win.document.close();
        win.focus();
        win.print();
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
                            onClick={handlePrint}
                            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-rose-700"
                        >
                            <FileDown className="h-3.5 w-3.5" />
                            Export PDF
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700"
                        >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                            Export Excel
                        </button>
                        <button
                            onClick={handlePrint}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300"
                        >
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
                                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-rose-600">
                                    <ArrowUp className="h-3 w-3" />
                                    {s.change}
                                </p>
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
                            <button className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">
                                Monthly
                                <ChevronDown className="h-3 w-3" />
                            </button>
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
                                        <span className="text-slate-500">{d.name}</span>
                                    </div>
                                    <span className="font-medium text-slate-700">
                                        {peso(d.value)} ({d.pct})
                                    </span>
                                </div>
                            ))}
                        </div>
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
                                    <th className="py-2 font-medium">Room</th>
                                    <th className="py-2 font-medium">Type</th>
                                    <th className="py-2 font-medium">Amount</th>
                                    <th className="py-2 text-right font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {records.map((r, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                                    >
                                        <td className="py-2.5 text-slate-500">{r.date}</td>
                                        <td className="py-2.5 font-medium text-slate-800">
                                            {r.boarder}
                                        </td>
                                        <td className="py-2.5">{r.room}</td>
                                        <td className="py-2.5">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge[r.type]}`}
                                            >
                                                {r.type}
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
                            </tbody>
                        </table>
                        <button className="mt-2 flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700">
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
                                <span className="font-medium text-orange-900">₱9,850.00</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-orange-700">Total Penalties Unpaid</span>
                                <span className="font-medium text-orange-900">₱13,600.00</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-orange-700">Collection Rate</span>
                                <span className="font-medium text-orange-900">42.0%</span>
                            </div>
                        </div>

                        <p className="mb-1.5 text-xs font-semibold text-orange-900">
                            Top Penalty Reasons
                        </p>
                        <div className="space-y-1.5">
                            {typeData.map((d) => (
                                <div key={d.name} className="flex items-center justify-between text-xs">
                                    <span className="text-orange-700">{d.name}</span>
                                    <span className="font-medium text-orange-900">
                                        {peso(d.value)} ({d.pct})
                                    </span>
                                </div>
                            ))}
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
                                    <th className="py-2 font-medium">Room</th>
                                    <th className="py-2 font-medium">Total Penalties</th>
                                    <th className="py-2 font-medium">Paid Amount</th>
                                    <th className="py-2 font-medium">Unpaid Amount</th>
                                    <th className="py-2 font-medium">Late Payment Count</th>
                                    <th className="py-2 text-right font-medium">Status</th>
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
                                        <td className="py-2.5">{peso(b.total)}</td>
                                        <td className="py-2.5">{peso(b.paid)}</td>
                                        <td className="py-2.5">{peso(b.unpaid)}</td>
                                        <td className="py-2.5">{b.count}</td>
                                        <td className="py-2.5 text-right">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[b.status]}`}
                                            >
                                                {b.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-400">Showing 1 to 5 of 18 boarders</p>
                        <div className="flex items-center gap-1">
                            <button className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            {[1, 2, 3].map((p) => (
                                <button
                                    key={p}
                                    className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium ${p === 1
                                        ? "bg-orange-600 text-white"
                                        : "text-slate-500 hover:bg-slate-100"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <span className="px-0.5 text-xs text-slate-400">&hellip;</span>
                            <button className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium text-slate-500 hover:bg-slate-100">
                                4
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