import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Trash2,
    User as UserIcon,
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
import { useAuth } from "@/hooks/useAuth";
import RestoreConfirmModal from "@/components/modal/ResoreAccountModal";


export type UserType = "Boarder" | "Staff" | "Admin";
export type UserStatus = "Pending" | "Approved" | "Rejected";
export type AccountStatus = "Active" | "Deactivate";
type ValidIdStatus =
    | "Under Review"
    | "Approved"
    | "Rejected";


export interface User {
    id: number;
    user_id_no: string;

    first_name: string;
    last_name: string;

    email: string;
    username: string;

    country_code: string,
    contact_number: string;
    nationality: string;
    address?: string;

    avatar_url?: string;

    gender?: string;
    age?: number;

    valid_id_type?: string;
    valid_id_image?: string;

    emergency_contact_name?: string;
    emergency_contact_number?: string;
    emergency_contact_relationship?: string;

    user_type: UserType;
    status: UserStatus;
    account_status: AccountStatus;
    valid_id_status: ValidIdStatus;

    is_deleted: boolean;
    deleted_at?: string | null;
    deleted_by?: number | null;
    deleted_by_name?: string;
    deleted_by_avatar: string;

    created_at: string;
    updated_at: string;

    is_assigned: boolean;
    room_number?: string;
    bed_number?: string;
}



const PAGE_SIZE = 5;


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

