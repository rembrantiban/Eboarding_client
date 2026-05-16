"use client"

import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"
import { usePayment } from "@/hooks/usePayment"
import { TrendingUp, Wallet, Users, ArrowUpRight } from "lucide-react"
import { useEffect } from "react"

type TooltipProps = {
  active?: boolean
  payload?: {
    value: number
  }[]
  label?: string
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (!active || !payload?.length) return null
  return (
    <div
      style={{
        background: "white",
        border: "0.5px solid #e2e8f0",
        borderRadius: 10,
        padding: "10px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        fontFamily: "'Syne', sans-serif",
      }}
    >
      <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4, fontWeight: 500 }}>
        {label}
      </p>
      <p style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", fontFamily: "'DM Mono', monospace" }}>
        ₱{payload[0].value.toLocaleString()}
      </p>
    </div>
  )
}

const StatCard = ({
  label,
  value,
  badge,
  badgeColor,
  icon: Icon,
}: {
  label: string
  value: string
  badge: string
  badgeColor: "green" | "blue"
  icon: React.ElementType
}) => (
  <div
    style={{
      flex: 1,
      background: "#f8fafc",
      borderRadius: 10,
      padding: "14px 16px",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          color: "#94a3b8",
          textTransform: "uppercase",
          letterSpacing: "0.07em",
        }}
      >
        {label}
      </span>
      <Icon size={14} color="#185fa5" />
    </div>

    <p
      style={{
        fontSize: 22,
        fontWeight: 500,
        color: "#0f172a",
        lineHeight: 1,
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {value}
    </p>

    <span
      style={{
        display: "inline-block",
        marginTop: 8,
        fontSize: 11,
        fontWeight: 500,
        padding: "3px 8px",
        borderRadius: 99,
        background: badgeColor === "green" ? "#eaf3de" : "#e6f1fb",
        color: badgeColor === "green" ? "#3b6d11" : "#185fa5",
      }}
    >
      {badge}
    </span>
  </div>
)

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    
const RevenueAnalytics = () => {

   const {
    revenueAnalytics,
    getRevenueAnalytics,
  } = usePayment()

  useEffect(() => {
    getRevenueAnalytics()
  }, [getRevenueAnalytics])

  const data =
    revenueAnalytics?.revenue || []

  const paidUsers =
    revenueAnalytics?.recentPaidUsers || []

  const totalRevenue =
    revenueAnalytics?.totalRevenue || 0

  const paidAnalytics =
    revenueAnalytics?.revenue || []

  const currentRevenue =
    paidAnalytics[
      paidAnalytics.length - 1
    ]?.revenue || 0

  const previousRevenue =
    paidAnalytics[
      paidAnalytics.length - 2
    ]?.revenue || 0

  const growth =
    previousRevenue > 0
      ? (
          ((currentRevenue - previousRevenue) /
            previousRevenue) *
          100
        ).toFixed(1)
      : "0"



return (
  <div
    style={{
      fontFamily: "'Syne', sans-serif",
      background: "white",
      border: "0.5px solid #e2e8f0",
      borderRadius: 10,
      overflow: "hidden",
    }}
  >
    {/* ── HEADER ── */}
    <div
      style={{
        padding: "20px 24px 18px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "#185fa5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Wallet size={17} color="#e6f1fb" />
        </div>
        <div>
          <p style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", lineHeight: 1.2 }}>
            Revenue Analytics
          </p>
          <p style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
            Monthly payment insights
          </p>
        </div>
      </div>
    </div>

    {/* ── STATS ── */}
    <div style={{ display: "flex", gap: 10, padding: "0 24px 20px" }}>
      <StatCard
        label="Total Revenue"
        value={`₱${totalRevenue.toLocaleString()}`}
        badge="↑ 12.4% this month"
        badgeColor="green"
        icon={Wallet}
      />
      <StatCard
        label="Paid Users"
        value={String(revenueAnalytics?.paidUsers || 0)}
        badge="Active payers"
        badgeColor="blue"
        icon={Users}
      />
      <StatCard
        label="Growth"
         value={`${Number(growth) > 0 ? "+" : ""}${growth}%`}
        badge="vs last month"
        badgeColor="green"
        icon={TrendingUp}
      />
    </div>

    <div style={{ height: "0.5px", background: "#f1f5f9" }} />

    {/* ── CHART + PAID USERS ROW ── */}
    <div
      style={{
        display: "flex",
        gap: 0,
        alignItems: "stretch",
      }}
    >
      {/* ── CHART ── */}
      <div
        style={{
          flex: 1.4,
          padding: "20px 24px 16px",
          borderRight: "0.5px solid #f1f5f9",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 500, color: "#94a3b8" }}>
            Revenue over time
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: "#185fa5",
                display: "inline-block",
              }}
            />
            Monthly revenue
          </div>
        </div>

        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#185fa5" stopOpacity={0.18} />
                  <stop offset="100%" stopColor="#185fa5" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#94a3b8",
                  fontFamily: "Syne",
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fontSize: 11,
                  fill: "#94a3b8",
                  fontFamily: "Syne",
                }}
                tickFormatter={(v) => `₱${v / 1000}k`}
                tickCount={5}
              />

              <Tooltip content={<CustomTooltip />} />

              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#185fa5"
                strokeWidth={2}
                fill="url(#revGrad)"
                dot={{
                  r: 4,
                  fill: "#185fa5",
                  strokeWidth: 2,
                  stroke: "#fff",
                }}
                activeDot={{
                  r: 6,
                  fill: "#185fa5",
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── PAID USERS ── */}
      <div
        style={{
          flex: 0.9,
          padding: "18px 24px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 14,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#0f172a",
              }}
            >
              Recent paid users
            </p>

            <p
              style={{
                fontSize: 12,
                color: "#94a3b8",
                marginTop: 2,
              }}
            >
              Payments this month
            </p>
          </div>

          <button
            style={{
              fontSize: 13,
              color: "#185fa5",
              fontWeight: 500,
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            See all <ArrowUpRight size={13} />
          </button>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {paidUsers.map((user, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                borderRadius: 10,
                cursor: "default",
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                "#f8fafc")
              }
              onMouseLeave={(e) =>
              ((e.currentTarget as HTMLDivElement).style.background =
                "transparent")
              }
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#e6f1fb",
                    color: "#185fa5",
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {initials(user.name)}
                </div>

                <div>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#0f172a",
                    }}
                  >
                    {user.name}
                  </p>

                  <p style={{ fontSize: 12, color: "#94a3b8" }}>
                    {user.room} • {user.bed}
                  </p>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 500,
                    color: "#0f6e56",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  ₱{user.amount.toLocaleString()}
                </p>

                <p
                  style={{
                    fontSize: 11,
                    color: "#94a3b8",
                    marginTop: 2,
                  }}
                >
                  Paid
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  </div>
)}

export default RevenueAnalytics