"use client";

import {
  ShieldCheck,
} from "lucide-react";
import { useRules } from "@/hooks/useRules";
import { useEffect, useState } from "react";
import CreateRuleModal from "@/components/modal/createRulesModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";
import UpdateRulesModal from "@/components/modal/updateRulesModal"
import type { Rule } from "@/store/useRulesStore"
import DeleteRuleModal from "@/components/modal/deleteRulesModal";

const Rules = () => {
  const { rules, loading, getRules } = useRules();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

  useEffect(() => {
    getRules();
  }, [getRules]);

  return (
    <div className="h-screen overflow-y-auto border-l-2 border-t-2 rounded-tl-2xl px-6 py-4 space-y-6 bg-background">

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Rules & Regulations
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Please follow these guidelines to maintain a safe,
            clean, and comfortable environment for everyone.
          </p>
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:bg-black/90 transition"
        >
          + Create Rule
        </button>

      </div>

      {/* LOADING */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">

          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-white p-5 animate-pulse space-y-4"
            >
              <div className="h-5 w-40 bg-muted rounded" />

              <div className="space-y-2">
                <div className="h-3 bg-muted rounded" />
                <div className="h-3 bg-muted rounded w-5/6" />
                <div className="h-3 bg-muted rounded w-4/6" />
              </div>
            </div>
          ))}

        </div>
      ) : rules.length === 0 ? (

        <div className="rounded-2xl border border-dashed p-16 text-center bg-white">

          <div className="w-14 h-14 rounded-2xl bg-muted mx-auto flex items-center justify-center">
            <ShieldCheck className="text-muted-foreground" />
          </div>
          <h2 className="mt-4 font-semibold text-lg">
            No Rules Yet
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            No rules and regulations have been added yet.
          </p>
        </div>

      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {rules.map((rule) => (

            <div
              key={rule.id}
              className="group rounded-lg border bg-white/70 backdrop-blur-xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              {/* TOP */}
              <div className="flex items-start gap-3">

                <div className="w-11 h-11 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-semibold text-lg text-gray-900">
                      {rule.title}
                    </h2>
                    {!rule.is_active && (
                      <span className="text-[11px] px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Posted on{" "}
                    {new Date(rule.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex justify-between items-start mt-3">
                {/* DESCRIPTION */}
                <div>
                  {rule.description
                    ?.split("\n")
                    .map((line, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                        <span className="leading-relaxed">
                          {line}
                        </span>

                      </div>
                    ))}
                </div>

                <div className="flex items-center gap-2">

                  {!rule.is_active && (
                    <span className="text-[11px] px-2 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                      Inactive
                    </span>
                  )}

                  <DropdownMenu>

                    <DropdownMenuTrigger asChild>
                      <button
                        className="opacity-0 group-hover:opacity-100 transition p-2 rounded-lg hover:bg-gray-100"
                      >
                        <MoreVertical
                          size={20}
                          className="text-gray-500"
                        />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="end"
                      className="w-40"
                    >

                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRule(rule);
                          setOpenEdit(true);
                        }}
                      >
                        <Pencil size={14} />
                        Update Rule
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRule(rule);
                          setOpenDelete(true);
                        }}
                        className="text-red-500 focus:text-red-500"
                      >
                        <Trash2 size={14} />
                        Delete Rule
                      </DropdownMenuItem>

                    </DropdownMenuContent>

                  </DropdownMenu>

                </div>
              </div>

            </div>


          ))}
        </div>
      )}

      <UpdateRulesModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        rule={selectedRule}
      />

      <DeleteRuleModal
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        ruleId={selectedRule?.id || null}
        ruleTitle={selectedRule?.title || ""}
      />

      <CreateRuleModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </div>
  );
};

export default Rules;