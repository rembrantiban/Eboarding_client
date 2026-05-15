"use client";

import { useState } from "react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { useRules } from "@/hooks/useRules";

type Props = {
  open: boolean;
  onClose: () => void;
  ruleId: number | null;
  ruleTitle: string;
};

type Status =
  | "idle"
  | "loading"
  | "success"
  | "error";

const DeleteRuleModal = ({
  open,
  onClose,
  ruleId,
  ruleTitle,
}: Props) => {

  const { deleteRule } = useRules();

  const [status, setStatus] =
    useState<Status>("idle");

  const [error, setError] =
    useState("");

  const handleDelete = async () => {
    if (!ruleId) return;

    try {
      setStatus("loading");
      setError("");

      await deleteRule(ruleId);

      setStatus("success");

      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 1400);

    } catch (err) {
      console.error(err);

      setStatus("error");

      setError(
        "Failed to delete rule"
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
      <DialogContent className="max-w-md border-0 rounded-2xl p-0 overflow-hidden">

        {/* LOADING */}
        {status === "loading" && (
          <div className="py-16 flex flex-col items-center justify-center gap-4">

            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <Loader2
                size={30}
                className="animate-spin text-red-600"
              />
            </div>

            <div className="text-center">
              <h2 className="font-semibold text-lg">
                Deleting Rule
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Please wait while we remove the rule.
              </p>
            </div>

          </div>
        )}

        {/* SUCCESS */}
        {status === "success" && (
          <div className="py-16 flex flex-col items-center justify-center gap-4">

            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2
                size={32}
                className="text-green-600"
              />
            </div>

            <div className="text-center">
              <h2 className="font-semibold text-lg">
                Rule Deleted
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                The rule has been deleted successfully.
              </p>
            </div>

          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="py-16 px-6 flex flex-col items-center justify-center gap-4">

            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
              <XCircle
                size={32}
                className="text-red-600"
              />
            </div>

            <div className="text-center">
              <h2 className="font-semibold text-lg">
                Something went wrong
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                {error}
              </p>
            </div>

            <Button
              onClick={() => setStatus("idle")}
              className="rounded-xl"
            >
              Try Again
            </Button>

          </div>
        )}

        {/* CONFIRM */}
        {status === "idle" && (
          <div>

            {/* HEADER */}
            <div className="px-6 pt-6">

              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mx-auto">
                <AlertTriangle
                  size={28}
                  className="text-red-600"
                />
              </div>

              <div className="text-center mt-4">
                <h2 className="text-xl font-semibold">
                  Delete Rule
                </h2>

                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  Are you sure you want to delete
                  <span className="font-semibold text-black">
                    {" "}“{ruleTitle}”
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 p-6 pt-5">

              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-xl h-11"
              >
                Cancel
              </Button>

              <Button
                onClick={handleDelete}
                className="flex-1 rounded-xl h-11 bg-red-600 hover:bg-red-700"
              >
                <Trash2 size={16} />
                Delete
              </Button>

            </div>

          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default DeleteRuleModal;