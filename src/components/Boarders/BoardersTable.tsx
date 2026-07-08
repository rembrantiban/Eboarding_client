"use client";

import { useEffect, useState } from "react";
import { useBoarder } from "@/hooks/useBoarder";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreVertical, ChevronLeft, ChevronRight, Edit2, Trash2, Eye, Bell } from "lucide-react";
import EditBoarderModal from "../modal/EditBoarderModal";
import axiosInstance from "@/api/api";
import { toast } from "sonner";
import type { Boarder } from "@/store/useBoarderStore";
import RemoveBoarderModal from "../modal/RemoveBoarderModal";

type BoarderType = {
  boarder_id: number;
  room_number: string;
  bed_number: string;
};

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
};

const BoardersTable = () => {
  const { boarders, getBoarders, loading, notifyBoarder, removeBoarder } = useBoarder();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openEditRoom, setOpenEditRoom] = useState(false);
  const [selectedBoarder, setSelectedBoarder] = useState<BoarderType | null>(null);
  const [notifyingId, setNotifyingId] = useState<number | null>(null);

  const [openRemove, setOpenRemove] = useState(false);
  const [selectedToRemove, setSelectedToRemove] = useState<Boarder | null>(null);

  const itemsPerPage = 7;

  useEffect(() => {
    getBoarders();
  }, [getBoarders]);

  const filteredBoarders = boarders.filter((b) =>
    `${b.first_name} ${b.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.contact_number.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredBoarders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBoarders = filteredBoarders.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        <div className="h-6 w-40 bg-muted animate-pulse rounded" />
        <div className="h-40 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  const handleNotifyBoarder = async (boarder: Boarder) => {
    if (!boarder.boarder_id) return;

    if (boarder.payment_status === "Paid") {
      toast.warning("Already paid");
      return;
    }

    try {
      setNotifyingId(boarder.boarder_id);

      await notifyBoarder(boarder.boarder_id);

    } catch (error) {
      console.error(error);
    } finally {
      setNotifyingId(null);
    }
  };
  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Boarders</h1>
        <p className="text-sm text-muted-foreground">
          Manage assigned boarders, rooms, and payments
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name, email, or phone..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="flex-1 max-w-sm"
        />
        <div className="text-sm text-muted-foreground">
          {filteredBoarders.length} result{filteredBoarders.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded border bg-white/80 backdrop-blur-xl shadow-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-700">
            <TableRow> 
              <TableHead className="text-white">Boarder</TableHead>
              <TableHead className="text-white">Room</TableHead>
              <TableHead className="text-white">Start Date</TableHead>
              <TableHead className="text-white">Monthly</TableHead>
              <TableHead className="text-white">Next Payment</TableHead>
              <TableHead className="text-white">Assign By</TableHead>
              <TableHead className="text-right text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentBoarders.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  {filteredBoarders.length === 0 ? "No boarders found" : "Loading..."}
                </TableCell>
              </TableRow>
            )}

            {currentBoarders.map((b) => {
              const isOverdue =
                b.due_date &&
                new Date(b.due_date) < new Date() &&
                b.payment_status !== "Paid";

              const initials = getInitials(b.first_name, b.last_name);

              return (
                <TableRow key={b.boarder_id} className="hover:bg-muted/50 transition">

                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-slate-700 text-slate-100 font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {b.first_name} {b.last_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {b.email}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {b.contact_number}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* ROOM */}
                  <TableCell>
                    <div className="text-sm font-medium">
                      Room {b.room_number}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {b.bed_number}
                    </div>
                  </TableCell>

                  <TableCell>
                    {b.start_date
                      ? new Date(b.start_date).toLocaleDateString()
                      : "N/A"}
                  </TableCell>

                  <TableCell>
                    ₱{Number(b.price_per_month ?? 0).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">
                        {b.due_date
                          ? new Date(b.due_date).toLocaleDateString()
                          : "No due date"}
                      </span>

                      <Badge
                        variant="outline"
                        className={`w-fit text-xs ${isOverdue
                          ? "border-red-500 text-red-600"
                          : b.payment_status === "Paid"
                            ? "border-green-500 text-green-600"
                            : "border-yellow-500 text-yellow-600"
                          }`}
                      >
                        {isOverdue ? "Overdue" : b.payment_status}
                      </Badge>
                    </div>
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    {b.assigned_by_first_name ? (
                      <Badge className="bg-slate-700 text-slate-300">
                        {b.assigned_by_first_name} {b.assigned_by_last_name}
                      </Badge>
                    ) : (
                      <Badge className="bg-slate-200 text-slate-700">
                        Not Assigned
                      </Badge>
                    )}
                  </TableCell>

                  {/* ROW ACTIONS */}
                  <TableCell className="text-right">
                    <DropdownMenu>


                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem
                          onClick={() => handleNotifyBoarder(b)}
                          disabled={b.payment_status === "Paid" || notifyingId === b.boarder_id}
                          className="flex items-center gap-2 cursor-pointer text-blue-600"
                        >
                          <Bell className="h-4 w-4" />
                          Notify Payment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedBoarder(b);
                          setOpenEditRoom(true);
                        }}
                          className="flex items-center gap-2 cursor-pointer">
                          <Edit2 className="h-4 w-4" />
                          Edit Boarder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedToRemove(b);
                            setOpenRemove(true);
                          }}
                          className="flex items-center gap-2 cursor-pointer text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>

                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      <EditBoarderModal
        open={openEditRoom}
        onClose={() => setOpenEditRoom(false)}
        boarder={selectedBoarder}
        onSave={async (data) => {
          if (!selectedBoarder) return;

          await axiosInstance.put(
            `/boarders/${selectedBoarder.boarder_id}`,
            data
          );

          getBoarders();
        }}
      />

      <RemoveBoarderModal
        open={openRemove}
        onClose={() => setOpenRemove(false)}
        boarderName={
          selectedToRemove
            ? `${selectedToRemove.first_name} ${selectedToRemove.last_name}`
            : ""
        }
        room={
          selectedToRemove
            ? `Room ${selectedToRemove.room_number} - Bed ${selectedToRemove.bed_number}`
            : ""
        }
        onConfirm={async () => {
          if (!selectedToRemove) return;
          await removeBoarder(selectedToRemove.boarder_id);
        }}
      />
    </div>
  );
};

export default BoardersTable;

