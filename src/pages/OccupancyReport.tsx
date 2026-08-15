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
    ArrowRight,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useNavigate } from "react-router-dom";
import { useRoom } from "@/hooks/useRoom";
import { useEffect, useMemo, useState } from "react";
import PrintOccupancyReportModal from "@/components/OccupancyReport/PrintOccupancyReportModal";

export type ActivityAction = "Active" | "Checked-Out" | "Transferred";

const actionStyle: Record<ActivityAction, { chip: string; dot: string }> = {
    "Active": {
        chip: "border-emerald-200/70 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
    },
    "Checked-Out": {
        chip: "border-rose-200/70 bg-rose-50 text-rose-700",
        dot: "bg-rose-500",
    },
    "Transferred": {
        chip: "border-blue-200/70 bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
    },
};

const statusStyle: Record<string, { chip: string; dot: string }> = {
    Full: { chip: "border-rose-200/70 bg-rose-50 text-rose-700", dot: "bg-rose-500" },
    Available: {
        chip: "border-emerald-200/70 bg-emerald-50 text-emerald-700",
        dot: "bg-emerald-500",
    },
    Vacant: { chip: "border-slate-200 bg-slate-50 text-slate-600", dot: "bg-slate-400" },
    Occupied: { chip: "border-blue-200/70 bg-blue-50 text-blue-700", dot: "bg-blue-500" },
};

function StatusChip({ label, map }: { label: string; map: typeof statusStyle }) {
    const s = map[label] ?? {
        chip: "border-slate-200 bg-slate-50 text-slate-600",
        dot: "bg-slate-400",
    };
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium leading-none ${s.chip}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
            {label}
        </span>
    );
}



const ROOMS_PER_PAGE = 6;
const ACTIVITIES_PER_PAGE = 3;

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | "ellipsis")[] = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) pages.push("ellipsis");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < total - 1) pages.push("ellipsis");

    pages.push(total);
    return pages;
}

interface PaginationProps {
    page: number;
    pageSize: number;
    totalItems: number;
    itemLabel: string;
    onChange: (page: number) => void;
}

function Pagination({
    page,
    pageSize,
    totalItems,
    itemLabel,
    onChange,
}: PaginationProps) {
    const pageCount = Math.max(1, Math.ceil(totalItems / pageSize));
    const from = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, totalItems);

    if (totalItems === 0) return null;

    return (
        <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[11px] text-slate-400">
                Showing{" "}
                <span className="font-medium tabular-nums text-slate-600">
                    {from}–{to}
                </span>{" "}
                of <span className="tabular-nums">{totalItems}</span> {itemLabel}
            </p>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onChange(page - 1)}
                    disabled={page === 1}
                    aria-label="Previous page"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-40"
                >
                    <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                {getPageNumbers(page, pageCount).map((p, i) =>
                    p === "ellipsis" ? (
                        <span key={`gap-${i}`} className="px-0.5 text-[11px] text-slate-300">
                            &hellip;
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onChange(p)}
                            aria-current={p === page ? "page" : undefined}
                            className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-[11.5px] font-medium tabular-nums transition-colors ${p === page
                                    ? "bg-slate-900 text-white"
                                    : "text-slate-500 hover:bg-slate-100"
                                }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    onClick={() => onChange(page + 1)}
                    disabled={page === pageCount}
                    aria-label="Next page"
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-700 disabled:pointer-events-none disabled:opacity-40"
                >
                    <ChevronRight className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    );
}



