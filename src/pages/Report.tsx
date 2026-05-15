"use client"

import { useEffect, useRef, useState } from "react"
import { usePayment } from "@/hooks/usePayment"
import ReportHeader from "@/components/Report/ReportHeader"
import ReportSummary from "@/components/Report/ReportSummary"
import ReportTable from "@/components/Report/ReportTable"
import ReportTableSkeleton from "@/components/Report/ReportTableSkeleton"
import { useReactToPrint } from "react-to-print"
import PrintReport from "@/components/Report/PrintReport"
import { useMemo } from "react"

const Report = () => {
    const { Reports, getReports, loading } = usePayment()
    const [search, setSearch] = useState("")

    const printRef = useRef<HTMLDivElement>(null)

    const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Payment Report",
    })
    useEffect(() => {
        getReports()
    }, [getReports])

    const paidPayments = Reports.filter((p) => p.status === "Paid")

    const filteredPayments = useMemo(() => {
  const searchLower = search.toLowerCase()

  return paidPayments.filter((p) =>
    `${p.first_name} ${p.last_name}`.toLowerCase().includes(searchLower) ||
    p.email.toLowerCase().includes(searchLower) ||
    `room ${p.room_number}`.toLowerCase().includes(searchLower)
  )
}, [paidPayments, search])


    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <ReportHeader 
                   search={search}
                    setSearch={setSearch}
                    onPrint={handlePrint}
                />

                {/* Summary Skeleton */}
                <div className="grid grid-cols-3 gap-4 animate-pulse">
                    <div className="h-20 bg-gray-200 rounded-xl" />
                    <div className="h-20 bg-gray-200 rounded-xl" />
                    <div className="h-20 bg-gray-200 rounded-xl" />
                </div>

                {/* Table Skeleton */}
                <ReportTableSkeleton />
            </div>
        )
    }

    return (
        <div className="h-screen overflow-hidden">
            <div className="h-full overflow-y-auto space-y-6 border-l-2 border-t-2 rounded-tl-2xl px-4 py-2">
                <div className="p-6 space-y-6">
                    <ReportHeader
                        search={search}
                        setSearch={setSearch}
                        onPrint={handlePrint}
                    />
                    <div className="hidden">
                    <div ref={printRef}>
                        <PrintReport payments={filteredPayments} />
                    </div>
                    </div>
                    <ReportSummary payments={paidPayments} />

                    <ReportTable
                        payments={paidPayments}
                        search={search}
                    />
                </div>
            </div>
        </div>
    )
}

export default Report