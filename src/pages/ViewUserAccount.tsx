"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Cake,
    UserRound,
    IdCard,
    ShieldCheck,
    UserRoundPen,
    Trash2,
    Clock,
    ExternalLink,
    ImageOff,
    UserPlus,
    HeartHandshake,
    Globe,
    Wrench,
    CircleCheck,
    CircleSlash,
    Activity,
    TriangleAlert,
    FileBadge,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import type { User } from "@/store/useAuthStore"
import DeleteUserModal from "@/components/modal/DeleteUserModal"
import UpdateUserModal from "@/components/modal/UpdateUserModal"
import AssignBoarderModal from "@/components/modal/AssignBoarderModal"
import { useAuthStore } from "@/store/useAuthStore"


type Tone = "emerald" | "amber" | "rose" | "slate"

const TONE: Record<Tone, { strip: string; badge: string; dot: string }> = {
    emerald: {
        strip: "bg-emerald-500",
        badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        dot: "bg-emerald-500",
    },
    amber: {
        strip: "bg-amber-500",
        badge: "bg-amber-50 text-amber-700 ring-amber-100",
        dot: "bg-amber-500",
    },
    rose: {
        strip: "bg-rose-500",
        badge: "bg-rose-50 text-rose-700 ring-rose-100",
        dot: "bg-rose-500",
    },
    slate: {
        strip: "bg-slate-400",
        badge: "bg-slate-100 text-slate-600 ring-slate-200",
        dot: "bg-slate-400",
    },
}

const toneOf = (value?: string | null): Tone => {
    if (!value) return "slate"
    const v = String(value).toLowerCase()
    if (["approved", "active", "verified", "assigned", "completed", "resolved"].includes(v)) return "emerald"
    if (["under review", "pending", "review", "unassigned", "on hold"].includes(v)) return "amber"
    if (["rejected", "suspended", "banned", "inactive", "deactivated", "closed"].includes(v)) return "rose"
    return "slate"
}

const ROLE_BADGE: Record<string, string> = {
    Admin: "bg-slate-900 text-white ring-slate-900",
    Staff: "bg-slate-100 text-slate-700 ring-slate-200",
    Boarder: "bg-emerald-50 text-emerald-700 ring-emerald-100",
}



const formatDateTime = (value?: string | null) => {
    if (!value) return "N/A"
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return "N/A"
    return new Intl.DateTimeFormat("en", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    }).format(d)
}

const formatPhone = (code?: string, number?: string) => {
    if (!number) return "N/A"
    if (!code) return number
    const trimmed = String(code).trim()
    const prefix = trimmed.startsWith("+") ? trimmed : `+${trimmed}`
    return `${prefix} ${number}`
}


