"use client"

import {
  LayoutGrid,
  UserRound,
  FolderOpen,
  House,
  Wallet,
  ClipboardList,
  TriangleAlert,
  Shield,
  Wrench,
  Bell,
  ChartLine,
  User,
  LogOut,
  Menu,
  X,
  EllipsisVertical,
} from "lucide-react"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import ProfileModal from "../modal/profileModal"
import LogoutConfirmModal from "../modal/LogoutConfirmModal"
import { IoHomeSharp } from "react-icons/io5";
import { useAnnouncement } from "@/hooks/useAnnouncement";


const BrandMark = ({ size = "md" }: { size?: "sm" | "md" }) => (
  <div
    className={`${size === "sm" ? "w-8 h-8 rounded-lg" : "w-10 h-10 rounded-xl"} bg-white flex items-center justify-center shrink-0 shadow-sm`}
  >
    <IoHomeSharp size={size === "sm" ? 16 : 20} className="text-slate-900" />
  </div>
)

export const MobileHeader = ({ onMenuOpen }: { onMenuOpen: () => void }) => (
  <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-slate-900 border-b border-white/10 flex items-center px-4 gap-3">
    <button
      onClick={onMenuOpen}
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-slate-300"
      aria-label="Open menu"
    >
      <Menu size={18} />
    </button>

    <div className="flex items-center gap-2">
      <BrandMark size="sm" />
      <span className="text-[15px] font-bold tracking-wide text-white">E-BOARDING</span>
    </div>
  </header>
)

