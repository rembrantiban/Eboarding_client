"use client";

import { useEffect, useMemo } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    AreaChart,
    Area,
} from "recharts";
import {
    Users,
    Home,
    AlertTriangle,
    Wallet,
    Bell,
    ArrowUpRight,
    ArrowDownRight,
    Wrench,
    Lightbulb,
    DoorClosed,
    PaintRoller,
    CalendarClock,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBilling } from "@/hooks/useBilling";
import { useRoom } from "@/hooks/useRoom";
import { BillingPageSkeleton, RoomPageSkeleton, SkeletonStyles } from "@/components/Skeleton/Skeleton";






const MAINTENANCE = [
    {
        id: "1",
        title: "Leaking faucet",
        room: "102",
        reporter: "Juan Dela Cruz",
        date: "May 31, 2025 · 09:30 AM",
        priority: "High",
        icon: Wrench,
    },
    {
        id: "2",
        title: "Light not working",
        room: "201",
        reporter: "Maria Santos",
        date: "May 30, 2025 · 02:15 PM",
        priority: "Medium",
        icon: Lightbulb,
    },
    {
        id: "3",
        title: "Door lock issue",
        room: "103",
        reporter: "Pedro Reyes",
        date: "May 30, 2025 · 10:45 AM",
        priority: "Low",
        icon: DoorClosed,
    },
    {
        id: "4",
        title: "Wall repaint needed",
        room: "301",
        reporter: "Ana Garcia",
        date: "May 29, 2025 · 04:20 PM",
        priority: "Low",
        icon: PaintRoller,
    },
];

const BILLINGS = [
    { id: "b1", boarder: "Juan Dela Cruz", room: "102", due: "Due in 2 days", amount: 3500, status: "Upcoming" },
    { id: "b2", boarder: "Maria Santos", room: "201", due: "Due today", amount: 4200, status: "Pending" },
    { id: "b3", boarder: "Pedro Reyes", room: "103", due: "5 days overdue", amount: 3800, status: "Overdue" },
    { id: "b4", boarder: "Ana Garcia", room: "301", due: "Due in 6 days", amount: 4000, status: "Upcoming" },
];



const peso = (n: number) => `₱${n.toLocaleString("en-PH")}`;

const PRIORITY_STYLES: Record<string, string> = {
    High: "bg-rose-50 text-rose-600 ring-rose-100",
    Medium: "bg-amber-50 text-amber-600 ring-amber-100",
    Low: "bg-slate-100 text-slate-600 ring-slate-200",
};

const STATUS_STYLES: Record<string, string> = {
    Upcoming: "bg-sky-50 text-sky-600 ring-sky-100",
    Pending: "bg-amber-50 text-amber-600 ring-amber-100",
    Overdue: "bg-rose-50 text-rose-600 ring-rose-100",
};

