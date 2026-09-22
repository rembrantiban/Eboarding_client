"use client"

import { Outlet } from "react-router-dom"
import Sidebar, { MobileHeader } from "@/components/layout/Sidebar"
import { useState } from "react"

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-y-hidden">
      <Sidebar
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
      />
      <MobileHeader onMenuOpen={() => setSidebarOpen(true)} />
      <main className="min-w-0 flex-1">
        {/* 🔷 PAGE CONTENT */}
        <div className="pt-10 pl-2">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout