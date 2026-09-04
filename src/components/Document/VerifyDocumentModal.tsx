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
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200 sm:max-w-100">
        <DialogHeader className="sr-only">
          <DialogTitle>Verify Document</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="relative overflow-hidden px-5 pt-5 pb-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(ellipse_at_top,var(--color-slate-200)_0%,transparent_70%)] opacity-70"
          />
          <div className="relative flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white ring-1 ring-slate-900/10">
              <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2} />
            </span>
            <div className="min-w-0 pt-0.5">
              <h2 className="text-[15px] leading-none font-semibold tracking-tight text-slate-900">
                Verify this document
              </h2>
              <p className="mt-1.5 text-[12px] leading-relaxed text-slate-500">
                Confirm the submitted ID is genuine and matches the
                boarder&rsquo;s details.
              </p>
            </div>
          </div>
        </div>

        {/* Summary card */}
        <div className="px-5">
          <div className="rounded-xl bg-slate-50/80 p-3 ring-1 ring-slate-200">
            <div className="flex items-center gap-2.5">
              {document.avatar_url ? (
                <img
                  src={document.avatar_url}
                  alt={`${document.first_name} ${document.last_name}`}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200/80 ring-1 ring-slate-200">
                  <User size={15} className="text-slate-500" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] leading-tight font-semibold text-slate-900">
                  {document.first_name} {document.last_name}
                </p>
                <p className="mt-0.5 truncate text-[11px] leading-tight text-slate-500">
                  {document.valid_id_type ?? "Valid ID"} &middot; #
                  {document.user_id_no}
                </p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-md bg-white px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-slate-600 uppercase ring-1 ring-slate-200">
                {document.valid_id_status}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={submitting}
            className="h-8 rounded-lg px-3 text-[12px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleVerify}
            disabled={submitting}
            className="h-8 gap-1.5 rounded-lg bg-slate-900 px-3 text-[12px] font-medium text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <BadgeCheck className="h-3.5 w-3.5" />
            )}
            {submitting ? "Verifying..." : "Verify document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}