export default function OccupancyReport() {
    const navigate = useNavigate();
    const {
        roomReportStats,
        getRoomReportStats,
        roomStatusReport,
        getRoomStatusReport,
        roomReport,
        getRoomReport,
        recentActivities,
        getRecentActivities,
        reportInsights,
        getReportInsights,
    } = useRoom();

    const [roomPage, setRoomPage] = useState(1);
    const [activityPage, setActivityPage] = useState(1);
    const [printOpen, setPrintOpen] = useState(false);
    const [activeSlice, setActiveSlice] = useState<number | null>(null);

    useEffect(() => {
        getRoomReportStats();
        getRoomStatusReport();
        getRoomReport();
        getRecentActivities();
        getReportInsights();
        //eslint-disable-next-line
    }, []);

    useEffect(() => {
        const pageCount = Math.max(1, Math.ceil(roomReport.length / ROOMS_PER_PAGE));
        if (roomPage > pageCount) 
            //eslint-disable-next-line
        setRoomPage(pageCount);
    }, [roomReport.length, roomPage]);

    useEffect(() => {
        const pageCount = Math.max(
            1,
            Math.ceil(recentActivities.length / ACTIVITIES_PER_PAGE)
        );
        if (activityPage > pageCount) 
         //eslint-disable-next-line
         setActivityPage(pageCount);
    }, [recentActivities.length, activityPage]);

    const pagedRooms = useMemo(
        () =>
            roomReport.slice((roomPage - 1) * ROOMS_PER_PAGE, roomPage * ROOMS_PER_PAGE),
        [roomReport, roomPage]
    );

    const pagedActivities = useMemo(
        () =>
            recentActivities.slice(
                (activityPage - 1) * ACTIVITIES_PER_PAGE,
                activityPage * ACTIVITIES_PER_PAGE
            ),
        [recentActivities, activityPage]
    );

    const stats = [
        {
            label: "Total rooms",
            value: roomReportStats.totalRooms,
            sub: "All rooms in the property",
            icon: Building2,
        },
        {
            label: "Occupied rooms",
            value: roomReportStats.occupiedRooms,
            sub: "Currently occupied",
            icon: Users,
        },
        {
            label: "Available rooms",
            value: roomReportStats.availableRooms,
            sub: "Open for assignment",
            icon: DoorOpen,
        },
        {
            label: "Occupancy rate",
            value: `${roomReportStats.occupancyRate}%`,
            sub: "Of total capacity",
            icon: TrendingUp,
            highlight: true,
        },
    ];

    const totalRooms = roomStatusReport.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full space-y-4 overflow-y-auto rounded-tl-2xl border-l border-t border-slate-200 bg-slate-50/70 px-4 pb-15 pt-4">
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
                            Reports · Occupancy
                        </p>
                        <h1 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                            Occupancy Report
                        </h1>
                        <p className="mt-0.5 text-[11.5px] text-slate-500">
                            Room utilization, occupancy trends and bed availability
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            May 01 &ndash; May 31, 2025
                            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                        </button>
                        <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50">
                            <FileDown className="h-3.5 w-3.5 text-rose-500" />
                            PDF
                        </button>
                        <button className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[11.5px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50">
                            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                            Excel
                        </button>
                        <button
                            onClick={() => setPrintOpen(true)}
                            className="flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-[11.5px] font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
                        >
                            <Printer className="h-3.5 w-3.5" />
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
                                className="group rounded-2xl border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm"
                            >
                                <div className="flex items-start justify-between">
                                    <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
                                        {s.label}
                                    </p>
                                    <Icon className="h-3.5 w-3.5 shrink-0 text-slate-300 transition-colors group-hover:text-slate-500" />
                                </div>

                                <p
                                    className={`mt-2 text-xl font-bold tabular-nums tracking-tight ${s.highlight ? "text-emerald-700" : "text-slate-900"
                                        }`}
                                >
                                    {s.value}
                                </p>

                                <p className="mt-1 text-[10.5px] text-slate-400">{s.sub}</p>
                            </div>
                        );
                    })}
                </div>

                {/* Rooms + Distribution */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                    {/* Room Availability Overview */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2">
                        <div className="mb-3">
                            <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                Room availability
                            </h2>
                            <p className="mt-0.5 text-[11.5px] text-slate-400">
                                Capacity and bed usage per room
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full min-w-150 border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-[10.5px] uppercase tracking-wider text-slate-400">
                                        <th className="py-2.5 font-medium">Room</th>
                                        <th className="py-2.5 text-right font-medium">Capacity</th>
                                        <th className="py-2.5 text-right font-medium">Occupied</th>
                                        <th className="py-2.5 text-right font-medium">Available</th>
                                        <th className="py-2.5 pl-4 font-medium">Utilization</th>
                                        <th className="py-2.5 font-medium">Status</th>
                                        <th className="py-2.5 text-right font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagedRooms.map((r) => {
                                        const use =
                                            r.capacity > 0 ? (r.occupied / r.capacity) * 100 : 0;
                                        return (
                                            <tr
                                                key={r.number}
                                                className="border-b border-slate-50 text-[12.5px] text-slate-700 transition-colors last:border-0 hover:bg-slate-50/70"
                                            >
                                                <td className="py-2.5 font-semibold text-slate-900">
                                                    {r.number}
                                                </td>
                                                <td className="py-2.5 text-right tabular-nums">
                                                    {r.capacity}
                                                </td>
                                                <td className="py-2.5 text-right tabular-nums">
                                                    {r.occupied}
                                                </td>
                                                <td className="py-2.5 text-right tabular-nums text-slate-400">
                                                    {r.available}
                                                </td>
                                                <td className="py-2.5 pl-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                                                            <div
                                                                className={`h-full rounded-full ${use >= 100 ? "bg-rose-500" : "bg-slate-900"
                                                                    }`}
                                                                style={{ width: `${Math.min(100, use)}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-[10.5px] tabular-nums text-slate-400">
                                                            {Math.round(use)}%
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-2.5">
                                                    <StatusChip label={r.status} map={statusStyle} />
                                                </td>
                                                <td className="py-2.5 text-right text-[11px] tabular-nums text-slate-400">
                                                    {r.date}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    {pagedRooms.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={7}
                                                className="py-12 text-center text-[12px] text-slate-400"
                                            >
                                                No rooms to display.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            page={roomPage}
                            pageSize={ROOMS_PER_PAGE}
                            totalItems={roomReport.length}
                            itemLabel="rooms"
                            onChange={setRoomPage}
                        />
                    </div>

                    {/* Room Status Distribution */}
                    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="mb-1">
                            <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                Status distribution
                            </h2>
                            <p className="mt-0.5 text-[11.5px] text-slate-400">
                                How the {totalRooms} rooms break down
                            </p>
                        </div>

                        <div className="relative mx-auto h-40 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={roomStatusReport}
                                        dataKey="value"
                                        nameKey="name"
                                        innerRadius="66%"
                                        outerRadius="94%"
                                        paddingAngle={2.5}
                                        cornerRadius={5}
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="none"
                                        onMouseEnter={(_, i) => setActiveSlice(i)}
                                        onMouseLeave={() => setActiveSlice(null)}
                                    >
                                        {roomStatusReport.map((d, i) => (
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
                                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                    {activeSlice === null
                                        ? "Total rooms"
                                        : roomStatusReport[activeSlice].name}
                                </span>
                                <span className="text-lg font-bold tabular-nums tracking-tight text-slate-900">
                                    {activeSlice === null
                                        ? totalRooms
                                        : roomStatusReport[activeSlice].value}
                                </span>
                                {activeSlice !== null && totalRooms > 0 && (
                                    <span className="text-[10.5px] tabular-nums text-slate-400">
                                        {(
                                            (roomStatusReport[activeSlice].value / totalRooms) *
                                            100
                                        ).toFixed(1)}
                                        % of rooms
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1.5">
                            {roomStatusReport.map((d, i) => (
                                <div
                                    key={d.name}
                                    onMouseEnter={() => setActiveSlice(i)}
                                    onMouseLeave={() => setActiveSlice(null)}
                                    className="flex cursor-default items-center justify-between rounded-lg px-1.5 py-1 transition-colors hover:bg-slate-50"
                                >
                                    <span className="flex items-center gap-2 text-[11.5px] text-slate-600">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-sm"
                                            style={{ backgroundColor: d.color }}
                                        />
                                        {d.name}
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-[11.5px] font-semibold tabular-nums text-slate-900">
                                            {d.value}
                                        </span>
                                        <span className="w-10 text-right text-[10.5px] tabular-nums text-slate-400">
                                            {totalRooms > 0
                                                ? Math.round((d.value / totalRooms) * 100)
                                                : 0}
                                            %
                                        </span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity + Insights */}
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                    {/* Recent Occupancy Activity */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 lg:col-span-2">
                        <div className="mb-3 flex items-start justify-between gap-2">
                            <div>
                                <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                    Recent activity
                                </h2>
                                <p className="mt-0.5 text-[11.5px] text-slate-400">
                                    Check-ins, check-outs and transfers
                                </p>
                            </div>
                            <button className="flex shrink-0 items-center gap-1 text-[11.5px] font-medium text-slate-500 transition-colors hover:text-slate-900">
                                View all
                                <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-slate-200 text-left text-[10.5px] uppercase tracking-wider text-slate-400">
                                        <th className="py-2.5 font-medium">Date</th>
                                        <th className="py-2.5 font-medium">Boarder</th>
                                        <th className="py-2.5 font-medium">Room</th>
                                        <th className="py-2.5 font-medium">Bed</th>
                                        <th className="py-2.5 font-medium">Action</th>
                                        <th className="py-2.5 text-right font-medium">
                                            Recorded by
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pagedActivities.map((a, i) => (
                                        <tr
                                            key={`${(activityPage - 1) * ACTIVITIES_PER_PAGE + i}`}
                                            className="border-b border-slate-50 text-[12.5px] text-slate-700 transition-colors last:border-0 hover:bg-slate-50/70"
                                        >
                                            <td className="py-3 text-[11px] tabular-nums text-slate-400">
                                                {a.date}
                                            </td>
                                            <td className="py-3 font-medium text-slate-900">
                                                {a.boarder}
                                            </td>
                                            <td className="py-3 tabular-nums">{a.room}</td>
                                            <td className="py-3 tabular-nums">{a.bed}</td>
                                            <td className="py-3">
                                                <StatusChip
                                                    label={a.action}
                                                    map={actionStyle as typeof statusStyle}
                                                />
                                            </td>
                                            <td className="py-3 text-right text-[11.5px] text-slate-400">
                                                {a.by}
                                            </td>
                                        </tr>
                                    ))}

                                    {pagedActivities.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="py-12 text-center text-[12px] text-slate-400"
                                            >
                                                No recent activity.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            page={activityPage}
                            pageSize={ACTIVITIES_PER_PAGE}
                            totalItems={recentActivities.length}
                            itemLabel="activities"
                            onChange={setActivityPage}
                        />
                    </div>

                    {/* Occupancy Insights */}
                    <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="mb-3 flex items-center gap-2.5">
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <Lightbulb className="h-4 w-4" />
                            </span>
                            <div>
                                <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                    Occupancy insights
                                </h2>
                                <p className="mt-0.5 text-[11px] text-slate-400">
                                    Generated from current data
                                </p>
                            </div>
                        </div>

                        <ul className="space-y-2.5">
                            {reportInsights?.insights.map((item, i) => (
                                <li
                                    key={i}
                                    className="border-l-2 border-emerald-200 pl-2.5 text-[11.5px] leading-relaxed text-slate-600"
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <Building2 className="pointer-events-none absolute -bottom-4 -right-4 h-24 w-24 text-slate-50" />
                    </div>
                </div>
            </div>

            <PrintOccupancyReportModal
                open={printOpen}
                onClose={() => setPrintOpen(false)}
                roomReportStats={roomReportStats}
                roomStatusReport={roomStatusReport}
                roomReport={roomReport}
                recentActivities={recentActivities}
                insights={reportInsights?.insights ?? []}
            />
        </div>
    );
}