type SidebarProps = {
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const Sidebar = ({ mobileOpen = false, onMobileClose }: SidebarProps) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)
  const { unreadCount, getUnreadCount, markAllAsRead, } = useAnnouncement();
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getUnreadCount();
  }, [getUnreadCount]);

  // Close the profile menu when clicking outside of it
  useEffect(() => {
    if (!dropdownOpen) return
    const handleClick = (e: MouseEvent) => {
      if (footerRef.current && !footerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [dropdownOpen])

  const fullName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
    : "Guest"
  const email = user?.email ?? ""
  const initial = user?.first_name?.charAt(0).toUpperCase() || "G"
  const isAdmin = user?.user_type === "Admin"
  const isStaff = user?.user_type === "Staff"

  const closeAll = () => {
    setDropdownOpen(false)
    onMobileClose?.()
  }

  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px] transition-opacity duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-64 shrink-0
          bg-linear-to-b from-slate-900 to-slate-900 border-r border-white/5
          flex flex-col select-none
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        {/* ── BRAND ── */}
        <div className="px-5 pt-6 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <BrandMark />
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold tracking-wide text-white leading-tight">
                E-BOARDING
              </span>
              <span className="text-xs text-slate-400 truncate">Erming House</span>
            </div>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onMobileClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-slate-300"
            aria-label="Close menu"
          >
            <X size={15} />
          </button>
        </div>

        {/* ── NAVIGATION ── */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">

          <SectionLabel label="Main" />
          {isAdmin && (
            <SidebarItem icon={<LayoutGrid size={18} />} label="Dashboard" to="/dashboard" onNavigate={closeAll} />
          )}
          {isStaff && (
            <SidebarItem icon={<LayoutGrid size={18} />} label="Dashboard" to="/staff-dashboard" onNavigate={closeAll} />
          )}

          <SectionLabel label="Account" />
          <SidebarItem icon={<UserRound size={18} />} label="User Management" to="/user" onNavigate={closeAll} />
          <SidebarItem icon={<FolderOpen size={18} />} label="Documents" to="/documents" onNavigate={closeAll} />

          <SectionLabel label="Properties" />
          <SidebarItem icon={<House size={18} />} label="Rooms" to="/room" onNavigate={closeAll} />

          <SectionLabel label="Transactions" />
          <SidebarItem icon={<Wallet size={18} />} label="Billing" to="/billing" onNavigate={closeAll} />
          {isAdmin && (
            <SidebarItem icon={<ClipboardList size={18} />} label="History" to="/history" onNavigate={closeAll} />
          )}
          <SidebarItem icon={<TriangleAlert size={18} />} label="Penalties" to="/penalties" onNavigate={closeAll} />

          <SectionLabel label="Others" />
          <SidebarItem icon={<Shield size={18} />} label="Rules & Regulations" to="/rules" onNavigate={closeAll} />
          {isAdmin && (
            <SidebarItem icon={<Wrench size={18} />} label="Maintenance" to="/admin-maintenance" onNavigate={closeAll} />
          )}
          {isStaff && (
            <SidebarItem icon={<Wrench size={18} />} label="Maintenance" to="/staff-maintenance" onNavigate={closeAll} />
          )}
          {isAdmin && (
            <SidebarItem icon={<Bell size={18} />} label="Announcements" to="/announcements" onNavigate={closeAll} />
          )}
          {isStaff && (
            <SidebarItem
              icon={<Bell size={18} />}
              label="Announcements"
              to="/staff-announcements"
              unreadCount={unreadCount}
              onNavigate={async () => {
                await markAllAsRead();
                await getUnreadCount();
                closeAll();
              }}
            />
          )}
          <SidebarItem icon={<ChartLine size={18} />} label="Reports" to="/reports" onNavigate={closeAll} />
        </nav>

        {/* ── PROFILE FOOTER ── */}
        <div ref={footerRef} className="px-3 py-3 border-t border-white/10 relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl transition-colors ${dropdownOpen ? "bg-white/10" : "hover:bg-white/5"}`}
            aria-haspopup="menu"
            aria-expanded={dropdownOpen}
          >
            {user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10 shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center font-semibold text-sm ring-2 ring-white/10 shrink-0">
                {initial}
              </div>
            )}

            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {fullName}
              </p>
              <p className="text-xs text-slate-400 truncate leading-tight mt-0.5">
                {email}
              </p>
            </div>

            <EllipsisVertical size={18} className="text-slate-400 shrink-0" />
          </button>

          {/* DROPDOWN */}
          {dropdownOpen && (
            <div
              role="menu"
              className="absolute bottom-full mb-2 left-3 right-3 bg-slate-800 border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
            >
              <div className="py-1">
                <DropdownButton
                  icon={<User size={15} />}
                  label="Profile"
                  onClick={() => {
                    navigate("/profile");
                    closeAll();
                  }}
                />
              </div>
              <div className="border-t border-white/10 py-1">
                <DropdownButton
                  icon={<LogOut size={15} />}
                  label="Logout"
                  danger
                  onClick={() => {
                    setDropdownOpen(false);
                    setLogoutConfirmOpen(true);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </aside>

      <ProfileModal open={openProfile} onClose={() => setOpenProfile(false)} />

      <LogoutConfirmModal
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        userName={user?.first_name}
        onConfirm={() => {
          logout();
          navigate("/login");
        }}
      />
    </>
  )
}

export default Sidebar



type SidebarItemProps = {
  icon: ReactNode
  label: string
  unreadCount?: number
  to: string
  onNavigate?: () => void
}

const SidebarItem = ({
  icon,
  label,
  to,
  unreadCount,
  onNavigate,
}: SidebarItemProps) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className={({ isActive }) =>
      `group flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-150 ${isActive
        ? "bg-gray-600 text-white shadow-md shadow-gray-900/40"
        : "text-slate-300 hover:bg-white/5 hover:text-white"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span
          className={`shrink-0 transition-colors ${isActive ? "text-white" : "text-slate-400 group-hover:text-white"}`}
        >
          {icon}
        </span>

        <span className="truncate">{label}</span>

        {!!unreadCount && unreadCount > 0 && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </>
    )}
  </NavLink>
);

const SectionLabel = ({ label }: { label: string }) => (
  <p className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase px-3 pt-5 pb-2">
    {label}
  </p>
)

type DropdownButtonProps = {
  icon: ReactNode
  label: string
  onClick: () => void
  danger?: boolean
}

const DropdownButton = ({ icon, label, onClick, danger }: DropdownButtonProps) => (
  <button
    role="menuitem"
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${danger
      ? "text-red-400 hover:bg-red-500/10"
      : "text-slate-200 hover:bg-white/5"
      }`}
  >
    {icon}
    {label}
  </button>
)
