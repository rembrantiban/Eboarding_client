"use client"

const rows = Array.from({ length: 6 })

const ReportTableSkeleton = () => {
  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden animate-pulse">

      {/* HEADER */}
      <div className="grid grid-cols-4 gap-4 px-4 py-3 border-b bg-muted/40">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-20 bg-gray-200 rounded" />
      </div>

      {/* ROWS */}
      {rows.map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-4 gap-4 px-4 py-4 border-b last:border-0"
        >
          {/* Boarder */}
          <div className="space-y-2">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>

          {/* Room */}
          <div className="h-4 w-28 bg-gray-200 rounded" />

          {/* Amount */}
          <div className="h-4 w-20 bg-gray-200 rounded" />

          {/* Date */}
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  )
}

export default ReportTableSkeleton