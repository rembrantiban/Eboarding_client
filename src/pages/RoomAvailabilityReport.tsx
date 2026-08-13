import {
  ArrowLeft,
  Building2,
  DoorOpen,
  Users,
  Wrench,
  BedDouble,
  Calendar,
  ChevronDown,
  FileDown,
  FileSpreadsheet,
  Printer,
  Search,
  SlidersHorizontal,
  Eye,
  Info,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";

const peso = (n: number) => `₱${n.toLocaleString()}.00`;

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
    label: "Available Rooms",
    value: "8",
    sub: "Rooms ready for assignment",
    pct: "16.0%",
    pctColor: "bg-emerald-50 text-emerald-600",
    icon: DoorOpen,
    bg: "bg-emerald-50",
    fg: "text-emerald-600",
  },
  {
    label: "Occupied Rooms",
    value: "42",
    sub: "Currently occupied rooms",
    pct: "84.0%",
    pctColor: "bg-blue-50 text-blue-600",
    icon: Users,
    bg: "bg-indigo-50",
    fg: "text-indigo-600",
  },
  {
    label: "Under Maintenance",
    value: "2",
    sub: "Rooms under maintenance",
    pct: "4.0%",
    pctColor: "bg-amber-50 text-amber-600",
    icon: Wrench,
    bg: "bg-amber-50",
    fg: "text-amber-600",
  },
];

const statusData = [
  { name: "Available", value: 8, pct: "16.0%", color: "#059669" },
  { name: "Occupied", value: 42, pct: "84.0%", color: "#2563eb" },
  { name: "Maintenance", value: 2, pct: "4.0%", color: "#f59e0b" },
];

const totalRooms = statusData.reduce((sum, d) => sum + d.value, 0);

const trendData = [
  { month: "Dec", available: 6, occupied: 42, maintenance: 2 },
  { month: "Jan", available: 7, occupied: 41, maintenance: 2 },
  { month: "Feb", available: 8, occupied: 40, maintenance: 2 },
  { month: "Mar", available: 6, occupied: 42, maintenance: 2 },
  { month: "Apr", available: 7, occupied: 41, maintenance: 2 },
  { month: "May", available: 8, occupied: 42, maintenance: 2 },
];

