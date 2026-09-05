import {
    DollarSign,
    Users,
    AlertTriangle,
    CreditCard,
    BedDouble,
    UserRound,
    Calendar,
    Eye,
    ChevronDown,
    ArrowRight,
    TrendingUp,
    type LucideIcon,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom"


type ReportType = {
  title: string;
  desc: string;
  icon: LucideIcon;
  bg: string;
  fg: string;
  path?: string;
};


const reportTypes : ReportType[] = [
    {
        title: "Financial Report",
        desc: "Income, expenses & summary",
        icon: DollarSign,
        bg: "bg-blue-50",
        fg: "text-blue-600",
        path: "/financial-report",
    },
    {
        title: "Occupancy Report",
        desc: "Room occupancy & boarder stats",
        icon: Users,
        bg: "bg-emerald-50",
        fg: "text-emerald-600",
        path: "/occupancy-report",
    },
    {
        title: "Penalty Report",
        desc: "Penalties & late payments",
        icon: AlertTriangle,
        bg: "bg-amber-50",
        fg: "text-amber-600",
        path: "/penalty-report",
    },
    {
        title: "Payment Collection",
        desc: "Collections & transactions",
        icon: CreditCard,
        bg: "bg-violet-50",
        fg: "text-violet-600",
        path: "/payment-collection-report",
    },
    {
        title: "Room Availability",
        desc: "Availability & room status",
        icon: BedDouble,
        bg: "bg-sky-50",
        fg: "text-sky-600",
        path: "/room-availability-report",
    },
    {
        title: "Boarder Report",
        desc: "Boarder details & information",
        icon: UserRound,
        bg: "bg-rose-50",
        fg: "text-rose-600",
        path: "/boarder-report",
    },
];

/** Formats a timestamp the same way the report list has always displayed dates, e.g. "May 31, 10:30 AM". */
function formatReportTimestamp(date: Date) {
    return `${date.toLocaleDateString("en-PH", {
        month: "long",
        day: "numeric",
    })}, ${date.toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit",
    })}`;
}

const reportGenerationNow = new Date();
const currentMonthName = reportGenerationNow.toLocaleDateString("en-PH", { month: "long" });

/** Minutes-ago offsets replicate the original mock's staggered generation times, anchored to today. */
const recentReports = [
    {
        name: `${currentMonthName} Financial Report`,
        type: "Financial",
        badge: "bg-blue-50 text-blue-600",
        date: formatReportTimestamp(new Date(reportGenerationNow.getTime() - 0)),
        by: "Administrator",
        path: "/financial-report",
    },
    {
        name: `${currentMonthName} Occupancy Report`,
        type: "Occupancy",
        badge: "bg-emerald-50 text-emerald-600",
        date: formatReportTimestamp(new Date(reportGenerationNow.getTime() - 75 * 60_000)),
        by: "Administrator",
        path: "/occupancy-report",
    },
    {
        name: `${currentMonthName} Penalty Report`,
        type: "Penalty",
        badge: "bg-amber-50 text-amber-600",
        date: formatReportTimestamp(new Date(reportGenerationNow.getTime() - 105 * 60_000)),
        by: "Administrator",
        path: "/penalty-report",
    },
    {
        name: `${currentMonthName} Collection Report`,
        type: "Collection",
        badge: "bg-violet-50 text-violet-600",
        date: formatReportTimestamp(new Date(reportGenerationNow.getTime() - 120 * 60_000)),
        by: "Administrator",
        path: "/payment-collection-report",
    },
    {
        name: "Room Availability Report",
        type: "Availability",
        badge: "bg-sky-50 text-sky-600",
        date: formatReportTimestamp(new Date(reportGenerationNow.getTime() - 18 * 60 * 60_000)),
        by: "Administrator",
        path: "/room-availability-report",
    },
];

const summaryData = [
    { name: "Financial", value: 6, color: "#2563eb" },
    { name: "Occupancy", value: 5, color: "#059669" },
    { name: "Penalty", value: 4, color: "#d97706" },
    { name: "Collection", value: 5, color: "#7c3aed" },
    { name: "Availability", value: 2, color: "#0284c7" },
    { name: "Boarder", value: 2, color: "#e11d48" },
];

const totalReports = summaryData.reduce((sum, d) => sum + d.value, 0);


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


export default function ReportManagement() {
    const navigate = useNavigate()

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-2 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-15 pt-4 bg-gray-50">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                            Report Management
                        </h1>
                        <p className="text-xs text-slate-500">
                            Generate and manage reports for your boarding house operations
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-slate-300">
                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                            {dateRange}
                        </button>
                    </div>
                </div>

                {/* Generate Reports */}
                <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="mb-3">
                        <h2 className="text-sm font-semibold text-slate-900">
                            Generate Reports
                        </h2>
                        <p className="text-xs text-slate-400">
                            Select a report type to generate
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-6">
                        {reportTypes.map((r) => {
                            const Icon = r.icon;

                            return (
                                <button
                                    onClick={() => r.path && navigate(r.path)}
                                    className="group flex flex-col items-start gap-2 rounded-lg border border-slate-200 p-2.5 text-left transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                                >
                                    <div className="flex w-full items-start justify-between">
                                        <div
                                            className={`flex h-8 w-8 items-center justify-center rounded-lg ${r.bg}`}
                                        >
                                            <Icon className={`h-4 w-4 ${r.fg}`} />
                                        </div>

                                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all group-hover:bg-slate-900 group-hover:text-white">
                                            <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold text-slate-800">
                                            {r.title}
                                        </p>

                                        <p className="mt-0.5 text-xs leading-snug text-slate-400">
                                            {r.desc}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom row */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Recent Reports */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4 lg:col-span-2">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                                    <th className="py-2 font-medium">Report</th>
                                    <th className="py-2 font-medium">Type</th>
                                    <th className="py-2 font-medium hidden sm:table-cell">
                                        Generated
                                    </th>
                                    <th className="py-2 text-right font-medium">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentReports.map((rep) => (
                                    <tr
                                        key={rep.name}
                                        className="border-b border-slate-50 text-xs text-slate-700 last:border-0 hover:bg-slate-50"
                                    >
                                        <td className="py-2.5 font-medium text-slate-800">
                                            {rep.name}
                                        </td>
                                        <td className="py-2.5">
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${rep.badge}`}
                                            >
                                                {rep.type}
                                            </span>
                                        </td>
                                        <td className="py-2.5 text-slate-400 hidden sm:table-cell">
                                            {rep.date}
                                        </td>
                                        <td className="py-2.5">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    title="View report"
                                                    onClick={() => navigate(rep.path)}
                                                    className="flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Report Summary */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <div className="mb-2 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-slate-900">
                                Report Summary
                            </h2>
                            <button className="flex items-center gap-1 rounded-md border border-slate-200 px-2 py-1 text-xs font-medium text-slate-500">
                                This Month
                                <ChevronDown className="h-3 w-3" />
                            </button>
                        </div>

                        <div className="relative mx-auto h-32 w-32">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={summaryData}
                                        dataKey="value"
                                        innerRadius={38}
                                        outerRadius={56}
                                        startAngle={90}
                                        endAngle={-270}
                                        stroke="none"
                                    >
                                        {summaryData.map((d) => (
                                            <Cell key={d.name} fill={d.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-xs text-slate-400">Total</span>
                                <span className="text-lg font-bold text-slate-900">
                                    {totalReports}
                                </span>
                            </div>
                        </div>

                        <div className="mt-3 space-y-1.5">
                            {summaryData.map((d) => (
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
                                        {d.value} ({Math.round((d.value / totalReports) * 100)}%)
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-2.5">
                            <div className="flex items-center gap-2">
                                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                                    <TrendingUp className="h-3.5 w-3.5" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Reports Generated</p>
                                    <p className="text-sm font-bold text-slate-900">
                                        {totalReports}
                                    </p>
                                </div>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600">
                                +14.3%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}