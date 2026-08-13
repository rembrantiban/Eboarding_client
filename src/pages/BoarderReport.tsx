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
  SlidersHorizontal,
  BarChart3,
  ChevronLeft,
  ChevronRight,
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

const stats = [
  {
    label: "Total Boarders",
    value: "96",
    sub: "+12.5% vs last month",
    icon: Users,
    bg: "bg-rose-50",
    fg: "text-rose-600",
    positive: true,
  },
  {
    label: "Male Boarders",
    value: "62",
    sub: "64.6% of total",
    icon: Mars,
    bg: "bg-indigo-50",
    fg: "text-indigo-600",
  },
  {
    label: "Female Boarders",
    value: "34",
    sub: "35.4% of total",
    icon: Venus,
    bg: "bg-pink-50",
    fg: "text-pink-600",
  },
  {
    label: "Active Boarders",
    value: "92",
    sub: "95.8% are currently active",
    icon: UserCheck,
    bg: "bg-emerald-50",
    fg: "text-emerald-600",
  },
];

const chartData = [
  { month: "Dec", total: 78 },
  { month: "Jan", total: 82 },
  { month: "Feb", total: 85 },
  { month: "Mar", total: 90 },
  { month: "Apr", total: 92 },
  { month: "May", total: 96 },
];

const statusData = [
  { name: "Active", value: 92, pct: "95.8%", color: "#059669" },
  { name: "Inactive", value: 3, pct: "3.1%", color: "#eab308" },
  { name: "Checked-out", value: 1, pct: "1.0%", color: "#ef4444" },
];

const totalBoarders = statusData.reduce((sum, d) => sum + d.value, 0);

type RecentBoarder = {
  id: string;
  name: string;
  room: string;
  checkIn: string;
  status: BoarderStatus;
  contact: string;
};

const recent : RecentBoarder[] = [
  { id: "BRO-096", name: "Juan Dela Cruz", room: "101", checkIn: "May 30, 2025", status: "Active", contact: "0912 345 6789" },
  { id: "BRO-095", name: "Maria Santos", room: "203", checkIn: "May 29, 2025", status: "Active", contact: "0917 234 5678" },
  { id: "BRO-094", name: "Pedro Reyes", room: "105", checkIn: "May 28, 2025", status: "Active", contact: "0918 123 4567" },
  { id: "BRO-093", name: "Ana Garcia", room: "302", checkIn: "May 27, 2025", status: "Active", contact: "0918 765 4321" },
  { id: "BRO-092", name: "Luis Mendoza", room: "201", checkIn: "May 26, 2025", status: "Inactive", contact: "0915 987 6543" },
];

type BoarderStatus =
  | "Active"
  | "Inactive"
  | "Checked-out";

const statusBadge: Record<BoarderStatus, string> = {
  Active: "bg-emerald-50 text-emerald-600",
  Inactive: "bg-amber-50 text-amber-600",
  "Checked-out": "bg-rose-50 text-rose-600",
};

type Boarder = {
  id: string;
  name: string;
  gender: string;
  dob: string;
  room: string;
  checkIn: string;
  status: BoarderStatus;
  contact: string;
  email: string;
};

const boarders : Boarder[] = [
  { id: "BRO-096", name: "Juan Dela Cruz", gender: "Male", dob: "Jan 15, 2001", room: "101", checkIn: "May 30, 2025", status: "Active", contact: "0912 345 6789", email: "juan.delacruz@email.com" },
  { id: "BRO-095", name: "Maria Santos", gender: "Female", dob: "Mar 22, 2002", room: "203", checkIn: "May 29, 2025", status: "Active", contact: "0917 234 5678", email: "maria.santos@email.com" },
  { id: "BRO-094", name: "Pedro Reyes", gender: "Male", dob: "Jul 10, 2000", room: "105", checkIn: "May 28, 2025", status: "Active", contact: "0918 123 4567", email: "pedro.reyes@email.com" },
  { id: "BRO-093", name: "Ana Garcia", gender: "Female", dob: "Dec 5, 2001", room: "302", checkIn: "May 27, 2025", status: "Active", contact: "0918 765 4321", email: "ana.garcia@email.com" },
  { id: "BRO-092", name: "Luis Mendoza", gender: "Male", dob: "Apr 18, 2000", room: "201", checkIn: "May 26, 2025", status: "Inactive", contact: "0915 987 6543", email: "luis.mendoza@email.com" },
];

