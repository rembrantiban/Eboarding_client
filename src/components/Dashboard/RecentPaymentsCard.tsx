import { ChevronRight } from  "lucide-react"

const payments = [
  {
    id: 1,
    name: "Maria Santos",
    room: "Room 201",
    status: "Paid",
    amount: 5500,
    date: "May 16, 2025",
    initials: "MS",
  },
  {
    id: 2,
    name: "Pedro Reyes",
    room: "Room 105",
    status: "Paid",
    amount: 5500,
    date: "May 16, 2025",
    initials: "PR",
  },
  {
    id: 3,
    name: "Ana Clara",
    room: "Room 303",
    status: "Pending",
    amount: 5500,
    date: "May 15, 2025",
    initials: "AC",
  },
  {
    id: 4,
    name: "Mark Villanueva",
    room: "Room 204",
    status: "Overdue",
    amount: 5500,
    date: "May 14, 2025",
    initials: "MV",
  },
];

const STATUS_STYLES = {
  Paid: "bg-gray-100 text-gray-700",
  Pending: "bg-gray-900 text-white",
  Overdue: "bg-gray-500 text-white",
};

function formatCurrency(v) {
  return `\u20B1${v.toLocaleString()}`;
}

export default function RecentPaymentsCard() {
  return (
    <div className="w-full max-w-md rounded border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-[15px] font-semibold text-gray-900">Recent Payments</h3>
        <button
          type="button"
          className="text-[12.5px] font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {payments.map((p) => (
          <div key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gray-900 text-[12px] font-semibold text-white">
              {p.initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-gray-900">
                {p.name}
              </p>
              <p className="text-[12.5px] text-gray-500">{p.room}</p>
            </div>

            <span
              className={`flex-shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${STATUS_STYLES[p.status]}`}
            >
              {p.status}
            </span>

            <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
              <span className="text-[13px] font-semibold text-gray-900">
                {formatCurrency(p.amount)}
              </span>
              <span className="text-[11px] text-gray-500">{p.date}</span>
            </div>
          </div>
        ))}

         <button
        type="button"
        className="mt-4 flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 text-[13px] font-medium text-gray-900 transition-colors hover:bg-gray-100"
      >
        View all payments
        <ChevronRight className="h-4 w-4 text-gray-500" />
      </button>
      </div>
    </div>
  );
}