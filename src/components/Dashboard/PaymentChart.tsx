import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

type PaymentData = {
  name: string;
  current: number;
  previous: number;
  count: number;
  prevCount: number;
};

const COLOR_MAP: Record<string, { current: string; previous: string }> = {
  Paid:    { current: "#3b82f6", previous: "#dbeafe" },
  Pending: { current: "#f59e0b", previous: "#fef3c7" },
  Overdue: { current: "#ef4444", previous: "#fee2e2" },
};

const BORDER_MAP: Record<string, string> = {
  Paid:    "#bfdbfe",
  Pending: "#fde68a",
  Overdue: "#fecaca",
};

function pctChange(curr: number, prev: number): number {
  if (prev === 0) return 0;
  return Math.round(((curr - prev) / prev) * 1000) / 10;
}

type TooltipPayloadItem = {
  dataKey: "current" | "previous";
  value: number;
  payload: PaymentData;
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const curr =
    payload.find((p) => p.dataKey === "current")?.value ?? 0;

  const prev =
    payload.find((p) => p.dataKey === "previous")?.value ?? 0;

  const pct = pctChange(curr, prev);
  const isUp = pct > 0;

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "10px 14px",
        minWidth: 160,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        fontSize: 12,
      }}
    >
      <p style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
        {label}
      </p>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>This month</span>
        <span>₱{curr.toLocaleString()}</span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>Last month</span>
        <span>₱{prev.toLocaleString()}</span>
      </div>

      <div
        style={{
          marginTop: 6,
          fontWeight: 700,
          color: isUp ? "#22c55e" : "#ef4444",
        }}
      >
        {isUp ? "↑" : "↓"} {Math.abs(pct)}%
      </div>
    </div>
  );
};

function StatPill({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "10px 12px",
      }}
    >
      <p style={{ color: "#94a3b8", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", marginBottom: 4 }}>
        {label}
      </p>
      <p style={{ color: "#0f172a", fontSize: 17, fontWeight: 700, lineHeight: 1 }}>{value}</p>
      <p style={{ color: "#cbd5e1", fontSize: 10, marginTop: 3 }}>{sub}</p>
    </div>
  );
}

function ChangeChip({ name, pct, label }: { name: string; pct: number; label: string }) {
  const isUp = pct > 0;
  const color =
    label === "Paid"
      ? isUp ? "#22c55e" : "#ef4444"
      : label === "Pending"
      ? "#f59e0b"
      : isUp ? "#ef4444" : "#22c55e";

  return (
    <div
      style={{
        flex: 1,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 10,
        padding: "8px 10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 600 }}>{name}</span>
      <span style={{ color, fontSize: 11, fontWeight: 800 }}>
        {isUp ? "↑" : "↓"} {Math.abs(pct)}%
      </span>
    </div>
  );
}

const PaymentChart = ({ data }: { data: PaymentData[] }) => {
  const totalCurrent  = data.reduce((s, d) => s + d.current, 0);
  const totalTenants  = data.reduce((s, d) => s + d.count, 0);

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 12,
        padding: "20px 22px 16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <p
            style={{
              color: "#93c5fd",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
              marginBottom: 3,
            }}
          >
            ANALYTICS
          </p>
          <h3
            style={{
              color: "#0f172a",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              margin: 0,
            }}
          >
            Payment Overview
          </h3>
          <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 2 }}>
            Current vs previous month
          </p>
        </div>

        <button
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#3b82f6",
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 8,
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          View Report →
        </button>
      </div>

      {/* ── Stat pills ── */}
      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <StatPill
          label="COLLECTED"
          value={`₱${(totalCurrent / 1000).toFixed(0)}k`}
          sub={`${totalTenants} tenants`}
        />
        {data.map((d) => (
          <StatPill
            key={d.name}
            label={d.name.toUpperCase()}
            value={`₱${(d.current / 1000).toFixed(0)}k`}
            sub={`${d.count} tenants`}
          />
        ))}
      </div>

      {/* ── Legend ── */}
      <div style={{ display: "flex", gap: 14, marginBottom: 8 }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            color: "#94a3b8",
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 2,
              background: "#3b82f6",
              display: "inline-block",
            }}
          />
          This month
        </span>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11,
            color: "#94a3b8",
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 2,
              background: "#dbeafe",
              border: "1px solid #bfdbfe",
              display: "inline-block",
            }}
          />
          Previous month
        </span>
      </div>

      {/* ── Chart ── */}
      <div style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barSize={28}
            barGap={4}
            margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="#f1f5f9"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#94a3b8" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#cbd5e1" }}
              tickFormatter={(v) => `₱${v / 1000}k`}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "rgba(241,245,249,0.7)", radius: 6 }}
            />

            {/* Current month bars */}
            <Bar dataKey="current" radius={[6, 6, 0, 0]} name="This month">
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLOR_MAP[entry.name]?.current ?? "#3b82f6"}
                />
              ))}
            </Bar>

            {/* Previous month bars */}
            <Bar dataKey="previous" radius={[6, 6, 0, 0]} name="Previous month">
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={COLOR_MAP[entry.name]?.previous ?? "#dbeafe"}
                  stroke={BORDER_MAP[entry.name] ?? "#bfdbfe"}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Change chips ── */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 14,
          paddingTop: 14,
          borderTop: "1px solid #f1f5f9",
        }}
      >
        {data.map((d) => (
          <ChangeChip
            key={d.name}
            name={d.name}
            label={d.name}
            pct={pctChange(d.current, d.previous)}
          />
        ))}
      </div>
    </div>
  );
};

export default PaymentChart;