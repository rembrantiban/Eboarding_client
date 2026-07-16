"use client";

import { Eye, LogOut, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import type { EnrichedAssignment } from "./types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RowMenuProps {
    assignment: EnrichedAssignment;
    onView: (a: EnrichedAssignment) => void;
    onEdit: (a: EnrichedAssignment) => void;
    onCheckout: (a: EnrichedAssignment) => void;
    onDelete: (a: EnrichedAssignment) => void;
}

export default function RowMenu({ assignment, onView, onEdit, onCheckout, onDelete }: RowMenuProps) {
    const { user } = useAuth();

    return (
        <div className="flex justify-end">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button
                        type="button"
                        className="rounded-lg p-2 hover:bg-slate-100"
                        aria-label="Open row actions"
                    >
                        <MoreVertical size={16} />
                    </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => onView(assignment)}>
                        <Eye size={14} className="mr-2" /> View
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => onEdit(assignment)}>
                        <Pencil size={14} className="mr-2" /> Edit
                    </DropdownMenuItem>

                    {assignment.status === "Active" && (
                        <DropdownMenuItem
                            onClick={() => onCheckout(assignment)}
                            className="text-amber-700 focus:bg-amber-50 focus:text-amber-700"
                        >
                            <LogOut size={14} className="mr-2" /> Check out
                        </DropdownMenuItem>
                    )}

                    {user?.user_type === "Admin" && (
                        <DropdownMenuItem
                            onClick={() => onDelete(assignment)}
                            className="text-red-500 focus:bg-red-50 focus:text-red-500"
                        >
                            <Trash2 size={14} className="mr-2" /> Delete
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}