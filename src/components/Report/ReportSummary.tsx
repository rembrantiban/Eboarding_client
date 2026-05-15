import { CheckCircle2, PhilippinePeso } from "lucide-react"
import type { Payment } from "@/store/usePaymentStore"

type Props = {
  payments: Payment[]
}

const ReportSummary = ({ payments }: Props) => {
  const totalAmount = payments.reduce(
    (sum, p) => sum + Number(p.amount),
    0
  )

  const totalTransactions = payments.length

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

      {/* TOTAL AMOUNT */}
      <div className="p-5 rounded-xl border bg-white shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase">
            Total Revenue
          </p>
          <p className="text-xl font-bold">
            ₱{totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
          <PhilippinePeso className="text-green-600" size={18} />
        </div>
      </div>

      {/* TOTAL TRANSACTIONS */}
      <div className="p-5 rounded-xl border bg-white shadow-sm flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase">
            Paid Transactions
          </p>
          <p className="text-xl font-bold">{totalTransactions}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <CheckCircle2 className="text-blue-600" size={18} />
        </div>
      </div>

    </div>
  )
}

export default ReportSummary