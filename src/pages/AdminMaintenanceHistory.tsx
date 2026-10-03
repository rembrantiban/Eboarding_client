"use client";

import { useEffect, useMemo } from "react"
import { Navigate, useNavigate } from "react-router-dom"
import { ArrowLeft, Archive, CalendarCheck2, Tags } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useMaintenance } from "@/hooks/useMaintenace"
import AdminMaintenanceHistoryTable from "@/components/maintenance/AdminMaintenanceHistoryTable"

const StatCard = ({
    label,
    value,
    hint,
    icon: Icon,
}: {
    label: string
    value: React.ReactNode
    hint: string
    icon: React.ComponentType<{ className?: string }>
}) => (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2">
            <p className="truncate text-[11px] font-medium text-slate-400">{label}</p>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                <Icon className="h-3.5 w-3.5" />
            </div>
        </div>
        <p className="mt-2 truncate text-[22px] font-semibold leading-none tracking-tight text-white">
            {value}
        </p>
        <p className="mt-1.5 truncate text-[10.5px] text-slate-500">{hint}</p>
    </div>
)

const AdminMaintenanceHistoryPage = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { maintenanceHistory, loading, getMaintenanceHistory } = useMaintenance()

    useEffect(() => {
        getMaintenanceHistory()
        //eslint-disable-next-line
    }, [])

    const stats = useMemo(() => {
        const now = new Date()

        const closedThisMonth = maintenanceHistory.filter((r) => {
            const closedAt = r.resolved_at ?? r.updated_at
            if (!closedAt) return false
            const d = new Date(closedAt)
            return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
        }).length

        const categoryCounts = new Map<string, number>()
        maintenanceHistory.forEach((r) => {
            if (!r.category) return
            categoryCounts.set(r.category, (categoryCounts.get(r.category) ?? 0) + 1)
        })

        let topCategory = "—"
        let topCount = 0
        categoryCounts.forEach((count, category) => {
            if (count > topCount) {
                topCategory = category
                topCount = count
            }
        })

        const durations = maintenanceHistory
            .map((r) => {
                const closedAt = r.resolved_at ?? r.updated_at
                if (!closedAt) return null
                const days =
                    (new Date(closedAt).getTime() - new Date(r.created_at).getTime()) /
                    (1000 * 60 * 60 * 24)
                return days >= 0 ? days : null
            })
            .filter((d): d is number => d !== null)

        const avgDays =
            durations.length > 0
                ? durations.reduce((sum, d) => sum + d, 0) / durations.length
                : null

        return {
            total: maintenanceHistory.length,
            closedThisMonth,
            topCategory,
            avgDays,
        }
    }, [maintenanceHistory])

    // Only Admins may view the archive — Staff share the /admin-maintenance route group.
    if (user && user.user_type !== "Admin") {
        return <Navigate to="/admin-maintenance" replace />
    }

    return (
        <div className="h-full overflow-y-auto space-y-6 px-5 py-6 bg-background">
            {/* Header */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 px-6 py-6 shadow-sm">
                <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                            <Archive className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-[17px] font-semibold leading-tight tracking-tight text-white">
                                Maintenance History
                            </h1>
                            <p className="mt-0.5 text-[12px] leading-tight text-slate-400">
                                A permanent record of every maintenance request that has been closed.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/admin-maintenance")}
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg bg-white/10 px-3.5 text-[12.5px] font-medium text-white ring-1 ring-white/15 transition hover:bg-white/15"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Requests
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <StatCard
                    label="Total Closed"
                    value={stats.total}
                    hint="All-time archived requests"
                    icon={Archive}
                />
                <StatCard
                    label="Closed This Month"
                    value={stats.closedThisMonth}
                    hint="Archived in the current month"
                    icon={CalendarCheck2}
                />
                <StatCard
                    label="Most Common Category"
                    value={stats.topCategory}
                    hint={
                        stats.avgDays !== null
                            ? `Avg. ${stats.avgDays.toFixed(1)} days to close`
                            : "Not enough data yet"
                    }
                    icon={Tags}
                />
            </div>

            <AdminMaintenanceHistoryTable
                request={maintenanceHistory}
                loading={loading}
            />
        </div>
    )
}

export default AdminMaintenanceHistoryPage
