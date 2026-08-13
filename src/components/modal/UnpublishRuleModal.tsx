"use client";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { EyeOff, Loader2 } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  ruleTitle: string;
  loading?: boolean;
  onConfirm: () => void;
};

const UnpublishRuleModal = ({
  open,
  onClose,
  ruleTitle,
  loading,
  onConfirm,
}: Props) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val && !loading) onClose();
      }}
    >
      <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl border-slate-200/80 p-0 shadow-xl">

        {/* HEADER */}
        <div className="flex items-start gap-2.5 border-b border-slate-200/80 px-5 py-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-50 ring-1 ring-amber-100">
            <EyeOff className="h-4 w-4 text-amber-600" />
          </div>

          <div className="min-w-0">
            <DialogTitle className="text-[14px] font-semibold leading-tight text-slate-900">
              Unpublish rule
            </DialogTitle>
            <DialogDescription className="mt-0.5 text-[11px] leading-tight text-slate-400">
              Boarders will no longer see this rule.
            </DialogDescription>
          </div>
        </div>

        {/* BODY */}
        <div className="px-5 py-4">
          <div className="rounded-xl border border-slate-200/80 p-4">
            <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
              Rule
            </p>
            <p className="mt-1 wrap-break-words text-[12.5px] font-semibold text-slate-900">
              {ruleTitle}
            </p>
          </div>

          <p className="mt-3 text-[11.5px] leading-relaxed text-slate-500">
            It disappears from the boarder rules page and future downloads. The
            rule itself is kept, so you can publish it again later.
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex items-center gap-2 border-t border-slate-200/80 px-5 py-3.5">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="h-9 flex-1 rounded-lg border-slate-200 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={loading}
            className="h-9 flex-1 rounded-lg bg-amber-600 text-[12.5px] font-medium text-white transition hover:bg-amber-700 disabled:opacity-40"
          >
            {loading ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Unpublishing...
              </>
            ) : (
              "Unpublish rule"
            )}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default UnpublishRuleModal;