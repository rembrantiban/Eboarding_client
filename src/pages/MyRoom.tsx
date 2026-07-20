import { useEffect, useState } from "react";
import {
    Home,
    DoorOpen,
    BedDouble,
    Wallet,
    Calendar,
    ChevronLeft,
    ChevronRight,
    X,
} from "lucide-react";
import { useRoomAssignment } from "@/hooks/useRoomAssignment";
import { useAuth } from "@/hooks/useAuth";


const MyRooms = () => {
    const { boarderAssignedRoom, getBoarderAssignedRoom, loading } = useRoomAssignment();
    const { user } = useAuth();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!user) return;
        getBoarderAssignedRoom(user.id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const images = boarderAssignedRoom?.room_images || [];

    return (
        <div className="w-full space-y-6">
            {/* HEADER */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-semibold text-slate-900">
                        My Room
                    </h1>
                    <p className="mt-0.5 text-sm text-slate-500">
                        Your current boarding assignment
                    </p>
                </div>

                {boarderAssignedRoom && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                        Active
                    </span>
                )}
            </div>

            {/* LOADING */}
            {loading ? (
                <div className="animate-pulse space-y-4 rounded-2xl bg-white p-6">
                    <div className="h-64 rounded-xl bg-slate-100" />
                    <div className="h-3.5 w-1/3 rounded bg-slate-100" />
                    <div className="grid grid-cols-2 gap-3">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-14 rounded-xl bg-slate-100"
                            />
                        ))}
                    </div>
                </div>
            ) : boarderAssignedRoom ? (
                <div className="overflow-hidden rounded-2xl bg-white">
                    {/* IMAGE */}
                    <div className="group relative h-72 w-full overflow-hidden bg-slate-100">
                        {images.length > 0 ? (
                            <img
                                src={images[currentIndex]}
                                onClick={() =>
                                    setSelectedImage(images[currentIndex])
                                }
                                alt=""
                                className="h-full w-full cursor-pointer object-cover transition duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center">
                                <Home className="text-slate-300" size={28} />
                            </div>
                        )}

                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() =>
                                        setCurrentIndex((prev) =>
                                            prev === 0
                                                ? images.length - 1
                                                : prev - 1
                                        )
                                    }
                                    className="absolute left-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur transition-colors hover:bg-white"
                                    aria-label="Previous photo"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                <button
                                    onClick={() =>
                                        setCurrentIndex(
                                            (prev) => (prev + 1) % images.length
                                        )
                                    }
                                    className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur transition-colors hover:bg-white"
                                    aria-label="Next photo"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </>
                        )}

                        {/* DOT INDICATORS */}
                        {images.length > 1 && (
                            <div className="absolute bottom-4 right-5 flex gap-1.5">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`h-1.5 rounded-full transition-all ${i === currentIndex
                                                ? "w-4 bg-white"
                                                : "w-1.5 bg-white/50"
                                            }`}
                                        aria-label={`Go to photo ${i + 1}`}
                                    />
                                ))}
                            </div>
                        )}

                        {/* LABEL */}
                        <div className="absolute bottom-4 left-5 text-white">
                            <p className="text-xl font-semibold">
                                Room {boarderAssignedRoom?.room_number}
                            </p>
                            <p className="text-xs text-white/70">
                                Bed {boarderAssignedRoom?.bed_number}
                            </p>
                        </div>
                    </div>

                    {/* BODY */}
                    <div className="space-y-5 p-6">
                        <p className="text-sm text-slate-500">
                            Comfortable and secure boarding space with
                            essential amenities.
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <Info
                                icon={<DoorOpen size={15} />}
                                label="Room"
                                value={boarderAssignedRoom?.room_number}
                            />
                            <Info
                                icon={<BedDouble size={15} />}
                                label="Bed"
                                value={boarderAssignedRoom?.bed_number}
                            />
                            <Info
                                icon={<Wallet size={15} />}
                                label="Monthly"
                                value={`₱${Number(
                                    boarderAssignedRoom.price_per_month
                                ).toLocaleString()}`}
                            />
                            <Info
                                icon={<Calendar size={15} />}
                                label="Since"
                                value={new Date(
                                    boarderAssignedRoom?.assigned_date
                                ).toLocaleDateString("en-PH")}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                        <Home className="text-slate-400" size={18} />
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-900">
                        No room assigned yet
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Your room details will appear here once assigned
                    </p>
                </div>
            )}

            {/* MODAL */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
                        aria-label="Close"
                    >
                        <X size={18} />
                    </button>
                    <img
                        src={selectedImage}
                        alt=""
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-[80vh] rounded-xl shadow-2xl"
                    />
                </div>
            )}
        </div>
    );
};

function Info({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string | number;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500">
                {icon}
            </div>
            <div className="min-w-0">
                <p className="text-xs text-slate-500">{label}</p>
                <p className="truncate text-sm font-medium text-slate-900">
                    {value}
                </p>
            </div>
        </div>
    );
}

export default MyRooms;