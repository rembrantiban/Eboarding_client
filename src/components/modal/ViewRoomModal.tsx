"use client";

import { useState } from "react";
import { BedDouble, Users, X } from "lucide-react";
import type { Room } from "@/store/useRoomStore";

type Props = {
  open: boolean;
  onClose: () => void;
  room: Room | null;
};

const ViewRoomModal = ({ open, onClose, room }: Props) => {
  const [activeImage, setActiveImage] = useState(0);

  if (!open || !room) return null;

  const images = room.images?.length
    ? room.images
    : ["/no-image.png"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      
      {/* 🔥 BIGGER MODAL */}
      <div className="w-full max-w-6xl bg-white rounded-sm shadow-2xl overflow-hidden">

        {/* 🔷 HEADER */}
        <div className="flex justify-between items-center px-8 py-5 border-b">
          <div>
            <h2 className="text-2xl font-semibold">
              Room {room.room_number}
            </h2>
            <p className="text-sm text-muted-foreground">
              Room details & information
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-muted transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* 🔷 CONTENT */}
        <div className="grid lg:grid-cols-2 gap-8 p-8">

          {/* 🖼️ IMAGE SECTION */}
          <div className="space-y-4">

            {/* MAIN IMAGE (bigger) */}
            <div className="overflow-hidden rounded-2xl">
              <img
                src={images[activeImage]}
                className="w-full h-100 object-cover hover:scale-105 transition duration-300"
              />
            </div>

            {/* THUMBNAILS */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 object-cover rounded-xl cursor-pointer border-2 transition ${
                    activeImage === index
                      ? "border-blue-500 scale-105"
                      : "border-gray-200 hover:scale-105"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* 📄 INFO SECTION */}
          <div className="space-y-6">

            {/* STATUS BADGE */}
            <div>
              <span
                className={`px-4 py-1.5 text-sm rounded-full font-medium ${
                  room.status === "Available"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {room.status}
              </span>
            </div>

            {/* PRICE (highlight) */}
            <div>
              <p className="text-3xl font-bold text-blue-600">
                ₱{room.price_per_month}
                <span className="text-sm text-muted-foreground font-normal">
                  {" "} / month
                </span>
              </p>
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-muted/50 p-4 rounded-xl">
                <p className="text-xs text-muted-foreground">Room Number</p>
                <p className="font-semibold">#{room.room_number}</p>
              </div>

              <div className="bg-muted/50 p-4 rounded-xl">
                <p className="text-xs text-muted-foreground">Capacity</p>
                 <div className="flex items-center gap-2 mt-2">
                     <Users size={14} />
                <p className="font-semibold"> {room.capacity} persons</p>
                 </div>
              </div>
              <div className="bg-muted/50 p-4 rounded-xl">
                <p className="text-xs text-muted-foreground">Total Beds</p>
                <div className="flex items-center gap-2 mt-2">
                  <BedDouble size={14} />
                  <p className="font-semibold"> {room.total_beds ?? 0}</p>
                </div>
              </div>

            </div>

            {/* DESCRIPTION */}
            {room.description && (
              <div>
                <p className="text-sm font-semibold mb-2">Description</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {room.description}
                </p>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={onClose}
              className="mt-4 w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition font-medium"
            >
              Close
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewRoomModal;