"use client";

import { AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import type { Document } from "@/store/useDocumentStore";

interface DocumentReminderBannerProps {
  document: Document | null;
}

const DocumentReminderBanner = ({ document }: DocumentReminderBannerProps) => {
  if (!document) {
    return (
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-100">
          <AlertTriangle size={16} className="text-amber-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Verification required
          </p>
          <p className="mt-0.5 text-sm text-amber-700">
            You haven't uploaded a valid ID yet. Please submit one to complete
            your boarder verification.
          </p>
        </div>
      </div>
    );
  }

  if (document.valid_id_status === "Rejected") {
    return (
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-100">
          <AlertTriangle size={16} className="text-red-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-red-800">
            Action needed
          </p>
          <p className="mt-0.5 text-sm text-red-700">
            Your document was rejected. Please review the reason below and
            submit a replacement.
          </p>
        </div>
      </div>
    );
  }

  if (document.valid_id_status === "Under Review") {
    return (
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
          <Clock size={16} className="text-slate-600" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800">
            Pending review
          </p>
          <p className="mt-0.5 text-sm text-slate-600">
            Your document was submitted and is currently being reviewed. We'll
            notify you once it's processed.
          </p>
        </div>
      </div>
    );
  }

  // Approved
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
        <CheckCircle2 size={16} className="text-emerald-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-emerald-800">
          Verification complete
        </p>
        <p className="mt-0.5 text-sm text-emerald-700">
          Your ID has been verified. No further action is required.
        </p>
      </div>
    </div>
  );
};

export default DocumentReminderBanner;