import {
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { DoorOpen, TrendingUp } from "lucide-react";

const data = [
  { room: "Room 101", available: 14, occupied: 6 },
  { room: "Room 102", available: 22, occupied: 12 },
  { room: "Room 103", available: 18, occupied: 9 },
  { room: "Room 104", available: 8, occupied: 13 },
];

export default function RoomBarChart() {
  return (
    <div className="w-full max-w-md rounded border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-sm font-medium text-slate-600">
        Room availability
      </h3>
      <p className="mt-0.5 text-[13px] text-gray-500">Availability by room</p>

      <div style={{ width: "100%", height: 220 }} className="mt-4">
        <ResponsiveContainer>
          <BarChart data={data} barGap={4} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#f3f4f6" />
            <XAxis
              dataKey="room"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />
            <Bar dataKey="available" fill="#9ca3af" radius={[6, 6, 0, 0]} barSize={28} />
            <Bar dataKey="occupied" fill="#111827" radius={[6, 6, 0, 0]} barSize={28} />
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