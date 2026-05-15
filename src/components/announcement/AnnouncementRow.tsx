import type { Announcement } from "@/store/useAnnouncementStore";
import { Edit, Megaphone, MoreVertical, Trash } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const AnnouncementRow = ({
    announcement,
    onEdit,
}: {
    announcement: Announcement;
    onEdit: (a: Announcement) => void;
}) => {

    return (
        <div className="group flex items-center justify-between p-4 border-b hover:bg-gray-50 transition">

            {/* LEFT CONTENT */}
            <div className="flex items-start gap-3">

                {/* ICON */}
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-black/5 text-black text-sm font-semibold">
                    <Megaphone />
                </div>

                {/* TEXT */}
                <div>
                    <h3 className="font-semibold text-gray-800 group-hover:text-black transition">
                        {announcement.title}
                    </h3>

                    <div className="text-sm text-gray-600/80 leading-relaxed space-y-1">
                        {announcement.description?.split("\n").map((line, index) => (
                            <div key={index} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.75" />
                                <span>{line}</span>
                            </div>
                        )) || "No description"}
                    </div>

                    {/* META */}
                    <span className="text-xs text-gray-400">
                        {new Date(announcement.created_at).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-3">

                {!announcement.is_read && (
                    <span className="text-xs bg-black text-white px-2 py-1 rounded-full">
                        NEW
                    </span>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-black transition">
                            <MoreVertical size={20} />
                        </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-36">
                        <DropdownMenuItem
                            onClick={() => onEdit(announcement)}
                        >
                            <Edit /> Update
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            // onClick={() => console.log("Delete", announcement.id)}
                            className="text-red-500 focus:text-red-500"
                        >
                            <Trash /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default AnnouncementRow;