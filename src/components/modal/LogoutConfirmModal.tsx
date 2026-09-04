"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { LogOut, Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  userName?: string;
}

export default function LogoutConfirmModal({
  open,
  onClose,
  onConfirm,
  userName,
}: Props) {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleConfirm = async () => {
    setLoggingOut(true);
    try {
      await onConfirm();
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value && !loggingOut) onClose();
      }}
    >
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border-0 p-0 shadow-2xl shadow-slate-900/20 ring-1 ring-slate-200 sm:max-w-90">
        <DialogHeader className="sr-only">
          <DialogTitle>Log out</DialogTitle>
        </DialogHeader>

        {/* Header */}
        <div className="relative overflow-hidden px-5 pt-6 pb-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-[radial-gradient(ellipse_at_top,var(--color-rose-200)_0%,transparent_70%)] opacity-70"
          />
          <div className="relative flex flex-col items-center text-center">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 ring-1 ring-rose-100">
              <LogOut className="h-5 w-5" strokeWidth={2} />
            </span>
            <h2 className="mt-3 text-[15px] leading-none font-semibold tracking-tight text-slate-900">
              Log out{userName ? `, ${userName}` : ""}?
            </h2>
            <p className="mt-2 max-w-70 text-[12px] leading-relaxed text-slate-500">
              You&rsquo;ll be signed out of your account and returned to the
              login screen.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-2 flex items-center justify-center gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-3.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loggingOut}
            className="h-9 flex-1 rounded-lg px-3 text-[12.5px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleConfirm}
            disabled={loggingOut}
            className="h-9 flex-1 gap-1.5 rounded-lg bg-rose-600 px-3 text-[12.5px] font-medium text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
          >
            {loggingOut ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            {loggingOut ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
