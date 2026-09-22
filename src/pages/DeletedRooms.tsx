import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Trash2,
    BedDouble,
    Users,
    CalendarClock,
    Search,
    ChevronDown,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    ListFilter,
    ArrowLeft,
} from "lucide-react";
import { useRoom } from "@/hooks/useRoom";
import type { DeletedRoom } from "@/store/useRoomStore";
import RestoreRoomConfirmModal from "@/components/modal/RestoreRoomConfirmModal";

const PAGE_SIZE = 5;

const STATUS_STYLES: Record<string, string> = {
    Available: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    Occupied: "bg-slate-900 text-white",
    "Under Maintenance": "bg-amber-50 text-amber-700 ring-1 ring-amber-100",
};

function formatDate(iso?: string | null): { date: string; time: string } {
    if (!iso) return { date: "—", time: "" };
    const d = new Date(iso);
    const date = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
    return { date, time };
}

const peso = (value: number) =>
    `₱${Number(value).toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

function RoomStatusBadge({ status }: { status: string }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${STATUS_STYLES[status] ?? "bg-slate-100 text-slate-700 ring-1 ring-slate-200"}`}
        >
            {status}
        </span>
    );
}


interface DeletedRoomsStatsProps {
    rooms: DeletedRoom[];
}

function DeletedRoomsStats({ rooms }: DeletedRoomsStatsProps) {
    const [now] = useState(() => Date.now());

    const stats = useMemo(() => {
        const total = rooms.length;
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        const recent = rooms.filter(
            (r) => r.deleted_at && now - new Date(r.deleted_at).getTime() <= THIRTY_DAYS
        ).length;
        return { total, recent };
    }, [rooms, now]);

    const cards: {
        label: string;
        value: string | number;
        icon: typeof Trash2;
    }[] = [
            {
                label: "Total Deleted",
                value: stats.total,
                icon: Trash2,
            },
            {
                label: "Last 30 Days",
                value: stats.recent,
                icon: CalendarClock,
            },
        ];

    return (
        <div className="flex w-fit divide-x divide-slate-100 rounded-xl border border-slate-200 bg-white">
            {cards.map((c) => (
                <div key={c.label} className="flex items-center gap-2.5 px-4 py-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                        <c.icon size={14} strokeWidth={2} />
                    </div>
                    <div>
                        <div className="text-[15px] font-semibold leading-tight tabular-nums text-slate-900">
                            {c.value}
                        </div>
                        <div className="text-[11px] leading-tight text-slate-400">{c.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
}


interface SelectOption {
    value: string;
    label: string;
}

interface SelectFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
}

function SelectField({ label, value, onChange, options }: SelectFieldProps) {
    return (
        <div className="flex flex-col gap-1 min-w-35">
            <span className="text-[10.5px] font-medium text-slate-500">{label}</span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[12.5px] font-medium text-slate-700 outline-none transition focus:border-slate-900"
                >
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={14}
                    className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
            </div>
        </div>
    );
}

interface FilterToolbarProps {
    search: string;
    setSearch: (v: string) => void;
    status: string;
    setStatus: (v: string) => void;
    deletedBy: string;
    setDeletedBy: (v: string) => void;
    deletedDate: string;
    setDeletedDate: (v: string) => void;
    deletedByOptions: SelectOption[];
    onClear: () => void;
}

function FilterToolbar({
    search,
    setSearch,
    status,
    setStatus,
    deletedBy,
    setDeletedBy,
    deletedDate,
    setDeletedDate,
    deletedByOptions,
    onClear,
}: FilterToolbarProps) {
    return (
        <div className="flex flex-col xl:flex-row xl:items-end gap-3 p-4 border-b border-slate-200 bg-white">

            {/* Search */}
            <div className="relative flex-1 min-w-70">
                <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search room number..."
                    className="h-9 w-full rounded-lg border border-slate-200 pl-8 pr-3 text-[12.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2.5 items-center ">

                <SelectField
                    label="Status"
                    value={status}
                    onChange={setStatus}
                    options={[
                        { value: "all", label: "All Status" },
                        { value: "Available", label: "Available" },
                        { value: "Occupied", label: "Occupied" },
                        { value: "Under Maintenance", label: "Under Maintenance" },
                    ]}
                />

                <SelectField
                    label="Deleted By"
                    value={deletedBy}
                    onChange={setDeletedBy}
                    options={[
                        { value: "all", label: "All" },
                        ...deletedByOptions,
                    ]}
                />

                <SelectField
                    label="Deleted Date"
                    value={deletedDate}
                    onChange={setDeletedDate}
                    options={[
                        { value: "all", label: "All Time" },
                        { value: "7", label: "Last 7 Days" },
                        { value: "30", label: "Last 30 Days" },
                        { value: "90", label: "Last 90 Days" },
                    ]}
                />

                <button
                    onClick={onClear}
                    className="flex h-9 items-center gap-1.5 whitespace-nowrap rounded-lg border border-slate-200 bg-white px-3.5 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                >
                    <ListFilter size={12} />
                    Clear Filters
                </button>

            </div>

        </div>
    );
}


interface DeletedRoomsTableProps {
    rooms: DeletedRoom[];
    onRestore: (room: DeletedRoom) => void;
}

function DeletedRoomsTable({ rooms, onRestore }: DeletedRoomsTableProps) {

    if (rooms.length === 0) {
        return (
            <div className="py-16 text-center text-sm text-slate-400">
                No deleted rooms match your filters.
            </div>
        );
    }

    return (
        <table className="w-full">
            <thead className="border-b border-slate-200/80 bg-slate-50/70">
                <tr className="text-left text-[10.5px] font-semibold uppercase tracking-wider text-slate-500">
                    <th className="py-2.5 px-4">Room</th>
                    <th className="py-2.5 px-4">Capacity / Beds</th>
                    <th className="py-2.5 px-4">Price / Month</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4">
                        <span className="inline-flex items-center gap-1">
                            Deleted At <ChevronDown size={12} />
                        </span>
                    </th>
                    <th className="py-2.5 px-4">Deleted By</th>
                    <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {rooms.map((r) => {
                    const { date, time } = formatDate(r.deleted_at);
                    return (
                        <tr key={r.id} className="transition-colors hover:bg-slate-50/70">
                            <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 ring-1 ring-slate-200">
                                        <BedDouble size={14} className="text-slate-400" />
                                    </div>
                                    <div className="text-[12.5px] font-medium text-slate-800 leading-tight">
                                        Room {r.room_number}
                                    </div>
                                </div>
                            </td>
                            <td className="py-2.5 px-4">
                                <div className="flex items-center gap-3 text-[12px] text-slate-600">
                                    <span className="flex items-center gap-1">
                                        <Users size={12} className="text-slate-400" />
                                        {r.capacity}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <BedDouble size={12} className="text-slate-400" />
                                        {r.total_beds}
                                    </span>
                                </div>
                            </td>
                            <td className="py-2.5 px-4 text-[12.5px] font-semibold text-slate-900">
                                {peso(r.price_per_month)}
                                <span className="ml-0.5 text-[10.5px] font-normal text-slate-400">/mo</span>
                            </td>
                            <td className="py-2.5 px-4">
                                <RoomStatusBadge status={r.status} />
                            </td>
                            <td className="py-2.5 px-4">
                                <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                                    <CalendarClock size={12} className="text-slate-400" />
                                    <div className="leading-tight">
                                        <div>{date}</div>
                                        <div className="text-[10.5px] text-slate-400">{time}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-2.5 px-4">
                                <div className="flex items-center gap-2">
                                    {r.deleted_by_avatar ? (
                                        <img
                                            src={r.deleted_by_avatar}
                                            alt={r.deleted_by_name}
                                            className="h-6 w-6 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-[10px] font-medium text-white">
                                            {r.deleted_by_name ? r.deleted_by_name.split(' ').map((n) => n[0]).join('') : ''}
                                        </div>
                                    )}
                                    <div className="text-[12px] text-slate-700 leading-tight">
                                        {r.deleted_by_name ?? "—"}
                                    </div>
                                </div>
                            </td>
                            <td className="py-2.5 px-4">
                                <div className="flex items-center justify-end">
                                    <button
                                        onClick={() => onRestore(r)}
                                        className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-2.5 py-1.5 text-[11.5px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                                    >
                                        <RotateCcw size={12} />
                                        Restore
                                    </button>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}


interface PaginationProps {
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    setPage: (page: number) => void;
}

function Pagination({ page, totalPages, totalItems, pageSize, setPage }: PaginationProps) {
    const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
    const end = Math.min(page * pageSize, totalItems);

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
            <span className="text-[11.5px] text-slate-500">
                Showing {start} to {end} of {totalItems} entries
            </span>
            <div className="flex items-center gap-1">
                <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
                >
                    <ChevronLeft size={14} />
                </button>
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`h-7 w-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${p === page
                            ? "bg-slate-800 text-white"
                            : "text-slate-500 border border-slate-200 hover:bg-slate-50"
                            }`}
                    >
                        {p}
                    </button>
                ))}
                <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page === totalPages}
                    className="h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50"
                >
                    <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}


export default function DeletedRoomsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");
    const [deletedBy, setDeletedBy] = useState("all");
    const [deletedDate, setDeletedDate] = useState("all");
    const [page, setPage] = useState(1);
    const [now] = useState(() => Date.now());
    const { deletedRooms, getDeletedRooms, restoreRoom } = useRoom();
    const [selectedRoom, setSelectedRoom] = useState<DeletedRoom | null>(null);
    const [showRestoreModal, setShowRestoreModal] = useState(false);

    useEffect(() => {
        getDeletedRooms();
        //eslint-disable-next-line
    }, []);

    const deletedByOptions: SelectOption[] = useMemo(() => {
        const names = Array.from(
            new Set(deletedRooms.map((r) => r.deleted_by_name).filter((n): n is string => Boolean(n)))
        );
        return names.map((n) => ({ value: n, label: n }));
    }, [deletedRooms]);

    const filtered = useMemo(() => {
        return deletedRooms.filter((r) => {
            const q = search.trim().toLowerCase();
            const matchesSearch = !q || r.room_number.toLowerCase().includes(q);

            const matchesStatus = status === "all" || r.status === status;
            const matchesDeletedBy = deletedBy === "all" || r.deleted_by_name === deletedBy;

            let matchesDate = true;
            if (deletedDate !== "all" && r.deleted_at) {
                const days = Number(deletedDate);
                matchesDate = now - new Date(r.deleted_at).getTime() <= days * 24 * 60 * 60 * 1000;
            }

            return matchesSearch && matchesStatus && matchesDeletedBy && matchesDate;
        });
    }, [deletedRooms, search, status, deletedBy, deletedDate, now]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    function handleClearFilters() {
        setSearch("");
        setStatus("all");
        setDeletedBy("all");
        setDeletedDate("all");
        setPage(1);
    }

    const handleRestore = async () => {
        if (!selectedRoom) return;

        // Close the confirm modal first so the loading/success status modal is the only one visible.
        setShowRestoreModal(false);

        try {
            await restoreRoom(selectedRoom.id);
        } finally {
            setSelectedRoom(null);
        }
    };

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-4 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-6 pt-4 bg-gray-50">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-[18px] font-semibold leading-tight tracking-tight text-slate-900">Deleted Rooms</h1>
                        <p className="mt-0.5 text-[12px] leading-tight text-slate-500">
                            These rooms have been deleted or archived. You can restore them if needed.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/room")}
                        className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Rooms
                    </button>
                </div>

                {/* Stats — separated component */}
                <DeletedRoomsStats rooms={deletedRooms} />

                {/* Table card */}
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    <FilterToolbar
                        search={search}
                        setSearch={(v) => {
                            setSearch(v);
                            setPage(1);
                        }}
                        status={status}
                        setStatus={(v) => {
                            setStatus(v);
                            setPage(1);
                        }}
                        deletedBy={deletedBy}
                        setDeletedBy={(v) => {
                            setDeletedBy(v);
                            setPage(1);
                        }}
                        deletedDate={deletedDate}
                        setDeletedDate={(v) => {
                            setDeletedDate(v);
                            setPage(1);
                        }}
                        deletedByOptions={deletedByOptions}
                        onClear={handleClearFilters}
                    />

                    <div className="overflow-x-auto">
                        <DeletedRoomsTable rooms={pageItems} onRestore={(room) => {
                            setSelectedRoom(room);
                            setShowRestoreModal(true);
                        }} />
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        totalItems={filtered.length}
                        pageSize={PAGE_SIZE}
                        setPage={setPage}
                    />
                </div>

                {showRestoreModal && selectedRoom && (
                    <RestoreRoomConfirmModal
                        room={selectedRoom}
                        onCancel={() => {
                            setShowRestoreModal(false);
                            setSelectedRoom(null);
                        }}
                        onConfirm={handleRestore}
                    />
                )}
            </div>
        </div>
    );
}
