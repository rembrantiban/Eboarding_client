"use client";

import { useEffect, useState } from "react";
import { useRoom } from "@/hooks/useRoom";
import { useBoarder } from "@/hooks/useBoarder";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BedDouble, Users } from "lucide-react";
import type { User } from "@/store/useAuthStore";
import { useAuth } from "@/hooks/useAuth"
type Props = {
    open: boolean;
    onClose: () => void;
    user: User;
};

const AssignBoarderModal = ({ open, onClose, user }: Props) => {
    const { availableRooms, getAvailableRooms } = useRoom();
    const { assignBoarder, loading } = useBoarder();
    const { getUsers } = useAuth();

    const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
    const [selectedBed, setSelectedBed] = useState<number | null>(null);

    useEffect(() => {
        if (open) getAvailableRooms();
    }, [open, getAvailableRooms]);

    const room = availableRooms.find((r) => r.id === selectedRoom);

   const handleAssign = async () => {
  if (!selectedRoom || !selectedBed) return;

  try {
    await assignBoarder({
      user_id: user.id,
      room_id: selectedRoom,
      bed_id: selectedBed,
    });

    await getUsers(); 

    setSelectedRoom(null);
    setSelectedBed(null);
    onClose();

  } catch (error) {
    console.error("Assign failed:", error);
  }
};

    if (!user) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            {/* 🔥 BIGGER MODAL */}
            <DialogContent className="max-w-5xl! w-full rounded-2xl p-6">

                {/* HEADER */}
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">
                        Assign Room & Bed
                    </DialogTitle>

                    <p className="text-sm text-muted-foreground">
                        Assigning for{" "}
                        <span className="font-semibold text-foreground">
                            {user.first_name} {user.last_name}
                        </span>
                    </p>
                </DialogHeader>

                {/* 🔥 MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">

                    {/* 🔷 LEFT: ROOMS */}
                    <div className="space-y-4 max-h-100 overflow-y-auto pr-2">
                        <h3 className="text-sm font-semibold text-muted-foreground">
                            Select Room
                        </h3>

                        {availableRooms.map((room) => (
                            <div
                                key={room.id}
                                onClick={() => {
                                    setSelectedRoom(room.id);
                                    setSelectedBed(null);
                                }}
                                className={`cursor-pointer rounded-xl border overflow-hidden transition ${selectedRoom === room.id
                                        ? "border-blue-500 shadow-md"
                                        : "hover:shadow"
                                    }`}
                            >
                                {/* IMAGE */}
                                <img
                                    src={room.images?.[0] || "/no-image.png"}
                                    className="w-full h-40 object-cover"
                                />

                                {/* CONTENT */}
                                <div className="p-4 space-y-2">
                                    <h4 className="font-semibold text-lg">
                                        Room {room.room_number}
                                    </h4>

                                    <p className="text-xs text-gray-500 line-clamp-2">
                                        {room.description || "No description"}
                                    </p>

                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Users size={14} /> {room.capacity}
                                        </span>

                                        <span className="font-semibold text-blue-600">
                                            ₱{Number(room.price_per_month).toLocaleString()}
                                        </span>
                                    </div>

                                    <p className="text-xs text-green-600 font-medium">
                                        {room.available_beds} beds available
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 🔷 RIGHT: ROOM DETAILS + BEDS */}
                    <div className="space-y-4">

                        {room ? (
                            <>
                                {/* ROOM PREVIEW */}
                                <div className="rounded-xl overflow-hidden border">
                                    <img
                                        src={room.images?.[0] || "/no-image.png"}
                                        className="w-full h-48 object-cover"
                                    />
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Room {room.room_number}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {room.description || "No description available"}
                                    </p>
                                </div>

                                {/* BEDS */}
                                <div>
                                    <p className="text-sm font-medium mb-2">
                                        Select Bed
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {room.beds.map((bed) => (
                                            <button
                                                key={bed.id}
                                                onClick={() => setSelectedBed(bed.id)}
                                                className={`px-3 py-2 rounded-lg border text-sm transition ${selectedBed === bed.id
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
                        onClick={handleAssign}
                        disabled={!selectedRoom || !selectedBed || loading}
                        className="bg-linear-to-r from-blue-600 to-indigo-600 text-white px-6"
                    >
                        {loading ? "Assigning..." : "Assign Boarder"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default AssignBoarderModal;