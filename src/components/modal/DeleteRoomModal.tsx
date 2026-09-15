"use client";

import { Button } from "@/components/ui/button";
import { Trash2, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  roomName?: string;
};

const DeleteRoomModal = ({
  open,
  onClose,
  onConfirm,
  loading,
  roomName,
}: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-5">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-red-600 flex items-center gap-2">
            <Trash2 size={18} />
            Delete Room
          </h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        {/* CONTENT */}
        <div className="text-sm text-gray-600 space-y-2">
          <p>
            Are you sure you want to delete this room?
          </p>

          {roomName && (
            <p className="font-semibold text-gray-800">
              Room: {roomName}
            </p>
          )}

          <p className="text-xs text-slate-500">
            This room will be moved to Deleted Rooms. Its beds and images are
            kept and you can restore it at any time.
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>

      </div>
    </div>
  );
};

export default DeleteRoomModal;