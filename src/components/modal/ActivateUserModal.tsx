import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { UserCheck, Loader2, ShieldCheck } from "lucide-react";
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

const ActivateUserModal = ({
  open,
  onClose,
  userId,
  userName,
  onSuccess,
}: Props) => {
  const { activateUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleActivate = async () => {
    try {
      setLoading(true);

      await activateUser(userId);

      toast.success("User account has been activated.");

      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : "Failed to activate account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden">

        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-5 flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
            <UserCheck className="w-7 h-7 text-emerald-600" />
          </div>

          <div>

            <h2 className="text-lg font-semibold text-slate-900">
              Activate Account
            </h2>

            <p className="text-sm text-slate-500">
              Restore user access.
            </p>

          </div>

        </div>

        <div className="px-6 py-6 space-y-5">

          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 flex gap-3">

            <ShieldCheck className="text-emerald-600 mt-0.5" />

            <div>

              <p className="font-medium text-slate-800">
                {userName}
              </p>

              <p className="text-sm text-slate-500 mt-1">
                This user will regain access to the boarding house management
                system.
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
              onClick={handleActivate}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2"
            >
              {loading && (
                <Loader2 className="w-4 h-4 animate-spin" />
              )}

              Activate
            </button>

          </div>

        </div>

      </DialogContent>
    </Dialog>
  );
};

export default ActivateUserModal;