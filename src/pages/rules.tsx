"use client";

import { ShieldCheck, MoreVertical, Pencil, Globe, EyeOff, Trash2, Plus } from "lucide-react";
import { useRules } from "@/hooks/useRules";
import { useEffect, useState } from "react";
import CreateRuleModal from "@/components/modal/createRulesModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UpdateRulesModal from "@/components/modal/updateRulesModal";
import type { Rule } from "@/store/useRulesStore";
import DeleteRuleModal from "@/components/modal/deleteRulesModal";
import PublishRuleModal from "@/components/modal/PublishRuleModal";
import UnpublishRuleModal from "@/components/modal/UnpublishRuleModal";

const Rules = () => {
  const { rules, loading, getRules, publishRule, unpublishRule } = useRules();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);
  const [openUnpublish, setOpenUnpublish] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  useEffect(() => {
    getRules();
  }, [getRules]);

  return (
    <div className="h-screen overflow-y-auto border-l border-t border-slate-200 rounded-tl-2xl px-6 py-6 space-y-6 bg-slate-50">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Rules & regulations
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
            Guidelines that keep the environment safe, clean, and comfortable
            for everyone.
          </p>
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <Plus size={16} />
          Create rule
        </button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 w-32 animate-pulse rounded bg-slate-100" />
                  <div className="h-2.5 w-20 animate-pulse rounded bg-slate-100" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-4/6 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      ) : rules.length === 0 ? (
        /* EMPTY STATE */
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
            <ShieldCheck className="text-slate-500" size={22} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-slate-900">
            No rules yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Rules and regulations you create will show up here.
          </p>
          <button
            onClick={() => setOpenCreate(true)}
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            <Plus size={16} />
            Create rule
          </button>
        </div>
      ) : (
        /* RULES GRID */
        <div className="grid gap-4 md:grid-cols-2">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition-shadow duration-200 hover:shadow-md"
            >
              {/* TOP */}
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600">
                  <ShieldCheck size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="truncate font-semibold text-slate-900">
                      {rule.title}
                    </h2>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {rule.status !== "Published" && (
                        <span className="rounded-full border border-red-100 bg-red-50 px-2 py-1 text-[11px] font-medium text-red-600">
                          Inactive
                        </span>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="rounded-lg p-2 text-slate-400 opacity-0 transition hover:bg-slate-100 hover:text-slate-600 group-hover:opacity-100"
                            aria-label="Rule actions"
                          >
                            <MoreVertical size={18} />
                          </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-40">
                          {rule.status === "Published" ? (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRule(rule);
                                setOpenUnpublish(true);
                              }}
                            >
                              <EyeOff size={14} />
                              Unpublish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedRule(rule);
                                setOpenPublish(true);
                              }}
                            >
                              <Globe size={14} />
                              Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedRule(rule);
                              setOpenEdit(true);
                            }}
                          >
                            <Pencil size={14} />
                            Update rule
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedRule(rule);
                              setOpenDelete(true);
                            }}
                            className="text-red-500 focus:text-red-500"
                          >
                            <Trash2 size={14} />
                            Delete rule
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <p className="mt-0.5 text-xs text-slate-400">
                    Posted on {new Date(rule.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* DESCRIPTION */}
              {rule.description && (
                <div className="mt-3.5 space-y-1.5 border-t border-slate-100 pt-3.5">
                  {rule.description.split("\n").map((line, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-300" />
                      <span className="text-sm leading-relaxed text-slate-500">
                        {line}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <UpdateRulesModal open={openEdit} onClose={() => setOpenEdit(false)} rule={selectedRule} />

      <DeleteRuleModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        ruleId={selectedRule?.id || null}
        ruleTitle={selectedRule?.title || ""}
      />

      <CreateRuleModal open={openCreate} onClose={() => setOpenCreate(false)} />

      <PublishRuleModal
        open={openPublish}
        loading={loading}
        onClose={() => setOpenPublish(false)}
        ruleTitle={selectedRule?.title ?? ""}
        onConfirm={async () => {
          if (!selectedRule) return;

          await publishRule(selectedRule.id);

          setOpenPublish(false);
          setSelectedRule(null);
        }}
      />

      <UnpublishRuleModal
        open={openUnpublish}
        loading={loading}
        onClose={() => setOpenUnpublish(false)}
        ruleTitle={selectedRule?.title ?? ""}
        onConfirm={async () => {
          if (!selectedRule) return;

          await unpublishRule(selectedRule.id);

          setOpenUnpublish(false);
          setSelectedRule(null);
        }}
      />
    </div>
  );
};

export default Rules;