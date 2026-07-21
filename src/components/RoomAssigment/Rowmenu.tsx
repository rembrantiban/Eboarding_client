"use client";

import { ArrowRightLeft, LogOut, MoreVertical } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AssignedBoarder } from "@/store/useRoomAssignmentStore" 

interface RowMenuProps {
    assignment: AssignedBoarder;
    onTransfer: (assignment: AssignedBoarder) => void;
    onCheckout: (assignment: AssignedBoarder) => void;
}

export default function RowMenu({ assignment, onTransfer, onCheckout }: RowMenuProps) {

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


                    <DropdownMenuItem onClick={() => onTransfer(assignment)}>
                        <ArrowRightLeft  size={14} className="mr-2" /> Transfer
                    </DropdownMenuItem>

                    {assignment.status === "Active" && (
                        <DropdownMenuItem
                            onClick={() => onCheckout(assignment)}
                            className="text-amber-700 focus:bg-amber-50 focus:text-amber-700"
                        >
                            <LogOut size={14} className="mr-2" /> Check out
                        </DropdownMenuItem>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}