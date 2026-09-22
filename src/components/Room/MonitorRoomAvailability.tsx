"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BedDouble,
  Building2,
  DoorOpen,
  Search,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRoom } from "@/hooks/useRoom";
import type { Room } from "@/store/useRoomStore";

const REFRESH_INTERVAL_MS = 15000;

const STATUS_DOT: Record<string, string> = {
  Available: "bg-emerald-500",
  Occupied: "bg-slate-900",
  "Under Maintenance": "bg-amber-500",
};

const STATUS_BADGE: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  Occupied: "bg-slate-900 text-white",
  "Under Maintenance": "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
};

const occupancyBarColor = (pct: number) => {
  if (pct >= 100) return "bg-rose-500";
  if (pct >= 70) return "bg-amber-500";
  return "bg-emerald-500";
};

const timeAgo = (seconds: number) => {
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const mins = Math.floor(seconds / 60);
  return `${mins}m ago`;
};

const MonitorRoomAvailability = () => {
  const { rooms, getRooms, dashboardStats, getDashboardStats, loading } =
    useRoom();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [nowTick, setNowTick] = useState(Date.now());

  useEffect(() => {
    const refresh = async () => {
      await Promise.all([getRooms(), getDashboardStats()]);
      setLastUpdated(new Date());
    };

    refresh();

    const poll = setInterval(refresh, REFRESH_INTERVAL_MS);
    const clock = setInterval(() => setNowTick(Date.now()), 1000);

    return () => {
      clearInterval(poll);
      clearInterval(clock);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchSearch = room.room_number
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchFilter = filter === "All" || room.status === filter;
      return matchSearch && matchFilter;
    });
  }, [rooms, search, filter]);

  const maintenanceCount = useMemo(
    () => rooms.filter((r) => r.status === "Under Maintenance").length,
    [rooms]
  );

  const statCards = [
    {
      label: "Total Rooms",
      value: dashboardStats.totalRooms,
      sub: "Across the property",
      icon: Building2,
      gradient: "from-slate-900 to-slate-700",
    },
    {
      label: "Available Beds",
      value: dashboardStats.availableBeds,
      sub: "Ready for assignment",
      icon: DoorOpen,
      gradient: "from-emerald-600 to-emerald-500",
    },
    {
      label: "Occupied Beds",
      value: dashboardStats.occupiedBeds,
      sub: "Currently in use",
      icon: Users,
      gradient: "from-blue-600 to-blue-500",
    },
    {
      label: "Fully Occupied",
      value: dashboardStats.fullyOccupied,
      sub: `${maintenanceCount} under maintenance`,
      icon: BedDouble,
      gradient: "from-amber-500 to-amber-400",
    },
  ];

  const secondsSinceUpdate = Math.max(
    0,
    Math.floor((nowTick - lastUpdated.getTime()) / 1000)
  );

  return (
    <div className="space-y-5 py-10">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800 p-5 text-white shadow-lg shadow-slate-900/10 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15">
            <Activity className="h-5 w-5 text-white" />
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold tracking-tight">
                Monitor Room Availability
              </h2>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-emerald-300 ring-1 ring-emerald-400/30">
                Live
              </span>
            </div>
            <p className="mt-1 text-[11.5px] text-slate-300">
              Real-time occupancy across every room &middot; updated{" "}
              {timeAgo(secondsSinceUpdate)}
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-linear-to-br ${s.gradient} opacity-10 transition-transform group-hover:scale-110`}
              />
              <div
                className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br ${s.gradient} shadow-sm`}
              >
                <Icon className="h-4 w-4 text-white" />
              </div>
              <p className="text-[11px] font-medium text-slate-400">
                {s.label}
              </p>
              <p className="mt-0.5 text-xl font-bold tabular-nums text-slate-900">
                {s.value}
              </p>
              <p className="mt-0.5 text-[10.5px] text-slate-400">{s.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Table card */}
      <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-[13.5px] font-semibold text-slate-900">
              Live Room Status
            </h3>
            <p className="text-[11px] text-slate-400">
              {filteredRooms.length} of {rooms.length} rooms
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search room..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 w-full rounded-lg border-slate-200 pl-8 text-[12.5px] shadow-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 sm:w-48"
              />
            </div>

            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="h-9 w-full rounded-lg border-slate-200 text-[12.5px] font-medium text-slate-700 shadow-none focus:ring-1 focus:ring-slate-900 sm:w-40">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All" className="text-[12.5px]">
                  All status
                </SelectItem>
                <SelectItem value="Available" className="text-[12.5px]">
                  Available
                </SelectItem>
                <SelectItem value="Occupied" className="text-[12.5px]">
                  Occupied
                </SelectItem>
                <SelectItem
                  value="Under Maintenance"
                  className="text-[12.5px]"
                >
                  Under Maintenance
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200/80">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-200/80 bg-slate-50/70">
                <tr className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">
                    Room
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">
                    Occupancy
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">
                    Capacity
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">
                    Price / Month
                  </th>
                  <th className="whitespace-nowrap px-4 py-2.5 text-left">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading && rooms.length === 0 ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-4 py-3" colSpan={5}>
                        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                      </td>
                    </tr>
                  ))
                ) : filteredRooms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-14 text-center">
                      <p className="text-[13px] font-semibold text-slate-900">
                        No rooms found
                      </p>
                      <p className="mt-1 text-[11.5px] text-slate-400">
                        Try adjusting your search or filter.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredRooms.map((room: Room) => {
                    const total = room.total_beds ?? 0;
                    const occupied = room.occupied_beds ?? 0;
                    const pct = total > 0 ? Math.round((occupied / total) * 100) : 0;

                    return (
                      <tr
                        key={room.id}
                        className="transition-colors hover:bg-slate-50/70"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`h-2 w-2 shrink-0 rounded-full ${
                                STATUS_DOT[room.status] ?? "bg-slate-300"
                              }`}
                            />
                            <span className="text-[12.5px] font-medium text-slate-900">
                              Room {room.room_number}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full transition-all ${occupancyBarColor(
                                  pct
                                )}`}
                                style={{ width: `${Math.min(pct, 100)}%` }}
                              />
                            </div>
                            <span className="text-[11px] tabular-nums text-slate-500">
                              {occupied}/{total}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                            <Users size={13} className="text-slate-400" />
                            <span className="tabular-nums">
                              {room.capacity}
                            </span>
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-[12.5px] font-semibold tabular-nums text-slate-900">
                          ₱{Number(room.price_per_month).toLocaleString("en-PH")}
                          <span className="ml-0.5 text-[10.5px] font-normal text-slate-400">
                            /mo
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${
                              STATUS_BADGE[room.status] ??
                              "bg-rose-50 text-rose-700 ring-1 ring-rose-100"
                            }`}
                          >
                            {room.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitorRoomAvailability;
