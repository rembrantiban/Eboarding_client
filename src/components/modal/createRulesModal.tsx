"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
    Loader2,
    CircleCheck,
    TriangleAlert,
    ShieldCheck,
} from "lucide-react";

import { useRules } from "@/hooks/useRules";

type Props = {
    open: boolean;
    onClose: () => void;
};

type Status =
    | "idle"
    | "loading"
    | "success"
    | "error";

const MAX_TITLE = 80;

const CreateRuleModal = ({
    open,
    onClose,
}: Props) => {

    const { createRule } = useRules();

    const [status, setStatus] =
        useState<Status>("idle");

    const [error, setError] =
        useState("");

    const [form, setForm] = useState({
        title: "",
        description: "",
    });

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

    const handleCreate = async () => {
        try {
            setStatus("loading");
            setError("");

            await createRule(form);

            setStatus("success");

            setTimeout(() => {
                setForm({
                    title: "",
                    description: "",
                });

                setStatus("idle");

                onClose();
            }, 1500);

        } catch (err) {
            console.error(err);

            setStatus("error");

            setError(
                "Failed to create rule"
            );
        }
    };

    const submitting = status === "loading";
    const canSubmit =
        form.title.trim() !== "" &&
        form.description.trim() !== "" &&
        !submitting &&
        status !== "success";

    return (
        <Dialog
            open={open}
            onOpenChange={(val) => {
                if (!val && !submitting) onClose();
            }}
        >
            <DialogContent className="max-w-lg gap-0 overflow-hidden rounded-2xl border-slate-200/80 p-0 shadow-xl">

                {/* HEADER */}
                <div className="flex items-start gap-2.5 border-b border-slate-200/80 px-5 py-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900">
                        <ShieldCheck className="h-4 w-4 text-white" />
                    </div>

                    <div className="min-w-0">
                        <DialogTitle className="text-[14px] font-semibold leading-tight text-slate-900">
                            Create rule
                        </DialogTitle>
                        <DialogDescription className="mt-0.5 text-[11px] leading-tight text-slate-400">
                            Add a new boarding house rule or regulation.
                        </DialogDescription>
                    </div>
                </div>

                {/* BODY */}
                <div className="space-y-4 px-5 py-4">

                    {/* TITLE */}
                    <div>
                        <div className="mb-1.5 flex items-baseline justify-between">
                            <label
                                htmlFor="rule-title"
                                className="text-[11.5px] font-medium text-slate-700"
                            >
                                Rule title <span className="text-rose-500">*</span>
                            </label>
                            <span className="text-[10.5px] tabular-nums text-slate-400">
                                {form.title.length}/{MAX_TITLE}
                            </span>
                        </div>

                        <Input
                            id="rule-title"
                            name="title"
                            maxLength={MAX_TITLE}
                            placeholder="e.g. Quiet hours"
                            value={form.title}
                            onChange={handleChange}
                            disabled={submitting}
                            className="h-9 rounded-lg border-slate-200 text-[12.5px] text-slate-800 transition placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-0 disabled:bg-slate-50"
                        />
                    </div>

                    {/* DESCRIPTION */}
                    <div>
                        <label
                            htmlFor="rule-description"
                            className="mb-1.5 block text-[11.5px] font-medium text-slate-700"
                        >
                            Description <span className="text-rose-500">*</span>
                        </label>

                        <Textarea
                            id="rule-description"
                            name="description"
                            rows={7}
                            placeholder={`Keep noise to a minimum between 10:00 PM and 6:00 AM.
                        Use headphones after quiet hours begin.
                        Report repeated disturbances to the caretaker.`}
                            value={form.description}
                            onChange={handleChange}
                            disabled={submitting}
                            className="resize-none rounded-lg border-slate-200 text-[12.5px] leading-relaxed text-slate-800 transition placeholder:text-slate-400 focus-visible:border-slate-900 focus-visible:ring-0 disabled:bg-slate-50"
                        />

                        <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                            Each new line shows as its own paragraph on the rules page.
                        </p>
                    </div>
                </div>

                {/* FOOTER */}
                <div className="flex flex-col gap-3 border-t border-slate-200/80 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-h-4 text-[11.5px]">
                        {status === "success" ? (
                            <p className="flex items-center gap-1.5 font-medium text-emerald-700">
                                <CircleCheck className="h-3.5 w-3.5" />
                                Rule created successfully.
                            </p>
                        ) : status === "error" ? (
                            <p className="flex items-center gap-1.5 font-medium text-rose-700">
                                <TriangleAlert className="h-3.5 w-3.5" />
                                {error}
                            </p>
                        ) : (
                            <p className="text-slate-400">
                                {form.title.trim() === ""
                                    ? "Add a title to continue."
                                    : form.description.trim() === ""
                                        ? "Add a description to continue."
                                        : "Rules are unpublished until you publish them."}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={submitting}
                            className="h-9 flex-1 rounded-lg border-slate-200 px-4 text-[12.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 sm:flex-none"
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleCreate}
                            disabled={!canSubmit}
                            className="h-9 flex-1 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800 disabled:opacity-40 sm:flex-none"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create rule"
                            )}
                        </Button>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    );
};

export default CreateRuleModal;