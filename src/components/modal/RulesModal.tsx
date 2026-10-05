"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { ScrollText } from "lucide-react";
import { useRules } from "@/hooks/useRules";
import { useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

const RulesModal = ({ open, onClose }: Props) => {
  const { rules, getRules, loading } = useRules();

  useEffect(() => {
    if (open) {
      getRules();
    }
  }, [open, getRules]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex max-h-[80vh] flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-lg">

        {/* HEADER */}
        <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-5 py-4 pr-12">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <ScrollText size={16} />
          </span>

          <div className="min-w-0">
            <DialogTitle className="text-base font-semibold text-slate-900">
              Rules & Regulations
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Please read and follow all boarding house policies.
            </DialogDescription>
          </div>
        </div>

        {/* CONTENT */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">

          {loading ? (
            <div className="space-y-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-3.5 w-36 rounded bg-slate-100" />
                  <div className="h-3 rounded bg-slate-100" />
                  <div className="h-3 w-5/6 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : rules.length === 0 ? (

            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ScrollText size={28} className="text-slate-300" />
              <h3 className="mt-3 text-sm font-semibold text-slate-900">
                No Rules Available
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                No rules and regulations have been added yet.
              </p>
            </div>

          ) : (

            <ol className="divide-y divide-slate-100">
              {rules.map((rule, index) => (
                <li key={rule.id} className="py-4 first:pt-0 last:pb-0">

                  {/* TITLE */}
                  <h3 className="flex items-baseline gap-2 text-sm font-semibold text-slate-900">
                    <span className="text-xs tabular-nums text-slate-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {rule.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <ul className="mt-2 space-y-1.5 pl-6">
                    {rule.description
                      ?.split("\n")
                      .filter((line) => line.trim())
                      .map((line, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-[13px] leading-relaxed text-slate-600"
                        >
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate-400" />
                          <span>{line}</span>
                        </li>
                      ))}
                  </ul>

                </li>
              ))}
            </ol>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex shrink-0 justify-end border-t border-slate-100 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700"
          >
            I Understand
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default RulesModal;
