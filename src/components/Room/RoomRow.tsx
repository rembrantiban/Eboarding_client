"use client";

import {
  MoreVertical,
  BedDouble,
  Users,
  Pencil,
  Trash2,
  Eye,
} from "lucide-react";
import type { Room } from "@/store/useRoomStore";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  room: Room & {
    occupants?: number;
  };
  onView: (room: Room) => void;
  onDelete?: (room: Room) => void;
  onEdit: (room: Room) => void;
};

const RoomRow = ({ room, onView, onDelete, onEdit }: Props) => {
  const { user } = useAuth();

  return (
    <tr className="border-t bg-background transition hover:bg-muted/50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3 font-medium">
          <div className="flex items-center gap-2">#{room.room_number}</div>
          <img
            src={room.images?.length ? room.images[0] : "/no-image.png"}
            alt="room"
            className="h-10 w-10 rounded-md border object-cover"
          />
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Users size={14} />
          {room.capacity}
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-sm font-semibold text-green-600">
          <BedDouble size={14} />
          {room.total_beds ?? 0}
        </span>
      </td>

      <td className="px-4 py-3 font-medium text-gray-700">
        ₱{Number(room.price_per_month).toLocaleString()}
      </td>

      <td className="px-4 py-3">
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${
            room.status === "Available"
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {room.status}
        </span>
      </td>

      <td className="px-4 py-3 text-right">
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-lg p-2 transition hover:bg-muted"
                aria-label="Open room actions"
              >
                <MoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem onClick={() => onView(room)}>
                <Eye size={14} className="mr-2" /> View
              </DropdownMenuItem>

              {user?.user_type === "Admin" && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(room)}>
                    <Pencil size={14} className="mr-2" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete?.(room)}
                    className="text-red-500 focus:bg-red-100 focus:text-red-500"
                  >
                    <Trash2 size={14} className="mr-2" /> Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </td>
    </tr>
  );
};

export default RoomRow;