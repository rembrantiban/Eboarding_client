"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Loader2, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useStatus } from "@/hooks/useStatus";


type Props = {
  open: boolean;
  onClose: () => void;
  userId: number;
  onSuccess?: () => void;
};

type Status = "idle" | "loading" | "success" | "error";

const DeleteUserModal = ({ open, onClose, userId, onSuccess }: Props) => {
  const { deleteUser } = useAuth();
  const { showLoading, showSuccess, showError } = useStatus();

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("idle");
    setError(null);
  }, [open]);

const handleDelete = async () => {
  if (!userId) return;

  try {
    showLoading(
      "Deleting User",
      "Please wait while we delete the user account..."
    );

    await deleteUser(userId);

    showSuccess(
      "User Deleted",
      "The user account has been deleted successfully."
    );

    onSuccess?.();

    onClose();

  } catch (err) {
    showError(
      "Delete Failed",
      typeof err === "string"
        ? err
        : "Failed to delete user."
    );
  }
};


  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) onClose();
      }}
    >
      <DialogContent className="sm:max-w-sm text-center">

        {/* 🔷 LOADING */}
        {status === "loading" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <Loader2 className="animate-spin text-red-500" size={40} />
            <p className="text-sm text-muted-foreground">
              Deleting user...
            </p>
          </div>
        )}

        {/* 🔷 SUCCESS */}
        {status === "success" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <CheckCircle className="text-green-500" size={40} />
            <p className="font-medium">User deleted successfully</p>
          </div>
        )}

        {/* 🔷 ERROR */}
        {status === "error" && (
          <div className="flex flex-col items-center gap-3 py-6">
            <XCircle className="text-red-500" size={40} />
            <p className="font-medium text-red-500">
              {error}
            </p>

            <Button
              variant="outline"
              onClick={() => setStatus("idle")}
            >
              Try Again
            </Button>
          </div>
        )}

        {/* 🔷 DEFAULT (CONFIRM UI) */}
        {status === "idle" && (
          <>
            <div className="flex flex-col items-center gap-3 py-4">
              <Trash2 className="text-red-500" size={36} />

              <h2 className="text-lg font-semibold">
                Delete User
              </h2>

              <p className="text-sm text-muted-foreground">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Trash2 className="mr-2" size={16} />
                Delete
              </Button>
            </div>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default DeleteUserModal;