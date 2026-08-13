"use client";

import { useEffect, useRef, useState } from "react";
import {
  Wrench,
  X,
  Loader2,
  TriangleAlert,
  ImagePlus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { MAINTENANCE_CATEGORIES } from "./maintenance";

type Props = {
  open: boolean;
  /** Pre-filled from the boarder's active contract — shown, not editable. */
  roomId: number;
  roomNumber: string;
  onClose: () => void;
  /** Wire straight to useMaintenanceStore().createMaintenanceRequest */
  onSubmit: (data: FormData) => Promise<boolean>;
};

const MAX_IMAGE_MB = 5;
const MAX_DESCRIPTION = 500;

const SubmitMaintenanceRequestModal = ({
  open,
  roomId,
  roomNumber,
  onClose,
  onSubmit,
}: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    category !== "" && description.trim().length >= 10 && !submitting;

  // Reset on open
  useEffect(() => {
    if (!open) return;

    setCategory("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setSubmitting(false);
    setError(null);
  }, [open]);

  // Revoke the object URL so the preview does not leak memory
  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  // Escape to close + lock background scroll
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !submitting) onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, submitting, onClose]);

  if (!open) return null;

  const handleFile = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Choose an image file (JPG, PNG, or WEBP).");
      return;
    }

    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`That image is over ${MAX_IMAGE_MB}MB. Pick a smaller one.`);
      return;
    }

    setError(null);
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    /* Matches the store: multipart FormData, image optional */
    const formData = new FormData();
    formData.append("room_id", String(roomId));
    formData.append("category", category);
    formData.append("description", description.trim());
    if (image) formData.append("image", image);

    try {
      const ok = await onSubmit(formData);

      /* The store already fires its own success / error toast */
      if (ok) onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-100 flex items-end justify-center bg-slate-950/50 backdrop-blur-sm duration-200 animate-in fade-in sm:items-center sm:p-4"
      onClick={() => !submitting && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submit-request-title"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-2xl border border-slate-200/80 bg-white shadow-xl duration-200 animate-in fade-in zoom-in-95 sm:rounded-2xl"
      >
        {/* Header */}
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900">
              <Wrench className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <h2
                id="submit-request-title"
                className="text-[14px] font-semibold leading-tight text-slate-900"
              >
                Request Maintenance
              </h2>
              <p className="mt-0.5 text-[11px] leading-tight text-slate-400">
                Tell us what needs fixing and we will assign someone to it.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            aria-label="Close"
            className="shrink-0 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 disabled:hover:bg-transparent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {/* Room — read only */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/80">
            <div>
              <p className="text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
                Your room
              </p>
              <p className="mt-1 text-[12.5px] font-semibold text-slate-900">
                Room {roomNumber}
              </p>
            </div>
            <p className="text-[11px] text-slate-400">From your contract</p>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="request-category"
              className="mb-1.5 block text-[11.5px] font-medium text-slate-700"
            >
              What needs fixing? <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="request-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={submitting}
                className="h-9 w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-8 text-[12.5px] text-slate-800 outline-none transition focus:border-slate-900 disabled:bg-slate-50"
              >
                <option value="">Select a category</option>
                {MAINTENANCE_CATEGORIES.map((c: string) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <label
                htmlFor="request-description"
                className="text-[11.5px] font-medium text-slate-700"
              >
                Describe the problem <span className="text-rose-500">*</span>
              </label>
              <span
                className={cn(
                  "text-[10.5px] tabular-nums",
                  description.length > MAX_DESCRIPTION - 50
                    ? "text-amber-600"
                    : "text-slate-400"
                )}
              >
                {description.length}/{MAX_DESCRIPTION}
              </span>
            </div>
            <Textarea
              id="request-description"
              rows={4}
              value={description}
              maxLength={MAX_DESCRIPTION}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
              placeholder="Where is it, when did it start, and what happens? The more detail, the faster we can fix it."
              className="resize-none rounded-lg border-slate-200 text-[12.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-0 disabled:bg-slate-50"
            />
            {description.trim().length > 0 &&
              description.trim().length < 10 && (
                <p className="mt-1 text-[11px] text-slate-400">
                  Add a little more detail — at least 10 characters.
                </p>
              )}
          </div>

          {/* Photo */}
          <div>
            <label className="mb-1.5 block text-[11.5px] font-medium text-slate-700">
              Add a photo{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />

            {preview ? (
              <div className="relative overflow-hidden rounded-xl ring-1 ring-slate-200">
                <img
                  src={preview}
                  alt="Selected attachment"
                  className="h-44 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  disabled={submitting}
                  aria-label="Remove photo"
                  className="absolute right-2 top-2 rounded-lg bg-slate-900/70 p-1.5 text-white backdrop-blur transition hover:bg-slate-900"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
                <p className="truncate bg-white px-3 py-2 text-[11px] text-slate-500">
                  {image?.name}
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={submitting}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFile(e.dataTransfer.files?.[0]);
                }}
                className="flex w-full flex-col items-center rounded-xl border border-dashed border-slate-200 py-7 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                  <ImagePlus className="h-5 w-5 text-slate-400" />
                </div>
                <p className="mt-2.5 text-[12px] font-semibold text-slate-900">
                  Tap to upload a photo
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  JPG, PNG, or WEBP up to {MAX_IMAGE_MB}MB
                </p>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 flex-col gap-3 border-t border-slate-200/80 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-4 text-[11.5px]">
            {error ? (
              <p className="flex items-center gap-1.5 font-medium text-rose-700">
                <TriangleAlert className="h-3.5 w-3.5" />
                {error}
              </p>
            ) : (
              <p className="text-slate-400">
                {category === ""
                  ? "Pick a category to continue."
                  : description.trim().length < 10
                    ? "Describe the problem to continue."
                    : "Ready to send."}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
              className="h-9 flex-1 rounded-lg border-slate-200 px-4 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 sm:flex-none"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="h-9 flex-1 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800 disabled:opacity-40 sm:flex-none"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit request"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitMaintenanceRequestModal;