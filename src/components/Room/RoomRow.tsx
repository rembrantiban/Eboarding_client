"use client";

import {
  MoreVertical,
  BedDouble,
  Users,
  Pencil,
  Trash2,
  Eye,
  ImageOff,
  RefreshCw,
} from "lucide-react";
import type { Room } from "@/store/useRoomStore";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  room: Room & {
    occupants?: number;
  };
  onView: (room: Room) => void;
  onDelete?: (room: Room) => void;
  onEdit: (room: Room) => void;
  onChangeStatus?: (room: Room) => void;
};

const STATUS_STYLES: Record<string, string> = {
  Available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
  Occupied: "bg-slate-900 text-white",
  "Under Maintenance": "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
};

const RoomRow = ({ room, onView, onDelete, onEdit, onChangeStatus }: Props) => {
  const { user } = useAuth();

  const statusClass =
    STATUS_STYLES[room.status] ?? "bg-rose-50 text-rose-700 ring-1 ring-rose-100";

  return (
    <tr className="transition-colors hover:bg-slate-50/70">
      <td className="px-4 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          {room.images?.length ? (
            <img
              src={room.images[0]}
              alt={`Room ${room.room_number}`}
              onClick={() => onView(room)}
              className="h-9 w-9 shrink-0 cursor-pointer rounded-lg object-cover ring-1 ring-slate-200 transition hover:ring-slate-400"
            />
          ) : (
            <div
              onClick={() => onView(room)}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200 transition hover:bg-slate-200"
            >
              <ImageOff className="h-3.5 w-3.5 text-slate-400" />
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-[12.5px] font-medium text-slate-900">
              Room {room.room_number}
            </p>
            <p className="truncate text-[11px] text-slate-400">
              {room.total_beds ?? 0} bed{(room.total_beds ?? 0) === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </td>

      <td className="px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
          <Users size={13} className="text-slate-400" />
          <span className="tabular-nums">{room.capacity}</span>
        </div>
      </td>

      <td className="px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-semibold text-slate-700 ring-1 ring-slate-200">
          <BedDouble size={12} className="text-slate-400" />
          <span className="tabular-nums">
            {room.occupied_beds ?? 0}/{room.total_beds ?? 0}
          </span>
        </span>
      </td>

      <td className="whitespace-nowrap px-4 py-2.5 text-[12.5px] font-semibold tabular-nums text-slate-900">
        ₱{Number(room.price_per_month).toLocaleString("en-PH")}
        <span className="ml-0.5 text-[10.5px] font-normal text-slate-400">/mo</span>
      </td>

      <td className="px-4 py-2.5">
        {onChangeStatus ? (
          <button
            type="button"
            onClick={() => onChangeStatus(room)}
            title="Change status"
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold transition hover:opacity-80 ${statusClass}`}
          >
            {room.status}
            <RefreshCw size={9.5} className="opacity-60" />
          </button>
        ) : (
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${statusClass}`}
          >
            {room.status}
          </span>
        )}
      </td>

      <td className="px-4 py-2.5 text-right">
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Open room actions"
              >
                <MoreVertical size={15} />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-44 rounded-xl border-slate-200 p-1 text-[12.5px]"
            >
              <DropdownMenuItem onClick={() => onView(room)} className="gap-2 rounded-lg">
                <Eye size={14} /> View
              </DropdownMenuItem>

              {onChangeStatus && (
                <DropdownMenuItem
                  onClick={() => onChangeStatus(room)}
                  className="gap-2 rounded-lg"
                >
                  <RefreshCw size={14} /> Change Status
                </DropdownMenuItem>
              )}

              {user?.user_type === "Admin" && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(room)} className="gap-2 rounded-lg">
                    <Pencil size={14} /> Edit
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-1 bg-slate-100" />

                  <DropdownMenuItem
                    onClick={() => onDelete?.(room)}
                    className="gap-2 rounded-lg text-red-500 focus:text-red-500"
                  >
                    <Trash2 size={14} /> Delete
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