"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Pencil,
    Plus,
    X,
    Megaphone,
    Search,
    Archive,
    ArchiveRestore,
    Inbox,
    Loader2,
} from "lucide-react";
import { useAnnouncement } from "@/hooks/useAnnouncement";
import type { Announcement } from "@/store/useAnnouncementStore";
import { useAuth } from "@/hooks/useAuth";

type Category = "Maintenance" | "Billing" | "General";
type CategoryFilter = "All" | Category;
type AudienceFilter = "All" | "Boarders" | "Staff";
type ViewMode = "Active" | "Archived";

const categories: Category[] = ["Maintenance", "Billing", "General"];
const categoryFilters: CategoryFilter[] = ["All", ...categories];
const audienceFilters: AudienceFilter[] = ["All", "Boarders", "Staff"];

const categoryStyles: Record<Category, string> = {
    Maintenance: "bg-amber-50 text-amber-700 ring-amber-100",
    Billing: "bg-rose-50 text-rose-700 ring-rose-100",
    General: "bg-slate-100 text-slate-600 ring-slate-200/70",
};

export default function AdminAnnouncementsPage() {
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");
    const [activeAudience, setActiveAudience] = useState<AudienceFilter>("All");
    const [view, setView] = useState<ViewMode>("Active");
    const [search, setSearch] = useState("");

    const { user } = useAuth();
    const {
        loading,
        getMyAnnouncements,
        myAnnouncements,
        updateAnnouncement,
        createAnnouncement,
        archiveAnnouncement,
        restoreAnnouncement,
    } = useAnnouncement();

    const [editing, setEditing] = useState<Announcement | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [pendingArchive, setPendingArchive] = useState<Announcement | null>(null);
    const [pendingRestore, setPendingRestore] = useState<Announcement | null>(null);
    const [working, setWorking] = useState(false);

    const audiences = ["Boarders", "Staff", "All"] as const;
    const isAdmin = user?.user_type === "Admin";

    const [draft, setDraft] = useState({
        category: "General" as Category,
        audience: "Boarders" as "Boarders" | "Staff" | "All",
        title: "",
        description: "",
    });

    useEffect(() => {
        getMyAnnouncements();
    }, [getMyAnnouncements]);

    const counts = useMemo(() => {
        const active = myAnnouncements.filter((a) => a.status !== "Archived").length;
        return { active, archived: myAnnouncements.length - active };
    }, [myAnnouncements]);

    const filtered = useMemo(() => {
        const byView = myAnnouncements.filter((a) =>
            view === "Archived" ? a.status === "Archived" : a.status !== "Archived"
        );

        const byCategory =
            activeCategory === "All"
                ? byView
                : byView.filter((a) => a.category === activeCategory);

        const byAudience =
            activeAudience === "All"
                ? byCategory
                : byCategory.filter(
                      (a) => a.audience === activeAudience || a.audience === "All"
                  );

        const query = search.trim().toLowerCase();
        if (!query) return byAudience;

        return byAudience.filter(
            (a) =>
                a.title.toLowerCase().includes(query) ||
                a.description.toLowerCase().includes(query) ||
                a.created_by_name.toLowerCase().includes(query)
        );
    }, [myAnnouncements, view, activeCategory, activeAudience, search]);

    const openCreate = () => {
        setDraft({
            category: "General",
            audience: "Boarders",
            title: "",
            description: "",
        });
        setIsCreating(true);
    };

    const openEdit = (item: Announcement) => {
        setDraft({
            category: item.category,
            audience: item.audience,
            title: item.title,
            description: item.description,
        });
        setEditing(item);
    };

    const closeForm = () => {
        setIsCreating(false);
        setEditing(null);
    };

    const saveDraft = async () => {
        if (!draft.title.trim() || !draft.description.trim()) return;

        try {
            if (editing) {
                await updateAnnouncement(editing.id, {
                    title: draft.title,
                    description: draft.description,
                    category: draft.category,
                    audience: draft.audience,
                });
            } else {
                await createAnnouncement({
                    title: draft.title,
                    description: draft.description,
                    category: draft.category,
                    audience: draft.audience,
                });
            }
            await getMyAnnouncements();
            closeForm();
        } catch (error) {
            console.error(error);
        }
    };

    const confirmArchive = async () => {
        if (!pendingArchive) return;
        setWorking(true);
        try {
            await archiveAnnouncement(pendingArchive.id);
            await getMyAnnouncements();
            setPendingArchive(null);
        } catch (error) {
            console.error(error);
        } finally {
            setWorking(false);
        }
    };

    const confirmRestore = async () => {
        if (!pendingRestore) return;
        setWorking(true);
        try {
            await restoreAnnouncement(pendingRestore.id);
            await getMyAnnouncements();
            setPendingRestore(null);
        } catch (error) {
            console.error(error);
        } finally {
            setWorking(false);
        }
    };

    const isFormOpen = isCreating || editing !== null;

    return (
        <div className="h-screen overflow-hidden bg-slate-50/60">
            <div className="h-full overflow-y-auto border-l-2 border-t-2 rounded-tl-2xl bg-background">
                {/* ===== Sticky header ===== */}
                <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
                    <div className="mx-auto max-w-3xl px-4 pt-5 pb-3 space-y-4.5">
                        {/* Title row */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900">
                                        <Megaphone size={14} className="text-white" />
                                    </span>
                                    <h1 className="text-[15px] font-semibold tracking-tight text-slate-900">
                                        Announcements
                                    </h1>
                                </div>
                                <p className="mt-1 text-[11.5px] text-slate-500">
                                    Manage updates sent to boarders and staff
                                </p>
                            </div>

                            {isAdmin && (
                                <button
                                    onClick={openCreate}
                                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-medium text-white shadow-sm ring-1 ring-slate-900/5 transition-colors hover:bg-slate-800"
                                >
                                    <Plus size={14} />
                                    New
                                </button>
                            )}
                        </div>

                        {/* Segmented view switch + search */}
                        <div className="flex items-center gap-2">
                            <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-slate-100 p-0.5">
                                {(["Active", "Archive"] as ViewMode[]).map((mode) => (
                                    <button
                                        key={mode}
                                        onClick={() => setView(mode)}
                                        className={`flex items-center gap-1.5 rounded-[7px] px-2.5 py-1.5 text-[11.5px] font-medium transition-all ${
                                            view === mode
                                                ? "bg-white text-slate-900 shadow-sm"
                                                : "text-slate-500 hover:text-slate-700"
                                        }`}
                                    >
                                        {mode === "Active" ? (
                                            <Inbox size={12.5} />
                                        ) : (
                                            <Archive size={12.5} />
                                        )}
                                        {mode === "Active" ? "Active" : "Archived"}
                                        <span
                                            className={`rounded px-1 text-[10px] font-semibold tabular-nums ${
                                                view === mode
                                                    ? "bg-slate-900 text-white"
                                                    : "bg-slate-200/80 text-slate-500"
                                            }`}
                                        >
                                            {mode === "Active" ? counts.active : counts.archived}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            <div className="relative flex-1">
                                <Search
                                    size={13.5}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search announcements..."
                                    className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8.5 pr-8 text-[12.5px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                    style={{ paddingLeft: "2.05rem" }}
                                />
                                {search && (
                                    <button
                                        onClick={() => setSearch("")}
                                        className="absolute right-2.5 top-1/2 flex h-4.5 w-4.5 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                                    >
                                        <X size={11} />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Category + Audience filters */}
                        <div className="flex items-center justify-between gap-3">
                            <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                                {categoryFilters.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors ${
                                            activeCategory === category
                                                ? "bg-slate-900 text-white ring-slate-900"
                                                : "bg-white text-slate-500 ring-slate-200 hover:text-slate-900 hover:ring-slate-300"
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className="flex shrink-0 items-center gap-2 overflow-x-auto pb-0.5">
                                <span className="shrink-0 text-[10.5px] font-medium uppercase tracking-wide text-slate-400">
                                    Audience
                                </span>
                                {audienceFilters.map((audience) => (
                                    <button
                                        key={audience}
                                        onClick={() => setActiveAudience(audience)}
                                        className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-medium ring-1 transition-colors ${
                                            activeAudience === audience
                                                ? "bg-emerald-600 text-white ring-emerald-600"
                                                : "bg-white text-slate-500 ring-slate-200 hover:text-slate-900 hover:ring-slate-300"
                                        }`}
                                    >
                                        {audience}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ===== Feed ===== */}
                <div className="mx-auto max-w-3xl px-4 py-5">
                    <section className="space-y-3">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-14 text-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 ring-1 ring-slate-200/70">
                                    {view === "Archived" ? (
                                        <Archive size={16} className="text-slate-400" />
                                    ) : (
                                        <Megaphone size={16} className="text-slate-400" />
                                    )}
                                </div>
                                <p className="mt-3 text-[12.5px] font-semibold text-slate-900">
                                    {search || activeCategory !== "All" || activeAudience !== "All"
                                        ? "No matching announcements"
                                        : view === "Archived"
                                        ? "No archived announcements"
                                        : "Nothing here yet"}
                                </p>
                                <p className="mt-0.5 text-[11.5px] text-slate-500">
                                    {search || activeCategory !== "All" || activeAudience !== "All"
                                        ? "Try adjusting your filters"
                                        : view === "Archived"
                                        ? "Archived announcements will appear here"
                                        : "Create an announcement to get started"}
                                </p>
                                {!search &&
                                    activeCategory === "All" &&
                                    activeAudience === "All" &&
                                    view === "Active" &&
                                    isAdmin && (
                                    <button
                                        onClick={openCreate}
                                        className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-slate-800"
                                    >
                                        <Plus size={14} />
                                        Create Announcement
                                    </button>
                                )}
                            </div>
                        ) : (
                            filtered.map((item) => (
                                <article
                                    key={item.id}
                                    className={`group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:border-slate-300 hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)] ${
                                        view === "Archived" ? "opacity-90" : ""
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            {item.created_by_avatar ? (
                                                <img
                                                    src={item.created_by_avatar}
                                                    alt={item.created_by_name}
                                                    className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                                                />
                                            ) : (
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-[11px] font-semibold text-white">
                                                    {item.created_by_name
                                                        .split(" ")
                                                        .map((n) => n[0])
                                                        .join("")
                                                        .toUpperCase()
                                                        .slice(0, 2)}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="truncate text-[12.5px] font-medium text-slate-900">
                                                    {item.created_by_name}
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    {new Date(item.created_at).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-1.5">
                                            {view === "Archived" && (
                                                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10.5px] font-medium text-slate-500 ring-1 ring-slate-200/70">
                                                    Archived
                                                </span>
                                            )}
                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10.5px] font-medium ring-1 ${
                                                    categoryStyles[item.category]
                                                }`}
                                            >
                                                {item.category}
                                            </span>
                                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-medium text-emerald-700 ring-1 ring-emerald-100">
                                                {item.audience}
                                            </span>
                                        </div>
                                    </div>

                                    <h3 className="mt-3 text-[13px] font-semibold tracking-tight text-slate-900">
                                        {item.title}
                                    </h3>
                                    <p className="mt-1 text-[12px] leading-relaxed text-slate-600">
                                        {item.description}
                                    </p>

                                    {isAdmin && (
                                        <div className="mt-3 flex items-center justify-end gap-1 border-t border-slate-100 pt-2.5">
                                            {view === "Active" ? (
                                                <>
                                                    <button
                                                        onClick={() => openEdit(item)}
                                                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                                    >
                                                        <Pencil size={13} />
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => setPendingArchive(item)}
                                                        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium text-slate-500 transition-colors hover:bg-amber-50 hover:text-amber-700"
                                                    >
                                                        <Archive size={13} />
                                                        Archive
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => setPendingRestore(item)}
                                                    className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium text-emerald-700 transition-colors hover:bg-emerald-50"
                                                >
                                                    <ArchiveRestore size={13} />
                                                    Restore
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </article>
                            ))
                        )}
                    </section>
                </div>

                {/* ===== Create / Edit modal ===== */}
                {isFormOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/40"
                            onClick={closeForm}
                        />

                        <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5">
                            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3.5">
                                <div>
                                    <h2 className="text-[13px] font-semibold tracking-tight text-slate-900">
                                        {editing ? "Edit Announcement" : "New Announcement"}
                                    </h2>
                                    <p className="mt-0.5 text-[11px] text-slate-500">
                                        {editing
                                            ? "Update the details below"
                                            : "Compose an update for your recipients"}
                                    </p>
                                </div>
                                <button
                                    onClick={closeForm}
                                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X size={14} />
                                </button>
                            </div>

                            <div className="space-y-3.5 px-5 py-4">
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
                                        Category
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {categories.map((c) => (
                                            <button
                                                key={c}
                                                type="button"
                                                onClick={() => setDraft((d) => ({ ...d, category: c }))}
                                                className={`rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium ring-1 transition-colors ${
                                                    draft.category === c
                                                        ? "bg-slate-900 text-white ring-slate-900"
                                                        : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                                                }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
                                        Title
                                    </label>
                                    <input
                                        value={draft.title}
                                        onChange={(e) =>
                                            setDraft((d) => ({ ...d, title: e.target.value }))
                                        }
                                        placeholder="Announcement title"
                                        className="h-9 w-full rounded-lg border border-slate-200 px-3 text-[12.5px] outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
                                        Target Audience
                                    </label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {audiences.map((audience) => (
                                            <button
                                                key={audience}
                                                type="button"
                                                onClick={() => setDraft((d) => ({ ...d, audience }))}
                                                className={`rounded-lg px-2.5 py-1.5 text-[11.5px] font-medium ring-1 transition-colors ${
                                                    draft.audience === audience
                                                        ? "bg-slate-900 text-white ring-slate-900"
                                                        : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"
                                                }`}
                                            >
                                                {audience}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-[11px] font-medium text-slate-600">
                                        Message
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={draft.description}
                                        onChange={(e) =>
                                            setDraft((d) => ({ ...d, description: e.target.value }))
                                        }
                                        placeholder="Write the announcement details..."
                                        className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2 text-[12.5px] leading-relaxed outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
                                <button
                                    onClick={closeForm}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveDraft}
                                    disabled={
                                        !draft.title.trim() || !draft.description.trim() || loading
                                    }
                                    className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                                >
                                    {loading && <Loader2 size={13} className="animate-spin" />}
                                    {loading
                                        ? "Saving..."
                                        : editing
                                        ? "Save Changes"
                                        : "Publish"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== Archive confirmation ===== */}
                {pendingArchive && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/40"
                            onClick={() => !working && setPendingArchive(null)}
                        />

                        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5">
                            <div className="px-5 pt-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 ring-1 ring-amber-100">
                                    <Archive size={16} className="text-amber-600" />
                                </div>
                                <h2 className="mt-3.5 text-[13px] font-semibold tracking-tight text-slate-900">
                                    Archive this announcement?
                                </h2>
                                <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                                    <span className="font-medium text-slate-700">
                                        &ldquo;{pendingArchive.title}&rdquo;
                                    </span>{" "}
                                    will be hidden from boarders but kept in your archive. You can
                                    restore it anytime.
                                </p>
                            </div>

                            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
                                <button
                                    onClick={() => setPendingArchive(null)}
                                    disabled={working}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmArchive}
                                    disabled={working}
                                    className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-amber-700 disabled:opacity-70"
                                >
                                    {working && <Loader2 size={13} className="animate-spin" />}
                                    {working ? "Archiving..." : "Archive"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== Restore confirmation ===== */}
                {pendingRestore && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-slate-900/40"
                            onClick={() => !working && setPendingRestore(null)}
                        />

                        <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5">
                            <div className="px-5 pt-5">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100">
                                    <ArchiveRestore size={16} className="text-emerald-600" />
                                </div>
                                <h2 className="mt-3.5 text-[13px] font-semibold tracking-tight text-slate-900">
                                    Restore this announcement?
                                </h2>
                                <p className="mt-1 text-[12px] leading-relaxed text-slate-500">
                                    <span className="font-medium text-slate-700">
                                        &ldquo;{pendingRestore.title}&rdquo;
                                    </span>{" "}
                                    will move back to active and become visible to{" "}
                                    {pendingRestore.audience.toLowerCase()} again.
                                </p>
                            </div>

                            <div className="mt-5 flex justify-end gap-2 border-t border-slate-100 bg-slate-50/60 px-5 py-3">
                                <button
                                    onClick={() => setPendingRestore(null)}
                                    disabled={working}
                                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-60"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmRestore}
                                    disabled={working}
                                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-70"
                                >
                                    {working && <Loader2 size={13} className="animate-spin" />}
                                    {working ? "Restoring..." : "Restore"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}