const summaryCards = [
  { label: "Available", value: "8", pct: "16.0%", sub: "Rooms ready to assign", icon: DoorOpen, fg: "text-teal-600", bg: "bg-teal-50", bar: "bg-teal-500" },
  { label: "Occupied", value: "42", pct: "84.0%", sub: "Rooms currently occupied", icon: Users, fg: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
  { label: "Under Maintenance", value: "2", pct: "4.0%", sub: "Rooms under maintenance", icon: Wrench, fg: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
  { label: "Total Capacity", value: "200", pct: "Beds", sub: "Across all rooms", icon: BedDouble, fg: "text-violet-600", bg: "bg-violet-50", bar: "bg-violet-500" },
];

const insights = [
  "8 rooms are available for new boarders",
  "42 rooms are currently occupied",
  "2 rooms are under maintenance",
  "Occupancy rate is 84%",
];

type StatusBadge = 
    | "Full"
    | "Available"
    | "Vacant"

const statusBadge : Record<StatusBadge, string> = {
  Full: "bg-rose-50 text-rose-600",
  Available: "bg-emerald-50 text-emerald-600",
  Vacant: "bg-slate-100 text-slate-500",
};


type Room = {
  number: string;
  floor: string;
  type: string;
  capacity: number;
  occupied: number;
  available: number;
  status: StatusBadge;
  rate: number;
};

const rooms : Room[] = [
  { number: "101", floor: "1st Floor", type: "Standard", capacity: 4, occupied: 4, available: 0, status: "Full", rate: 4000 },
  { number: "102", floor: "1st Floor", type: "Standard", capacity: 4, occupied: 3, available: 1, status: "Available", rate: 4000 },
  { number: "103", floor: "1st Floor", type: "Standard", capacity: 4, occupied: 2, available: 2, status: "Available", rate: 4000 },
  { number: "104", floor: "1st Floor", type: "Standard", capacity: 4, occupied: 0, available: 4, status: "Vacant", rate: 4000 },
  { number: "201", floor: "2nd Floor", type: "Deluxe", capacity: 4, occupied: 4, available: 0, status: "Full", rate: 5000 },
  { number: "202", floor: "2nd Floor", type: "Deluxe", capacity: 4, occupied: 2, available: 2, status: "Available", rate: 5000 },
  { number: "203", floor: "2nd Floor", type: "Deluxe", capacity: 4, occupied: 3, available: 1, status: "Available", rate: 5000 },
  { number: "301", floor: "3rd Floor", type: "Premium", capacity: 4, occupied: 3, available: 1, status: "Available", rate: 6000 },
];


export default function RoomAvailabilityReport() {
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
              Room Availability Report
            </h1>
            <p className="text-xs text-slate-500">
              Check room availability and status overview
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
                className="relative rounded-xl border border-slate-200 bg-white p-3"
              >
                {s.pct && (
                  <span
                    className={`absolute right-3 top-3 rounded-full px-1.5 py-0.5 text-xs font-medium ${s.pctColor}`}
                  >
                    {s.pct}
                  </span>
                )}
                <div
                  className={`mb-2 flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}
                >
                  <Icon className={`h-4 w-4 ${s.fg}`} />
                </div>
                <p className="text-xs text-slate-400">{s.label}</p>
                <p className="text-base font-bold text-slate-900">{s.value}</p>
                <p className="mt-0.5 text-xs text-slate-400">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Overview + Trend */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Room Availability Overview */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              Room Availability Overview
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative h-32 w-32 shrink-0">
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
              <div className="flex-1 space-y-2">
                {statusData.map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
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

          {/* Availability Trend */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Availability Trend
              </h2>
              <button className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">
                Monthly
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <div className="h-40 w-full">
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
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      fontSize: "12px",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  />
                  <Line type="monotone" dataKey="available" stroke="#059669" strokeWidth={2} dot={{ r: 2.5 }} />
                  <Line type="monotone" dataKey="occupied" stroke="#2563eb" strokeWidth={2} dot={{ r: 2.5 }} />
                  <Line type="monotone" dataKey="maintenance" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2.5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                Available
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Occupied
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Maintenance
              </div>
            </div>
          </div>
        </div>

        {/* Room Status Summary + Quick Insights */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-2 text-sm font-semibold text-slate-900">
              Room Status Summary
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {summaryCards.map((c) => {
                const Icon = c.icon;
                return (
                  <div
                    key={c.label}
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${c.bg}`}>
                        <Icon className={`h-4 w-4 ${c.fg}`} />
                      </div>
                      <span className={`text-xs font-medium ${c.fg}`}>{c.pct}</span>
                    </div>
                    <p className="mt-2 text-xs text-slate-400">{c.label}</p>
                    <p className="text-base font-bold text-slate-900">{c.value}</p>
                    <p className="mt-0.5 truncate text-xs text-slate-400">{c.sub}</p>
                    <div className={`mt-2 h-1 w-full rounded-full ${c.bar} opacity-70`} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="relative overflow-hidden rounded-xl border border-sky-100 bg-sky-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-sm">
                <Info className="h-3.5 w-3.5 text-sky-600" />
              </div>
              <h2 className="text-sm font-semibold text-sky-900">
                Quick Insights
              </h2>
            </div>
            <ul className="space-y-2">
              {insights.map((item, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-sky-800">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
                  {item}
                </li>
              ))}
            </ul>
            <Building2 className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 text-sky-200 opacity-60" />
          </div>
        </div>

        {/* Room Availability Details */}
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-semibold text-slate-900">
              Room Availability Details
            </h2>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5">
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <input
                  placeholder="Search room"
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
                  <th className="py-2 font-medium">Room</th>
                  <th className="py-2 font-medium">Floor</th>
                  <th className="py-2 font-medium">Type</th>
                  <th className="py-2 font-medium">Capacity</th>
                  <th className="py-2 font-medium">Occupied</th>
                  <th className="py-2 font-medium">Available</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Monthly Rate</th>
                  <th className="py-2 text-right font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((r) => (
                  <tr
                    key={r.number}
                    className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                  >
                    <td className="py-2.5 font-medium text-slate-800">{r.number}</td>
                    <td className="py-2.5 text-slate-500">{r.floor}</td>
                    <td className="py-2.5 text-slate-500">{r.type}</td>
                    <td className="py-2.5">{r.capacity}</td>
                    <td className="py-2.5">{r.occupied}</td>
                    <td className="py-2.5">{r.available}</td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="py-2.5 font-medium text-slate-800">{peso(r.rate)}</td>
                    <td className="py-2.5 text-right">
                      <button className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-400">Showing 1 to 8 of 50 rooms</p>
            <div className="flex items-center gap-1">
              <button className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100">
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium ${
                    p === 1
                      ? "bg-blue-600 text-white"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  {p}
                </button>
              ))}
              <span className="px-0.5 text-xs text-slate-400">&hellip;</span>
              <button className="flex h-6 w-6 items-center justify-center rounded-md text-xs font-medium text-slate-500 hover:bg-slate-100">
                7
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