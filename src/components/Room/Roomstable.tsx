"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import RoomRow from "./RoomRow";
import { Search, Plus, RotateCcw, DoorOpen, PackageOpen } from "lucide-react";
import AddRoomModal from "../modal/AddRoomModal";
import { useRoom } from "@/hooks/useRoom";
import ViewRoomModal from "../modal/ViewRoomModal";
import type { Room } from "@/store/useRoomStore";
import UpdateRoomModal from "../modal/UpdateRoomModal";
import DeleteRoomModal from "../modal/DeleteRoomModal";
import UpdateRoomStatusModal, {
  type RoomStatus,
} from "./UpdateRoomStatusModal";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RoomsTable = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  const { deleteRoom, updateRoomStatus } = useRoom();

  const { rooms, getRooms, loading } = useRoom();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [statusOpen, setStatusOpen] = useState(false);
  const [roomToUpdate, setRoomToUpdate] = useState<Room | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  // ✅ FILTER LOGIC
  const filteredRooms = rooms.filter((room) => {
    const matchSearch =
      room.room_number.toLowerCase().includes(search.toLowerCase()) ||
      room.price_per_month.toString().includes(search);
    const matchFilter = filter === "All" || room.status === filter;

    return matchSearch && matchFilter;
  });

  const handleReset = () => {
    setSearch("");
    setFilter("All");
  };

  const handleStatusConfirm = async (status: RoomStatus) => {
    if (!roomToUpdate) return;

    const toastId = toast.loading("Updating status...");
    try {
      setIsUpdatingStatus(true);

      await updateRoomStatus(roomToUpdate.id, status);
      await getRooms();

      toast.success(`Room ${roomToUpdate.room_number} is now ${status}`, {
        id: toastId,
      });

      setStatusOpen(false);
      setRoomToUpdate(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed", {
        id: toastId,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const isFiltered = search !== "" || filter !== "All";

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      {/* 🔷 Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
            <DoorOpen className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold leading-tight text-slate-900">
              Rooms
            </h2>
            <p className="text-[11px] leading-tight text-slate-400">
              {filteredRooms.length} of {rooms.length} rooms
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border-slate-200 pl-8 text-[12.5px] shadow-none placeholder:text-slate-400 focus-visible:ring-1 focus-visible:ring-slate-900 sm:w-52"
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
              <SelectItem value="Under Maintenance" className="text-[12.5px]">
                Under Maintenance
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            {/* ✅ FIXED RESET BUTTON */}
            <button
              type="button"
              onClick={handleReset}
              disabled={!isFiltered}
              title="Reset filters"
              className="flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[12.5px] font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>

            <button
              type="button"
              onClick={() => setAddRoomOpen(true)}
              className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3.5 text-[12.5px] font-medium text-white transition-colors hover:bg-slate-800 sm:flex-none"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Room
            </button>
          </div>
        </div>
      </div>

      {/* 🔷 Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200/80 bg-slate-50/70">
              <tr className="text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="whitespace-nowrap px-4 py-2.5 text-left">Room</th>
                <th className="whitespace-nowrap px-4 py-2.5 text-left">Capacity</th>
                <th className="whitespace-nowrap px-4 py-2.5 text-left">Beds</th>
                <th className="whitespace-nowrap px-4 py-2.5 text-left">
                  Price / Month
                </th>
                <th className="whitespace-nowrap px-4 py-2.5 text-left">Status</th>
                <th className="whitespace-nowrap px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 animate-pulse rounded-lg bg-slate-100" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                          <div className="h-2.5 w-12 animate-pulse rounded bg-slate-100" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-3 w-10 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-5 w-12 animate-pulse rounded-full bg-slate-100" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-3 w-16 animate-pulse rounded bg-slate-100" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="h-5 w-20 animate-pulse rounded-full bg-slate-100" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="ml-auto h-7 w-7 animate-pulse rounded-lg bg-slate-100" />
                    </td>
                  </tr>
                ))
              ) : filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14">
                    <div className="flex flex-col items-center text-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                        <PackageOpen className="h-5 w-5 text-slate-400" />
                      </div>
                      <p className="mt-3 text-[13px] font-semibold text-slate-900">
                        No rooms found
                      </p>
                      <p className="mt-1 text-[11.5px] text-slate-400">
                        {isFiltered
                          ? "Try adjusting your search or filter."
                          : "Add your first room to get started."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <RoomRow
                    key={room.id}
                    room={{
                      ...room,
                      status: room.status as
                        | "Available"
                        | "Occupied"
                        | "Under Maintenance",
                    }}
                    onView={(r) => {
                      setSelectedRoom(r);
                      setViewOpen(true);
                    }}
                    onEdit={(r) => {
                      setSelectedRoom(r);
                      setEditOpen(true);
                    }}
                    onChangeStatus={(r) => {
                      setRoomToUpdate(r);
                      setStatusOpen(true);
                    }}
                    onDelete={(room) => {
                      setRoomToDelete(room);
                      setDeleteOpen(true);
                    }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ MODAL */}
      <AddRoomModal open={addRoomOpen} onClose={() => setAddRoomOpen(false)} />
      <ViewRoomModal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        room={selectedRoom}
      />
      <UpdateRoomModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        room={selectedRoom}
      />

      <UpdateRoomStatusModal
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false);
          setRoomToUpdate(null);
        }}
        room={roomToUpdate}
        loading={isUpdatingStatus}
        onConfirm={handleStatusConfirm}
      />

      <DeleteRoomModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        roomName={roomToDelete?.room_number} // ✅ USES IT
        loading={isDeleting}
        onConfirm={async () => {
          if (!roomToDelete) return;

          const toastId = toast.loading("Deleting room...");
          try {
            setIsDeleting(true);

            await deleteRoom(roomToDelete.id);

            toast.success("Room deleted 🗑️", { id: toastId });

            setDeleteOpen(false);
            setRoomToDelete(null);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Delete failed", {
              id: toastId,
            });
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </div>
  );
};

export default RoomsTable;