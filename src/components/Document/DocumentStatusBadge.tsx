"use client";

import type { DocumentStatus } from "./types";

const statusConfig: Record<
  DocumentStatus,
  {
    bg: string;
    text: string;
  }
> = {
  Approved: {
    bg: "bg-green-50",
    text: "text-green-600",
  },
  "Under Review": {
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  Rejected: {
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

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.bg} ${config.text}`}
    >
      {status}
    </span>
  );
};

export default DocumentStatusBadge;