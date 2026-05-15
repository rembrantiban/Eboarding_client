"use client";

import { BedDouble, Users,  } from "lucide-react";
import type { AvailableRoom } from "@/store/useRoomStore";

type Props = {
  room: AvailableRoom;
  onSelectBed: (roomId: number, bedId: number) => void;
};

const RoomCard = ({ room, onSelectBed }: Props) => {
  const mainImage = room.images?.[0] || "https://via.placeholder.com/300x200";
  

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-md hover:shadow-2xl transition-all overflow-hidden border border-gray-100 flex flex-col md:flex-row group">

  {/* IMAGE */}
  <div className="md:w-1/2 md:h-auto overflow-hidden shrink-0 relative">
    <img
      src={mainImage}
      alt={`Room ${room.room_number}`}
      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
    />

    {/* GRADIENT OVERLAY */}
    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
  </div>

  {/* CONTENT */}
  <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">

    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            Room {room.room_number}
          </h3>
          <p className="text-sm text-gray-500">
            {room.available_beds} beds available
          </p>
        </div>

      </div>

      {/* DESCRIPTION */}
      {room.description && (
        <p className="text-sm text-gray-600 leading-relaxed">
          {room.description}
        </p>
      )}

      {/* STATS */}
      <div className="flex gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-blue-500" />
          {room.capacity} persons
        </div>

        <div className="flex items-center gap-2">
          <BedDouble size={16} className="text-blue-500" />
          {room.total_beds} beds
        </div>
      </div>

      {/* PRICE */}
      <div className="text-2xl font-bold text-blue-600">
        ₱{Number(room.price_per_month).toLocaleString()}
        <span className="text-sm text-gray-500 font-normal"> /month</span>
      </div>

      {/* BEDS */}
      <div>
        <p className="text-sm font-semibold mb-2">Number of Beds</p>
        <div className="flex flex-wrap gap-2">
          {room.beds?.map((bed) => (
            <button
              key={bed.id}
              onClick={() => onSelectBed(room.id, bed.id)}
              className="px-3 py-1 rounded-lg border text-sm bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white transition"
            >
              {bed.bed_number}
            </button>
          ))}
        </div>
      </div>

    </div>

    {/* BUTTON */}
 

  </div>
</div>
  );
};

export default RoomCard;
