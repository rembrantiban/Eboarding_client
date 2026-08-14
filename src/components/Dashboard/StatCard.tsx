import type { ReactNode } from "react"

type Props = {
  title: string
  value: string
  icon: ReactNode
  /** Optional short line under the value, e.g. "Updated today" */
  hint?: string
  /** Fills the card with slate-900 — use for the primary metric only */
  primary?: boolean
  /** Optional change indicator, e.g. "+12%" */
  trend?: string
  trendDirection?: "up" | "down"
}

const StatCard = ({
  title,
  value,
  icon,
  hint,
  primary,
  trend,
  trendDirection = "up",
}: Props) => {
  return (
    <div
      className="rounded-xl border p-4 transition-colors 
      border-slate-900 bg-slate-800"
    >
      <div className="flex items-center justify-between gap-2">
        <p
          className="truncate text-[13px] font-medium text-slate-200"
         
        >
          {title}
        </p>

        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100"
        >
          <span
            className="flex items-center justify-center [&>svg]:h-4.5 [&>svg]:w-4.5 "
          >
            {icon}
          </span>
        </div>
      </div>

      <div className="mt-2.5 flex items-end gap-2">
        <h2
          className="text-[22px] font-semibold leading-none tabular-nums tracking-tight text-white"
        >
          {value}
        </h2>

        {trend && (
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
              trendDirection === "up"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-rose-50 text-rose-700"
            }`}
          >
            {trend}
          </span>
        )}
      </div>

      {hint && (
        <p
          className={`mt-1.5 truncate text-[10.5px] ${
            primary ? "text-slate-500" : "text-slate-400"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  )
}

export default StatCard