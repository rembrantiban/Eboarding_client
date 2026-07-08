"use client";

import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    User,
    ReceiptSwissFranc,
    LogOut,
    Bed,
    Bell,
    Layers
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useAnnouncement } from "@/hooks/useAnnouncement"
import { useEffect } from "react";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: "/boarder-dashboard" },
    { label: "Profile", icon: Layers, path: "/view-account" },
    { label: "Bed & Room", icon: Bed, path: "/my-room" },
    { label: "Edit profile", icon: User, path: "/edit-account" },
    { label: "Announcements", icon: Bell, path: "/boarder/announcements" },
    { label: "Payment History", icon: ReceiptSwissFranc, path: "/payment-history" },
];

export default function Sidebar() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { markAllAsRead, getUnreadCount, unreadCount } = useAnnouncement();

    useEffect(() => {
        getUnreadCount()
    }, [getUnreadCount]);

    console.log(unreadCount);
    const currentPath =
        typeof window !== "undefined" ? window.location.pathname : "";

    return (
        <aside className="sticky top-8 w-64 shrink-0 px-5 py-8">
            {/* User */}
            <button
                onClick={() => navigate("/profile")}
                className="w-full rounded-2xl p-3 text-left transition-colors hover:bg-slate-100"
            >
                <div className="flex items-center gap-3">
                    {user?.avatar_url ? (
                        <img
                            src={user.avatar_url}
                            alt={`${user.first_name} ${user.last_name}`}
                            className="h-11 w-13 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-11 w-14 rounded-full bg-slate-900 text-lg font-bold text-emerald-100 flex items-center justify-center">
                            {user?.first_name?.charAt(0).toUpperCase()}{user?.last_name?.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold text-slate-900">
                            {user?.first_name} {user?.last_name}
                        </h2>
                        <p className="truncate text-xs text-slate-500">
                            {user?.email}
                        </p>
                    </div>
                </div>
            </button>

            {/* Navigation */}
            <nav className="mt-6 space-y-1">
                {navItems.map(({ label, icon: Icon, path }) => {
                    const isActive = currentPath === path;

                    return (
                        <button
                            key={path}
                            onClick={async () => {
                                if (path === "/boarder/announcements") {
                                    await markAllAsRead();
                                    await getUnreadCount();
                                }

                                navigate(path);
                            }}
                            className={`
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-4
                                    py-2.5
                                    text-left
                                    text-sm
                                    transition-colors
                                    ${isActive
                                    ? "bg-slate-900 font-medium text-white"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }
                        `}
                        >
                            
                            <Icon size={18} />
                            <span>{label}</span>
                            {label === "Announcements" && unreadCount > 0 && (
                                <span className="flex h-4 w-4 items-center justify-center rounded-full  bg-red-500 px-1.5 text-[10px] font-semibold text-white">
                                    {unreadCount}
                                </span>
                            )}

                        </button>
                    );
                })}
            </nav>

            {/* Push Bottom */}
            <div className="flex-1" />

            {/* Logout */}
            <button
                onClick={() => {
                    // TODO: wire to real signOut handler
                    navigate("/login");
                }}
                className="mt-6 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-left text-sm text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-600"
            >
                <LogOut size={18} />
                Sign out
            </button>
        </aside>
    );
}