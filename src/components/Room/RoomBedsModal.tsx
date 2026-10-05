"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BedDouble, CalendarDays, Mail, UserRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/api/api";
import type { Room } from "@/store/useRoomStore";

type BedOccupant = {
  id: number;
  user_id_no: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string | null;
  gender?: string | null;
  contact_number?: string | null;
  country_code?: string | null;
  assigned_date: string;
  expected_checkout?: string | null;
};

type RoomBed = {
  id: number;
  bed_number: string;
  status: "Available" | "Occupied";
  occupant: BedOccupant | null;
};

type Summary = {
  total: number;
  occupied: number;
  available: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  room: Room | null;
};

const formatDate = (date?: string | null) =>
  date
    ? new Date(date).toLocaleDateString("en-PH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

// Bed numbers may be stored as "1" or "Bed 1"
const bedLabel = (bedNumber: string) =>
  /^bed/i.test(bedNumber) ? bedNumber : `Bed ${bedNumber}`;

const RoomBedsModal = ({ open, onClose, room }: Props) => {
  const [beds, setBeds] = useState<RoomBed[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !room) return;

    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axiosInstance.get(`/rooms/${room.id}/beds`);
        if (cancelled) return;
        setBeds(res.data.beds);
        setSummary(res.data.summary);
      } catch (err: unknown) {
        if (cancelled) return;
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.message ?? "Failed to load beds"
            : "Failed to load beds"
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, [open, room]);

  if (!room) return null;

  const occupancy =
    summary && summary.total > 0
      ? Math.round((summary.occupied / summary.total) * 100)
      : 0;

  return (
    <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
      <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg">

        {/* HEADER */}
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-5 py-4 pr-12">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <BedDouble size={16} />
          </span>
          <div className="min-w-0">
            <DialogTitle className="text-base font-semibold text-slate-900">
              Room {room.room_number} · Beds
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              ₱{Number(room.price_per_month).toLocaleString("en-PH")}/mo · Capacity {room.capacity}
            </DialogDescription>
          </div>
        </div>

        {/* SUMMARY */}
        <div className="shrink-0 border-b border-slate-100 px-5 py-4">
          <div className="grid grid-cols-3 gap-2">
            <SummaryTile label="Total Beds" value={summary?.total} loading={loading} />
            <SummaryTile label="Occupied" value={summary?.occupied} loading={loading} />
            <SummaryTile
              label="Available"
              value={summary?.available}
              loading={loading}
              accent
            />
          </div>

          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[11px] text-slate-500">
              <span>Occupancy</span>
              <span className="tabular-nums">{loading ? "—" : `${occupancy}%`}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-900 transition-all"
                style={{ width: `${loading ? 0 : occupancy}%` }}
              />
            </div>
          </div>
        </div>

        {/* BED LIST */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {loading ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : error ? (
            <p className="py-8 text-center text-sm text-red-500">{error}</p>
          ) : beds.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <BedDouble size={26} className="text-slate-300" />
              <p className="mt-2 text-sm font-semibold text-slate-900">No beds in this room</p>
              <p className="mt-1 text-xs text-slate-400">Beds added to this room will appear here.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {beds.map((bed) => (
                <BedItem key={bed.id} bed={bed} />
              ))}
            </ul>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 justify-end border-t border-slate-100 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
          >
            Close
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default RoomBedsModal;

/* ================= SUMMARY TILE ================= */

const SummaryTile = ({
  label,
  value,
  loading,
  accent = false,
}: {
  label: string;
  value?: number;
  loading: boolean;
  accent?: boolean;
}) => (
  <div
    className={`rounded-xl px-3 py-2.5 ring-1 ${
      accent ? "bg-emerald-50 ring-emerald-100" : "bg-slate-50 ring-slate-100"
    }`}
  >
    <p className={`text-[11px] ${accent ? "text-emerald-700" : "text-slate-500"}`}>{label}</p>
    <p
      className={`mt-0.5 text-lg font-semibold tabular-nums ${
        accent ? "text-emerald-700" : "text-slate-900"
      }`}
    >
      {loading ? "—" : value ?? 0}
    </p>
  </div>
);

/* ================= BED ITEM ================= */

const BedItem = ({ bed }: { bed: RoomBed }) => {
  const occupant = bed.occupant;

  return (
    <li className="flex items-center gap-3 rounded-xl border border-slate-200/80 px-3 py-2.5">
      {/* Bed label */}
      <div className="w-16 shrink-0">
        <p className="text-[13px] font-semibold text-slate-900">{bedLabel(bed.bed_number)}</p>
        <span
          className={`mt-0.5 inline-flex rounded-full px-1.5 py-px text-[10px] font-semibold ${
            occupant
              ? "bg-slate-900 text-white"
              : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
          }`}
        >
          {occupant ? "Occupied" : "Available"}
        </span>
      </div>

      <div className="h-8 w-px shrink-0 bg-slate-100" />

      {/* Occupant */}
      {occupant ? (
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          {occupant.avatar_url ? (
            <img
              src={occupant.avatar_url}
              alt={`${occupant.first_name} ${occupant.last_name}`}
              className="h-8 w-8 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
            />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-semibold text-white">
              {occupant.first_name?.charAt(0)}
              {occupant.last_name?.charAt(0)}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <p className="truncate text-[12.5px] font-medium text-slate-900">
              {occupant.first_name} {occupant.last_name}
              <span className="ml-1.5 text-[11px] font-normal text-slate-400">
                #{occupant.user_id_no}
              </span>
            </p>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500">
              <span className="flex min-w-0 items-center gap-1">
                <Mail size={11} className="shrink-0 text-slate-400" />
                <span className="truncate">{occupant.email}</span>
              </span>
              <span className="flex items-center gap-1 whitespace-nowrap">
                <CalendarDays size={11} className="text-slate-400" />
                Since {formatDate(occupant.assigned_date)}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center gap-2 text-[12px] text-slate-400">
          <UserRound size={14} />
          No boarder assigned
        </div>
      )}
    </li>
  );
};
