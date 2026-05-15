"use client";

import { useEffect, useState } from "react";
import { useRoom } from "@/hooks/useRoom";
import RoomCard from "@/components/Room/RoomCard";
import LocationCard from "@/components/Room/LocationCard";
import { ArrowUpDown } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";


const Viewroom = () => {
  const { availableRooms, getAvailableRooms, loading } = useRoom();

  const [sortBy, setSortBy] = useState<"price-low" | "price-high" | "newest">(
    "price-low"
  );

  useEffect(() => {
    getAvailableRooms();
  }, [getAvailableRooms]);


  const handleSelectBed = (roomId: number, bedId: number) => {
    // Handle bed selection - you can add modal or navigation logic here
    console.log(`Selected Bed ${bedId} in Room ${roomId}`);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
          <Header />
      {/* HEADER */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
          <h1 className="text-md md:text-md font-bold text-gray-900">
            Available Rooms
          </h1>
          <p className="text-gray-600 mt-2">
            {availableRooms.length} {availableRooms.length === 1 ? "room" : "rooms"} found
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* 🔷 LEFT SIDEBAR - LOCATION CARD */}
          <div className="lg:col-span-1">
            <LocationCard />
          </div>

          {/* 🔷 RIGHT SECTION - ROOMS */}
          <div className="lg:col-span-3">
            {/* SORT CONTROLS */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b">
              <p className="text-sm text-gray-600">
                Showing {availableRooms.length} results
              </p>

              <div className="flex items-center gap-2">
                <ArrowUpDown size={16} className="text-gray-600" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(
                      e.target.value as "price-low" | "price-high" | "newest"
                    )
                  }
                  className="text-sm px-3 py-2 border rounded-lg bg-white cursor-pointer"
                >
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>

            {/* ROOMS LIST */}
            {availableRooms.length > 0 ? (
              <div className="space-y-4">
                {availableRooms .map((room) => (
                  <RoomCard
                    key={room.id}
                    room={room}
                    onSelectBed={handleSelectBed}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No rooms found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to find available rooms
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Viewroom;