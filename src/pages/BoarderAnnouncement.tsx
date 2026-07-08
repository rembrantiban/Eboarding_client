"use client";

import { useState } from "react";
import { Pin, Bell, MessageCircle, ChevronRight, Megaphone } from "lucide-react";

type Category = "All" | "Maintenance" | "Billing" | "Events" | "General";

// TODO: replace with real data from useAnnouncements hook
const categories: Category[] = ["All", "Maintenance", "Billing", "Events", "General"];

const pinnedAnnouncement = {
    id: "0",
    author: "Management Office",
    avatar: "/avatar.jpg",
    date: "Jul 5, 2026",
    category: "Maintenance" as Category,
    title: "Water interruption scheduled this Saturday",
    body:
        "Water service will be temporarily unavailable from 8:00 AM to 12:00 PM this Saturday, July 11, for scheduled maintenance of the main line. Please store water in advance.",
};

const announcements = [
    {
        id: "1",
        author: "Management Office",
        avatar: "/avatar.jpg",
        date: "Jul 3, 2026",
        category: "Billing" as Category,
        title: "July rent statements are now available",
        body:
            "You can now view and download your July billing statement from the Payments tab. Please settle your balance on or before the 15th to avoid late fees.",
        comments: 4,
    },
    {
        id: "2",
        author: "Management Office",
        avatar: "/avatar.jpg",
        date: "Jun 28, 2026",
        category: "Events" as Category,
        title: "Boarders' movie night this Friday",
        body:
            "Join us at the common lounge this Friday at 7 PM for a movie night. Snacks will be provided. Feel free to bring suggestions for what we should watch next month.",
        comments: 12,
    },
    {
        id: "3",
        author: "Management Office",
        avatar: "/avatar.jpg",
        date: "Jun 20, 2026",
        category: "General" as Category,
        title: "Updated house rules on visitor hours",
        body:
            "Starting July 1, visitor hours will be extended to 9 PM on weekdays and 10 PM on weekends. Please remind your guests to log in at the front desk.",
        comments: 2,
    },
];

const categoryStyles: Record<Category, string> = {
    All: "bg-slate-100 text-slate-600",
    Maintenance: "bg-amber-50 text-amber-700",
    Billing: "bg-rose-50 text-rose-700",
    Events: "bg-emerald-50 text-emerald-700",
    General: "bg-slate-100 text-slate-600",
};

export default function AnnouncementsPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");

    const filtered =
        activeCategory === "All"
            ? announcements
            : announcements.filter((a) => a.category === activeCategory);

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-8">
            <div className="mx-auto max-w-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold text-slate-900">
                            Announcements
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Updates from the management office
                        </p>
                    </div>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-500 hover:text-slate-900">
                        <Bell size={16} />
                    </button>
                </div>

                {/* Category filter */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                                activeCategory === category
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-slate-500 hover:text-slate-900"
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Pinned announcement */}
                {activeCategory === "All" && (
                    <section className="rounded-2xl bg-slate-900 p-6">
                        <div className="flex items-center gap-2 text-xs font-medium text-white/60">
                            <Pin size={12} />
                            Pinned
                        </div>
                        <h2 className="mt-3 text-base font-semibold text-white">
                            {pinnedAnnouncement.title}
                        </h2>
                        <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                            {pinnedAnnouncement.body}
                        </p>
                        <div className="mt-4 flex items-center gap-3 text-xs text-white/50">
                            <span>{pinnedAnnouncement.author}</span>
                            <span>·</span>
                            <span>{pinnedAnnouncement.date}</span>
                        </div>
                    </section>
                )}

                {/* Feed */}
                <section className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                                <Megaphone size={18} className="text-slate-400" />
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-900">
                                Nothing here yet
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                                Announcements in this category will show up here
                            </p>
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <article
                                key={item.id}
                                className="rounded-2xl bg-white p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.avatar}
                                            alt=""
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {item.author}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {item.date}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                                            categoryStyles[item.category]
                                        }`}
                                    >
                                        {item.category}
                                    </span>
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                    {item.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                                    {item.body}
                                </p>

                                <button className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900">
                                    <MessageCircle size={14} />
                                    {item.comments} comments
                                    <ChevronRight size={12} />
                                </button>
                            </article>
                        ))
                    )}
                </section>
            </div>
        </div>
    );
}