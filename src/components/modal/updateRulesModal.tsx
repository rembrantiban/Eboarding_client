"use client";

import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  Loader2,
  CheckCircle2,
  XCircle,
  Pencil,
} from "lucide-react";

import { useRules } from "@/hooks/useRules";
import type { Rule } from "@/store/useRulesStore";

type Props = {
  open: boolean;
  onClose: () => void;
  rule: Rule | null;
};

type Status =
  | "idle"
  | "loading"
  | "success"
  | "error";

const UpdateRuleModal = ({
  open,
  onClose,
  rule,
}: Props) => {

  const { updateRule } = useRules();

  const [status, setStatus] =
    useState<Status>("idle");

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
  });

  useEffect(() => {
    if (!rule || !open) return;
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm({
      title: rule.title,
      description: rule.description,
    });

  }, [rule, open]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
  if (!rule) return;

  try {
    setStatus("loading");
    setError("");

    await updateRule(rule.id, {
      ...form,
      is_active: rule.is_active,
    });

    setStatus("success");

    setTimeout(() => {
      setStatus("idle");
      onClose();
    }, 1500);

  } catch (err) {
    console.error(err);

    setStatus("error");

    setError(
      "Failed to update rule"
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
      <DialogContent className="max-w-xl border-0 rounded-xl p-0 overflow-hidden">

        {/* LOADING */}
        {status === "loading" && (
          <div className="py-16 flex flex-col items-center justify-center gap-4">

            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
              <Loader2
                size={30}
                className="animate-spin text-blue-600"
              />
            </div>

            <div className="text-center">
              <h2 className="font-semibold text-lg">
                Updating Rule
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                Please wait while we update the rule.
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
                Rule Updated
              </h2>

              <p className="text-sm text-muted-foreground mt-1">
                The rule has been updated successfully.
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

        {/* FORM */}
        {status === "idle" && (
          <div>

            {/* HEADER */}
            <div className="border-b px-6 py-5 flex items-start gap-4">

              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Pencil
                  size={24}
                  className="text-blue-600"
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Update Rule
                </h2>

                <p className="text-sm text-muted-foreground mt-1">
                  Edit the rule details and regulations.
                </p>
              </div>

            </div>

            {/* BODY */}
            <div className="p-6 space-y-5">

              {/* TITLE */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Rule Title
                </label>

                <Input
                  name="title"
                  placeholder="Enter rule title..."
                  value={form.title}
                  onChange={handleChange}
                  className="h-11 rounded-sm"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Description
                </label>

                <Textarea
                  name="description"
                  placeholder={`Example:
• Always keep noise levels low
• Visitors are not allowed after 10 PM
• Clean your assigned area regularly`}
                  value={form.description}
                  onChange={handleChange}
                  className="min-h-40 rounded-sm resize-none"
                />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-2">

                <Button
                  variant="outline"
                  onClick={onClose}
                  className="rounded-xl"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleUpdate}
                  className="rounded-xl bg-black hover:bg-black/90"
                >
                  Update Rule
                </Button>

              </div>

            </div>
          </div>
        )}

      </DialogContent>
    </Dialog>
  );
};

export default UpdateRuleModal;