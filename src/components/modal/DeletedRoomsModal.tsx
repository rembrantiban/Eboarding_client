"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, RotateCcw, BedDouble, Inbox } from "lucide-react";
import { useRoom } from "@/hooks/useRoom";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onClose: () => void;
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
      <DialogContent className="max-h-[80vh] gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl sm:max-w-md">
        <DialogHeader className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900">
              <Trash2 className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-[13.5px] font-semibold text-slate-900">
                Deleted Rooms
              </DialogTitle>
              <p className="text-[11px] leading-tight text-slate-400">
                Restore a room to bring it back online.
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-3 py-2">
          {deletedRoomsLoading ? (
            <div className="space-y-2 p-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          ) : deletedRooms.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                <Inbox className="h-4.5 w-4.5 text-slate-400" />
              </div>
              <p className="mt-3 text-[12.5px] font-medium text-slate-900">
                Trash is empty
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Deleted rooms will show up here.
              </p>
            </div>
          ) : (
            <ul className="space-y-1.5 py-1">
              {deletedRooms.map((room) => (
                <li
                  key={room.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5 transition hover:bg-slate-50"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                    <BedDouble className="h-4 w-4 text-slate-400" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-semibold text-slate-900">
                      {room.room_number}
                    </p>
                    <p className="truncate text-[10.5px] text-slate-400">
                      {room.total_beds} bed{room.total_beds === 1 ? "" : "s"} ·{" "}
                      {peso(room.price_per_month)}/mo · Deleted{" "}
                      {formatDate(room.deleted_at)}
                      {room.deleted_by_name ? ` by ${room.deleted_by_name}` : ""}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRestore(room.id, room.room_number)}
                    className="flex h-7 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-[11px] font-medium text-slate-700 transition hover:bg-slate-900 hover:text-white"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Restore
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeletedRoomsModal;
