"use client";

import { useEffect, useRef, useState } from "react";
import { usePayment } from "@/hooks/usePayment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Search, Filter, CheckCircle2, Clock, Printer, AlertTriangle, User, Bell, EllipsisVertical, Users } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import PaymentPrint from "./PaymentPrint";
import SummaryCard from "./SummaryCard";
import Summary from "./Summary"
import type { Boarder } from "@/store/useBoarderStore";
import { toast } from "sonner";
import { useBoarder } from "@/hooks/useBoarder";

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
};

const PaymentReport = () => {
  const { payments, getPayments, loading, markAsPaid } = usePayment();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [notifyingId, setNotifyingId] = useState<number | null>(null);
  const { notifyBoarder } = useBoarder();

  const itemsPerPage = 8;

  const pendingCount = payments.filter((p) => {
    const isOverdue =
      p.status !== "Paid" && new Date(p.due_date) < new Date();

    return p.status !== "Paid" && !isOverdue;
  }).length;

  const overdueCount = payments.filter((p) => {
    const isPending =
      p.status !== "Paid" && new Date(p.due_date) < new Date();

    return p.status !== "Pending" && !isPending;
  }).length;

  const totalPending = payments
    .filter((p) => {
      const isOverdue =
        p.status !== "Paid" && new Date(p.due_date) < new Date();
      return p.status !== "Paid" && !isOverdue;
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

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



  const totalOverdue = payments
    .filter((p) => {
      return p.status !== "Paid" && new Date(p.due_date) < new Date();
    })
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Payment Report",
  });


  useEffect(() => {
    getPayments();
  }, [getPayments]);

  const filteredPayments = payments.filter((p) => {
    // Search filter
    const matchesSearch =
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `Room ${p.room_number}`.toLowerCase().includes(searchTerm.toLowerCase());

    const isOverdue = p.status !== "Paid" && new Date(p.due_date) < new Date();
    let matchesStatus = true;

    switch (statusFilter) {
      case "paid":
        matchesStatus = p.status === "Paid";
        break;
      case "pending":
        matchesStatus = p.status !== "Paid" && !isOverdue;
        break;
      case "overdue":
        matchesStatus = isOverdue;
        break;
      default:
        matchesStatus = true;
    }

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = filteredPayments.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: "all" | "paid" | "pending" | "overdue") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const isFiltering = searchTerm !== "" || statusFilter !== "all";

  const printData = isFiltering ? filteredPayments : payments;

  if (loading) {
    return (
      <div className="p-6 space-y-3">
        <div className="h-6 w-48 bg-muted animate-pulse rounded" />
        <div className="h-40 bg-muted animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Payment Report</h1>
        <p className="text-sm text-muted-foreground">
          Track all boarder payments
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">

        <Summary
          title="Pending Payments"
          amount={pendingCount}
          color="bg-green-100 text-green-600"
          icon={<User size={18} />}
        />
        <Summary
          title="Overdue Payments"
          amount={overdueCount}
          color="bg-red-100 text-red-600"
          icon={<Users size={18} />}
        />

        <SummaryCard
          title="Total Amount Pending"
          amount={totalPending}
          color="bg-yellow-100 text-yellow-600"
          icon={<Clock size={18} />}
        />

        <SummaryCard
          title="Total Amount Overdue"
          amount={totalOverdue}
          color="bg-red-100 text-red-600"
          icon={<AlertTriangle size={18} />}
        />

      </div>
      {/* SEARCH AND FILTERS */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex flex-1 gap-2 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or room..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10"
            />
          </div>

          {/* STATUS FILTER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem
                onClick={() => handleStatusFilter("all")}
                className={`cursor-pointer ${statusFilter === "all" ? "bg-muted" : ""}`}
              >
                All Payments
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilter("pending")}
                className={`cursor-pointer flex gap-2 ${statusFilter === "pending" ? "bg-muted" : ""}`}
              >
                <Clock className="h-4 w-4 text-yellow-600" />
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilter("overdue")}
                className={`cursor-pointer flex gap-2 ${statusFilter === "overdue" ? "bg-muted" : ""}`}
              >
                <Clock className="h-4 w-4 text-red-600" />
                Overdue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* STATS */}
        <div className="text-sm text-muted-foreground">
          {filteredPayments.length} result{filteredPayments.length !== 1 ? "s" : ""}
        </div>
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          {isFiltering ? "Print Filtered" : "Print Report"}
        </Button>



        {/* 🔥 HIDDEN PRINT AREA */}
        <div className="hidden">
          <PaymentPrint ref={printRef} payments={printData} />
        </div>
      </div>

      {/* TABLE */}
      <div className="rounded border bg-white/80 backdrop-blur-xl shadow-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Boarder</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Penalty</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentPayments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  {filteredPayments.length === 0 ? "No payments found" : "Loading..."}
                </TableCell>
              </TableRow>
            )}

            {currentPayments.map((p) => {
              const isOverdue =
                p.status !== "Paid" &&
                new Date(p.due_date) < new Date();

              const initials = getInitials(p.first_name, p.last_name);

              return (
                <TableRow key={p.payment_id} className="hover:bg-muted/50 transition">
                  {/* BOARDER WITH AVATAR */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {p.first_name} {p.last_name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {p.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  {/* ROOM */}
                  <TableCell>
                    <div className="text-sm font-medium">
                      Room {p.room_number}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Bed {p.bed_number}
                    </div>
                  </TableCell>

                  {/* AMOUNT */}
                  <TableCell className="font-semibold">
                    ₱{Number(p.amount).toLocaleString()}
                    {p.penalty_amount > 0 && (
                      <span className="text-red-500 text-xs ml-1">
                        (+₱{Number(p.penalty_amount || "100").toLocaleString()})
                      </span>
                    )}
                  </TableCell>

                  {/* DUE DATE */}
                  <TableCell>
                    {p.due_date ? (
                      <span className="text-sm font-medium text-gray-700">
                        {new Date(p.due_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    ) : (
                      "—"
                    )}
                  </TableCell>

                  {/* STATUS */}
                  <TableCell>
                    <Badge
                      className={
                        isOverdue
                          ? "bg-red-100 text-red-700 hover:bg-red-100"
                          : p.status === "Paid"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                      }
                    >
                      {isOverdue ? "Overdue" : p.status}
                    </Badge>
                  </TableCell>

                  {/* PAID AT */}
                  <TableCell>
                   {p.penalty_amount > 0 ? `₱${Number(p.penalty_amount).toLocaleString()}` : "—"}
                  </TableCell>

                  <TableCell className="text-right">
                    {p.status !== "Paid" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <EllipsisVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">

                          <DropdownMenuItem
                            onClick={() => markAsPaid(p.payment_id)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            Mark as Paid
                          </DropdownMenuItem>

                          <DropdownMenuItem
                           onClick={() => handleNotifyBoarder(p)}
                           disabled={p.payment_status === "Paid" || notifyingId === p.boarder_id}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Bell className="h-4 w-4 text-blue-600 hover:animate-ping duration-200" />
                            Send Reminder
                          </DropdownMenuItem>

                        </DropdownMenuContent>
                      </DropdownMenu>


                    ) : (
                      <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                        complete
                      </Badge>
                    )}
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
          Page {currentPage} of {totalPages || 1}
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
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReport;