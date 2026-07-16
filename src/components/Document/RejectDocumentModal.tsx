"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { XCircle } from "lucide-react";

import type { Document } from "@/store/useDocumentStore";

interface Props {
  open: boolean;
  onClose: () => void;
  document: Document | null;
  onReject: (
    id: number,
    reason: string
  ) => Promise<void> | void;
}

export default function RejectDocumentModal({
  open,
  onClose,
  document,
  onReject,
}: Props) {

  const [reason, setReason] = useState("");

  if (!document) return null;

  const handleReject = async () => {
    if (!reason.trim()) return;

    await onReject(document.id, reason);

    setReason("");

    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          setReason("");
          onClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-md rounded-2xl">

        <DialogHeader>
          <DialogTitle className="sr-only">
            Reject Document
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center text-center">

          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            Reject Document
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Please provide a reason for rejecting
            this document.
          </p>

        </div>

        <div className="mt-5">

          <Textarea
            placeholder="Enter rejection reason..."
            rows={5}
            value={reason}
            onChange={(e) =>
              setReason(e.target.value)
            }
          />

        </div>

        <div className="mt-6 flex justify-end gap-2">

          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            variant="destructive"
            disabled={!reason.trim()}
            onClick={handleReject}
          >
            Reject
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}