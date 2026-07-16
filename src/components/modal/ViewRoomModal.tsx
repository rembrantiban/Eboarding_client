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

  const images = room.images?.length ? room.images : ["/no-image.png"];

  const isAvailable = room.status === "Available";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Room Details
            </p>
            <h2 className="text-xl font-semibold text-gray-900">
              Room {room.room_number}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="grid lg:grid-cols-2 gap-10 p-8">
          {/* IMAGE SECTION */}
          <div className="space-y-3">
            <div className="overflow-hidden rounded-xl bg-gray-100 aspect-4/3">
              <img
                src={images[activeImage]}
                alt={`Room ${room.room_number}`}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === index
                        ? "border-gray-900"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFO SECTION */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  isAvailable
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {room.status}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-3xl font-semibold text-gray-900 tracking-tight">
                ₱{room.price_per_month}
                <span className="text-sm text-gray-500 font-normal">
                  {" "}/ month
                </span>
              </p>
            </div>

            {/* DETAILS GRID */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Room No.</p>
                <p className="text-sm font-semibold text-gray-900">
                  #{room.room_number}
                </p>
              </div>

              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Capacity</p>
                <div className="flex items-center gap-1.5">
                  <Users size={14} className="text-gray-500" />
                  <p className="text-sm font-semibold text-gray-900">
                    {room.capacity}
                  </p>
                </div>
              </div>

              <div className="border border-gray-100 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">Beds</p>
                <div className="flex items-center gap-1.5">
                  <BedDouble size={14} className="text-gray-500" />
                  <p className="text-sm font-semibold text-gray-900">
                    {room.total_beds ?? 0}
                  </p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            {room.description && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-2">
                  Description
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {room.description}
                </p>
              </div>
            )}

            {/* ACTION BUTTON */}
            <button
              onClick={onClose}
              className="mt-auto w-full bg-gray-900 text-white py-3 rounded-xl hover:bg-gray-800 transition-colors font-medium text-sm"
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