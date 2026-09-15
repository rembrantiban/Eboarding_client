"use client";

import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeft, Archive, CalendarCheck2, Tags } from "lucide-react"
import { useMaintenance } from "@/hooks/useMaintenace"
import BoarderMaintenanceHistoryTable from "@/components/maintenance/BoarderMaintenanceHistoryTable"

const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone,
}: {
  label: string
  value: React.ReactNode
  hint: string
  icon: React.ComponentType<{ className?: string }>
  tone: string
}) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
    <div className="flex items-center justify-between gap-2">
      <p className="truncate text-[11px] font-medium uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-3.5 w-3.5" />
      </div>
    </div>
    <p className="mt-2 truncate text-[22px] font-semibold leading-none tabular-nums text-slate-900">
      {value}
    </p>
    <p className="mt-1.5 truncate text-[10.5px] text-slate-400">{hint}</p>
  </div>
)

const BoarderMaintenanceHistoryPage = () => {
  const navigate = useNavigate()
  const { boarderMaintenanceHistory, loading, getBoarderMaintenanceHistory } = useMaintenance()

  useEffect(() => {
    getBoarderMaintenanceHistory()
    //eslint-disable-next-line
  }, [])

  const stats = useMemo(() => {
    const now = new Date()

    const closedThisMonth = boarderMaintenanceHistory.filter((r) => {
      const closedAt = r.resolved_at ?? r.updated_at
      if (!closedAt) return false
      const d = new Date(closedAt)
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()
    }).length

    const categoryCounts = new Map<string, number>()
    boarderMaintenanceHistory.forEach((r) => {
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

    return {
      total: boarderMaintenanceHistory.length,
      closedThisMonth,
      topCategory,
    }
  }, [boarderMaintenanceHistory])

  return (
    <div className="min-h-screen bg-slate-50/60">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/boarder-maintenance")}
              aria-label="Back to maintenance"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900">
              <Archive className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-[18px] font-semibold leading-tight text-slate-900">
                Maintenance Request History
              </h1>
              <p className="mt-0.5 text-[12px] text-slate-500">
                A permanent record of every request on your account that has been closed.
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard
            label="Total Closed"
            value={stats.total}
            hint="All-time closed requests"
            icon={Archive}
            tone="bg-slate-100 text-slate-700"
          />
          <StatCard
            label="Closed This Month"
            value={stats.closedThisMonth}
            hint="Closed in the current month"
            icon={CalendarCheck2}
            tone="bg-emerald-50 text-emerald-700"
          />
          <StatCard
            label="Most Common Category"
            value={stats.topCategory}
            hint="Across your closed requests"
            icon={Tags}
            tone="bg-indigo-50 text-indigo-700"
          />
        </div>

        <BoarderMaintenanceHistoryTable
          request={boarderMaintenanceHistory}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default BoarderMaintenanceHistoryPage
