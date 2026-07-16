"use client"

import { useEffect } from "react"
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
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import type { User } from "@/store/useAuthStore"
import { useState } from "react"
import DeleteUserModal from "@/components/modal/DeleteUserModal"
import UpdateUserModal from "@/components/modal/UpdateUserModal"
import AssignBoarderModal from "@/components/modal/AssignBoarderModal"
import { useAuthStore } from "@/store/useAuthStore"

const STATUS_CONFIG: Record<User["status"], { strip: string; badge: string; label: string }> = {
    Approved: { strip: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700", label: "Approved" },
    Pending: { strip: "bg-amber-500", badge: "bg-amber-50 text-amber-700", label: "Pending review" },
    Rejected: { strip: "bg-rose-500", badge: "bg-rose-50 text-rose-700", label: "Rejected" },
}

const ROLE_BADGE: Record<string, string> = {
    Admin: "bg-slate-900 text-white",
    Staff: "bg-slate-100 text-slate-700",
    Boarder: "bg-emerald-50 text-emerald-700",
}

const formatDateTime = (value?: string) => {
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
            <div className="flex min-h-screen items-center justify-center bg-white">
                <p className="text-sm text-slate-400">Loading resident profile...</p>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-white">
                <p className="text-sm font-medium text-slate-700">Resident not found</p>
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800"
                >
                    <ArrowLeft size={14} /> Go back
                </button>
            </div>
        )
    }

    const status = STATUS_CONFIG[user.status]
    const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase()

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 pb-15 pt-4 bg-background">

                {/* Top bar */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
                    >
                        <ArrowLeft size={16} /> Back to users
                    </button>

                    <div className="flex items-center gap-2">
                        
                        <button
                            onClick={() => setOpenEdit(true)}
                            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50"
                        >
                            <UserRoundPen size={14} /> Edit
                        </button>
                        <button
                            onClick={() => setOpenDelete(true)}
                            className="flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-[13px] font-medium text-rose-500 transition-colors hover:bg-rose-50"
                        >
                            <Trash2 size={14} /> Delete
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">

                    {/* LEFT — ID badge card */}
                    <aside className="h-fit lg:sticky lg:top-8">
                        <div className={`h-2 rounded-t-2xl ${status.strip}`} />
                        <div className="flex flex-col items-center gap-3 rounded-b-2xl border border-t-0 border-slate-200 px-6 pb-6 pt-7 text-center">

                            {user.avatar_url ? (
                                <img
                                    src={user.avatar_url}
                                    alt={user.username}
                                    className="h-24 w-24 rounded-2xl object-cover ring-1 ring-slate-200"
                                />
                            ) : (
                                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-800 text-2xl font-semibold text-white">
                                    {initials || <UserRound size={28} />}
                                </div>
                            )}

                            <div>
                                <p className="text-base font-semibold text-slate-900">
                                    {user.first_name} {user.last_name}
                                </p>
                                <p className="text-sm text-slate-400">@{user.username}</p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${ROLE_BADGE[user.user_type] ?? "bg-slate-100 text-slate-600"}`}>
                                    {user.user_type}
                                </span>
                                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.badge}`}>
                                    {status.label}
                                </span>
                            </div>

                            {/* Perforated divider — badge tear line */}
                            <div className="relative w-full py-1">
                                <div className="border-t border-dashed border-slate-200" />
                                <div className="absolute -left-6 -top-1.75 h-3.5 w-3.5 rounded-full bg-white ring-1 ring-slate-200" />
                                <div className="absolute -right-6 -top-1.75 h-3.5 w-3.5 rounded-full bg-white ring-1 ring-slate-200" />
                            </div>

                            {/* Serial / ID chip */}
                            <div className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 py-2.5">
                                <IdCard size={14} className="text-slate-400" />
                                <span className="font-mono text-[13px] font-semibold tracking-[0.15em] text-slate-700">
                                    {user.user_id_no}
                                </span>
                            </div>

                            {/* Quick contact */}
                            <div className="w-full space-y-2.5 pt-2 text-left">
                                <InfoLine icon={Mail} value={user.email} />
                                <InfoLine icon={Phone} value={user.contact_number} />
                                {user.address && <InfoLine icon={MapPin} value={user.address} />}
                            </div>
                        </div>
                    </aside>

                    {/* RIGHT — detail sections */}
                    <div className="space-y-6">

                        <SectionCard title="Personal information" icon={UserRound}>
                            <div className="grid grid-cols-2 gap-4">
                                <Stat icon={UserRound} label="Gender" value={user.gender || "Not specified"} />
                                <Stat icon={Cake} label="Age" value={user.age ? `${user.age} years old` : "Not specified"} />
                            </div>
                        </SectionCard>

                        <SectionCard title="Emergency contact" icon={UserPlus}>
                            {user.emergency_contact_name ? (
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <Stat icon={UserPlus} label="Name" value={user.emergency_contact_name} />
                                    <Stat icon={Phone} label="Contact number" value={user.emergency_contact_number || "—"} />
                                    <Stat icon={HeartHandshake} label="Relationship" value={user.emergency_contact_relationship || "—"} />
                                </div>
                            ) : (
                                <EmptyRow label="No emergency contact on file" />
                            )}
                        </SectionCard>

                        <SectionCard title="Identity verification" icon={ShieldCheck}>
                            {user.valid_id_image ? (
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                                    <img
                                        src={user.valid_id_image}
                                        alt="Valid ID"
                                        className="h-32 w-full rounded-xl border border-slate-200 object-cover sm:w-52"
                                    />
                                    <div className="flex flex-1 flex-col gap-2">
                                        <span className={`w-fit rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.badge}`}>
                                            {user.status === "Approved" ? "ID verified" : status.label}
                                        </span>
                                        <a
                                            href={user.valid_id_image}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex w-fit items-center gap-1.5 text-[13px] font-medium text-slate-600 hover:text-slate-900"
                                        >
                                            View full size <ExternalLink size={13} />
                                        </a>
                                    </div>
                                </div>
                            ) : (
                                <EmptyRow icon={ImageOff} label="No ID document uploaded" />
                            )}
                        </SectionCard>

                        <SectionCard title="Account activity" icon={Clock}>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

function SectionCard({
    title,
    icon: Icon,
    children,
}: {
    title: string
    icon: React.ComponentType<{ size?: number; className?: string }>
    children: React.ReactNode
}) {
    return (
        <div className="rounded-2xl border border-slate-200 p-6">
            <div className="mb-4 flex items-center gap-2">
                <Icon size={15} className="text-slate-400" />
                <h2 className="text-[13px] font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
            </div>
            {children}
        </div>
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
            <div>
                <p className="text-[11px] text-slate-400">{label}</p>
                <p className="text-sm font-medium text-slate-800">{value}</p>
            </div>
        </div>
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
        <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 px-4 py-3 text-[13px] text-slate-400">
            <Icon size={15} />
            {label}
        </div>
    )
}

export default ViewUserPage