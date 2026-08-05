import { useMemo } from "react"
import { Users, UserRound, Briefcase, Clock } from "lucide-react"
import type { User } from "@/store/useAuthStore"

type Props = {
  users: User[]
}

const UserStatsCards = ({ users }: Props) => {
  const stats = useMemo(() => {
    const total = users.length
    const boarders = users.filter((u) => u.user_type === "Boarder").length
    const staff = users.filter(
      (u) => u.user_type === "Staff" || u.user_type === "Admin"
    ).length
    const pending = users.filter((u) => u.status === "Pending").length

    return { total, boarders, staff, pending }
  }, [users])

  const cards = [
    {
      label: "Total Users",
      value: stats.total,
      icon: Users,
      hint: "All registered accounts",
      primary: true,
    },
    {
      label: "Boarders",
      value: stats.boarders,
      icon: UserRound,
      hint: "Tenant accounts",
    },
    {
      label: "Staff & Admin",
      value: stats.staff,
      icon: Briefcase,
      hint: "Internal accounts",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: Clock,
      hint: "Awaiting approval",
      accent: true,
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, hint, primary, accent }) => (
        <div
          key={label}
          className="rounded-xl border p-3.5 transition-colors 
              border-slate-900 bg-slate-900"
        >
          <div className="flex items-center justify-between gap-2">
            <p
              className={`text-[11px] font-medium ${
                primary ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {label}
            </p>
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                primary
                  ? "bg-white/10"
                  : accent
                    ? "bg-amber-50"
                    : "bg-slate-100"
              }`}
            >
              <Icon
                className={`h-3.5 w-3.5 ${
                  primary
                    ? "text-white"
                    : accent
                      ? "text-amber-600"
                      : "text-slate-600"
                }`}
              />
            </div>
          </div>

          <p
            className="mt-2 text-[22px] font-semibold leading-none tabular-nums 
            text-slate-100"
            
          >
            {value}
          </p>

          <p
            className={`mt-1.5 text-[10.5px] ${
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

export default UserStatsCards