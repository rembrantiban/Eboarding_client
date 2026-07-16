"use client";

import { FileText, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type DocumentStatsProps = {
  total: number;
  approved: number;
  underReview: number;
  rejected: number;
};

const stats = (props: DocumentStatsProps) => [
  {
    label: "Total Documents",
    value: props.total,
    description: "All your submitted documents",
    icon: FileText,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    label: "Approved",
    value: props.approved,
    description: "Documents approved",
    icon: CheckCircle2,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    label: "Under Review",
    value: props.underReview,
    description: "Documents being reviewed",
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    label: "Rejected",
    value: props.rejected,
    description: "Documents rejected",
    icon: XCircle,
    iconBg: "bg-red-50",
    iconColor: "text-red-600",
  },
];

const DocumentStats = (props: DocumentStatsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats(props).map((stat) => (
        <Card key={stat.label} className="rounded-md border-slate-200 shadow-sm">
          <CardContent className="flex items-start gap-3 ">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}>
              <stat.icon size={18} />
            </div>
            <div >
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              <p className="mt-0.5 text-xl font-semibold text-slate-900">{stat.value}</p>
              <p className="mt-0.5 text-xs text-slate-500">{stat.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DocumentStats;