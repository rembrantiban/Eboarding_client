"use client";

import { useEffect, useMemo, useState } from "react";
import {
    ScrollText,
    Plus,
    Pencil,
    Ban,
    LoaderCircle,
    Save,
    X,
    ListChecks,
    Search,
    PhilippinePeso,
    Sparkles,
} from "lucide-react";
import { usePenalty } from "@/hooks/usePenalty";
import type { PenaltyRule } from "@/store/usePenaltyStore";
import {
    Field,
    ModalShell,
    CancelButton,
    PrimaryButton,
    inputClass,
    textareaClass,
    peso,
} from "./PenaltyFormBits";

type Props = {
    open: boolean;
    onClose: () => void;
};

type TabKey = "list" | "form";

type Draft = {
    id: number | null;
    penalty_name: string;
    description: string;
    amount: string;
};

const emptyDraft: Draft = {
    id: null,
    penalty_name: "",
    description: "",
    amount: "",
};

const PenaltyRulesModal = ({ open, onClose }: Props) => {
    const {
        penaltyRules,
        getAllPenaltyRules,
        createPenaltyRule,
        updatePenaltyRule,
        deactivatePenaltyRule,
    } = usePenalty();

    const [tab, setTab] = useState<TabKey>("list");
    const [query, setQuery] = useState("");
    const [draft, setDraft] = useState<Draft>(emptyDraft);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            getAllPenaltyRules();
        } else {
            //eslint-disable-next-line
            setTab("list");
            setQuery("");
            setDraft(emptyDraft);
            setErrors({});
        }
    }, [open, getAllPenaltyRules]);

    const isEditing = draft.id !== null;

    const filteredRules = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return penaltyRules;
        return penaltyRules.filter(
            (r) =>
                r.penalty_name.toLowerCase().includes(q) ||
                (r.description ?? "").toLowerCase().includes(q)
        );
    }, [penaltyRules, query]);

    const totalValue = useMemo(
        () => penaltyRules.reduce((t, r) => t + Number(r.amount || 0), 0),
        [penaltyRules]
    );

    const goToForm = (rule?: PenaltyRule) => {
        setDraft(
            rule
                ? {
                      id: rule.id,
                      penalty_name: rule.penalty_name,
                      description: rule.description ?? "",
                      amount: String(rule.amount),
                  }
                : emptyDraft
        );
        setErrors({});
        setTab("form");
    };

    const validate = () => {
        const e: Record<string, string> = {};
        if (!draft.penalty_name.trim()) e.penalty_name = "Name is required";
        if (!draft.amount.trim()) e.amount = "Amount is required";
        else if (Number.isNaN(Number(draft.amount)) || Number(draft.amount) < 0)
            e.amount = "Enter a valid amount";
        return e;
    };

    const handleSave = async () => {
        const e = validate();
        if (Object.keys(e).length) {
            setErrors(e);
            return;
        }
        setSubmitting(true);
        const ok = isEditing
            ? await updatePenaltyRule({
                  id: draft.id as number,
                  penalty_name: draft.penalty_name.trim(),
                  description: draft.description.trim(),
                  amount: Number(draft.amount),
              })
            : await createPenaltyRule({
                  penalty_name: draft.penalty_name.trim(),
                  description: draft.description.trim() || undefined,
                  amount: Number(draft.amount),
              });
        setSubmitting(false);
        if (ok) {
            setDraft(emptyDraft);
            setErrors({});
            setTab("list");
        }
    };

    const handleDeactivate = async (id: number) => {
        await deactivatePenaltyRule(id);
        if (draft.id === id) {
            setDraft(emptyDraft);
        }
    };

    const footer =
        tab === "form" ? (
            <>
                <button
                    type="button"
                    onClick={() => {
                        setDraft(emptyDraft);
                        setErrors({});
                        setTab("list");
                    }}
                    className="rounded-lg border border-slate-200 px-4 py-2 text-[12.5px] font-medium text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-50"
                    disabled={submitting}
                >
                    Back to list
                </button>
                <PrimaryButton onClick={handleSave} disabled={submitting}>
                    {submitting ? (
                        <>
                            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                            Saving...
                        </>
                    ) : isEditing ? (
                        <>
                            <Save className="h-3.5 w-3.5" />
                            Update Rule
                        </>
                    ) : (
                        <>
                            <Plus className="h-3.5 w-3.5" />
                            Create Rule
                        </>
                    )}
                </PrimaryButton>
            </>
        ) : (
            <>
                <CancelButton onClick={onClose} />
                <PrimaryButton onClick={() => goToForm()}>
                    <Plus className="h-3.5 w-3.5" />
                    New Rule
                </PrimaryButton>
            </>
        );

    return (
        <ModalShell
            open={open}
            onClose={onClose}
            title="Penalty"
            subtitle="Define reusable penalty types and amounts"
            icon={ScrollText}
            footer={footer}
        >
            {/* Tab switcher */}
            <div className="flex items-center gap-1 rounded-xl bg-slate-100 p-1">
                <TabButton
                    active={tab === "list"}
                    icon={ListChecks}
                    label="Penalty List"
                    count={penaltyRules.length}
                    onClick={() => setTab("list")}
                />
                <TabButton
                    active={tab === "form"}
                    icon={isEditing ? Pencil : Plus}
                    label={isEditing ? "Edit Rule" : "New Rule"}
                    onClick={() => (isEditing ? setTab("form") : goToForm())}
                />
            </div>

            {tab === "list" ? (
                <div className="space-y-3">
                    {/* summary strip */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <SummaryTile
                            label="Active Rules"
                            value={String(penaltyRules.length)}
                        />
                        <SummaryTile
                            label="Combined Value"
                            value={peso(totalValue)}
                        />
                    </div>

                    {/* search */}
                    <div className="relative">
                        <Search
                            size={13.5}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search rules…"
                            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12.5px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-300 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>

                    {/* list */}
                    {filteredRules.length === 0 ? (
                        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 px-4 py-10 text-center">
                            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50 ring-1 ring-inset ring-slate-200/70">
                                <ScrollText size={17} className="text-slate-400" />
                            </div>
                            <p className="mt-3 text-[12.5px] font-semibold text-slate-900">
                                {query ? "No matching rules" : "No penalty rules yet"}
                            </p>
                            <p className="mt-0.5 text-[11.5px] text-slate-400">
                                {query
                                    ? "Try a different search term."
                                    : "Create your first rule from the New Rule tab."}
                            </p>
                            {!query && (
                                <button
                                    type="button"
                                    onClick={() => goToForm()}
                                    className="mt-3 flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-[12px] font-medium text-white transition-colors hover:bg-slate-800"
                                >
                                    <Plus size={13.5} />
                                    New Rule
                                </button>
                            )}
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {filteredRules.map((r) => (
                                <li
                                    key={r.id}
                                    className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 transition-all hover:border-slate-300 hover:shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.15)]"
                                >
                                    <div className="flex min-w-0 items-center gap-3">
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900/90 text-white">
                                            <PhilippinePeso size={15} />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-[13px] font-semibold text-slate-900">
                                                {r.penalty_name}
                                            </p>
                                            <p className="truncate text-[11px] text-slate-400">
                                                {r.description || "No description"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[12.5px] font-bold tabular-nums text-slate-800 ring-1 ring-inset ring-slate-200/70">
                                            {peso(Number(r.amount))}
                                        </span>
                                        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                            <button
                                                type="button"
                                                onClick={() => goToForm(r)}
                                                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                                title="Edit rule"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeactivate(r.id)}
                                                className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                                                title="Deactivate rule"
                                            >
                                                <Ban className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white px-3.5 py-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                            <Sparkles size={14} />
                        </span>
                        <div>
                            <p className="text-[12.5px] font-semibold text-slate-800">
                                {isEditing ? "Editing an existing rule" : "New penalty rule"}
                            </p>
                            <p className="text-[11px] leading-relaxed text-slate-400">
                                Rules can be reused whenever you assign a penalty to a
                                boarder — the amount is applied automatically.
                            </p>
                        </div>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={() => {
                                    setDraft(emptyDraft);
                                    setErrors({});
                                }}
                                className="ml-auto flex items-center gap-1 text-[11px] font-medium text-slate-400 transition-colors hover:text-slate-600"
                            >
                                <X className="h-3 w-3" />
                                Clear
                            </button>
                        )}
                    </div>

                    <Field label="Penalty Name" error={errors.penalty_name}>
                        <input
                            value={draft.penalty_name}
                            onChange={(e) => {
                                setDraft((d) => ({ ...d, penalty_name: e.target.value }));
                                setErrors((p) => ({ ...p, penalty_name: "" }));
                            }}
                            placeholder="e.g. Late Payment Fee"
                            className={inputClass(errors.penalty_name)}
                        />
                    </Field>

                    <Field label="Amount" error={errors.amount}>
                        <div className="flex items-stretch overflow-hidden rounded-lg border border-slate-200 transition focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-500/20">
                            <span className="flex w-9 items-center justify-center border-r border-slate-200 bg-slate-50 text-slate-400">
                                <PhilippinePeso size={13.5} />
                            </span>
                            <input
                                value={draft.amount}
                                onChange={(e) => {
                                    setDraft((d) => ({ ...d, amount: e.target.value }));
                                    setErrors((p) => ({ ...p, amount: "" }));
                                }}
                                inputMode="decimal"
                                placeholder="0.00"
                                className="w-full px-3 py-2 text-[13px] tabular-nums text-slate-800 outline-none placeholder:text-slate-300"
                            />
                        </div>
                    </Field>

                    <Field label="Description" optional>
                        <textarea
                            rows={3}
                            value={draft.description}
                            onChange={(e) =>
                                setDraft((d) => ({ ...d, description: e.target.value }))
                            }
                            placeholder="When does this penalty apply?"
                            className={textareaClass()}
                        />
                    </Field>
                </div>
            )}
        </ModalShell>
    );
};

/* ---------------- small bits ---------------- */

const TabButton = ({
    active,
    icon: Icon,
    label,
    count,
    onClick,
}: {
    active: boolean;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    count?: number;
    onClick: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-all ${
            active
                ? "bg-white text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.08)]"
                : "text-slate-500 hover:text-slate-700"
        }`}
    >
        <Icon size={13.5} />
        {label}
        {typeof count === "number" && (
            <span
                className={`rounded-full px-1.5 text-[10px] font-semibold tabular-nums ${
                    active
                        ? "bg-slate-900 text-white"
                        : "bg-slate-200 text-slate-500"
                }`}
            >
                {count}
            </span>
        )}
    </button>
);

const SummaryTile = ({ label, value }: { label: string; value: string }) => (
    <div className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
        <p className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
            {label}
        </p>
        <p className="mt-0.5 text-[15px] font-bold tabular-nums tracking-tight text-slate-900">
            {value}
        </p>
    </div>
);

export default PenaltyRulesModal;
