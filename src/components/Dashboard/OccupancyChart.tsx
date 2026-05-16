"use client"

import { useEffect } from "react"
import { useRoom } from "@/hooks/useRoom"

const OccupancyChart = () => {

  const {
    getDashboardStats,
    dashboardStats,
  } = useRoom()

  useEffect(() => {
    getDashboardStats()
  }, [getDashboardStats])

  const occupiedBeds =
    dashboardStats?.occupiedBeds || 0

  const availableBeds =
    dashboardStats?.availableBeds || 0

  const totalBeds =
    occupiedBeds + availableBeds

  const occupiedPercent =
    totalBeds > 0
      ? (occupiedBeds / totalBeds) * 100
      : 0

  const availablePercent =
    totalBeds > 0
      ? (availableBeds / totalBeds) * 100
      : 0

  return (
    <div className="rounded-md border bg-background p-5 shadow-sm">

      <h3 className="font-semibold mb-4">
       Occupancy Overview
      </h3>

      <div className="space-y-4">

        {/* OCCUPIED */}
        <div>
          <p className="text-sm">
            Occupied ({occupiedBeds})
          </p>

          <div className="w-full bg-muted rounded-full h-2 mt-1">

            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{
                width: `${occupiedPercent}%`,
              }}
            />

          </div>
        </div>

        {/* AVAILABLE */}
        <div>
          <p className="text-sm">
            Available ({availableBeds})
          </p>

          <div className="w-full bg-muted rounded-full h-2 mt-1">

            <div
              className="bg-green-500 h-2 rounded-full transition-all"
              style={{
                width: `${availablePercent}%`,
              }}
            />

          </div>
        </div>

      </div>
    </div>
  )
}

export default OccupancyChart