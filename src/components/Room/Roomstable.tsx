"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import RoomRow from "./RoomRow";
import { Button } from "../ui/button";
import { ArrowUpDown, Plus, RotateCcw } from "lucide-react";
import AddRoomModal from "../modal/AddRoomModal";
import { useRoom } from "@/hooks/useRoom";
import ViewRoomModal from "../modal/ViewRoomModal";
import type { Room } from "@/store/useRoomStore"
import UpdateRoomModal from "../modal/UpdateRoomModal";
import DeleteRoomModal from "../modal/DeleteRoomModal";
import { toast } from "sonner"
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
  const { deleteRoom } = useRoom()

  const { rooms, getRooms, loading } = useRoom();
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  // ✅ FILTER LOGIC
  const filteredRooms = rooms.filter((room) => {
    const matchSearch =
      room.room_number.toLowerCase().includes(search.toLowerCase()) ||
      room.price_per_month.toString().includes(search)
    const matchFilter =
      filter === "All" || room.status === filter;

    return matchSearch && matchFilter;
  });

  const handleReset = () => {
    setSearch("");
    setFilter("All");
  };

  return (
    <div className="rounded border bg-background p-5 shadow-sm space-y-4">

      {/* 🔷 Header */}
      <div className="flex items-center justify-between">

        <div className="flex gap-2">
          <Input
            placeholder="Search room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-52"
          />

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Full">Full</SelectItem>
            </SelectContent>
          </Select>

          {/* ✅ FIXED RESET BUTTON */}
          <Button onClick={handleReset}>
            <RotateCcw />
            Reset
          </Button>
        </div>

        <div>
          <Button onClick={() => setAddRoomOpen(true)}>
            <Plus />
            Add New
          </Button>
        </div>
      </div>

      {/* 🔷 Table */}
      <div className="rounded border">
        <table className="w-full text-sm">

          <thead className="  text-slate-700">
            <tr>
              <th className="text-left px-4 py-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} />
                  Room
                </div>
              </th>

              <th className="text-left px-4 py-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} />
                  Capacity
                </div>
              </th>

              <th className="text-left px-4 py-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} />
                  Beds
                </div>
              </th>

              <th className="text-left px-4 py-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} />
                  Price Per Month
                </div>
              </th>

              <th className="text-left px-4 py-3">
                <div className="flex items-center gap-2">
                  <ArrowUpDown size={16} />
                  Status
                </div>
              </th>

              <th className="text-right px-4 py-3">
                <div className="flex items-center justify-end gap-2">
                  <ArrowUpDown size={16} />
                  Actions
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  No rooms found
                </td>
              </tr>
            ) : (
              filteredRooms.map((room) => (
                <RoomRow
                  key={room.id}
                  room={{
                    ...room,
                    status: room.status as "Available" | "Occupied" | "Under Maintenance",
                  }}
                  onView={(r) => {
                    setSelectedRoom(r);
                    setViewOpen(true);
                  }}
                  onEdit={(r) => {
                    setSelectedRoom(r);
                    setEditOpen(true);
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

      {/* ✅ MODAL */}
      <AddRoomModal
        open={addRoomOpen}
        onClose={() => setAddRoomOpen(false)}
      />
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
      <DeleteRoomModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        roomName={roomToDelete?.room_number} // ✅ USES IT
        loading={isDeleting}
        onConfirm={async () => {
          if (!roomToDelete) return;

          try {
            setIsDeleting(true);

            await deleteRoom(roomToDelete.id);

            const toastId = toast.loading("Deleting room...");
            toast.success("Room deleted 🗑️", { id: toastId });

            setDeleteOpen(false);
            setRoomToDelete(null);

          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Delete failed");
          } finally {
            setIsDeleting(false);
          }
        }}
      />
    </div>
  );
};

export default RoomsTable;