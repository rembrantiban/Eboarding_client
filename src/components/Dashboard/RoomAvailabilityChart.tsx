import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { TrendingUp } from "lucide-react";
import { useRoom } from "@/hooks/useRoom";
import { useEffect } from "react";

const AVAILABLE_COLOR = "#9ca3af"; // gray-400
const OCCUPIED_COLOR = "#111827"; // gray-900

type CustomTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: Array<{
    color?: string;
    value?: number;
    name?: string;
    dataKey?: string;
  }>;
};

function CustomTooltip({
  active,
  payload,
  label,
}: CustomTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-sm">
      <p className="text-[11px] font-medium text-gray-500">
        {label}
      </p>

      <div className="mt-1.5 space-y-1">
        {payload.map((entry) => (
          <div
            key={String(entry.dataKey)}
            className="flex items-center gap-1.5 text-[12px]"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />

            <span className="capitalize text-gray-500">
              {entry.name}
            </span>

            <span className="ml-auto font-semibold tabular-nums text-gray-900">
              {entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RoomBarChart() {
  const { roomAvailability, getRoomAvailabilityChart } = useRoom();

  useEffect(() => {
    getRoomAvailabilityChart();
  }, [getRoomAvailabilityChart]);


  const chartData = roomAvailability.map((item) => ({
  ...item,
  room: `Room ${item.room}`,
}));

  return (
    <div className="h-full w-full rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-slate-600">Room  Availability</h3>
          <p className="mt-0.5 text-[13px] text-gray-500">Availability by room</p>
        </div>

        <div className="flex shrink-0 items-center gap-3 pt-0.5 text-[12px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: AVAILABLE_COLOR }}
            />
            Available
          </span>
          <span className="flex items-center gap-1.5">
            <span
              className="h-2 w-2 rounded-sm"
              style={{ backgroundColor: OCCUPIED_COLOR }}
            />
            Occupied
          </span>
        </div>
      </div>

      <div style={{ width: "100%", height: 220 }} className="mt-4">
        <ResponsiveContainer>
          <BarChart
            data={chartData}
            barGap={4}
            margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="room"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "#f9fafb" }}
            />
            <Bar
              dataKey="available"
              name="Available Bed"
              fill={AVAILABLE_COLOR}
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
            <Bar
              dataKey="occupied"
              name="Occupied Bed"
              fill={OCCUPIED_COLOR}
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 flex items-center gap-1.5 text-[13px] font-medium text-gray-900">
        Trending up by 5.2% this month
        <TrendingUp className="h-4 w-4 text-gray-900" strokeWidth={2.25} />
      </div>
      <p className="mt-1 text-[13px] text-gray-500">
        Showing available vs occupied rooms
      </p>
    </div>
  );
}