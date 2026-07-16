"use client"

import {
  LayoutDashboard,
  Users,
  BedDouble,
  UserCheck,
  User,
  Settings,
  LogOut,
  Shield,
  Bell,
  MoreHorizontal,
  Menu,
  X,
  Wallet,
  ScrollText,
  FolderOpen, 
} from "lucide-react"
import { useState, type ReactNode } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import ProfileModal from "../modal/profileModal"
import { IoHomeSharp } from "react-icons/io5";


export const MobileHeader = ({ onMenuOpen }: { onMenuOpen: () => void }) => (
  <header className="lg:hidden fixed top-0 inset-x-0 z-40 h-14 bg-white border-b border-slate-100 flex items-center px-4 gap-3">
    <button
      onClick={onMenuOpen}
      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-600"
      aria-label="Open menu"
    >
      <Menu size={18} />
    </button>

    {/* Logo */}
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-md bg-linear-to-r from-purple-600 to-teal-400 flex items-center justify-center shrink-0">
        <span className="text-white font-black text-xs leading-none"><IoHomeSharp size={20} /></span>
      </div>
      <span className="text-[15px] font-bold tracking-tight text-slate-900">
        E-<span className="bg-linear-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent select-none">boarding</span>
      </span>
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

  const fullName = user
    ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
    : "Guest"
  const email = user?.email ?? ""
  const initial = user?.first_name?.charAt(0).toUpperCase() || "G"

  const closeAll = () => {
    setDropdownOpen(false)
    onMobileClose?.()
  }

  return (
    <>
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside
        className={`
          fixed top-0 left-0 z-50 h-screen w-68 bg-white border-r border-slate-100
          flex flex-col select-none
          transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          lg:translate-x-0 lg:static lg:z-auto
          ${mobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"}
        `}
      >
        <div className="px-5 py-5 border-b border-slate-200 flex items-center justify-between  w-full">
          <div className="flex items-center gap-2 ">
            <div className="w-10 h-10 rounded-md  bg-linear-to-r from-slate-600 to-slate-700 flex items-center justify-center shrink-0">
              <span className="text-white font-black text-sm leading-none"><IoHomeSharp size={20} className="text-white" /></span>
            </div>
           <div className="flex flex-col">
             <span className="text-[17px] font-bold tracking-tight text-slate-900">
              E-<span className="bg-linear-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent select-none">BOARDING</span>
            </span>
            <p className="text-xs text-slate-500">Erming House</p>
           </div>
          </div>

          {/* Close button — mobile only */}
          <button
            onClick={onMobileClose}
            className="lg:hidden w-7 h-7 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-blue-900"
            aria-label="Close menu"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">

          <SectionLabel label="Main" />
          <SidebarItem icon={<LayoutDashboard size={16} />} label="Dashboard" to="/dashboard" onNavigate={closeAll} />

          <SectionLabel label="Account" />
          <SidebarItem icon={<Users size={16} />} label="User Management" to="/user" onNavigate={closeAll} />
          <SidebarItem icon={<FolderOpen size={16} />} label="Documents" to="/documents" onNavigate={closeAll} />


          <SectionLabel label="Properties" />
          <SidebarItem icon={<UserCheck size={16} />} label="Rooms" to="/room" onNavigate={closeAll} />

          <SectionLabel label="Transactions" />
          <SidebarItem icon={<BedDouble size={16} />} label="Boarders" to="/boarders" onNavigate={closeAll} />
          <SidebarItem icon={<Wallet size={16} />} label="Billing" to="/payments" onNavigate={closeAll} />
          <SidebarItem icon={<Wallet size={16} />} label="Payment History" to="/payment-history" onNavigate={closeAll} />
          <SidebarItem icon={<ScrollText size={16} />} label="Reports" to="/reports" onNavigate={closeAll} />

          <SectionLabel label="Others" />
          <SidebarItem icon={<Shield size={16} />} label="Rules & Regulations" to="/rules" onNavigate={closeAll} />
          <SidebarItem icon={<Bell size={16} />} label="Announcements" to="/announcements" onNavigate={closeAll} />
        </div>

        {/* ── PROFILE FOOTER ── */}
        <div className="px-3 pb-4 border-t border-slate-100 pt-3 relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
          >
            { user?.avatar_url ? (
              <img
                src={user.avatar_url}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                {initial}
              </div>
            )}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate leading-tight">{fullName}</p>
              <p className="text-[11px] text-slate-400 truncate leading-tight">{email}</p>
            </div>
            <MoreHorizontal size={16} className="text-slate-400 shrink-0" />
          </button>

          {/* DROPDOWN */}
          {dropdownOpen && (
            <div className="absolute bottom-full mb-2 left-3 right-3 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800 truncate">{fullName}</p>
                <p className="text-[11px] text-slate-400 truncate">{email}</p>
              </div>

              <div className="py-1">
                <DropdownButton
                  icon={<User size={14} />}
                  label="Profile"
                  onClick={() => { navigate("/profile"); setDropdownOpen(false) }}
                />
                <DropdownButton
                  icon={<Settings size={14} />}
                  label="Settings"
                  onClick={() => { navigate("/settings"); setDropdownOpen(false) }}
                />
              </div>

              <div className="border-t border-slate-100 py-1">
                <DropdownButton
                  icon={<LogOut size={14} />}
                  label="Logout"
                  danger
                  onClick={() => { logout(); navigate("/login") }}
                />
              </div>
            </div>
          )}
        </div>
      </aside>

      <ProfileModal open={openProfile} onClose={() => setOpenProfile(false)} />
    </>
  )
}

export default Sidebar



type SidebarItemProps = {
  icon: ReactNode
  label: string
  to: string
  onNavigate?: () => void
}

const SidebarItem = ({ icon, label, to, onNavigate }: SidebarItemProps) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive
          ? "bg-slate-700 text-slate-100"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <span className={isActive ? "text-slate-100" : "text-slate-400"}>{icon}</span>
        <span>{label}</span>
        {isActive && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-100" />
        )}
      </>
    )}
  </NavLink>
)

const SectionLabel = ({ label }: { label: string }) => (
  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase px-3 pt-5 pb-1.5">
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
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-colors ${
      danger
        ? "text-red-500 hover:bg-red-50"
        : "text-slate-600 hover:bg-slate-50"
    }`}
  >
    {icon}
    {label}
  </button>
)