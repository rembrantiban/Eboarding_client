"use client";

import { CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import type { Document } from "@/store/useDocumentStore";

interface DocumentStatusCardProps {
  document: Document;
}

const statusConfig = {
  "Under Review": {
    icon: Clock,
    iconClass: "text-amber-500 bg-amber-50",
    label: "Under Review",
    labelClass: "text-amber-600",
    message: "Your document is being reviewed by our team.",
  },
  Approved: {
    icon: CheckCircle2,
    iconClass: "text-emerald-600 bg-emerald-50",
    label: "Approved",
    labelClass: "text-emerald-600",
    message: "Your ID has been verified and approved.",
  },
  Rejected: {
    icon: XCircle,
    iconClass: "text-red-500 bg-red-50",
    label: "Rejected",
    labelClass: "text-red-500",
    message: "Your document was rejected. See the reason below.",
  },
} as const;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const DocumentStatusCard = ({ document }: DocumentStatusCardProps) => {
  const config = statusConfig[document.valid_id_status];
  const Icon = config.icon;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5">
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${config.iconClass}`}>
          <Icon size={20} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">
              {document.valid_id_type ?? "Valid ID"}
            </p>
            <span className={`text-xs font-medium ${config.labelClass}`}>
              {config.label}
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">{config.message}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 px-6 py-5 sm:grid-cols-[120px_1fr]">
        <div className="flex h-28 w-full items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 sm:w-28">
          {document.valid_id_image ? (
            <img
              src={document.valid_id_image}
              alt={document.valid_id_type ?? "Valid ID"}
              className="h-full w-full object-cover"
            />
          ) : (
            <FileText size={22} className="text-slate-300" />
          )}
        </div>

        <dl className="grid grid-cols-2 gap-y-2.5 text-sm">
          <dt className="text-slate-500">Submitted</dt>
          <dd className="text-right font-medium text-slate-700">
            {formatDate(document.created_at)}
          </dd>

          <dt className="text-slate-500">Last updated</dt>
          <dd className="text-right font-medium text-slate-700">
            {formatDate(document.updated_at)}
          </dd>

          {document.valid_id_status === "Approved" && document.verified_by && (
            <>
              <dt className="text-slate-500">Verified by</dt>
              <dd className="text-right font-medium text-slate-700">
                {document.verified_by}
              </dd>
            </>
          )}
        </dl>
      </div>

      {document.valid_id_status === "Rejected" &&
        document.valid_id_rejection_reason && (
          <div className="border-t border-red-100 bg-red-50/60 px-6 py-4">
            <p className="text-xs font-medium uppercase tracking-wide text-red-500">
              Rejection reason
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {document.valid_id_rejection_reason}
            </p>
          </div>
        )}
    </div>
  );
};

export default DocumentStatusCard;