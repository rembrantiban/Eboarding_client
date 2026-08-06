import { useMemo } from "react"
import { ClipboardList, Clock, Wrench, CheckCircle2 } from "lucide-react"
import type { MaintenanceRequest } from "@/store/useMaintenanceStore" // TODO: adjust import path

type Props = {
  requests: MaintenanceRequest[]
}

const MaintenanceStatsCards = ({ requests }: Props) => {
  const stats = useMemo(() => {
    const count = (status: string) =>
      requests.filter(
        (r) => r.status?.toLowerCase() === status.toLowerCase()
      ).length

    return {
      total: requests.length,
      pending: count("Pending"),
      inProgress: count("In Progress"),
      completed: count("Completed"),
    }
  }, [requests])

  const cards = [
    {
      label: "Total Requests",
      value: stats.total,
      icon: ClipboardList,
      hint: "All time requests",
      primary: true,
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      hint: "Awaiting assignment",
      tint: "bg-amber-50 text-amber-600",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: Wrench,
      hint: "Currently being worked on",
      tint: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: CheckCircle2,
      hint: "Resolved requests",
      tint: "bg-emerald-50 text-emerald-600",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, hint, primary, tint }) => (
        <div
          key={label}
          className="rounded-xl border p-3.5 transition-colors border-slate-900 bg-slate-900"
        >
          <div className="flex items-center justify-between gap-2">
            <p
              className={`truncate text-[11px] font-medium ${
                primary ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {label}
            </p>
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                primary ? "bg-white/10 text-white" : tint ?? "bg-slate-100 text-slate-600"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
            </div>
          </div>

          <p
            className="mt-2 text-[22px] font-semibold leading-none tabular-nums tracking-tight  text-slate-100"
          >
            {value}
          </p>

          <p
            className={`mt-1.5 truncate text-[10.5px] ${
              primary ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {hint}
          </p>
        </div>
      ))}
    </div>
  )
}

export default MaintenanceStatsCards