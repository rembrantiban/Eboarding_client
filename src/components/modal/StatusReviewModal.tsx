import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ShieldCheck, ShieldX } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

  return (
    <Dialog open={open} onOpenChange={onClose}>

      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">

        <div className="border-b px-6 py-5">

          <h2 className="text-lg font-semibold">
            Review Registration
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Choose the status for this boarder.
          </p>

        </div>

        <div className="px-6 py-5">

          <div className="mb-5">

            <p className="font-medium text-slate-800">
              {userName}
            </p>

            <p className="text-sm text-slate-400">
              Select the account status below.
            </p>

          </div>

          <div className="space-y-3">

           
            <label
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                status === "Approved"
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-slate-200"
              }`}
            >
              <input
                type="radio"
                checked={status === "Approved"}
                onChange={() => setStatus("Approved")}
                className="hidden"
              />

              <ShieldCheck className="text-emerald-600" />

              <div>

                <p className="font-medium">
                  Approved
                </p>

                <p className="text-xs text-slate-500">
                  User can access the system.
                </p>

              </div>

            </label>

            <label
              className={`flex cursor-pointer items-center gap-4 rounded-xl border p-4 transition ${
                status === "Rejected"
                  ? "border-red-400 bg-red-50"
                  : "border-slate-200"
              }`}
            >
              <input
                type="radio"
                checked={status === "Rejected"}
                onChange={() => setStatus("Rejected")}
                className="hidden"
              />

              <ShieldX className="text-red-500" />

              <div>

                <p className="font-medium">
                  Rejected
                </p>

                <p className="text-xs text-slate-500">
                  User cannot access the system.
                </p>

              </div>

            </label>

          </div>

        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-medium text-white hover:bg-slate-800 flex items-center gap-2"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save Changes
          </button>

        </div>

      </DialogContent>

    </Dialog>
  );
}