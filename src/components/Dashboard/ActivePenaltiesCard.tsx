import { ChevronRight } from "lucide-react";

const penalties = [
  {
    id: 1,
    name: "Juan Dela Cruz",
    reason: "Late Payment",
    amount: 500,
    date: "May 15, 2025",
    initials: "JD",
  },
  {
    id: 2,
    name: "Maria Santos",
    reason: "Noise Violation",
    amount: 300,
    date: "May 14, 2025",
    initials: "MS",
  },
  {
    id: 3,
    name: "Peter Reyes",
    reason: "Curfew Violation",
    amount: 500,
    date: "May 13, 2025",
    initials: "PR",
  },
];

function formatCurrency(v: number) {
  return `\u20B1${v.toLocaleString()}`;
}

export default function ActivePenaltiesCard() {
  return (
    <div className="w-full max-w-full  rounded border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-[15px] font-semibold text-gray-900">
        Active Penalties
      </h3>

      <div className="flex flex-col divide-y divide-gray-100">
        {penalties.map((p) => (
          <div key={p.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-[12px] font-semibold text-white">
              {p.initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-[13.5px] font-semibold text-gray-900">
                {p.name}
              </p>
              <p className="text-[12.5px] text-gray-500">{p.reason}</p>
            </div>

            <div className="flex shrink-0 flex-col items-end gap-1">
              <span className="rounded-full bg-gray-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                {formatCurrency(p.amount)}
              </span>
              <span className="text-[11px] text-gray-500">{p.date}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 flex w-full items-center justify-between rounded-lg bg-gray-50 px-3 py-2.5 text-[13px] font-medium text-gray-900 transition-colors hover:bg-gray-100"
      >
        View all penalties
        <ChevronRight className="h-4 w-4 text-gray-500" />
      </button>
    </div>
  );
}