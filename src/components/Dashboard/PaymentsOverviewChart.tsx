import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { useBilling } from "@/hooks/useBilling";

type ChartPoint = {
  date: string;
  value: number;
};

const LINE_COLOR = "#121111"; // indigo-700

function formatAxisCurrency(v: number) {
  return `₱${(v / 1000).toFixed(0)}K`;
}

function formatCurrency(v: number) {
  return `₱${v.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;
}

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
  }>;
  label?: string;
};

function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg shadow-slate-900/10">
      <p className="text-[10px] uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold">
        {formatCurrency(Number(payload[0].value))}
      </p>
    </div>
  );
}

export default function PaymentsOverviewChart() {
  const { paymentsOverview, getPaymentsOverview } = useBilling();

  useEffect(() => {
    getPaymentsOverview();
    // eslint-disable-next-line
  }, []);

  const chartData: ChartPoint[] = useMemo(
    () =>
      paymentsOverview.map((item) => ({
        ...item,
        value: Number(item.value),
      })),
    [paymentsOverview]
  );

  const totalPayments = useMemo(
    () =>
      chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );
  const prevValue = chartData.length > 1 ? chartData[chartData.length - 2] : null;

  const change =
    totalPayments && prevValue && prevValue.value !== 0
      ? ((totalPayments - prevValue.value) / prevValue.value) * 100
      : null;

  const Trend = change === null || change === 0 ? Minus : change > 0 ? TrendingUp : TrendingDown;
  const trendColor =
    change === null || change === 0
      ? "text-slate-400 bg-slate-50"
      : change > 0
        ? "text-emerald-600 bg-emerald-50"
        : "text-red-600 bg-red-50";

  return (
    <div className="w-full rounded-md border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
            Payments overview (This Month)
          </p>
          <p className="mt-1.5 text-2xl font-bold tabular-nums text-slate-900">
            {formatCurrency(totalPayments)}
          </p>
          <p className="mt-0.5 text-xs text-slate-400">This month</p>
        </div>

        {change !== null && (
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold tabular-nums ${trendColor}`}
          >
            <Trend size={12} strokeWidth={2.5} />
            {Math.abs(change).toFixed(1)}%
          </span>
        )}
      </div>

      {/* Chart */}
      {!chartData.length ? (
        <div className="mt-6 flex h-55 items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-400">
          No payment data available.
        </div>
      ) : (
        <div className="mt-4" style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="paymentsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={LINE_COLOR} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={LINE_COLOR} stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid vertical={false} stroke="#f1f5f9" />

              <XAxis
                dataKey="date"
                interval={0}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                width={44}
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={formatAxisCurrency}
                domain={[0, "dataMax + 5000"]}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#cbd5e1", strokeWidth: 1, strokeDasharray: "4 4" }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke={LINE_COLOR}
                strokeWidth={2.5}
                fill="url(#paymentsFill)"
                dot={{ r: 3, fill: LINE_COLOR, stroke: "#fff", strokeWidth: 1.5 }}
                activeDot={{ r: 5, fill: LINE_COLOR, stroke: "#fff", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}