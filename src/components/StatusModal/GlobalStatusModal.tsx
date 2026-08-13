import {
  Loader2,
  Check,
  AlertTriangle,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";

import { useStatus } from "@/hooks/useStatus";

export default function GlobalStatusModal() {
  const {
    open,
    status,
    title,
    description,
    close,
  } = useStatus();

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (status !== "loading" && !value) {
          close();
        }
      }}
    >
      <DialogContent
        className="z-110 sm:max-w-sm rounded-2xl border border-slate-200 shadow-xl p-0 overflow-hidden"
        overlayClassName="z-110"
      >

        <div className="flex flex-col items-center px-8 pt-10 pb-8">

          {status === "loading" && (
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-blue-100 bg-blue-50">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" strokeWidth={2.25} />
            </div>
          )}

          {status === "success" && (
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-emerald-100 bg-emerald-50">
              <Check className="h-6 w-6 text-emerald-600" strokeWidth={2.5} />
            </div>
          )}

          {status === "error" && (
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border-2 border-red-100 bg-red-50">
              <AlertTriangle className="h-6 w-6 text-red-600" strokeWidth={2.25} />
            </div>
          )}

          <h2 className="text-[15px] font-medium tracking-tight text-slate-900 text-center">
            {title}
          </h2>

          {description && (
            <p className="mt-1.5 text-[13px] leading-relaxed text-center text-slate-500 max-w-70">
              {description}
            </p>
          )}

          {status !== "loading" && (
            <Button
              onClick={close}
              className="mt-7 w-full h-10 rounded-lg text-[13px] font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-none"
            >
              Close
            </Button>
          )}

        </div>

      </DialogContent>
    </Dialog>
  );
}