const ViewUserPage = () => {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const { users, getUsers, isLoading } = useAuth()

    const [openEdit, setOpenEdit] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)
    const [openAssign, setOpenAssign] = useState(false)

    useEffect(() => {
        if (!users || users.length === 0) getUsers()
    }, [users, getUsers])

    const user = users?.find((u) => String(u.id) === id)

    const handleDeleteSuccess = () => {
        useAuthStore.setState((state) => ({
            users: state.users.filter((u) => u.id !== user?.id),
        }))
        navigate(-1)
    }

    const handleUpdateSuccess = (updated: User) => {
        useAuthStore.setState((state) => ({
            users: state.users.map((u) => (u.id === updated.id ? updated : u)),
        }))
    }

    if (isLoading && !user) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="flex items-center gap-2.5 text-sm text-slate-400">
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-200 border-t-slate-500" />
                    Loading resident profile…
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex h-screen flex-col items-center justify-center gap-3 bg-background">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                    <UserRound size={20} className="text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-700">Resident not found</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
                >
                    <ArrowLeft size={14} /> Go back
                </button>
            </div>
        )
    }

    const isBoarder = user.user_type === "Boarder"
    const isStaff = user.user_type === "Staff"

    const idTone = TONE[toneOf(user.valid_id_status)]
    const accountTone = TONE[toneOf(user.account_status as unknown as string)]
    const statusTone = TONE[toneOf(user.status as unknown as string)]

    // Strip reflects ID verification for boarders, account standing otherwise.
    const stripTone = user.is_deleted ? TONE.rose : isBoarder ? idTone : accountTone

    const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto rounded-tl-2xl border-l-2 border-t-2 bg-background px-4 pb-16 pt-4 sm:px-6">

              
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                    >
                        <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
                        Back to users
                    </button>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setOpenEdit(true)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                            <UserRoundPen size={14} /> Edit
                        </button>
                        <button
                            onClick={() => setOpenDelete(true)}
                            className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-white px-3 py-2 text-[13px] font-medium text-rose-500 transition-colors hover:border-rose-300 hover:bg-rose-50"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>
                {user.is_deleted && (
                    <div className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 px-5 py-4">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-100">
                            <TriangleAlert size={16} className="text-rose-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-[13px] font-semibold text-rose-800">This account has been archived</p>
                            <p className="text-[12px] text-rose-600">
                                Deleted {formatDateTime(user.deleted_at)}
                                {user.deleted_by_name ? ` · by ${user.deleted_by_name}` : ""}
                            </p>
                        </div>
                        {user.deleted_by_avatar && (
                            <img
                                src={user.deleted_by_avatar}
                                alt={user.deleted_by_name ?? "Deleted by"}
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-white"
                            />
                        )}
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[330px_1fr]">

                    <aside className="h-fit lg:sticky lg:top-4">
                        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.10)]">
                            <div className={`h-1.5 ${stripTone.strip}`} />

                            <div className="flex flex-col items-center gap-3 px-6 pb-6 pt-7 text-center">
                                <div className="relative">
                                    {user.avatar_url ? (
                                        <img
                                            src={user.avatar_url}
                                            alt={user.username}
                                            className="h-24 w-24 rounded-2xl object-cover ring-1 ring-slate-200"
                                        />
                                    ) : (
                                        <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 text-2xl font-semibold tracking-wide text-white">
                                            {initials || <UserRound size={28} />}
                                        </div>
                                    )}
                                    <span
                                        className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full ring-[3px] ring-white ${statusTone.dot}`}
                                        title={String(user.status ?? "")}
                                    />
                                </div>

                                <div className="space-y-0.5">
                                    <p className="text-base font-semibold tracking-tight text-slate-900">
                                        {user.first_name} {user.last_name}
                                    </p>
                                    <p className="text-sm text-slate-400">@{user.username}</p>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                    <Pill className={ROLE_BADGE[user.user_type] ?? "bg-slate-100 text-slate-600 ring-slate-200"}>
                                        {user.user_type}
                                    </Pill>
                                    {isBoarder && <Pill className={idTone.badge}>{user.valid_id_status}</Pill>}
                                    {user.account_status && (
                                        <Pill className={accountTone.badge}>{String(user.account_status)}</Pill>
                                    )}
                                </div>

                                {/* Perforated tear line */}
                                <div className="relative w-full py-1.5">
                                    <div className="border-t border-dashed border-slate-200" />
                                    <div className="absolute -left-7.5 -top-1.5 h-3.5 w-3.5 rounded-full border border-slate-200 bg-background" />
                                    <div className="absolute -right-7.5 -top-1.5 h-3.5 w-3.5 rounded-full border border-slate-200 bg-background" />
                                </div>

                                {/* Serial chip */}
                                <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-50 py-2.5 ring-1 ring-inset ring-slate-100">
                                    <IdCard size={14} className="text-slate-400" />
                                    <span className="font-mono text-[13px] font-semibold tracking-[0.15em] text-slate-700">
                                        {user.user_id_no}
                                    </span>
                                </div>

                                {/* Quick contact */}
                                <div className="w-full space-y-2.5 pt-2 text-left">
                                    <InfoLine icon={Mail} value={user.email} />
                                    {!isStaff && (
                                        <InfoLine icon={Phone} value={formatPhone(user.country_code, user.contact_number)} />
                                    )}
                                    {!isStaff && (
                                        <InfoLine icon={Globe} value={user.nationality || "Nationality not set"} />
                                    )}
                                    {!isStaff && user.address && <InfoLine icon={MapPin} value={user.address} />}
                                </div>
                            </div>
                        </div>
                    </aside>


                    <div className="space-y-6">

                        <SectionCard title="Personal information" icon={UserRound}>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                                {!isStaff && (
                                    <Stat icon={UserRound} label="Gender" value={user.gender || "Not specified"} />
                                )}
                                {!isStaff && (
                                    <Stat
                                        icon={Cake}
                                        label="Age"
                                        value={user.age ? `${user.age} years old` : "Not specified"}
                                    />
                                )}
                                {!isStaff && (
                                    <Stat icon={Globe} label="Nationality" value={user.nationality || "Not specified"} />
                                )}
                                {!isStaff && (
                                    <Stat
                                        icon={Phone}
                                        label="Contact number"
                                        value={formatPhone(user.country_code, user.contact_number)}
                                    />
                                )}

                                <Stat icon={Mail} label="Email" value={user.email} />

                                {!isStaff && (
                                    <Stat icon={MapPin} label="Address" value={user.address || "Not specified"} />
                                )}
                            </div>
                        </SectionCard>


                        {isBoarder && (
                            <SectionCard title="Emergency contact" icon={UserPlus}>
                                {user.emergency_contact_name ? (
                                    <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-3">
                                        <Stat icon={UserPlus} label="Name" value={user.emergency_contact_name} />
                                        <Stat
                                            icon={Phone}
                                            label="Contact number"
                                            value={user.emergency_contact_number || "—"}
                                        />
                                        <Stat
                                            icon={HeartHandshake}
                                            label="Relationship"
                                            value={user.emergency_contact_relationship || "—"}
                                        />
                                    </div>
                                ) : (
                                    <EmptyRow icon={UserPlus} label="No emergency contact on file" />
                                )}
                            </SectionCard>
                        )}

                        {isBoarder && (
                            <SectionCard
                                title="Identity verification"
                                icon={ShieldCheck}
                                action={<Pill className={idTone.badge}>{user.valid_id_status}</Pill>}
                            >
                                {user.valid_id_image ? (
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                        <a
                                            href={user.valid_id_image}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group relative block overflow-hidden rounded-xl border border-slate-200 sm:w-56"
                                        >
                                            <img
                                                src={user.valid_id_image}
                                                alt="Valid ID"
                                                className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03] sm:w-56"
                                            />
                                            <span className="absolute inset-0 bg-slate-900/0 transition-colors group-hover:bg-slate-900/10" />
                                        </a>

                                        <div className="flex flex-1 flex-col gap-4">
                                            <Stat
                                                icon={FileBadge}
                                                label="Document type"
                                                value={user.valid_id_type || "Not specified"}
                                            />
                                            <a
                                                href={user.valid_id_image}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex w-fit items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                                            >
                                                View full size <ExternalLink size={12} />
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <EmptyRow icon={ImageOff} label="No ID document uploaded" />
                                )}
                            </SectionCard>
                        )}

                        {isStaff && (
                            <SectionCard title="Maintenance workload" icon={Wrench}>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <Tile
                                        icon={Activity}
                                        label="Active requests"
                                        value={String(user.active_requests ?? 0)}
                                    />
                                    <Tile
                                        icon={CircleCheck}
                                        label="Resolved"
                                        value={String(user.completed_requests ?? 0)}
                                    />
                                    <Tile
                                        icon={CircleSlash}
                                        label="Closed"
                                        value={String(user.closed_requests ?? 0)}
                                    />
                                </div>
                            </SectionCard>
                        )}

                        <SectionCard title="Account activity" icon={Clock}>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
                                <Stat icon={Activity} label="Status" value={String(user.status ?? "—")} />
                                <Stat
                                    icon={ShieldCheck}
                                    label="Account status"
                                    value={String(user.account_status ?? "—")}
                                />
                                <Stat icon={Clock} label="Created" value={formatDateTime(user.created_at)} />
                                <Stat icon={Clock} label="Last updated" value={formatDateTime(user.updated_at)} />
                            </div>
                        </SectionCard>

                    </div>
                </div>
            </div>

            <DeleteUserModal
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                userId={user.id}
                onSuccess={handleDeleteSuccess}
            />
            <UpdateUserModal
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                user={user}
                onSuccess={handleUpdateSuccess}
            />
            <AssignBoarderModal
                open={openAssign}
                onClose={() => setOpenAssign(false)}
                user={user}
            />
        </div>
    )
}

/* ------------------------------------------------------------------ */
/* Presentational bits                                                 */
/* ------------------------------------------------------------------ */

function SectionCard({
    title,
    icon: Icon,
    action,
    children,
}: {
    title: string
    icon: React.ComponentType<{ size?: number; className?: string }>
    action?: React.ReactNode
    children: React.ReactNode
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
            <div className="mb-5 flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                    <Icon size={15} className="text-slate-400" />
                    <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                        {title}
                    </h2>
                </div>
                {action}
            </div>
            {children}
        </section>
    )
}

function Stat({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>
    label: string
    value: string
}) {
    return (
        <div className="flex items-start gap-2.5">
            <Icon size={15} className="mt-0.5 shrink-0 text-slate-300" />
            <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
                <p className="wrap-break-words text-sm font-medium text-slate-800">{value}</p>
            </div>
        </div>
    )
}

function Tile({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>
    label: string
    value: string
}) {
    return (
        <div className="rounded-xl border border-slate-100 bg-slate-50/70 px-4 py-3">
            <div className="mb-1 flex items-center gap-1.5">
                <Icon size={13} className="text-slate-400" />
                <p className="text-[11px] uppercase tracking-wide text-slate-400">{label}</p>
            </div>
            <p className="text-lg font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
    )
}

function Pill({ className = "", children }: { className?: string; children: React.ReactNode }) {
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${className}`}
        >
            {children}
        </span>
    )
}

function InfoLine({
    icon: Icon,
    value,
}: {
    icon: React.ComponentType<{ size?: number; className?: string }>
    value: string
}) {
    return (
        <div className="flex items-center gap-2 text-[13px] text-slate-600">
            <Icon size={13} className="shrink-0 text-slate-400" />
            <span className="truncate">{value}</span>
        </div>
    )
}

function EmptyRow({
    icon: Icon = ImageOff,
    label,
}: {
    icon?: React.ComponentType<{ size?: number; className?: string }>
    label: string
}) {
    return (
        <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-4 text-[13px] text-slate-400">
            <Icon size={15} />
            {label}
        </div>
    )
}

export default ViewUserPage