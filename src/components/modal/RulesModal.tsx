"use client";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ShieldCheck } from "lucide-react";
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
      <DialogContent className="max-w-xl! p-0 overflow-hidden rounded-lg">

        {/* 🔷 HEADER */}
        <div className="flex items-center gap-3 px-6 py-5 border-b bg-white">
          <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="text-blue-600" size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              Rules & Regulations
            </h2>

            <p className="text-sm text-muted-foreground">
              Please read and follow all boarding house policies.
            </p>
          </div>
        </div>

        {/* 🔷 CONTENT */}
        <ScrollArea className="h-125 px-6 py-5">

          {loading ? (
            <div className="space-y-4">

              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4 animate-pulse"
                >
                  <div className="h-4 w-40 bg-muted rounded mb-3" />

                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded" />
                    <div className="h-3 bg-muted rounded w-5/6" />
                    <div className="h-3 bg-muted rounded w-4/6" />
                  </div>
                </div>
              ))}

            </div>
          ) : rules.length === 0 ? (

            <div className="h-full flex flex-col items-center justify-center text-center py-20">
              <ShieldCheck
                size={40}
                className="text-muted-foreground"
              />

              <h3 className="mt-4 font-semibold text-lg">
                No Rules Available
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                No rules and regulations have been added yet.
              </p>
            </div>

          ) : (

            <div className="space-y-5">

              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className=""
                >

                  {/* TITLE */}
                  <div className="flex items-center gap-2 mb-4">

                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                      <ShieldCheck
                        size={18}
                        className="text-blue-600"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {rule.title}
                      </h3>
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="space-y-2">
                    {rule.description
                      ?.split("\n")
                      .map((line, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />

                          <span className="leading-relaxed">
                            {line}
                          </span>
                        </div>
                      ))}
                  </div>

                </div>
              ))}

            </div>
          )}

        </ScrollArea>

        {/* 🔷 FOOTER */}
        <div className="flex justify-end px-6 py-4 border-t bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl border hover:bg-muted transition"
          >
            Close
          </button>
        </div>

      </DialogContent>
    </Dialog>
  );
};

export default RulesModal;