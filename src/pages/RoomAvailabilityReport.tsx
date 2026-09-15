import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  DoorOpen,
  Users,
  Wrench,
  BedDouble,
  Calendar,
  ChevronDown,
  FileSpreadsheet,
  Printer,
  Search,
  Info,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Loader2,
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
import { useRoom } from "@/hooks/useRoom";
import PrintRoomAvailabilityModal from "@/components/RoomAvailabilityReport/PrintRoomAvailabilityModal";
import { exportRoomAvailabilityExcel } from "@/components/RoomAvailabilityReport/exportRoomAvailabilityExcel";

const peso = (n: number) => `₱${Number(n ?? 0).toLocaleString()}.00`;

type RoomStatus = "Available" | "Occupied" | "Under Maintenance";

const statusBadge: Record<RoomStatus, string> = {
  Available: "bg-emerald-50 text-emerald-600",
  Occupied: "bg-blue-50 text-blue-600",
  "Under Maintenance": "bg-amber-50 text-amber-600",
};

const STATUS_FILTERS: ("All Status" | RoomStatus)[] = [
  "All Status",
  "Available",
  "Occupied",
  "Under Maintenance",
];

const ROOMS_PER_PAGE = 8;

export default function RoomAvailabilityReport() {
  const navigate = useNavigate();
  const {
    rooms,
    getRooms,
    occupancyTrend,
    getOccupancyTrend,
    reportInsights,
    getReportInsights,
    loading,
  } = useRoom();

  useEffect(() => {
    getRooms();
    getOccupancyTrend();
    getReportInsights();
    // eslint-disable-next-line
  }, []);

  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const dateRange = `${firstDay.toLocaleDateString("en-PH", { month: "short", day: "2-digit" })} – ${lastDay.toLocaleDateString("en-PH", { month: "short", day: "2-digit", year: "numeric" })}`;
  const periodLabel = now.toLocaleString("en-PH", { month: "long", year: "numeric" });

  /* ---------------- Derived data (all sourced from real rooms) ---------------- */

  const totalRoomsCount = rooms.length;
  const availableCount = useMemo(() => rooms.filter((r) => r.status === "Available").length, [rooms]);
  const occupiedCount = useMemo(() => rooms.filter((r) => r.status === "Occupied").length, [rooms]);
  const maintenanceCount = useMemo(
    () => rooms.filter((r) => r.status === "Under Maintenance").length,
    [rooms]
  );
  const totalCapacity = useMemo(() => rooms.reduce((s, r) => s + (r.capacity || 0), 0), [rooms]);

  const pct = (n: number) => (totalRoomsCount ? `${((n / totalRoomsCount) * 100).toFixed(1)}%` : "0%");

  const stats = [
    {
      label: "Total Rooms",
      value: String(totalRoomsCount),
      sub: "All rooms in the property",
      icon: Building2,
      bg: "bg-blue-50",
      fg: "text-blue-600",
    },
    {
      label: "Available Rooms",
      value: String(availableCount),
      sub: "Rooms ready for assignment",
      pct: pct(availableCount),
      pctColor: "bg-emerald-50 text-emerald-600",
      icon: DoorOpen,
      bg: "bg-emerald-50",
      fg: "text-emerald-600",
    },
    {
      label: "Occupied Rooms",
      value: String(occupiedCount),
      sub: "Currently occupied rooms",
      pct: pct(occupiedCount),
      pctColor: "bg-blue-50 text-blue-600",
      icon: Users,
      bg: "bg-indigo-50",
      fg: "text-indigo-600",
    },
    {
      label: "Under Maintenance",
      value: String(maintenanceCount),
      sub: "Rooms under maintenance",
      pct: pct(maintenanceCount),
      pctColor: "bg-amber-50 text-amber-600",
      icon: Wrench,
      bg: "bg-amber-50",
      fg: "text-amber-600",
    },
  ];

  const statusData = [
    { name: "Available", value: availableCount, pct: pct(availableCount), color: "#059669" },
    { name: "Occupied", value: occupiedCount, pct: pct(occupiedCount), color: "#2563eb" },
    { name: "Under Maintenance", value: maintenanceCount, pct: pct(maintenanceCount), color: "#d97706" },
  ];

  const summaryCards = [
    { label: "Available", value: String(availableCount), pct: pct(availableCount), sub: "Rooms ready to assign", icon: DoorOpen, fg: "text-teal-600", bg: "bg-teal-50", bar: "bg-teal-500" },
    { label: "Occupied", value: String(occupiedCount), pct: pct(occupiedCount), sub: "Rooms currently occupied", icon: Users, fg: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" },
    { label: "Under Maintenance", value: String(maintenanceCount), pct: pct(maintenanceCount), sub: "Rooms under maintenance", icon: Wrench, fg: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" },
    { label: "Total Capacity", value: String(totalCapacity), pct: "Beds", sub: "Across all rooms", icon: BedDouble, fg: "text-violet-600", bg: "bg-violet-50", bar: "bg-violet-500" },
  ];

  const insights = reportInsights?.insights ?? [];

  /* ---------------- Room availability details (real, searchable, paginated) ---------------- */

  const roomRows = useMemo(
    () =>
      rooms.map((r) => ({
        number: r.room_number,
        capacity: r.capacity,
        occupied: r.occupied_beds ?? 0,
        available: r.available_beds ?? 0,
        status: r.status,
        rate: r.price_per_month,
      })),
    [rooms]
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All Status" | RoomStatus>("All Status");
  const [page, setPage] = useState(1);

  const filteredRooms = useMemo(() => {
    const q = search.trim().toLowerCase();
    return roomRows.filter((r) => {
      const matchStatus = statusFilter === "All Status" || r.status === statusFilter;
      const matchSearch = q === "" || r.number.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [roomRows, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / ROOMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const pagedRooms = filteredRooms.slice(
    (safePage - 1) * ROOMS_PER_PAGE,
    safePage * ROOMS_PER_PAGE
  );

  /* ---------------- Print / Export ---------------- */

  const [printOpen, setPrintOpen] = useState(false);
  const [exporting, setExporting] = useState(false);

  const availabilityStats = {
    totalRooms: totalRoomsCount,
    availableRooms: availableCount,
    occupiedRooms: occupiedCount,
    maintenanceRooms: maintenanceCount,
    totalCapacity,
  };

  const handleExcel = async () => {
    setExporting(true);
    try {
      await exportRoomAvailabilityExcel({
        availabilityStats,
        statusBreakdown: statusData,
        occupancyTrend,
        rooms: roomRows,
        insights,
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
              Room Availability Report
            </h1>
            <p className="text-xs text-slate-500">
              Check room availability and status overview
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

        {loading && rooms.length === 0 ? (
          <div className="flex items-center justify-center gap-2 py-24 text-sm text-slate-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading room data...
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
                {totalRoomsCount === 0 ? (
                  <p className="py-10 text-center text-xs text-slate-400">No rooms yet.</p>
                ) : (
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
                          {totalRoomsCount}
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
                )}
              </div>

              {/* Availability Trend */}
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-slate-900">
                    Availability Trend
                  </h2>
                  <span className="text-xs text-slate-400">Last 6 months</span>
                </div>
                {occupancyTrend.length === 0 ? (
                  <p className="py-10 text-center text-xs text-slate-400">
                    No trend data yet.
                  </p>
                ) : (
                  <>
                    <div className="h-40 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={occupancyTrend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
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
                          <Line type="monotone" dataKey="occupied" name="New occupancy" stroke="#2563eb" strokeWidth={2} dot={{ r: 2.5 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-blue-600" />
                        New occupancy
                      </div>
                    </div>
                  </>
                )}
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
                  {insights.length === 0 && (
                    <li className="text-xs text-sky-700">No insights yet.</li>
                  )}
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
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search room"
                      className="w-28 bg-transparent text-xs text-slate-600 outline-none placeholder:text-slate-400"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value as typeof statusFilter);
                      setPage(1);
                    }}
                    className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 outline-none hover:border-slate-300"
                  >
                    {STATUS_FILTERS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-160 border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                      <th className="py-2 font-medium">Room</th>
                      <th className="py-2 font-medium">Capacity</th>
                      <th className="py-2 font-medium">Occupied Beds</th>
                      <th className="py-2 font-medium">Available</th>
                      <th className="py-2 font-medium">Status</th>
                      <th className="py-2 font-medium">Monthly Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRooms.map((r) => (
                      <tr
                        key={r.number}
                        className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                      >
                        <td className="py-2.5 font-medium text-slate-800">{r.number}</td>
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
                      </tr>
                    ))}

                    {pagedRooms.length === 0 && (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                          No rooms match this filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredRooms.length > 0 && (
                <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-slate-400">
                    Showing {(safePage - 1) * ROOMS_PER_PAGE + 1} to{" "}
                    {Math.min(safePage * ROOMS_PER_PAGE, filteredRooms.length)} of{" "}
                    {filteredRooms.length} rooms
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
                          ? "bg-blue-600 text-white"
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

      <PrintRoomAvailabilityModal
        open={printOpen}
        onClose={() => setPrintOpen(false)}
        availabilityStats={availabilityStats}
        statusBreakdown={statusData}
        occupancyTrend={occupancyTrend}
        rooms={roomRows}
        insights={insights}
        periodLabel={periodLabel}
      />
    </div>
  );
}
