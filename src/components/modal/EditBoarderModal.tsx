"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRoom } from "@/hooks/useRoom";
import { BedDouble, DoorOpen, Users } from "lucide-react";
import type { AvailableRoom } from "@/store/useRoomStore";

type BoarderType = {
  boarder_id: number;
  room_number: string;
  bed_number: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  boarder: BoarderType | null;
  onSave: (data: { room_id: number; bed_id: number }) => Promise<void>;
};

const EditBoarderModal = ({ open, onClose, boarder, onSave }: Props) => {
  const { availableRooms, getAvailableRooms } = useRoom();

  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedBed, setSelectedBed] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const getRoomImage = (room: AvailableRoom) => {
  if (Array.isArray(room.images) && room.images.length > 0) {
    return room.images[0];
  }
  return "/no-image.png";
};

  useEffect(() => {
    if (open) {
      getAvailableRooms();
    }
  }, [open, getAvailableRooms]);

  const room = availableRooms.find((r) => r.id === selectedRoom);

  const handleSave = async () => {
    if (!selectedRoom || !selectedBed) return;

    setLoading(true);
    await onSave({
      room_id: selectedRoom,
      bed_id: selectedBed,
    });
    setLoading(false);
    onClose();
  };

  if (!boarder) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl! w-full rounded p-6">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Change Room & Bed
          </DialogTitle>

          <p className="text-sm text-muted-foreground">
            Currently assigned to{" "}
            <span className="font-semibold text-foreground">
              Room {boarder.room_number} • Bed {boarder.bed_number}
            </span>
          </p>
        </DialogHeader>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">

          {/* LEFT: ROOM LIST */}
          <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Select Room
            </h3>

            {availableRooms.map((r) => (
              <div
                key={r.id}
                onClick={() => {
                  setSelectedRoom(r.id);
                  setSelectedBed(null);
                }}
                className={`cursor-pointer rounded-xl border overflow-hidden transition ${
                  selectedRoom === r.id
                    ? "border-blue-500 shadow-md"
                    : "hover:shadow"
                }`}
              >
                {/* IMAGE */}
                <img
                  src={getRoomImage(r)}
                  alt={`Room ${r.room_number}`}
                  className="w-full h-40 object-cover"
                />

                {/* CONTENT */}
                <div className="p-4 space-y-2">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <DoorOpen size={16} />
                    Room {r.room_number}
                  </h4>

                  <p className="text-xs text-gray-500 line-clamp-2">
                    {r.description || "No description"}
                  </p>

                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Users size={14} /> {r.capacity}
                    </span>

                    {r.price_per_month && (
                      <span className="font-semibold text-blue-600">
                        ₱{Number(r.price_per_month).toLocaleString()}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-green-600 font-medium">
                    {r.available_beds} beds available
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: ROOM PREVIEW + BED SELECTION */}
          <div className="space-y-4">
            {room ? (
              <>
                {/* ROOM PREVIEW IMAGE */}
                <div className="rounded-xl overflow-hidden border">
                  <img
                    src={getRoomImage(room)}
                    alt={`Room ${room.room_number}`}
                    className="w-full h-48 object-cover"
                  />
                </div>

                {/* ROOM INFO */}
                <div>
                  <h3 className="text-lg font-semibold">
                    Room {room.room_number}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {room.description || "No description available"}
                  </p>
                </div>

                {/* BED SELECTION */}
                <div>
                  <p className="text-sm font-medium mb-2">Select Bed</p>

                  <div className="flex flex-wrap gap-2">
                    {room.beds.map((bed) => (
                      <button
                        key={bed.id}
                        onClick={() => setSelectedBed(bed.id)}
                        className={`px-3 py-2 rounded-lg border text-sm transition ${
                          selectedBed === bed.id
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        <BedDouble size={14} className="inline mr-1" />
                        {bed.bed_number}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Select a room to view details
              </div>
            )}
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            disabled={!selectedRoom || !selectedBed || loading}
            className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6"
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default EditBoarderModal;
