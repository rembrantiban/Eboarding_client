"use client";

import { useEffect, useMemo, useState } from "react";
import {

    Pencil,
    Trash2,
    Plus,
    X,
    Megaphone,
} from "lucide-react";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import type { Announcement } from "@/store/useAnnouncementStore";

type Category = "Maintenance" | "Billing" | "General";
type CategoryFilter = "All" | Category;



const categories: Category[] = ["Maintenance", "Billing", "General"];
const categoryFilters: CategoryFilter[] = ["All", ...categories];

const categoryStyles: Record<Category, string> = {
    Maintenance: "bg-amber-50 text-amber-700",
    Billing: "bg-rose-50 text-rose-700",
    General: "bg-slate-100 text-slate-600",
};

// TODO: replace with real data from useAnnouncements hook




export default function AdminAnnouncementsPage() {
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
    const { loading, getMyAnnouncements, myAnnouncements, updateAnnouncement, createAnnouncement } = useAnnouncement();
    const [editing, setEditing] = useState<Announcement | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [draft, setDraft] = useState(() => ({
        category: "General" as Category,
        title: "",
        description: ""

    }));
    const [pendingDelete, setPendingDelete] = useState<Announcement | null>(null);

    useEffect(() => {
        getMyAnnouncements();
    }, [getMyAnnouncements]);

    const filtered = useMemo(() => {
        const list =
            activeCategory === "All"
                ? myAnnouncements
                : myAnnouncements.filter((a) => a.category === activeCategory);
        return [...list];
    }, [myAnnouncements, activeCategory]);

    const openCreate = () => {
        setDraft(() => ({
            category: "General" as Category,
            title: "",
            description: ""
        }));
        setIsCreating(true);
    };

    const openEdit = (item: Announcement) => {
        setDraft({ category: item.category, title: item.title, description: item.description });
        setEditing(item);
    };

    const closeForm = () => {
        setIsCreating(false);
        setEditing(null);
    };

    const saveDraft = async () => {
        if (!draft.title.trim() || !draft.description.trim() || !draft.category) return;

        try {
            if (editing) {
                await updateAnnouncement(editing.id, {
                    title: draft.title,
                    description: draft.description,
                    category: draft.category,
                });
            } else {
                await createAnnouncement({
                    title: draft.title,
                    description: draft.description,
                    category: draft.category,
                });
            }

            await getMyAnnouncements();

            closeForm();

        } catch (error) {
            console.error(error);
        }
    };





    const confirmDelete = () => {
        if (!pendingDelete) return;
        // TODO: call your real delete mutation here
        getMyAnnouncements();
        setPendingDelete(null);
    };

    const isFormOpen = isCreating || editing !== null;

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 py-14 bg-background">
                <div className="mx-auto max-w-3xl space-y-6">

                    {/* Header */}
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h1 className="text-xl font-semibold text-slate-900">
                                Announcements
                            </h1>
                            <p className="mt-0.5 text-sm text-slate-500">
                                Manage updates sent to boarders
                            </p>
                        </div>
                        <button
                            onClick={openCreate}
                            className="flex shrink-0 items-center gap-1.5 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                        >
                            <Plus size={16} />
                            New
                        </button>
                    </div>

                    {/* Category filter */}
                    <div className="flex gap-2 overflow-x-auto pb-1">
                        {categoryFilters.map((category) => (
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
                                    Nothing here yet
                                </p>
                                <p className="mt-0.5 text-xs text-slate-500">
                                    Create an announcement to get started
                                </p>
                            </div>
                        ) : (
                            filtered.map((item) => (
                                <article
                                    key={item.id}
                                    className="rounded-2xl border border-slate-200 bg-white p-6"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            {item.created_by_avatar ? (
                                                <img
                                                    src={item.created_by_avatar}
                                                    alt={item.created_by_name}
                                                    className="h-10 w-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                                                    {item.created_by_name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()}
                                                </div>
                                            )}

                                            <div>
                                                <p className="text-sm font-medium text-slate-900">
                                                    {item.created_by_name}
                                                </p>

                                                <p className="text-xs text-slate-500">
                                                    {new Date(item.created_at).toLocaleDateString("en-US", {
                                                        month: "long",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${categoryStyles[item.category]}`}>
                                            {item.category}
                                        </span>
                                    </div>

                                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                                        {item.description}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">

                                        <div className="flex items-center gap-1">

                                            <button
                                                onClick={() => openEdit(item)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                                title="Edit"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => setPendingDelete(item)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                </article>
                            ))
                        )}
                    </section>
                </div>

                {/* Create / Edit modal */}
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={closeForm}
                        />

                        <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold text-slate-900">
                                    {editing ? "Edit Announcement" : "New Announcement"}
                                </h2>
                                <button
                                    onClick={closeForm}
                                    className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="mt-5 space-y-4">

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                        Category
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {categories.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setDraft((d) => ({ ...d, category: c }))}
                                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${draft.category === c
                                                    ? "bg-slate-900 text-white"
                                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                        Title
                                    </label>
                                    <input
                                        value={draft.title}
                                        onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                                        placeholder="Announcement title"
                                        className="h-10 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-xs font-medium text-slate-600">
                                        Message
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={draft.description}
                                        onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
                                        placeholder="Write the announcement details..."
                                        className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                                    />
                                </div>

                            </div>

                            <div className="mt-6 flex justify-end gap-2.5">
                                <button
                                    onClick={closeForm}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveDraft}
                                    disabled={!draft.title.trim() || !draft.description.trim()}
                                    className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                                >
                                    {loading ? "Saving..." : editing ? "Save Changes" : "Post Announcement"}
                                </button>
                            </div>

                        </div>
                    </div>
                )}

                {/* Delete confirmation */}
                {pendingDelete && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                            onClick={() => setPendingDelete(null)}
                        />

                        <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50">
                                <Trash2 size={18} className="text-rose-600" />
                            </div>
                            <h2 className="mt-4 text-base font-semibold text-slate-900">
                                Delete this announcement?
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                "{pendingDelete.title}" will be permanently removed and boarders will no longer see it.
                            </p>

                            <div className="mt-6 flex justify-end gap-2.5">
                                <button
                                    onClick={() => setPendingDelete(null)}
                                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}