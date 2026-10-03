import type { ReactNode } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"

type Props = {
  title: string
  value: string
  icon: ReactNode
  /** Optional short line under the value, e.g. "Updated today" */
  hint?: string
  /** Tailwind classes for the icon chip, e.g. "bg-blue-50 text-blue-600" */
  tone?: string
  /** Optional change indicator, e.g. "+12%" */
  trend?: string
  trendDirection?: "up" | "down"
}

const StatCard = ({
  title,
  value,
  icon,
  hint,
  tone = "bg-slate-100 text-slate-700",
  trend,
  trendDirection = "up",
}: Props) => {
  const TrendIcon = trendDirection === "up" ? TrendingUp : TrendingDown

  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-semibold leading-none tracking-tight text-white tabular-nums">
            {value}
          </p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg [&>svg]:h-5 [&>svg]:w-5 ${tone}`}>
          {icon}
        </div>
      </div>

      {(trend || hint) && (
        <div className="mt-3 flex items-center gap-2 text-[11px]">
          {trend && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-semibold ${trendDirection === "up"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-rose-500/15 text-rose-400"
                }`}
            >
              <TrendIcon size={11} />
              {trend}
            </span>
          )}
          {hint && <span className="truncate text-slate-500">{hint}</span>}
        </div>
      )}
    </div>
  )
}

export default StatCard
