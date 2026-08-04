"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Megaphone, Search, X } from "lucide-react";
import { useAnnouncementStore } from "@/store/useAnnouncementStore";

type Category = "All" | "Maintenance" | "Billing" | "General";

// TODO: replace with real data from useAnnouncements hook
const categories: Category[] = ["All", "Maintenance", "Billing", "General"];




const categoryStyles: Record<Category, string> = {
    All: "bg-slate-100 text-slate-600",
    Maintenance: "bg-amber-50 text-amber-700",
    Billing: "bg-rose-50 text-rose-700",
    General: "bg-slate-100 text-slate-600",
};

export default function AnnouncementsPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("All");
    const [search, setSearch] = useState("");
    const { announcements, getAnnouncements } = useAnnouncementStore();

    useEffect(() => {
        getAnnouncements();
    }, [getAnnouncements]);

    const filtered = useMemo(() => {
        const list =
            activeCategory === "All"
                ? announcements
                : announcements.filter((a) => a.category === activeCategory);

        const query = search.trim().toLowerCase();
        if (!query) return list;

        return list.filter(
            (a) =>
                a.title.toLowerCase().includes(query) ||
                a.description.toLowerCase().includes(query) ||
                a.created_by_name.toLowerCase().includes(query)
        );
    }, [announcements, activeCategory, search]);

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

                {/* Search */}
                <div className="relative">
                    <Search
                        size={15}
                        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search announcements..."
                        className="h-10 w-full rounded-full border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <X size={12} />
                        </button>
                    )}
                </div>

                {/* Category filter */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${activeCategory === category
                                    ? "bg-slate-900 text-white"
                                    : "bg-white text-slate-500 hover:text-slate-900"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>


                {/* Feed */}
                <section className="space-y-4">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl bg-white py-16 text-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                                <Megaphone size={18} className="text-slate-400" />
                            </div>
                            <p className="mt-3 text-sm font-medium text-slate-900">
                                {search ? "No matching announcements" : "Nothing here yet"}
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500">
                                {search
                                    ? "Try a different search term"
                                    : "Announcements in this category will show up here"}
                            </p>
                        </div>
                    ) : (
                        filtered.map((item) => (
                            <article
                                key={item.notification_id}
                                className="rounded-2xl bg-white p-6"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.created_by_avatar || ""}
                                            alt=""
                                            className="h-10 w-10 rounded-full object-cover"
                                        />
                                        <div>
                                            <p className="text-sm font-medium text-slate-900">
                                                {item.created_by_name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(item.created_at).toLocaleDateString(
                                                    "en-US",
                                                    {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyles[item.category]
                                            }`}
                                    >
                                        {item.category}
                                    </span>
                                </div>

                                <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                    {item.title}
                                </h3>
                                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                                    {item.description}
                                </p>
                            </article>
                        ))
                    )}
                </section>
            </div>
        </div>
    );
}