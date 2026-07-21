"use client"

import { useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { Payment } from "@/store/usePaymentStore"
import { ChevronLeft, ChevronRight, Rocket } from "lucide-react"

type Props = {
  payments: Payment[];
  search: string;

}

const ReportTable = ({ payments, search }: Props) => {

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  const filteredPayments = useMemo(() => {
    const searchLower = search.toLowerCase()

    return payments.filter((p) =>
      `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchLower) ||
      p.email.toLowerCase().includes(searchLower) ||
      `room ${p.room_number}`.toLowerCase().includes(searchLower)
    )
  }, [payments, search])

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage)

  const safePage = Math.min(currentPage, totalPages || 1)

  const paginatedPayments = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage
    return filteredPayments.slice(start, start + itemsPerPage)
  }, [filteredPayments, safePage])


  const getPageNumbers = () => {
    const pages: number[] = []
    const maxVisible = 5

    let start = Math.max(currentPage - 2, 1)
    const end = Math.min(start + maxVisible - 1, totalPages)

    if (end - start < maxVisible - 1) {
      start = Math.max(end - maxVisible + 1, 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }
  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">

      {/* TABLE */}
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Boarder</TableHead>
            <TableHead>Room</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Penalty</TableHead>
            <TableHead>Paid Date</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedPayments.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-14 text-center">
                <div className="flex flex-col items-center justify-center gap-2.5">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-500">
                    <Rocket className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-slate-600">
                      Under Development
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      Paid records will be available here once this feature is ready.
                    </p>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            paginatedPayments.map((p) => (
              <TableRow key={p.payment_id} className="hover:bg-muted/40">
                <TableCell>
                  <div className="font-medium">
                    {p.first_name} {p.last_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {p.email}
                  </div>
                </TableCell>

                <TableCell>
                  Room {p.room_number} - Bed {p.bed_number}
                </TableCell>

                <TableCell className="font-semibold">
                  ₱{Number(p.amount).toLocaleString()}
                </TableCell>

                <TableCell className="text-green-500">
                  +₱{Number(p.penalty_amount).toLocaleString()}
                </TableCell>

                <TableCell>
                  {p.paid_at
                    ? new Date(p.paid_at).toLocaleDateString()
                    : "—"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* ✅ PAGINATION (OUTSIDE TABLE) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">

          {/* INFO */}
          <p className="text-sm text-muted-foreground">
            Showing {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, payments.length)} of{" "}
            {payments.length} records
          </p>

          {/* CONTROLS */}
          <div className="flex items-center gap-1">

            {/* PREV */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={safePage === 1}
              className="p-2 rounded-lg border hover:bg-muted disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>

            {/* PAGES */}
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1.5 text-sm rounded-lg border transition
                  ${currentPage === page
                    ? "bg-primary text-white border-primary"
                    : "hover:bg-muted"
                  }
                `}
              >
                {page}
              </button>
            ))}

            {/* NEXT */}
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(p + 1, totalPages))
              }
              disabled={safePage === totalPages}
              className="p-2 rounded-lg border hover:bg-muted disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>

          </div>
        </div>
      )}

    </div>
  )
}

export default ReportTable