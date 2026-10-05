"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { CheckCircle2 } from "lucide-react";

import type { Document } from "@/store/useDocumentStore";

interface Props {
  open: boolean;
  onClose: () => void;
  document: Document | null;
  onApprove: (id: number) => Promise<void> | void;
}

export default function ApproveDocumentModal({
  open,
  onClose,
  document,
  onApprove,
}: Props) {
  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm gap-0 rounded-2xl p-5">

        <DialogHeader>
          <DialogTitle className="sr-only">
            Approve Document
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center">

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          </div>

          <h2 className="mt-3 text-base font-semibold text-slate-900">
            Approve Document
          </h2>

          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">
            Are you sure you want to approve the uploaded
            <span className="font-semibold text-slate-900">
              {" "}
              {document.valid_id_type}
            </span>
            {" "}of
            <span className="font-semibold text-slate-900">
              {" "}
              {document.first_name} {document.last_name}
            </span>
            ?
          </p>

        </div>

        <div className="mt-5 flex justify-center gap-2">

          <Button
            size="sm"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700"
            onClick={async () => {
              await onApprove(document.id);
              onClose();
            }}
          >
            Approve
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}