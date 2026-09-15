"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, RotateCcw, BedDouble, Inbox, Users, CalendarClock } from "lucide-react";
import { useRoom } from "@/hooks/useRoom";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
};

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  Occupied: "bg-slate-900 text-white",
  "Under Maintenance": "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
};

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

const peso = (value: number) =>
  `₱${Number(value).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

const DeletedRoomsModal = ({ open, onClose }: Props) => {
  const { deletedRooms, deletedRoomsLoading, getDeletedRooms, restoreRoom } =
    useRoom();

  useEffect(() => {
    if (open) getDeletedRooms();
  }, [open, getDeletedRooms]);

  const handleRestore = async (id: number, roomNumber: string) => {
    const toastId = toast.loading(`Restoring ${roomNumber}...`);
    try {
      await restoreRoom(id);
      toast.success(`${roomNumber} restored`, { id: toastId });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Restore failed", {
        id: toastId,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="flex max-h-[85vh] w-full max-w-4xl! flex-col gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl">
        <DialogHeader className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900">
              <Trash2 className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <DialogTitle className="text-[14px] font-semibold text-slate-900">
                  Deleted Rooms
                </DialogTitle>
                {deletedRooms.length > 0 && (
                  <span className="inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-slate-100 px-1.5 text-[10px] font-semibold tabular-nums text-slate-600">
                    {deletedRooms.length}
                  </span>
                )}
              </div>
              <p className="text-[11.5px] leading-tight text-slate-400">
                Restore a room to bring it back online — nothing is lost.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto">
          {deletedRoomsLoading ? (
            <div className="space-y-2 p-5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : deletedRooms.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                <Inbox className="h-5 w-5 text-slate-400" />
              </div>
              <p className="mt-3 text-[13px] font-medium text-slate-900">
                Trash is empty
              </p>
              <p className="mt-1 text-[11.5px] text-slate-400">
                Deleted rooms will show up here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="sticky top-0 border-b border-slate-200/80 bg-slate-50/70">
                  <tr className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="whitespace-nowrap px-6 py-2.5 text-left">Room</th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Capacity</th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Beds</th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-left">
                      Price / Month
                    </th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Status</th>
                    <th className="whitespace-nowrap px-4 py-2.5 text-left">Deleted</th>
                    <th className="whitespace-nowrap px-6 py-2.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {deletedRooms.map((room) => {
                    const statusClass =
                      STATUS_STYLES[room.status] ??
                      "bg-rose-50 text-rose-700 ring-1 ring-rose-100";

                    return (
                      <tr key={room.id} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200">
                              <BedDouble className="h-3.5 w-3.5 text-slate-400" />
                            </div>
                            <p className="truncate text-[12.5px] font-medium text-slate-900">
                              Room {room.room_number}
                            </p>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                            <Users size={13} className="text-slate-400" />
                            <span className="tabular-nums">{room.capacity}</span>
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
                            <BedDouble size={12} className="text-slate-400" />
                            <span className="tabular-nums">{room.total_beds}</span>
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-[12.5px] font-semibold tabular-nums text-slate-900">
                          {peso(room.price_per_month)}
                          <span className="ml-0.5 text-[10.5px] font-normal text-slate-400">
                            /mo
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${statusClass}`}
                          >
                            {room.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
                            <CalendarClock size={12} className="shrink-0 text-slate-400" />
                            <div className="leading-tight">
                              <div>{formatDate(room.deleted_at)}</div>
                              {room.deleted_by_name && (
                                <div className="text-[10.5px] text-slate-400">
                                  by {room.deleted_by_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRestore(room.id, room.room_number)}
                            className="inline-flex h-7 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 transition hover:bg-slate-900 hover:text-white"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Restore
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletedRoomsModal;