function UserTypeBadge({ type }: { type: UserType }) {
    const styles: Record<UserType, string> = {
        Boarder: "bg-slate-100 text-slate-700",
        Staff: "bg-indigo-50 text-indigo-700",
        Admin: "bg-rose-50 text-rose-700",
    };
    const label = type === "Boarder" ? "Boarder" : type === "Staff" ? "Staff" : "Admin";
    return (
        <span
            className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[11px] font-medium ${styles[type]}`}
        >
            {label}
        </span>
    );
}


interface DeletedAccountsStatsProps {
    users: User[];
}

function DeletedAccountsStats({ users }: DeletedAccountsStatsProps) {
    const [now] = useState(() => Date.now());
    const stats = useMemo(() => {
        const total = users.length;
        const Boarder = users.filter((u) => u.user_type === "Boarder").length;
        const Staff = users.filter((u) => u.user_type === "Staff").length;
        const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
        const recent = users.filter(
            (u) => u.deleted_at && now - new Date(u.deleted_at).getTime() <= THIRTY_DAYS
        ).length;
        return { total, Boarder, Staff, recent };
    }, [users, now]);

    const cards: {
        label: string;
        value: number;
        sub: string;
        icon: typeof Trash2;
        tone: string;
    }[] = [
            {
                label: "Total Deleted Accounts",
                value: stats.total,
                sub: "All archived user accounts",
                icon: Trash2,
                tone: "bg-slate-800 text-white",
            },
            {
                label: "Boarders",
                value: stats.Boarder,
                sub: "Deleted boarder accounts",
                icon: UserIcon,
                tone: "bg-slate-800 text-white",
            },
            {
                label: "Staff",
                value: stats.Staff,
                sub: "Deleted staff accounts",
                icon: Users,
                tone: "bg-slate-800 text-white",
            },
            {
                label: "Recently Deleted",
                value: stats.recent,
                sub: "In the last 30 days",
                icon: CalendarClock,
                tone: "bg-slate-800 text-white",
            },
        ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {cards.map((c) => (
                <div
                    key={c.label}
                    className="rounded-lg border border-slate-200 bg-white px-3.5 py-3 flex items-center gap-3 shadow-sm"
                >
                    <div className={`h-8 w-8 shrink-0 rounded-md flex items-center justify-center ${c.tone}`}>
                        <c.icon size={14} strokeWidth={2} />
                    </div>
                    <div className="min-w-0">
                        <div className="flex items-baseline gap-2">
                            <span className="text-lg font-semibold text-slate-900 leading-none">{c.value}</span>
                            <span className="text-xs font-medium text-slate-600 truncate">{c.label}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate mt-1">{c.sub}</div>
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
        <div className="flex flex-col gap-1 min-w-32">
            <span className="text-[10px] font-medium text-slate-500">{label}</span>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="appearance-none w-full h-8 pl-2.5 pr-7 text-xs rounded-md border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-slate-200 text-slate-700"
                >
                    {options.map((o) => (
                        <option key={o.value} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
                <ChevronDown
                    size={13}
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                />
            </div>
        </div>
    );
}

interface FilterToolbarProps {
    search: string;
    setSearch: (v: string) => void;
    userType: string;
    setUserType: (v: string) => void;
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
    userType,
    setUserType,
    deletedBy,
    setDeletedBy,
    deletedDate,
    setDeletedDate,
    deletedByOptions,
    onClear,
}: FilterToolbarProps) {
    return (
        <div className="flex flex-col xl:flex-row xl:items-end gap-3 px-4 py-3 border-b border-slate-200 bg-white">

            {/* Search */}
            <div className="relative flex-1 min-w-60">
                <Search
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name, email, or username..."
                    className="
            w-full
            h-8
            pl-9
            pr-3
            rounded-md
            border
            border-slate-200
            bg-white
            text-xs
            placeholder:text-slate-400
            focus:outline-none
            focus:ring-2
            focus:ring-slate-700/20
            focus:border-slate-700
            transition
          "
                />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 items-center ">

                <SelectField
                    label="User Type"
                    value={userType}
                    onChange={setUserType}
                    options={[
                        { value: "all", label: "All Types" },
                        { value: "Boarder", label: "Boarder" },
                        { value: "Staff", label: "Staff" },
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
                    className="
            h-8
            px-3
            rounded-md
            border
            border-slate-200
            bg-white
            text-xs
            font-medium
            text-slate-700
            hover:bg-slate-100
            transition
            flex
            items-center
            gap-2
            whitespace-nowrap
          "
                >
                    <ListFilter size={12} />
                    Clear Filters
                </button>

            </div>

        </div>
    );
}


interface DeletedAccountsTableProps {
    users: User[];
    onRestore: (user: User) => void;

}

function DeletedAccountsTable({ users, onRestore }: DeletedAccountsTableProps) {


    if (users.length === 0) {
        return (
            <div className="py-16 text-center text-sm text-slate-400">
                No deleted accounts match your filters.
            </div>
        );
    }

    return (
        <table className="w-full text-xs">
            <thead>
                <tr className="text-left text-[10px] uppercase tracking-wide text-slate-400 border-b border-slate-100">
                    <th className="py-2 px-4 font-medium">User</th>
                    <th className="py-2 px-4 font-medium">User Type</th>
                    <th className="py-2 px-4 font-medium">
                        <span className="inline-flex items-center gap-1">
                            Deleted At <ChevronDown size={12} />
                        </span>
                    </th>
                    <th className="py-2 px-4 font-medium">Deleted By</th>
                    <th className="py-2 px-4 font-medium text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((u) => {
                    const { date, time } = formatDate(u.deleted_at);
                    return (
                        <tr
                            key={u.id}
                            className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                        >
                            <td className="py-2 px-4">
                                <div className="flex items-center gap-3">
                                    {u.avatar_url ? (
                                        <img
                                            src={u.avatar_url}
                                            alt={u.first_name}
                                            className="h-7 w-7 rounded-full object-cover border border-slate-200"
                                        />
                                    ) : (
                                        <div className="h-7 w-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-semibold">
                                            {u.first_name 
                                                ?.split(" ")
                                                .map((n) => n[0])
                                                .join("")
                                                .slice(0, 2)}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-medium text-slate-800 leading-tight">
                                            {u.first_name} {u.last_name}
                                        </div>
                                        <div className="text-[11px] text-slate-400">{u.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-2 px-4">
                                <UserTypeBadge type={u.user_type} />
                            </td>
                            <td className="py-2 px-4">
                                <div className="flex items-center gap-1.5 text-slate-600">
                                    <CalendarClock size={13} className="text-slate-400" />
                                    <div className="leading-tight">
                                        <div>{date}</div>
                                        <div className="text-[11px] text-slate-400">{time}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-2 px-4">
                                <div className="flex items-center gap-2">
                                    {u.deleted_by_avatar ? (
                                        <img
                                            src={u.deleted_by_avatar}
                                            alt={u.deleted_by_name}
                                            className="h-6 w-6 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-6 w-6 rounded-full bg-slate-900 flex items-center justify-center text-[9px] font-medium text-white">
                                            {u.deleted_by_name ? u.deleted_by_name.split(' ').map((n) => n[0]).join('') : ''}
                                        </div>
                                    )}
                                    <div className="leading-tight">
                                        <div className="text-slate-700">{u.deleted_by_name}</div>
                                        <div className="text-[11px] text-slate-400">Administrator</div>
                                    </div>
                                </div>
                            </td>
                            <td className="py-2 px-4">
                                <div className="flex items-center justify-end gap-2">
                                    <button
                                        onClick={() => onRestore(u)}
                                        className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium border border-slate-200 rounded-md hover:bg-slate-50 text-slate-700 transition-colors"
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
            <span className="text-xs text-slate-400">
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


export default function DeletedAccountsPage() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [userType, setUserType] = useState("all");
    const [deletedBy, setDeletedBy] = useState("all");
    const [deletedDate, setDeletedDate] = useState("all");
    const [page, setPage] = useState(1);
    const { deletedUsers, getAllDeletedUsers, recoverDeletedUsers } = useAuth();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRestoreModal, setShowRestoreModal] = useState(false);


    useEffect(() => {
        getAllDeletedUsers();
        //eslint-disable-next-line
    }, []);

    const deletedByOptions: SelectOption[] = useMemo(() => {
        const names = Array.from(
            new Set(deletedUsers.map((u) => u.deleted_by_name).filter((n): n is string => Boolean(n)))
        );
        return names.map((n) => ({ value: n, label: n }));
    }, [deletedUsers]);

    const [now] = useState(() => Date.now());

    const filtered = useMemo(() => {
        return deletedUsers.filter((u) => {
            const q = search.trim().toLowerCase();
            const matchesSearch =
                !q ||
                `${u.first_name} ${u.last_name}`.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                u.username.toLowerCase().includes(q);

            const matchesType = userType === "all" || u.user_type === userType;
            const matchesDeletedBy = deletedBy === "all" || u.deleted_by_name === deletedBy;

            let matchesDate = true;
            if (deletedDate !== "all" && u.deleted_at) {
                const days = Number(deletedDate);
                matchesDate = now - new Date(u.deleted_at).getTime() <= days * 24 * 60 * 60 * 1000;
            }

            return matchesSearch && matchesType && matchesDeletedBy && matchesDate;
        });
    }, [deletedUsers, search, userType, deletedBy, deletedDate, now]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);



    function handleClearFilters() {
        setSearch("");
        setUserType("all");
        setDeletedBy("all");
        setDeletedDate("all");
        setPage(1);
    }

    const handleRestore = async () => {
        if (!selectedUser) return;

        // Close the confirm modal first so the loading/success status modal is the only one visible.
        setShowRestoreModal(false);

        try {
            await recoverDeletedUsers(selectedUser.id);
            getAllDeletedUsers();
        } finally {
            setSelectedUser(null);
        }
    };
    return (
        <div className="h-full overflow-hidden">
            <div className="h-full overflow-y-auto space-y-4 px-6 pb-10 pt-4 bg-gray-50">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900">Deleted Accounts</h1>
                        <p className="text-xs text-slate-500 mt-0.5">
                            These user accounts have been deleted or archived. You can restore them if needed.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/user")}
                        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-3.5 w-3.5" />
                        Back to Users
                    </button>
                </div>

                {/* Stats — separated component */}
                <DeletedAccountsStats users={deletedUsers} />

                {/* Table card */}
                <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <FilterToolbar
                        search={search}
                        setSearch={(v) => {
                            setSearch(v);
                            setPage(1);
                        }}
                        userType={userType}
                        setUserType={(v) => {
                            setUserType(v);
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
                        <DeletedAccountsTable users={pageItems} onRestore={(user) => {
                            setSelectedUser(user);
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
                {showRestoreModal && selectedUser && (
                    <RestoreConfirmModal
                        user={selectedUser}
                        onCancel={() => {
                            setShowRestoreModal(false);
                            setSelectedUser(null);
                        }}
                        onConfirm={handleRestore}
                    />
                )}
            </div>
        </div>
    );
}