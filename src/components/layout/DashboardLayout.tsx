"use client"

import { Outlet } from "react-router-dom"
import Sidebar, { MobileHeader } from "@/components/layout/Sidebar"
import Topbar from "@/components/layout/Topbar"
import { useState } from "react"

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} />
      <main className="min-w-0 flex-1 flex flex-col">
        <div className="hidden lg:block">
          <Topbar />
        </div>
        {/* 🔷 PAGE CONTENT */}
        <div className="flex-1 min-h-0 pt-14 lg:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout
