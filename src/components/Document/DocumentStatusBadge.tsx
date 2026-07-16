"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import type { DocumentStatus } from "./types";

const statusConfig: Record<
  DocumentStatus,
  {
    icon: typeof CheckCircle2;
    bg: string;
    text: string;
  }
> = {
  Approved: {
    icon: CheckCircle2,
    bg: "bg-green-50",
    text: "text-green-600",
  },
  "Under Review": {
    icon: Clock,
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  Rejected: {
    icon: XCircle,
    bg: "bg-red-50",
    text: "text-red-600",
  },
};

interface DocumentStatusBadgeProps {
  status: DocumentStatus;
}

const DocumentStatusBadge = ({
  status,
}: DocumentStatusBadgeProps) => {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
};

export default DocumentStatusBadge;