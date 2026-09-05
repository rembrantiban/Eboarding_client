import "@fontsource/crimson-pro/400.css"
import "@fontsource/crimson-pro/600.css"
import "@fontsource/dm-sans/400.css"
import "@fontsource/dm-sans/500.css"

type PaymentData = {
  name: string
  current: number
  previous: number
  count: number
  prevCount: number
}

type OccupancyTrendItem = {
  month: string
  occupied: number
}

type RecentPaidUser = {
  name: string
  room: string
  bed: string
  amount: number
}

type Props = {
  totalBoarders: number
  dashboardStats: {
    totalRooms: number
    fullyOccupied: number
    occupiedBeds: number
    availableBeds: number
  }
  analytics: PaymentData[]
  recentPaidUsers: RecentPaidUser[]
  occupancyTrend: OccupancyTrendItem[]
}

const DashboardPrints = ({
  totalBoarders,
  dashboardStats,
  analytics,
  occupancyTrend,
  recentPaidUsers,
}: Props) => {
  const today = new Date().toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        padding: "2.5rem 3rem",
        maxWidth: 860,
        margin: "0 auto",
        background: "#fff",
        color: "#111",
        minHeight: "100vh",
      }}
    >
      {/* ── DOCUMENT HEADER ── */}
      <div
        style={{
          borderBottom: "2px solid #111",
          paddingBottom: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <h1
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: 30,
            fontWeight: 600,
            margin: "0 0 6px",
          }}
        >
          E-Boarding Dashboard Report
        </h1>
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            fontSize: 12,
            color: "#888",
          }}
        >
          <span>Generated: {today}</span>
          <span>Prepared by: E-Boarding System</span>
          <span>Saint Francis College Guihulngan Negros Inc.</span>
        </div>
      </div>

      {/* ── SECTION LABEL ── */}
      <p
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#888",
          margin: "0 0 10px",
        }}
      >
        Summary Statistics
      </p>

      {/* ── STAT ROW ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          border: "0.5px solid #ccc",
          marginBottom: "2rem",
        }}
      >
        {[
          { label: "Total Boarders", value: totalBoarders },
          { label: "Total Rooms", value: dashboardStats.totalRooms },
          { label: "Occupied Beds", value: dashboardStats.occupiedBeds },
          { label: "Available Beds", value: dashboardStats.availableBeds },
        ].map((stat, i, arr) => (
          <div
            key={stat.label}
            style={{
              padding: "14px 16px",
              borderRight:
                i < arr.length - 1 ? "0.5px solid #ccc" : "none",
            }}
          >
            <p style={{ fontSize: 11, color: "#888", margin: "0 0 4px" }}>
              {stat.label}
            </p>
            <p
              style={{
                fontFamily: "'Crimson Pro', serif",
                fontSize: 26,
                fontWeight: 600,
                margin: 0,
              }}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* ── OCCUPANCY TREND ── */}
      <Section title="Occupancy Trend">
        <DocTable
          headers={["Month", "Occupied Beds"]}
          rows={occupancyTrend.map((item) => [item.month, item.occupied])}
          alignRight={[1]}
        />
      </Section>

      {/* ── PAYMENT ANALYTICS ── */}
      <Section title="Payment Analytics">
        <DocTable
          headers={["Status", "Current", "Previous", "Tenants"]}
          rows={analytics.map((item) => [
            item.name,
            `₱${item.current.toLocaleString()}`,
            `₱${item.previous.toLocaleString()}`,
            item.count,
          ])}
          alignRight={[1, 2, 3]}
        />
      </Section>

      {/* ── RECENT PAID USERS ── */}
      <Section title="Recent Paid Users">
        <DocTable
          headers={["Name", "Room", "Bed", "Amount Paid"]}
          rows={recentPaidUsers.map((user) => [
            user.name,
            user.room,
            user.bed,
            `₱${user.amount.toLocaleString()}`,
          ])}
          alignRight={[3]}
        />
      </Section>

      {/* ── FOOTER ── */}
      <div
        style={{
          borderTop: "0.5px solid #ccc",
          paddingTop: 10,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          color: "#aaa",
          marginTop: "2rem",
        }}
      >
        <span>
          E-Boarding House — A COMPUTERIZED BOARDING HOUSE MANAGEMENT SYSTEM FOR ERMINGS
        </span>
        <span>Page 1 of 1</span>
      </div>
    </div>
  )
}

/* ── HELPERS ── */

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div style={{ marginBottom: "2rem" }}>
    <p
      style={{
        fontFamily: "'Crimson Pro', serif",
        fontSize: 17,
        fontWeight: 600,
        margin: "0 0 10px",
        paddingBottom: 6,
        borderBottom: "0.5px solid #ccc",
      }}
    >
      {title}
    </p>
    {children}
  </div>
)

const DocTable = ({
  headers,
  rows,
  alignRight = [],
}: {
  headers: string[]
  rows: (string | number)[][]
  alignRight?: number[]
}) => (
  <table
    style={{
      width: "100%",
      borderCollapse: "collapse",
      fontSize: 13,
    }}
  >
    <thead>
      <tr style={{ background: "#f5f5f5" }}>
        {headers.map((h, i) => (
          <th
            key={h}
            style={{
              textAlign: alignRight.includes(i) ? "right" : "left",
              padding: "8px 12px",
              fontWeight: 500,
              fontSize: 11,
              letterSpacing: "0.05em",
              color: "#666",
              borderBottom: "0.5px solid #ccc",
            }}
          >
            {h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, ri) => (
        <tr key={ri}>
          {row.map((cell, ci) => (
            <td
              key={ci}
              style={{
                textAlign: alignRight.includes(ci) ? "right" : "left",
                padding: "8px 12px",
                borderBottom:
                  ri < rows.length - 1
                    ? "0.5px solid #eee"
                    : "none",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {cell}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)

export default DashboardPrints