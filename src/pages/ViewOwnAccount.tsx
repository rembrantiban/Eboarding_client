"use client";

import { useNavigate } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    MapPin,
    AtSign,
    BadgeCheck,
    Pencil,
    HeartHandshake,
    Users,
    type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

type InfoRowProps = {
    icon: LucideIcon;
    label: string;
    value: string | undefined;
    sub?: string;
};
function InfoRow({ icon: Icon, label, value, sub }: InfoRowProps) {
    return (
        <div className="flex items-start gap-3 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100">
                <Icon size={16} className="text-slate-500" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-slate-500">{label}</p>
                {value ? (
                    <p className="mt-0.5 truncate text-sm font-medium text-slate-900">
                        {value}
                    </p>
                ) : (
                    <p className="mt-0.5 text-sm italic text-slate-400">Not provided</p>
                )}
                {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
            </div>
        </div>
    );
}

export default function PersonalInformation() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const fullName = `${user?.first_name} ${user?.last_name}`;
    const initials = `${user?.first_name[0] ?? ""}${
        user?.last_name[0] ?? ""
    }`.toUpperCase();

    const hasEmergencyContact =
        user?.emergency_contact_name ||
        user?.emergency_contact_number ||
        user?.emergency_contact_relationship;

    return (
        <div className="min-h-screen  px-6 py-8">
            <div className="mx-auto max-w-3xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Personal information
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Your details on file with management
                        </p>
                    </div>
                    <button
                        onClick={() => navigate("/edit-account")}
                        className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                    >
                        <Pencil size={14} />
                        Edit
                    </button>
                </div>

                {/* Identity card */}
                <section className="rounded-2xl bg-slate-900 p-6 sm:p-8">
                    <div className="flex items-center gap-4">
                        {user?.avatar_url ? (
                            <img
                                src={user.avatar_url}
                                alt={`${user.first_name} ${user.last_name}`}
                                className="h-16 w-16 border-2 border-slate-400 rounded-full object-cover"
                            />
                        ) : (
                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg font-semibold text-white">
                                {initials}
                            </div>
                        )}
                        <div className="min-w-0">
                            <p className="truncate text-lg font-semibold text-white">
                                {fullName}
                            </p>
                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">
                                    <AtSign size={11} />
                                    {user?.username}
                                </span>
                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-medium text-emerald-300">
                                    <BadgeCheck size={11} />
                                    {user?.user_type}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact details */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="text-sm font-semibold text-slate-900">
                        Contact details
                    </h2>
                    <div className="mt-1 divide-y divide-slate-100">
                        <InfoRow
                            icon={User}
                            label="First name"
                            value={user?.first_name}
                        />
                        <InfoRow
                            icon={User}
                            label="Last name"
                            value={user?.last_name}
                        />
                        <InfoRow icon={Mail} label="Email" value={user?.email} />
                        <InfoRow
                            icon={Phone}
                            label="Phone number"
                            value={user?.contact_number}
                        />
                        <InfoRow
                            icon={MapPin}
                            label="Address"
                            value={user?.address}
                        />
                    </div>
                </section>

                {/* Emergency contact */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                                <HeartHandshake size={15} className="text-rose-500" />
                                Emergency contact
                            </h2>
                            <p className="mt-0.5 text-xs text-slate-400">
                                Who to reach in case of an emergency
                            </p>
                        </div>
                        {!hasEmergencyContact && (
                            <button
                                onClick={() => navigate("/edit-account")}
                                className="text-xs font-medium text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline"
                            >
                                Add now
                            </button>
                        )}
                    </div>

                    <div className="mt-1 divide-y divide-slate-100">
                        <InfoRow
                            icon={User}
                            label="Contact name"
                            value={user?.emergency_contact_name}
                        />
                        <InfoRow
                            icon={Phone}
                            label="Contact number"
                            value={user?.emergency_contact_number}
                        />
                        <InfoRow
                            icon={Users}
                            label="Relationship"
                            value={user?.emergency_contact_relationship}
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}