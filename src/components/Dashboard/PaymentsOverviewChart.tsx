import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "May 1", value: 18000 },
  { date: "May 3", value: 42000 },
  { date: "May 5", value: 58000 },
  { date: "May 6", value: 68000 },
  { date: "May 7", value: 64000 },
  { date: "May 8", value: 78000 },
  { date: "May 9", value: 86000 },
  { date: "May 10", value: 92000 },
  { date: "May 11", value: 98000 },
  { date: "May 12", value: 100000 },
  { date: "May 13", value: 104000 },
  { date: "May 14", value: 108000 },
  { date: "May 15", value: 116000 },
  { date: "May 16", value: 128450 },
];

const lastValue = data[data.length - 1];

function formatCurrency(v) {
  return `\u20B1${(v / 1000).toFixed(0)}K`;
}

function ChartDot({ cx, cy, index }) {
  const isLast = index === data.length - 1;

  if (!isLast) {
    return <circle cx={cx} cy={cy} r={3.5} fill="#475569" stroke="#fff" strokeWidth={1.5} />;
  }

  const label = `\u20B1${lastValue.value.toLocaleString()}`;
  const labelWidth = label.length * 7 + 20;

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill="#475569" stroke="#fff" strokeWidth={2} />
      <g transform={`translate(${cx - labelWidth / 2}, ${cy - 38})`}>
        <rect width={labelWidth} height={24} rx={12} fill="#475569" />
        <polygon
          points={`${labelWidth / 2 - 5},24 ${labelWidth / 2 + 5},24 ${labelWidth / 2},31`}
          fill="#475569"
        />
        <text
          x={labelWidth / 2}
          y={16}
          textAnchor="middle"
          fill="#fff"
          fontSize={12}
          fontWeight={600}
        >
          {label}
        </text>
      </g>
    </g>
  );
}

export default function PaymentsOverviewChart() {
  return (
    <div className="w-full max-w-md rounded border border-slate-200 bg-white p-6 ">
      <h3 className="mb-4 text-[15px] font-semibold text-slate-900">
        Payments overview{" "}
        <span className="font-normal text-slate-400">(This month)</span>
      </h3>

      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 24, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="paymentsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#64748b" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#f1f5f9" />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              ticks={["May 1", "May 6", "May 11", "May 16"]}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={formatCurrency}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              width={48}
              domain={[0, 160000]}
              ticks={[0, 20000, 40000, 60000, 80000, 100000, 120000, 140000, 160000]}
            />

            <Area
              type="monotone"
              dataKey="value"
              stroke="#475569"
              strokeWidth={2.5}
              fill="url(#paymentsFill)"
              dot={<ChartDot />}
              activeDot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}