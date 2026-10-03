"use client"

import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {
  CalendarDays,
  Bell,
  ChevronRight,
  LayoutGrid,
  UserRound,
  FolderOpen,
  House,
  Users,
  Wallet,
  ClipboardList,
  TriangleAlert,
  Shield,
  Wrench,
  ChartLine,
  Calendar,
  UserCog,
  type LucideIcon,
  ChevronDown,
  User,
  LogOut,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { useAnnouncement } from "@/hooks/useAnnouncement"
import LogoutConfirmModal from "../modal/LogoutConfirmModal"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

type Role = "Admin" | "Staff"

type Crumb = { label: string; icon: LucideIcon; to?: string }

type PageInfo = Crumb & { parent?: Crumb }

const USERS: Crumb = { label: "User Management", icon: UserRound, to: "/user" }
const ROOMS: Crumb = { label: "Rooms", icon: House, to: "/room" }
const REPORTS: Crumb = { label: "Reports", icon: ChartLine, to: "/reports" }

// Breadcrumb info for each route (admin and staff), matched by route prefix
const PAGES: [string, PageInfo][] = [
  ["/user", USERS],
  ["/view-user", { label: "View User", icon: UserRound, parent: USERS }],
  ["/deleted-accounts", { label: "Deleted Accounts", icon: UserRound, parent: USERS }],
  ["/documents", { label: "Documents", icon: FolderOpen }],
  ["/room", ROOMS],
  ["/deleted-rooms", { label: "Deleted Rooms", icon: House, parent: ROOMS }],
  ["/boarders", { label: "Boarders", icon: Users }],
  ["/billing", { label: "Billing", icon: Wallet }],
  ["/history", { label: "History", icon: ClipboardList }],
  ["/penalties", { label: "Penalties", icon: TriangleAlert }],
  ["/rules", { label: "Rules & Regulations", icon: Shield }],
  ["/admin-maintenance-history", { label: "History", icon: Wrench, parent: { label: "Maintenance", icon: Wrench, to: "/admin-maintenance" } }],
  ["/admin-maintenance", { label: "Maintenance", icon: Wrench }],
  ["/staff-maintenance", { label: "Maintenance", icon: Wrench }],
  ["/announcements", { label: "Announcements", icon: Bell }],
  ["/staff-announcements", { label: "Announcements", icon: Bell }],
  ["/calendar", { label: "Calendar", icon: Calendar }],
  ["/reports", REPORTS],
  ["/financial-report", { label: "Financial Report", icon: ChartLine, parent: REPORTS }],
  ["/occupancy-report", { label: "Occupancy Report", icon: ChartLine, parent: REPORTS }],
  ["/penalty-report", { label: "Penalty Report", icon: ChartLine, parent: REPORTS }],
  ["/payment-collection-report", { label: "Payment Collection", icon: ChartLine, parent: REPORTS }],
  ["/room-availability-report", { label: "Room Availability", icon: ChartLine, parent: REPORTS }],
  ["/boarder-report", { label: "Boarder Report", icon: ChartLine, parent: REPORTS }],
  ["/profile", { label: "My Profile", icon: UserCog }],
]

const getPage = (pathname: string) =>
  PAGES.find(([path]) => pathname === path || pathname.startsWith(`${path}/`))?.[1]




const Topbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { unreadCount, getUnreadCount, markAllAsRead } = useAnnouncement()

  const [now, setNow] = useState(() => new Date())
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

  const role = user?.user_type as Role | undefined
  const fullName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
    : "Guest"
  const initial = user?.first_name?.charAt(0).toUpperCase() || "G"
  const roleLabel = role === "Admin" ? "Administrator" : role ?? ""
  const announcementsPath = role === "Staff" ? "/staff-announcements" : "/announcements"
  const dashboardPath = role === "Staff" ? "/staff-dashboard" : "/dashboard"

  // Dashboard is always the first crumb; the current page (and its parent) follow it
  const page = getPage(pathname)
  const crumbs: Crumb[] = [
    { label: "Dashboard", icon: LayoutGrid, to: dashboardPath },
    ...(page?.parent ? [page.parent] : []),
    ...(page ? [page] : []),
  ]

  useEffect(() => {
    getUnreadCount()
  }, [getUnreadCount])

  // Live clock
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(id)
  }, [])

  const dateLabel = now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
  const timeLabel = now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })

  return (
    <>
      <header className="h-16 shrink-0 bg-white border-b border-slate-200 flex items-center gap-4 px-4 lg:px-6">
        {/* ── BREADCRUMB ── */}
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex items-center gap-1.5 min-w-0">
            {crumbs.map((crumb, i) => {
              const isLast = i === crumbs.length - 1
              const Icon = crumb.icon
              return (
                <li key={crumb.label + i} className={`flex items-center gap-1.5 ${isLast ? "min-w-0" : "shrink-0"}`}>
                  {i > 0 && <ChevronRight size={15} className="text-slate-300 shrink-0" />}
                  {isLast ? (
                    <span aria-current="page" className="flex items-center gap-2 min-w-0">
                      <span className="w-8 h-8 rounded-lg bg-gray-900 text-white flex items-center justify-center shrink-0">
                        <Icon size={16} />
                      </span>
                      <span className="text-base font-semibold text-slate-800 truncate">{crumb.label}</span>
                    </span>
                  ) : (
                    <Link
                      to={crumb.to ?? dashboardPath}
                      className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                    >
                      <Icon size={15} />
                      {crumb.label}
                    </Link>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:gap-5">
          {/* ── DATE / TIME ── */}
          <div className="hidden md:flex items-center gap-2.5">
            <CalendarDays size={20} className="text-slate-600" />
            <div className="leading-tight">
              <p className="text-xs font-medium text-slate-800">{dateLabel}</p>
              <p className="text-xs text-slate-500">{timeLabel}</p>
            </div>
          </div>

          {/* ── THEME TOGGLE ── */}
         
          {/* ── NOTIFICATIONS ── */}
          <button
            onClick={async () => {
              navigate(announcementsPath)
              // Staff read announcements; opening them clears the unread badge (same as the sidebar)
              if (role === "Staff") {
                await markAllAsRead()
                await getUnreadCount()
              }
            }}
            className="relative w-10 h-10 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          >
            <Bell size={20} />
            {!!unreadCount && unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white ring-2 ring-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <div className="hidden sm:block h-8 w-px bg-slate-200" />

          {/* ── PROFILE ── */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 rounded-lg px-1.5 py-1 hover:bg-slate-50 transition-colors outline-none">
                {user?.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-semibold text-sm shrink-0">
                    {initial}
                  </div>
                )}
                <div className="hidden md:block text-left leading-tight">
                  <p className="text-sm font-semibold text-slate-800">{fullName}</p>
                  <p className="text-xs text-slate-500">{roleLabel}</p>
                </div>
                <ChevronDown size={16} className="hidden md:block text-slate-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User size={15} /> Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={() => setLogoutConfirmOpen(true)}>
                <LogOut size={15} /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <LogoutConfirmModal
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        userName={user?.first_name}
        onConfirm={() => {
          logout()
          navigate("/login")
        }}
      />
    </>
  )
}

export default Topbar


