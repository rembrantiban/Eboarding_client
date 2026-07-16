import { PieChart, Pie, Cell, Tooltip } from "recharts";

const data = [
  { name: "Occupied", value: 42, color: "#475569" },
  { name: "Available", value: 18, color: "#cbd5e1" },
];

const total = data.reduce((sum, d) => sum + d.value, 0);

function formatRooms(v) {
  return `${v} rooms`;
}

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  const pct = ((item.value / total) * 100).toFixed(0);

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-[11px] font-medium text-slate-500">{item.name}</p>
      <p className="text-[13px] font-semibold text-slate-900">
        {formatRooms(item.value)}{" "}
        <span className="font-normal text-slate-400">({pct}%)</span>
      </p>
    </div>
  );
}

export default function RoomOccupancyChart() {
  return (
    <div className="w-full max-w-md ite rounded border border-slate-200 bg-white p-6">
      <h3 className="mb-4 text-[15px] font-semibold text-slate-900">
        Occupancy Status {" "}
        <span className="font-normal text-slate-400">(Today)</span>
      </h3>

      <div className="flex items-center gap-6">
        <div className="relative" style={{ width: 180, height: 180, flexShrink: 0 }}>
          <PieChart width={180} height={180}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={58}
              outerRadius={82}
              paddingAngle={3}
              stroke="#fff"
              strokeWidth={2}
              labelLine={false}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[11px] font-medium text-slate-400">Total rooms</span>
            <span className="text-[20px] font-bold text-slate-900">{total}</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3">
          {data.map((entry) => {
            const pct = ((entry.value / total) * 100).toFixed(0);
            return (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-[13px] text-slate-600">{entry.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-slate-900">
                    {entry.value}
                  </span>
                  <span className="text-[11px] text-slate-400">{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}