"use client"

import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"
import { useRoom } from "@/hooks/useRoom"
import { useEffect } from "react"
const OccupancyTrend = () => {
  const { occupancyTrend, getOccupancyTrend } = useRoom()
  

  useEffect(() => {
    getOccupancyTrend()
  }, [getOccupancyTrend])

  return (
    <div className="rounded-md border w-4xl lg:w-full bg-background p-6 shadow-sm space-y-4">

      <div>
        <h3 className="font-semibold text-lg">Occupancy Trend</h3>
        <p className="text-sm text-muted-foreground">
          Showing room occupancy for the last 6 months
        </p>
      </div>

      {/* 🔷 Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={occupancyTrend}>
            
            {/* Gradient */}
            <defs>
              <linearGradient id="colorOcc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis 
              dataKey="month" 
              tickLine={false}
              axisLine={false}
              className="text-xs"
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="occupied"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorOcc)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 🔷 Footer */}
      <div className="pt-2 border-t">
        <p className="text-sm font-medium">
          Trending up by <span className="text-green-500">5.2%</span> this month 📈
        </p>
        <p className="text-xs text-muted-foreground">
          January - June 2024
        </p>
      </div>

    </div>
  )
}

export default OccupancyTrend