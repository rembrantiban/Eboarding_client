"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { BadgeCheck, Loader2, ShieldCheck, User } from "lucide-react";

import type { Document } from "@/store/useDocumentStore";

interface Props {
  open: boolean;
  onClose: () => void;
  document: Document | null;
  onVerify: (id: number) => Promise<boolean> | boolean;
}

export default function VerifyDocumentModal({
  open,
  onClose,
  document,
  onVerify,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  if (!document) return null;

  const handleVerify = async () => {
    setSubmitting(true);
    try {
      const ok = await onVerify(document.id);
      if (ok) onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !submitting) onClose();
      }}
    >
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border border-slate-200 p-0 sm:max-w-md">
        <DialogHeader className="sr-only">
          <DialogTitle>Verify Document</DialogTitle>
        </DialogHeader>

        {/* Accent header */}
        <div className="relative flex flex-col items-center gap-3 bg-linear-to-b from-indigo-50 to-white px-6 pt-8 pb-6 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 ring-8 ring-indigo-100">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Verify this document
            </h2>
            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
              Confirm that the submitted ID is genuine and matches the
              boarder&rsquo;s details.
            </p>
          </div>
        </div>

        {/* Summary card */}
        <div className="px-6 pb-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <div className="flex items-center gap-3">
              {document.avatar_url ? (
                <img
                  src={document.avatar_url}
                  alt={`${document.first_name} ${document.last_name}`}
                  className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200">
                  <User size={16} className="text-slate-500" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-slate-900">
                  {document.first_name} {document.last_name}
                </p>
                <p className="truncate text-[12px] text-slate-500">
                  {document.valid_id_type ?? "Valid ID"} &middot; #
                  {document.user_id_no}
                </p>
              </div>
              <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200">
                {document.valid_id_status}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 px-6 pb-6 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleVerify}
            disabled={submitting}
            className="gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BadgeCheck className="h-4 w-4" />
            )}
            {submitting ? "Verifying..." : "Verify document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
