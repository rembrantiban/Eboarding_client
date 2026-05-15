"use client"

import type { Payment } from "@/store/usePaymentStore"

type Props = {
  payments: Payment[]
}

const PrintReport = ({ payments }: Props) => {
  const totalAmount = payments.reduce((sum, p) => sum + Number(p.amount), 0)
  const totalPenalty = payments.reduce((sum, p) => sum + Number(p.penalty_amount || 0), 0)

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="p-8 text-black bg-white text-sm font-sans w-full">

      {/* HEADER */}
      <div className="text-center border-b pb-4 mb-6">
        <h1 className="text-xl font-bold">E-Boarding House</h1>
        <p className="text-xs text-gray-500">Payment Report</p>
        <p className="text-xs text-gray-400 mt-1">Generated on {today}</p>
      </div>

      {/* TABLE */}
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">Boarder</th>
            <th className="text-left py-2">Room</th>
            <th className="text-left py-2">Amount</th>
            <th className="text-left py-2">Penalty</th>
            <th className="text-left py-2">Paid Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p.payment_id} className="border-b">
              <td className="py-2">
                {p.first_name} {p.last_name}
                <div className="text-gray-400 text-[10px]">{p.email}</div>
              </td>

              <td className="py-2">
                Room {p.room_number} - Bed {p.bed_number}
              </td>

              <td className="py-2">
                ₱{Number(p.amount).toLocaleString()}
              </td>

              <td className="py-2 text-red-500">
                ₱{Number(p.penalty_amount || 0).toLocaleString()}
              </td>

              <td className="py-2">
                {p.paid_at
                  ? new Date(p.paid_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* TOTALS */}
      <div className="mt-6 border-t pt-4 flex justify-end">
        <div className="text-right space-y-1">
          <p>
            Total Amount:{" "}
            <span className="font-semibold">
              ₱{totalAmount.toLocaleString()}
            </span>
          </p>
          <p>
            Total Penalty:{" "}
            <span className="font-semibold text-red-500">
              ₱{totalPenalty.toLocaleString()}
            </span>
          </p>
        </div>
      </div>
      <div className="mt-10 flex justify-between items-end text-xs text-gray-500">

        <div>
          <p className="font-medium text-black">Notes</p>
          <p>This report contains all completed payments.</p>
        </div>

        <div className="text-right">
          <p className="border-t w-40 pt-1 text-center text-[10px]">
            Authorized Signature
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-10 text-center text-[10px] text-gray-400">
        This is a system-generated report. No signature required.
      </div>

    </div>
  )
}

export default PrintReport