"use client";

import { useState } from "react";
import {
  MoreVertical,
  BedDouble,
  Users,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import type { Room } from "@/store/useRoomStore"

type Props = {
  room: Room & {
    occupants?: number; // ✅ ADD THIS
  };
  onView: (room: Room) => void;
  onDelete?: (room: Room) => void;
  onEdit: (room: Room) => void;
};

const RoomRow = ({ room, onView, onDelete, onEdit }: Props) => {
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <tr className="border-t hover:bg-muted/50 transition relative">

      {/* Room */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 font-medium">
          <div className="flex items-center gap-2">
            #{room.room_number}
          </div>
          <img
            src={
              room.images?.length
                ? room.images[0]
                : "/no-image.png"
            }
            alt="room"
            className="w-10 h-10 object-cover rounded-md border"
          />
        </div>
      </td>

      {/* Capacity */}
      <td className="px-4 py-3 flex items-center gap-2"> <Users size={14} />{room.capacity}</td>

      {/* Occupants */}
      <td className="px-4 py-3 ">

        <span className="inline-flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-full border bg-green-50 text-green-600 border-green-200"
        >
          <BedDouble size={14} />
          {room.total_beds ?? 0}
        </span>
      </td>
      <td className="px-4 py-3 font-medium text-gray-700">
        ₱{Number(room.price_per_month).toLocaleString()}
      </td>
      {/* Status */}
      <td className="px-4 py-3">
        <span
          className={`px-2 py-1 text-xs rounded-full font-medium ${room.status === "Available"
            ? "bg-green-100 text-green-600"
            : "bg-red-100 text-red-600"
            }`}
        >
          {room.status}
        </span>
      </td>


      {/* Actions */}
      <td className="px-4 py-3 text-right relative">
        <div className="flex justify-end">

          {/* 🔥 3 DOT BUTTON */}
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="p-2 rounded-lg hover:bg-muted"
          >
            <MoreVertical size={16} />
          </button>

          {/* 🔥 DROPDOWN */}
          {openMenu && (
            <div className="absolute right-4 mt-10 w-44 bg-white/90 backdrop-blur-xl border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">

              <button
                onClick={() => {
                  onView(room);
                  setOpenMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted text-sm"
              >
                <Eye size={14} /> View
              </button>

              <button
                onClick={() => {
                  onEdit(room);
                  setOpenMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-muted text-sm"
              >
                <Pencil size={14} /> Edit
              </button>

              <button
                onClick={() => {
                  onDelete?.(room);
                  setOpenMenu(false);
                }}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-100 text-red-500 text-sm"
              >
                <Trash2 size={14} /> Delete
              </button>

            </div>
          )}
        </div>
      </td>

    </tr>
  );
};

export default RoomRow;