export default function BoarderReport() {

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
              Boarder Report
            </h1>
            <p className="text-xs text-slate-500">
              View boarder details and information
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
                  className={`mt-2 text-xs font-medium ${
                    s.positive ? "text-emerald-600" : "text-slate-400"
                  }`}
                >
                  {s.positive ? "↑ " : ""}
                  {s.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* Trend + Status */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Boarders Over Time */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Boarders Over Time
              </h2>
              <button className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">
                Monthly
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="boarderFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#e11d48" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#e11d48" stopOpacity={0} />
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
                    width={30}
                  />
                  <Tooltip
                    formatter={(v) => [v, "Total Boarders"]}
                    contentStyle={{
                      fontSize: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#e11d48"
                    strokeWidth={2}
                    fill="url(#boarderFill)"
                    dot={{ r: 3, fill: "#e11d48", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
              <span className="h-2 w-2 rounded-full bg-rose-600" />
              Total Boarders
            </div>
          </div>

          {/* Boarders by Status */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              Boarders by Status
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
                <span className="text-xs text-slate-400">Total</span>
                <span className="text-lg font-bold text-slate-900">
                  {totalBoarders}
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
                    {d.value} ({d.pct})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent + Summary */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Recent Boarders */}
          <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Boarders
              </h2>
              <button className="text-xs font-medium text-rose-600 hover:text-rose-700">
                View All
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 font-medium">ID</th>
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Room</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 text-right font-medium">Contact</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-2.5 text-slate-500">{b.id}</td>
                    <td className="py-2.5 font-medium text-slate-800">
                      {b.name}
                    </td>
                    <td className="py-2.5">{b.room}</td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[b.status]}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="flex items-center justify-end gap-1 text-slate-500">
                        <Phone className="h-3 w-3" />
                        {b.contact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Boarder Summary */}
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                <Users className="h-3.5 w-3.5 text-rose-600" />
              </div>
              <h2 className="text-sm font-semibold text-rose-900">
                Boarder Summary
              </h2>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-700">Total Boarders</span>
                <span className="font-medium text-rose-900">96</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-700">Active Boarders</span>
                <span className="font-medium text-rose-900">92</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-700">Inactive Boarders</span>
                <span className="font-medium text-rose-900">3</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-700">Checked-out Boarders</span>
                <span className="font-medium text-rose-900">1</span>
              </div>
            </div>

            <div className="my-3 h-px bg-rose-100" />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-700">Male Boarders</span>
                <span className="font-medium text-rose-900">62</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-700">Female Boarders</span>
                <span className="font-medium text-rose-900">34</span>
              </div>
            </div>

            <div className="my-3 h-px bg-rose-100" />

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-700">New This Month</span>
                <span className="font-medium text-rose-900">14</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-rose-700">Checked-out This Month</span>
                <span className="font-medium text-rose-900">5</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2.5 rounded-lg bg-white p-2.5 shadow-sm">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-50">
                <BarChart3 className="h-4 w-4 text-rose-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400">Compared to last month</p>
                <p className="text-xs font-semibold text-emerald-600">
                  +12.5% increase in total boarders
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Boarders Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Boarders Details
            </h2>
            <div className="flex items-center gap-2">
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
            <table className="w-full min-w-215 border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="py-2 font-medium">ID</th>
                  <th className="py-2 font-medium">Name</th>
                  <th className="py-2 font-medium">Gender</th>
                  <th className="py-2 font-medium">Date of Birth</th>
                  <th className="py-2 font-medium">Room</th>
                  <th className="py-2 font-medium">Check-in</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Contact</th>
                  <th className="py-2 text-right font-medium">Email</th>
                </tr>
              </thead>
              <tbody>
                {boarders.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-2.5 text-slate-500">{b.id}</td>
                    <td className="py-2.5 font-medium text-slate-800">
                      {b.name}
                    </td>
                    <td className="py-2.5 text-slate-500">{b.gender}</td>
                    <td className="py-2.5 text-slate-500">{b.dob}</td>
                    <td className="py-2.5">{b.room}</td>
                    <td className="py-2.5 text-slate-500">{b.checkIn}</td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[b.status]}`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-slate-500">{b.contact}</td>
                    <td className="py-2.5 text-right text-slate-500">{b.email}</td>
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
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium ${
                    p === 1
                      ? "bg-rose-600 text-white"
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