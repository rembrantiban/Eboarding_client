import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { UserX, Loader2, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: number;
  userName: string;
  onSuccess?: () => void;
};

const DeactivateUserModal = ({
  open,
  onClose,
  userId,
  userName,
  onSuccess,
}: Props) => {
  const { deactivateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDeactivate = async () => {
    try {
      setLoading(true);

      await deactivateUser(userId);

      toast.success("User account has been deactivated.");

      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : "Failed to deactivate account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">

        {/* Header */}
        <div className="bg-red-50 border-b border-red-100 px-6 py-5 flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
            <UserX className="w-7 h-7 text-red-600" />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Deactivate Account
            </h2>

            <p className="text-sm text-slate-500">
              Disable this user's access.
            </p>
          </div>

        </div>

        <div className="px-6 py-6 space-y-5">

          <div className="rounded-xl bg-red-50 border border-red-100 p-4 flex gap-3">

            <ShieldAlert className="text-red-500 mt-0.5" />

            <div>

              <p className="font-medium text-slate-800">
                {userName}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                The user will no longer be able to log in until the account
                is activated again.
              </p>

            </div>

          </div>

          <div className="flex justify-end gap-3">

            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              onClick={handleDeactivate}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
            >
              {loading && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}

              Deactivate
            </button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
};

export default DeactivateUserModal;