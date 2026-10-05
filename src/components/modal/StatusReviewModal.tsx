import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import type { User } from "@/store/useAuthStore";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  currentStatus: "Pending" | "Approved" | "Rejected";
   onSuccess?: (updatedUser: User) => void;

};

export default function StatusReviewModal({
  open,
  onClose,
  userId,
  userName,
  currentStatus,
  onSuccess,
}: Props) {

  const { updateUserStatus } = useAuth();

  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  try {
    setLoading(true);

    const updatedUser = await updateUserStatus(
      userId,
      status
    );

    toast.success("User status updated.");

    onSuccess?.(updatedUser);

    onClose();
  } catch (err) {
    toast.error(
      typeof err === "string"
        ? err
        : "Something went wrong."
    );
  } finally {
    setLoading(false);
  }
};

  const options = [
    {
      value: "Approved" as const,
      label: "Approve",
      hint: "User can access the system.",
      Icon: ShieldCheck,
      active: "border-emerald-400 bg-emerald-50",
      iconClass: "text-emerald-600",
    },
    {
      value: "Rejected" as const,
      label: "Reject",
      hint: "User cannot access the system.",
      Icon: ShieldX,
      active: "border-red-400 bg-red-50",
      iconClass: "text-red-500",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className="sm:max-w-sm gap-0 rounded-2xl p-0 overflow-hidden">

        {/* Header */}
        <div className="border-b border-slate-100 px-5 py-4 pr-12">
          <DialogTitle className="text-base font-semibold text-slate-900">
            Review Registration
          </DialogTitle>
          <DialogDescription className="mt-0.5 truncate text-xs text-slate-400">
            Set the account status for{" "}
            <span className="font-medium text-slate-700">{userName}</span>
          </DialogDescription>
        </div>

        {/* Options */}
        <div className="space-y-2 px-5 py-4">
          {options.map(({ value, label, hint, Icon, active, iconClass }) => (
            <label
              key={value}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
                status === value ? active : "border-slate-200 hover:bg-slate-50"
              }`}
            >
              <input
                type="radio"
                name="registration-status"
                checked={status === value}
                onChange={() => setStatus(value)}
                className="sr-only"
              />

              <Icon size={18} className={`shrink-0 ${iconClass}`} />

              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">{label}</p>
                <p className="text-xs text-slate-500">{hint}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-3">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-sm text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save Changes
          </button>
        </div>

      </DialogContent>

    </Dialog>
  );
}
