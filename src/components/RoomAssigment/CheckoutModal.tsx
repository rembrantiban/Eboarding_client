"use client";

import {
  X,
  LogOut,
  User,
  DoorOpen,
  BedDouble,
  TriangleAlert,
} from "lucide-react";

import type { AssignedBoarder } from "@/store/useRoomAssignmentStore";

interface CheckoutModalProps {
  open: boolean;
  assignment: AssignedBoarder | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CheckoutModal({
  open,
  assignment,
  loading = false,
  onClose,
  onConfirm,
}: CheckoutModalProps) {
  if (!open || !assignment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">

        {/* Header */}
        <div className="border-b border-slate-100 p-6">

          <div className="flex items-start justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                <LogOut size={22} />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Check Out Boarder
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  This will end the current room assignment.
                </p>
              </div>

            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            >
              <X size={18} />
            </button>

          </div>

        </div>

        {/* Body */}
        <div className="space-y-5 p-6">

          {/* Boarder Card */}

          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white">
                <User size={18} />
              </div>

              <div>
                <h3 className="font-medium text-slate-900">
                  {assignment.first_name} {assignment.last_name}
                </h3>

                <p className="text-xs text-slate-500">
                  {assignment.user_id_no}
                </p>
              </div>

            </div>

            <div className="mt-4 flex gap-6 text-sm text-slate-600">

              <div className="flex items-center gap-2">
                <DoorOpen size={15} />
                Room {assignment.room_number}
              </div>

              <div className="flex items-center gap-2">
                <BedDouble size={15} />
                Bed {assignment.bed_number}
              </div>

            </div>

          </div>

          {/* Warning */}

          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">

            <div className="flex gap-3">

              <TriangleAlert
                size={18}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>

                <p className="text-sm font-medium text-amber-700">
                  Checkout Confirmation
                </p>

                <ul className="mt-2 space-y-1 text-xs text-amber-700">

                  <li>• The current assignment will become <b>Checked-Out</b>.</li>

                  <li>• The selected bed will become available.</li>

                  <li>• The boarder can be assigned to another room later.</li>

                  <li>• Assignment history will be preserved.</li>

                </ul>

              </div>

            </div>

          </div>

        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-100 p-5">

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className="rounded-xl bg-rose-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-700 disabled:bg-slate-300"
          >
            {loading ? "Checking Out..." : "Confirm Checkout"}
          </button>

        </div>

      </div>

    </div>
  );
}