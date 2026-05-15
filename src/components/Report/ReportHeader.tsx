"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Printer } from "lucide-react"

type Props = {
  search: string
  setSearch: (value: string) => void
  onPrint: () => void
}

const ReportHeader = ({ search, setSearch, onPrint }: Props) => {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

      {/* LEFT */}
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          Payment Report
        </h1>
        <p className="text-sm text-muted-foreground">
          List of all completed payments
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 w-full lg:w-auto">

        {/* 🔍 SEARCH */}
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            placeholder="Search by name, email, or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-lg"
          />
        </div>

        {/* 🖨 PRINT */}
        <Button
          onClick={onPrint}
          className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
        >
          <Printer className="h-4 w-4" />
          Print
        </Button>

      </div>
    </div>
  )
}

export default ReportHeader