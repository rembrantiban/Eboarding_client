import { useEffect, useState } from "react";
import { useAnnouncement } from "@/hooks/useAnnouncement"
import CreateAnnouncementModal from "@/components/announcement/CreateAnnouncementModal";
import AnnouncementList from "@/components/announcement/AnnouncementList";
import type { Announcement } from "@/store/useAnnouncementStore";
import UpdateAnnouncementModal from "@/components/announcement/UpdateAnnouncementModal";

const AnnouncementPage = () => {
    const { announcements, fetchAnnouncements } = useAnnouncement();

    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);

    const [openEdit, setOpenEdit] = useState(false);
    const [selected, setSelected] = useState<Announcement | null>(null);

    useEffect(() => {
        fetchAnnouncements();
    }, [fetchAnnouncements]);

    const filtered = announcements.filter((a) =>
        a.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 py-2 bg-background">
                <div className="p-6 max-w-6xl mx-auto space-y-6">

                    {/* HEADER */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Announcements
                            </h1>

                            <p className="text-sm text-gray-400 ">
                                Stay updated with the latest notices and important information.
                            </p>
                        </div>

                        <button
                            onClick={() => setOpen(true)}
                            className="bg-black text-white px-4 py-2 rounded-lg"
                        >
                            + Create
                        </button>
                    </div>

                    {/* SEARCH */}
                    <input
                        type="text"
                        placeholder="Search announcements..."
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-black"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* LIST */}
                    <AnnouncementList announcements={filtered}   onEdit={(a) => {
                        setSelected(a);
                        setOpenEdit(true);
                    }}/>

                    {/* MODAL */}
                    {open && <CreateAnnouncementModal onClose={() => setOpen(false)} />}

                    <UpdateAnnouncementModal
                    open={openEdit}
                    onClose={() => setOpenEdit(false)}
                    announcement={selected}
                    />
                </div>
            </div>
        </div>
    );
};

export default AnnouncementPage;