export default function StaffDashboard() {


    const { dashboardStats, getStaffDashboardStats } = useAuth();
    const { paymentsOverview, getPaymentsOverview, loading } = useBilling();
    const { roomOccupancyChart, getRoomOccupancyChart, roomAvailabilityChart, getRoomAvailabilityChart, loading: roomLoading } = useRoom();


    useEffect(() => {
        getStaffDashboardStats();
        getPaymentsOverview();
        getRoomOccupancyChart();
        getRoomAvailabilityChart();
        //eslint-disable-next-line
    }, []);

        const STATS = useMemo(
            () => [
                {
                    label: "Total Boarders",
                    value: dashboardStats?.totalBoarders?.value ?? 0,
                    delta: dashboardStats?.totalBoarders?.delta ?? 0,
                    icon: Users,
                    tint: "bg-indigo-500/15 text-indigo-300 ring-indigo-400/20",
                },
                {
                    label: "Total Rooms",
                    value: dashboardStats?.totalRooms?.value ?? 0,
                    delta: dashboardStats?.totalRooms?.delta ?? 0,
                    icon: Home,
                    tint: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
                },
                {
                    label: "Active Penalties",
                    value: dashboardStats?.activePenalties?.value ?? 0,
                    delta: dashboardStats?.activePenalties?.delta ?? 0,
                    icon: AlertTriangle,
                    tint: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
                },
                {
                    label: "Monthly Revenue",
                    value: `₱${Number(
                        dashboardStats?.monthlyRevenue?.value ?? 0
                    ).toLocaleString("en-PH")}`,
                    delta: dashboardStats?.monthlyRevenue?.delta ?? 0,
                    icon: Wallet,
                    tint: "bg-violet-500/15 text-violet-300 ring-violet-400/20",
                },
            ],
            [dashboardStats]
        );

        const paymentData = useMemo(
            () =>
                paymentsOverview.map((item) => ({
                    date: item.date,
                    amount: Number(item.value),
                })),
            [paymentsOverview]
        );

        const totalRooms = useMemo(
            () =>
                roomOccupancyChart.reduce(
                    (sum, item) => sum + Number(item.value),
                    0
                ),
            [roomOccupancyChart]
        );

        const occupiedRooms = useMemo(
            () =>
                roomOccupancyChart.find(
                    (item) => item.name === "Occupied"
                )?.value ?? 0,
            [roomOccupancyChart]
        );

        const occupiedPct = useMemo(
            () =>
                totalRooms > 0
                    ? Math.round(
                        (occupiedRooms / totalRooms) * 100
                    )
                    : 0,
            [occupiedRooms, totalRooms]
        );;

        const paymentsTotal = useMemo(
            () =>
                paymentsOverview.reduce(
                    (sum, item) => sum + Number(item.value),
                    0
                ),
            [paymentsOverview]
        );

        const unassigned = MAINTENANCE.length;

        
    if (loading && paymentsOverview.length === 0) {
        return <><SkeletonStyles /><BillingPageSkeleton /></>;
    }


    if (roomLoading && (roomOccupancyChart.length === 0  || roomAvailabilityChart.length === 0 ) ) return <RoomPageSkeleton view="grid" />;

        return (
            <div className="h-screen overflow-hidden">
                <div className="h-full overflow-y-auto space-y-2 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-15 pt-4 bg-gray-50">
                    {/* Header */}
                    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-xl">
                                Dashboard
                            </h1>
                            <p className="mt-1 text-sm text-slate-500">
                                Welcome back, Staff One. Here&apos;s what&apos;s happening today.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                aria-label="Notifications"
                                className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 shadow-sm transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                            >
                                <Bell className="h-4 w-4" />
                                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white ring-2 ring-white">
                                    {unassigned}
                                </span>
                            </button>
                        </div>
                    </header>

                    {/* Stat cards */}
                    <section className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                        {STATS.map((stat) => {
                            const Icon = stat.icon;
                            const up = stat.delta >= 0;
                            return (
                                <div
                                    key={stat.label}
                                    className="group relative overflow-hidden rounded-2xl bg-slate-900 p-5 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-0.5 hover:shadow-lg"
                                >
                                    <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/4 blur-2xl" />
                                    <div className="flex items-start gap-4">
                                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${stat.tint}`}>
                                            <Icon className="h-5 w-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                                            <div className="mt-1.5 flex items-baseline gap-2">
                                                <span className="text-2xl font-semibold tracking-tight text-white">
                                                    {stat.value}
                                                </span>
                                                {stat.delta !== 0 && (
                                                    <span
                                                        className={`inline-flex items-center gap-0.5 text-xs font-medium ${up ? "text-emerald-400" : "text-rose-400"
                                                            }`}
                                                    >
                                                        {up ? (
                                                            <ArrowUpRight className="h-3.5 w-3.5" />
                                                        ) : (
                                                            <ArrowDownRight className="h-3.5 w-3.5" />
                                                        )}
                                                        {Math.abs(stat.delta)}%
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-xs text-slate-500">vs last month</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </section>

                    {/* Charts */}
                    <section className="grid grid-cols-1 gap-2 lg:grid-cols-3">
                        {/* Room occupancy */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                            <h2 className="text-base font-semibold text-slate-900">Room Occupancy</h2>
                            <p className="mt-0.5 text-xs text-slate-500">Overview of room occupancy</p>

                            <div className="mt-4 flex items-center gap-4">
                                <div className="relative h-37.5 w-37.5 shrink-0">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={roomOccupancyChart}
                                                dataKey="value"
                                                innerRadius={52}
                                                outerRadius={72}
                                                paddingAngle={2}
                                                stroke="none"
                                            >
                                                {roomOccupancyChart.map((slice) => (
                                                    <Cell key={slice.name} fill={slice.color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-2xl font-semibold tracking-tight text-slate-900">
                                            {occupiedPct}%
                                        </span>
                                        <span className="text-[11px] text-slate-500">Occupied</span>
                                    </div>
                                </div>

                                <ul className="min-w-0 flex-1 space-y-3">
                                    <ul className="min-w-0 flex-1 space-y-3">
                                        {roomOccupancyChart.map((slice) => (
                                            <li key={slice.name} className="flex items-start gap-2.5">
                                                <span
                                                    className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                                                    style={{ backgroundColor: slice.color }}
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-800">
                                                        {slice.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {slice.value} {slice.value === 1 ? "room" : "rooms"} (
                                                        {totalRooms > 0
                                                            ? Math.round((slice.value / totalRooms) * 100)
                                                            : 0}
                                                        %)
                                                    </p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </ul>
                            </div>

                            <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs">
                                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-600" />
                                <span className="font-medium text-emerald-600">5.2%</span>
                                <span className="text-slate-500">vs last month</span>
                            </div>
                        </div>

                        {/* Room availability */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">Room Availability</h2>
                                    <p className="mt-0.5 text-xs text-slate-500">Availability by room</p>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-600">
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" /> Available
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <span className="h-2.5 w-2.5 rounded-sm bg-slate-900" /> Occupied
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 h-44.5 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={roomAvailabilityChart} barGap={6}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis
                                            dataKey="room"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#64748b", fontSize: 12 }}
                                        />
                                        <YAxis
                                            allowDecimals={false}
                                            tickLine={false}
                                            axisLine={false}
                                            width={24}
                                            tick={{ fill: "#94a3b8", fontSize: 12 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: "#f8fafc" }}
                                            contentStyle={{
                                                borderRadius: 12,
                                                border: "1px solid #e2e8f0",
                                                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                                                fontSize: 12,
                                            }}
                                        />
                                        <Bar dataKey="available" fill="#cbd5e1" radius={[6, 6, 0, 0]} maxBarSize={26} />
                                        <Bar dataKey="occupied" fill="#0f172a" radius={[6, 6, 0, 0]} maxBarSize={26} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                Showing available vs occupied rooms
                            </p>
                        </div>

                        {/* Payments overview */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                            <div className="flex items-baseline justify-between gap-2">
                                <h2 className="text-base font-semibold text-slate-900">Payments Overview</h2>
                                <span className="text-xs text-slate-500">This month</span>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">Total collections</p>

                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-2xl font-semibold tracking-tight text-slate-900">
                                    {peso(paymentsTotal)}
                                </span>
                            </div>

                            <div className="mt-3 h-32.5 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={paymentData} margin={{ top: 4, right: 4, left: -14, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="paymentsFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#0f172a" stopOpacity={0.16} />
                                                <stop offset="100%" stopColor="#0f172a" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            axisLine={false}
                                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                                        />
                                        <YAxis
                                            tickLine={false}
                                            axisLine={false}
                                            width={46}
                                            tick={{ fill: "#94a3b8", fontSize: 11 }}
                                            tickFormatter={(v: number) => `₱${v / 1000}K`}
                                        />
                                        <Tooltip
                                            formatter={(value) => [
                                                peso(Number(value ?? 0)),
                                                "Collected",
                                            ]}
                                            contentStyle={{
                                                borderRadius: 12,
                                                border: "1px solid #e2e8f0",
                                                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                                                fontSize: 12,
                                            }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="amount"
                                            stroke="#0f172a"
                                            strokeWidth={2}
                                            fill="url(#paymentsFill)"
                                            dot={{ r: 3, fill: "#0f172a" }}
                                            activeDot={{ r: 5 }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <p className="mt-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                                Compared with last month
                            </p>
                        </div>
                    </section>

                    {/* Maintenance + Billings */}
                    <section className="grid grid-cols-1 gap-2 lg:grid-cols-3">
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm lg:col-span-2">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">Maintenance Requests</h2>
                                    <p className="mt-0.5 text-xs text-slate-500">View and assign requests</p>
                                </div>
                                <button
                                    type="button"
                                    className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                                >
                                    View All
                                </button>
                            </div>

                            <ul className="mt-4 divide-y divide-slate-100">
                                {MAINTENANCE.map((req) => {
                                    const Icon = req.icon;
                                    return (
                                        <li
                                            key={req.id}
                                            className="flex items-center gap-3 py-3 first:pt-0 sm:gap-4"
                                        >
                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                                <Icon className="h-4.5 w-4.5" />
                                            </span>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium text-slate-900">{req.title}</p>
                                                <p className="mt-0.5 truncate text-xs text-slate-500">
                                                    Room {req.room} · Reported by {req.reporter}
                                                </p>
                                                <p className="mt-0.5 truncate text-xs text-slate-400">{req.date}</p>
                                            </div>

                                            <span
                                                className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 sm:inline-block ${PRIORITY_STYLES[req.priority]}`}
                                            >
                                                {req.priority}
                                            </span>

                                            <button
                                                type="button"
                                                className="shrink-0 rounded-xl border border-slate-200 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                                            >
                                                Assign
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>

                            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                                <span className="text-slate-500">{MAINTENANCE.length} total requests</span>
                                <span className="font-medium text-amber-600">{unassigned} unassigned</span>
                            </div>
                        </div>

                        {/* Billings */}
                        <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold text-slate-900">Billing Schedule</h2>
                                    <p className="mt-0.5 text-xs text-slate-500">Next payments due</p>
                                </div>
                                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                                    <CalendarClock className="h-4 w-4" />
                                </span>
                            </div>

                            <ul className="mt-4 space-y-2.5">
                                {BILLINGS.map((bill) => (
                                    <li
                                        key={bill.id}
                                        className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:border-slate-200 hover:bg-slate-50"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-slate-900">
                                                    {bill.boarder}
                                                </p>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    Room {bill.room} · {bill.due}
                                                </p>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <p className="text-sm font-semibold text-slate-900">{peso(bill.amount)}</p>
                                                <span
                                                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${STATUS_STYLES[bill.status]}`}
                                                >
                                                    {bill.status}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                className="mt-4 w-full rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                            >
                                View all billings
                            </button>
                        </div>
                    </section>

                </div>
            </div>
        );
    }