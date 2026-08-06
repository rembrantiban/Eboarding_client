"use client";

import { FileText, CheckCircle2, Clock, XCircle } from "lucide-react";

type DocumentStatsProps = {
  total: number;
  approved: number;
  underReview: number;
  rejected: number;
  loading?: boolean;
};

const buildStats = (props: DocumentStatsProps) => [
  {
    label: "Total Documents",
    value: props.total,
    description: "All submitted documents",
    icon: FileText,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    accent: "bg-slate-400",
  },
  {
    label: "Approved",
    value: props.approved,
    description: "Cleared for boarding",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    accent: "bg-emerald-500",
  },
  {
    label: "Under Review",
    value: props.underReview,
    description: "Awaiting your action",
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    accent: "bg-amber-500",
  },
  {
    label: "Rejected",
    value: props.rejected,
    description: "Needs resubmission",
    icon: XCircle,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
    accent: "bg-rose-500",
  },
];

const StatCardSkeleton = () => (
  <div className="animate-pulse rounded-xl border border-slate-200/70 bg-white px-3.5 py-3">
    <div className="flex items-start justify-between">
      <div className="h-2.5 w-20 rounded bg-slate-100" />
      <div className="h-7 w-7 rounded-lg bg-slate-100" />
    </div>
    <div className="mt-2.5 h-4 w-10 rounded bg-slate-100" />
    <div className="mt-2 h-2.5 w-24 rounded bg-slate-100" />
  </div>
);

const DocumentStats = (props: DocumentStatsProps) => {
  if (props.loading) {
    return (
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      {buildStats(props).map((stat) => (
        <div
          key={stat.label}
          className="group relative overflow-hidden rounded-xl border border-slate-200/70 bg-slate-800 px-3.5 py-3 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:border-slate-300"
        >
          <span
            className={`absolute inset-y-0 left-0 w-0.5 ${stat.accent} opacity-0 transition-opacity group-hover:opacity-100`}
          />
          <div className="flex items-start justify-between gap-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-slate-100">
              {stat.label}
            </p>
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${stat.iconBg} ${stat.iconColor}`}
            >
              <stat.icon size={14} />
            </div>
          </div>
          <p className="mt-1.5 text-[17px] font-semibold leading-tight tracking-tight text-slate-200">
            {stat.value}
          </p>
          <p className="mt-1 text-[11px] text-slate-400">{stat.description}</p>
        </div>
      ))}
    </div>
  );
};

export default DocumentStats;