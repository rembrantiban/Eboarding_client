"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Globe,
} from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  ruleTitle: string;
  loading?: boolean;
  onConfirm: () => void;
};

const PublishRuleModal = ({
  open,
  onClose,
  ruleTitle,
  loading,
  onConfirm,
}: Props) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl border-0 p-0 overflow-hidden">

        <div className="bg-emerald-50 px-8 pt-8 pb-6">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
            <Globe className="h-8 w-8 text-emerald-600" />
          </div>

          <h2 className="mt-5 text-center text-xl font-semibold text-slate-900">
            Publish Rule
          </h2>

          <p className="mt-2 text-center text-sm leading-relaxed text-slate-500">
            This rule will become visible to all boarders.
          </p>

        </div>

        <div className="px-8 py-6">

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

            <p className="text-xs uppercase tracking-wider text-slate-400">
              Rule
            </p>

            <p className="mt-1 font-medium text-slate-800">
              {ruleTitle}
            </p>

          </div>

          <div className="mt-8 flex justify-end gap-3">

            <Button
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button
              onClick={onConfirm}
              disabled={loading}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700"
            >
              {loading
                ? "Publishing..."
                : "Publish Rule"}
            </Button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
};

export default PublishRuleModal;