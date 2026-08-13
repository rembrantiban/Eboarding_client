import {
    ArrowLeft,
    Building2,
    Users,
    DoorOpen,
    TrendingUp,
    Calendar,
    ChevronDown,
    FileDown,
    FileSpreadsheet,
    Printer,
    Lightbulb,
    CheckCircle2,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";

const stats = [
    {
        label: "Total Rooms",
        value: "50",
        sub: "All rooms in the property",
        icon: Building2,
        bg: "bg-blue-50",
        fg: "text-blue-600",
    },
    {
        label: "Occupied Rooms",
        value: "42",
        sub: "Rooms currently occupied",
        icon: Users,
        bg: "bg-emerald-50",
        fg: "text-emerald-600",
    },
    {
        label: "Available Rooms",
        value: "8",
        sub: "Rooms currently available",
        icon: DoorOpen,
        bg: "bg-amber-50",
        fg: "text-amber-600",
    },
    {
        label: "Occupancy Rate",
        value: "84%",
        sub: "+6% vs last month",
        icon: TrendingUp,
        bg: "bg-violet-50",
        fg: "text-violet-600",
        positive: true,
    },
];

const trendData = [
    { month: "Jan", rate: 75 },
    { month: "Feb", rate: 78 },
    { month: "Mar", rate: 81 },
    { month: "Apr", rate: 83 },
    { month: "May", rate: 84 },
    { month: "Jun", rate: 86 },
];



type ActionStyle =
  | "Check-In"
  | "Check-Out"
  | "Transfer";

const statusData = [
    { name: "Occupied", value: 42, color: "#2563eb" },
    { name: "Available", value: 8, color: "#059669" },
    { name: "Maintenance", value: 2, color: "#d97706" },
];

type Activity = {
  date: string;
  boarder: string;
  room: string;
  bed: string;
  action: ActionStyle;
  by: string;
};

const activity : Activity[] = [
    { date: "May 31, 2025", boarder: "Juan Dela Cruz", room: "101", bed: "A", action: "Check-In", by: "Admin" },
    { date: "May 31, 2025", boarder: "Maria Santos", room: "203", bed: "B", action: "Transfer", by: "Admin" },
    { date: "May 30, 2025", boarder: "Pedro Reyes", room: "105", bed: "A", action: "Check-Out", by: "Admin" },
    { date: "May 30, 2025", boarder: "Ana Garcia", room: "102", bed: "A", action: "Check-In", by: "Admin" },
    { date: "May 28, 2025", boarder: "Luis Mendoza", room: "201", bed: "A", action: "Check-Out", by: "Admin" },
];

const actionStyle: Record<ActionStyle, string> = {
    "Check-In": "bg-emerald-50 text-emerald-600",
    "Check-Out": "bg-rose-50 text-rose-600",
    "Transfer": "bg-blue-50 text-blue-600",
};

const insights = [
    "Current occupancy rate is 84%",
    "42 of 50 rooms are occupied",
    "8 rooms are available",
    "2 rooms are under maintenance",
    "Occupancy increased by 6% compared to last month",
];

const rooms = [
    { number: "101", floor: "1st Floor", capacity: 4, occupied: 4, available: 0, status: "Full", date: "May 31, 2025" },
    { number: "102", floor: "1st Floor", capacity: 4, occupied: 3, available: 1, status: "Available", date: "May 31, 2025" },
    { number: "103", floor: "1st Floor", capacity: 4, occupied: 2, available: 2, status: "Available", date: "May 30, 2025" },
    { number: "104", floor: "1st Floor", capacity: 4, occupied: 0, available: 4, status: "Vacant", date: "May 29, 2025" },
    { number: "202", floor: "2nd Floor", capacity: 4, occupied: 4, available: 0, status: "Occupied", date: "May 31, 2025" },
    { number: "203", floor: "2nd Floor", capacity: 4, occupied: 3, available: 1, status: "Available", date: "May 30, 2025" },
];

const statusStyle: Record<string, string> = {
    Full: "bg-rose-50 text-rose-600",
    Available: "bg-emerald-50 text-emerald-600",
    Vacant: "bg-slate-100 text-slate-500",
    Occupied: "bg-blue-50 text-blue-600",
};

const totalRooms = statusData.reduce((sum, d) => sum + d.value, 0);

export default function OccupancyReport() {

    const navigate = useNavigate()

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-2 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-15 pt-4 bg-gray-50">
                {/* Back link */}
                <button onClick={() => navigate(-1)}  className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Reports
                </button>

                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                            Occupancy Report
                        </h1>
                        <p className="text-xs text-slate-500">
                            Monitor room utilization, occupancy trends, and bed availability
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
                                    className={`mt-2 flex items-center gap-1 text-xs font-medium ${s.positive ? "text-emerald-600" : "text-slate-400"
                                        }`}
                                >
                                    {s.positive && <TrendingUp className="h-3 w-3" />}
                                    {s.sub}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Trend + Distribution */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Occupancy Rate Trend */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Occupancy Rate Trend
                            </h2>
                            <button className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">
                                Monthly
                                <ChevronDown className="h-3 w-3" />
                            </button>
                        </div>
                        <div className="h-44 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
                                        tickFormatter={(v) => `${v}%`}
                                        domain={[0, 100]}
                                        width={40}
                                    />
                                    <Tooltip
                                        formatter={(v) => [`${v}%`, "Occupancy Rate"]}
                                        contentStyle={{
                                            fontSize: "12px",
                                            borderRadius: "8px",
                                            border: "1px solid #e2e8f0",
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="rate"
                                        stroke="#2563eb"
                                        strokeWidth={2}
                                        dot={{ r: 3, fill: "#2563eb", strokeWidth: 0 }}
                                        activeDot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
                            <span className="h-2 w-2 rounded-full bg-blue-600" />
                            Occupancy Rate (%)
                        </div>
                    </div>

                    {/* Room Status Distribution */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <h2 className="mb-2 text-sm font-semibold text-slate-900">
                            Room Status Distribution
                        </h2>
                        <div className="relative mx-auto h-32 w-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        dataKey="value"
                                        innerRadius={38}
                                        outerRadius={56}
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="none"
                                    >
                                        {statusData.map((d) => (
                                            <Cell key={d.name} fill={d.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs text-slate-400">Total Rooms</span>
                                <span className="text-lg font-bold text-slate-900">
                                    {totalRooms}
                                </span>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1.5">
                            {statusData.map((d) => (
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
                                        {d.value} ({Math.round((d.value / totalRooms) * 100)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity + Insights */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Recent Occupancy Activity */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
                        <h2 className="mb-2 text-sm font-semibold text-slate-900">
                            Recent Occupancy Activity
                        </h2>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                    <th className="py-2 font-medium">Date</th>
                                    <th className="py-2 font-medium">Boarder</th>
                                    <th className="py-2 font-medium">Room</th>
                                    <th className="py-2 font-medium">Bed</th>
                                    <th className="py-2 font-medium">Action</th>
                                    <th className="py-2 text-right font-medium">By</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activity.map((a, i) => (
                                    <tr
                                        key={i}
                                        className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                                    >
                                        <td className="py-2.5 text-slate-500">{a.date}</td>
                                        <td className="py-2.5 font-medium text-slate-800">
                                            {a.boarder}
                                        </td>
                                        <td className="py-2.5">{a.room}</td>
                                        <td className="py-2.5">{a.bed}</td>
                                        <td className="py-2.5">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${actionStyle[a.action]}`}
                                            >
                                                {a.action}
                                            </span>
                                        </td>
                                        <td className="py-2.5 text-right text-slate-500">
                                            {a.by}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700">
                            View All Activity
                            <ArrowRight className="h-3 w-3" />
                        </button>
                    </div>

                    {/* Occupancy Insights */}
                    <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                                <Lightbulb className="h-3.5 w-3.5 text-emerald-600" />
                            </div>
                            <h2 className="text-sm font-semibold text-emerald-900">
                                Occupancy Insights
                            </h2>
                        </div>
                        <ul className="space-y-2">
                            {insights.map((item, i) => (
                                <li key={i} className="flex items-start gap-1.5 text-xs text-emerald-800">
                                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Building2 className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 text-emerald-200 opacity-60" />
                    </div>
                </div>

                {/* Room Availability Overview */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <h2 className="mb-2 text-sm font-semibold text-slate-900">
                        Room Availability Overview
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-150 border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                    <th className="py-2 font-medium">Room Number</th>
                                    <th className="py-2 font-medium">Floor</th>
                                    <th className="py-2 font-medium">Capacity</th>
                                    <th className="py-2 font-medium">Occupied</th>
                                    <th className="py-2 font-medium">Available Beds</th>
                                    <th className="py-2 font-medium">Status</th>
                                    <th className="py-2 text-right font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((r) => (
                                    <tr
                                        key={r.number}
                                        className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                                    >
                                        <td className="py-2.5 font-medium text-slate-800">
                                            {r.number}
                                        </td>
                                        <td className="py-2.5 text-slate-500">{r.floor}</td>
                                        <td className="py-2.5">{r.capacity}</td>
                                        <td className="py-2.5">{r.occupied}</td>
                                        <td className="py-2.5">{r.available}</td>
                                        <td className="py-2.5">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle[r.status]}`}
                                            >
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="py-2.5 text-right text-slate-500">
                                            {r.date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-slate-400">Showing 1 to 6 of 50 rooms</p>
                        <div className="flex items-center gap-1">
                            <button className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
                                <ChevronLeft className="h-3.5 w-3.5" />
                            </button>
                            {[1, 2, 3].map((p) => (
                                <button
                                    key={p}
                                    className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium ${p === 1
                                            ? "bg-slate-900 text-white"
                                            : "text-slate-500 hover:bg-slate-100"
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                            <span className="px-0.5 text-xs text-slate-400">&hellip;</span>
                            <button className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium text-slate-500 hover:bg-slate-100">
                                9
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