"use client";

import {
  ShieldCheck,
  MoreVertical,
  Pencil,
  Globe,
  EyeOff,
  Trash2,
  Plus,
  Search,
  SearchX,
  Info,
  Check,
  ScrollText,
  GlobeOff,
} from "lucide-react";
import { useRules } from "@/hooks/useRules";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { useAuth } from "@/hooks/useAuth";

type RuleMeta = Rule & { posted_by?: string; updated_at?: string };

const formatDate = (value?: string | null) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

const Rules = () => {
  const { user } = useAuth();
  const { rules, loading, getRules, publishRule, unpublishRule } = useRules();
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPublish, setOpenPublish] = useState(false);
  const [openUnpublish, setOpenUnpublish] = useState(false);
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | number | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getRules();
  }, [getRules]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (q === "") return rules;

    return rules.filter(
      (rule) =>
        rule.title.toLowerCase().includes(q) ||
        rule.description?.toLowerCase().includes(q)
    );
  }, [rules, search]);

  const publishedCount = useMemo(
    () => rules.filter((rule) => rule.status === "Published").length,
    [rules]
  );

  const lastRevised = useMemo(() => {
    if (rules.length === 0) return "";
    const newest = rules.reduce((latest, rule) => {
      const current = new Date(
        (rule as RuleMeta).updated_at ?? rule.created_at
      ).getTime();
      return current > latest ? current : latest;
    }, 0);
    return newest ? formatDate(new Date(newest).toISOString()) : "";
  }, [rules]);

  useEffect(() => {
    if (loading || filtered.length === 0) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("[data-rule-section]")
    );
    if (sections.length === 0) return;
    //eslint-disable-next-line
    setActiveId(sections[0].dataset.ruleSection ?? null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) => a.boundingClientRect.top - b.boundingClientRect.top
          )[0];

        if (visible) {
          setActiveId(
            (visible.target as HTMLElement).dataset.ruleSection ?? null
          );
        }
      },
      {
        root: scrollRef.current,
        rootMargin: "-15% 0px -70% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [loading, filtered]);

  const scrollToRule = (id: string | number) => {
    const target = document.querySelector<HTMLElement>(
      `[data-rule-section="${id}"]`
    );
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(String(id));
  };

  return (
    <div
      ref={scrollRef}
      className="h-screen overflow-y-auto rounded-tl-2xl border-l border-t border-slate-200 bg-slate-50 px-5 py-4"
    >
      <div className="mx-auto max-w-5xl space-y-3.5 pb-8">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
              <ScrollText size={14} />
            </div>

            <div>
              <h1 className="text-[15px] font-semibold tracking-tight text-slate-900">
                House rules
              </h1>
              <p className="mt-0.5 text-xs text-slate-500">
                E-Boarding House
                {lastRevised && ` · Last revised ${lastRevised}`}
              </p>
            </div>
          </div>

          {user?.user_type === "Admin" && (
            <button
              onClick={() => setOpenCreate(true)}
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
            >
              <Plus size={14} />
              Create rule
            </button>
          )}
        </div>

        {/* INFO BANNER */}
        <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-blue-50/70 px-4 py-3">
          <Info size={15} className="mt-0.5 shrink-0 text-blue-500" />
          <p className="text-[13px] leading-relaxed text-blue-900/75">
            Published rules appear on every boarder&apos;s house rules page and
            form part of their contract. Unpublished rules stay visible to
            admins only until you publish them.
          </p>
        </div>

        {/* SEARCH + COUNT */}
        {!loading && rules.length > 0 && (
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <Search
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Search the rules..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search rules"
                className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
              />
            </div>

            <p className="text-xs text-slate-500">
              <span className="font-medium tabular-nums text-slate-900">
                {publishedCount}
              </span>{" "}
              published ·{" "}
              <span className="font-medium tabular-nums text-slate-900">
                {rules.length - publishedCount}
              </span>{" "}
              unpublished
            </p>
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[190px_minmax(0,1fr)]">
            <div className="hidden space-y-2 lg:block">
              <div className="h-2 w-16 animate-pulse rounded bg-slate-200" />
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 animate-pulse rounded-lg bg-slate-100"
                />
              ))}
            </div>

            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="flex gap-3">
                    <div className="h-8 w-8 shrink-0 animate-pulse rounded-lg bg-slate-100" />
                    <div className="flex-1 space-y-2.5">
                      <div className="h-3.5 w-36 animate-pulse rounded bg-slate-100" />
                      <div className="h-2.5 animate-pulse rounded bg-slate-100" />
                      <div className="h-2.5 w-5/6 animate-pulse rounded bg-slate-100" />
                      <div className="h-2.5 w-1/3 animate-pulse rounded bg-slate-100" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : filtered.length === 0 ? (
          /* EMPTY STATE */
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-10 text-center">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
              {search ? (
                <SearchX className="text-slate-500" size={18} />
              ) : (
                <ShieldCheck className="text-slate-500" size={18} />
              )}
            </div>

            <h2 className="mt-3 text-sm font-semibold text-slate-900">
              {search ? "Nothing matches that" : "No rules yet"}
            </h2>

            <p className="mt-1 text-[13px] text-slate-500">
              {search
                ? "Try a different word, or clear the search to see every rule."
                : "Rules and regulations you create will show up here."}
            </p>

            {search ? (
              <button
                onClick={() => setSearch("")}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3.5 py-2 text-[13px] font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={() => setOpenCreate(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-slate-800"
              >
                <Plus size={14} />
                Create rule
              </button>
            )}
          </div>
        ) : (
          /* CONTENTS + RULES */
          <div className="grid gap-6 lg:grid-cols-[190px_minmax(0,1fr)]">
            {/* CONTENTS RAIL */}
            <nav
              aria-label="Rules contents"
              className="hidden lg:sticky lg:top-0 lg:block lg:self-start"
            >
              <p className="px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                Contents
              </p>

              <ul className="mt-2 space-y-0.5">
                {filtered.map((rule, index) => {
                  const isActive = String(rule.id) === String(activeId);

                  return (
                    <li key={rule.id}>
                      <button
                        onClick={() => scrollToRule(rule.id)}
                        className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors ${
                          isActive
                            ? "bg-slate-900 font-medium text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <span
                          className={`shrink-0 text-[11px] tabular-nums ${
                            isActive ? "text-white/60" : "text-slate-400"
                          }`}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="truncate">{rule.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* RULE CARDS */}
            <div className="space-y-3">
              {filtered.map((rule, index) => {
                const meta = rule as RuleMeta;

                return (
                  <article
                    key={rule.id}
                    data-rule-section={rule.id}
                    className="scroll-mt-4 rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex gap-3">
                      {/* NUMBER */}
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold tabular-nums text-white">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0 flex-1">
                        {/* TITLE + ACTIONS */}
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="pt-1 text-sm font-semibold text-slate-900">
                            {rule.title}
                          </h2>

                          <div className="flex shrink-0 items-center gap-1.5">
                            {rule.status !== "Published" && (
                              <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 ring-1 ring-slate-200">
                                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                Unpublished
                              </span>
                            )}

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                                  aria-label="Rule actions"
                                >
                                  <MoreVertical size={16} />
                                </button>
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                align="end"
                                className="w-40 rounded-lg border-slate-200 p-1 text-[13px]"
                              >
                                {user?.user_type === "Admin" && (
                                  <>
                                    {rule.status === "Published" ? (
                                      <DropdownMenuItem
                                        onClick={() => {
                                          setSelectedRule(rule);
                                          setOpenUnpublish(true);
                                        }}
                                        className="gap-2 rounded-md"
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
                                        className="gap-2 rounded-md"
                                      >
                                        <Globe size={14} />
                                        Publish
                                      </DropdownMenuItem>
                                    )}
                                  </>
                                )}

                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedRule(rule);
                                    setOpenEdit(true);
                                  }}
                                  className="gap-2 rounded-md"
                                >
                                  <Pencil size={14} />
                                  Update rule
                                </DropdownMenuItem>

                                {user?.user_type === "Admin" && (
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedRule(rule);
                                      setOpenDelete(true);
                                    }}
                                    className="gap-2 rounded-md text-red-500 focus:text-red-500"
                                  >
                                    <Trash2 size={14} />
                                    Delete rule
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {/* DESCRIPTION */}
                        {rule.description && (
                          <div className="mt-1.5 space-y-1.5">
                            {rule.description.split("\n").map((line, i) => (
                              <p
                                key={i}
                                className="text-[13px] leading-relaxed text-slate-600"
                              >
                                {line}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* META FOOTER */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-slate-100 pt-2.5 text-[11px]">
                          {rule.status === "Published" ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 font-medium text-emerald-600">
                              <Check size={12} />
                              Published
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 font-medium text-slate-400">
                              <GlobeOff size={12} />
                              Not published
                            </span>
                          )}

                          {meta.posted_by && (
                            <span className="text-slate-400">
                              Posted by {meta.posted_by}
                            </span>
                          )}

                          <span className="text-slate-400">
                            {meta.updated_at
                              ? `Updated ${formatDate(meta.updated_at)}`
                              : `Posted ${formatDate(rule.created_at)}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}
      </div>

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