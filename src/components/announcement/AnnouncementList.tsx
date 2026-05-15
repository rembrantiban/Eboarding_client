import { Bell } from "lucide-react";
import AnnouncementRow from "./AnnouncementRow"
import type { Announcement } from "@/store/useAnnouncementStore";

const AnnouncementList = ({
    announcements,
    onEdit,
}: {
    announcements: Announcement[];
    onEdit: (a: Announcement) => void;
}) => {
    if (announcements.length === 0) {
        return (
            <div className="text-center flex flex-col items-center text-gray-400 py-10">
                <Bell size={40} />
                <p className="mt-2">No announcements found</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow divide-y-2">
            {announcements.map((a: Announcement) => (
                <AnnouncementRow key={a.notification_id} announcement={a} onEdit={onEdit} />
            ))}
        </div>
    );
};

export default AnnouncementList;