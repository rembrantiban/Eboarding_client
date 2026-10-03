import { useNavigate } from "react-router-dom"
import {
  Megaphone,
  TriangleAlert,
  Shield,
  House,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react"
import type { QuickAction } from "@/hooks/useQuickAction"

type Action = {
  label: string
  description: string
  icon: LucideIcon
  to: string
  quickAction?: QuickAction
}

const ACTIONS: Action[] = [
  {
    label: "New Announcement",
    description: "Post a notice to boarders",
    icon: Megaphone,
    to: "/announcements",
    quickAction: "create-announcement",
  },
  {
    label: "Assign Penalty",
    description: "Record a rule violation",
    icon: TriangleAlert,
    to: "/penalties",
    quickAction: "assign-penalty",
  },
  {
    label: "Add Rule",
    description: "Create a house rule",
    icon: Shield,
    to: "/rules",
    quickAction: "create-rule",
  },
  {
    label: "Rooms",
    description: "Assign & manage rooms",
    icon: House,
    to: "/room",
  },
]

const QuickActions = () => {
  const navigate = useNavigate()

  return (
    <section className="h-full rounded-lg border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>
        <p className="text-xs text-slate-500">Shortcuts to common tasks</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-2">
        {ACTIONS.map(({ label, description, icon: Icon, to, quickAction }) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(to, quickAction ? { state: { quickAction } } : undefined)}
            className="group relative flex flex-col items-start gap-3 rounded-lg border border-gray-200 bg-white p-3.5 text-left transition-colors hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-900 text-white">
              <Icon size={17} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-semibold text-slate-800">{label}</span>
              <span className="block truncate text-[11px] text-slate-500">{description}</span>
            </span>
            <ArrowUpRight
              size={15}
              className="absolute right-3 top-3 text-slate-300 transition-colors group-hover:text-slate-700"
            />
          </button>
        ))}
      </div>
    </section>
  )
}

export default QuickActions
