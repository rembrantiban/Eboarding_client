"use client";

import { useEffect, useMemo, useState } from "react"
import {
  ScrollText,
  Download,
  Search,
  SearchX,
  FileText,
  Check,
  Info,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import HouseRulesPrintDocument from "@/components/Rule/HouseRulesPrintDocument"
import type { Rule } from "@/store/useRulesStore" // TODO: adjust import path
import { useRules } from "@/hooks/useRules";



type Props = {
  rules?: Rule[]
  loading?: boolean
  onRefresh?: () => void
  houseName?: string
  houseAddress?: string
  boarderName?: string
  roomNumber?: string
}



const formatDate = (date?: string) =>
  date
    ? new Date(date).toLocaleDateString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    : "—"

const formatDateTime = (date?: string | null) =>
  date
    ? new Date(date).toLocaleString("en-PH", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
    : "—"

const authorName = (rule: Rule) => {
  const name = [rule.first_name, rule.last_name].filter(Boolean).join(" ").trim()
  return name || "House management"
}

const slugify = (id: number) => `rule-${id}`

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

const BoarderHouseRulesPage = ({
  loading,
  onRefresh,
  houseName = "E-Boarding House",
  houseAddress,
  boarderName,
  roomNumber,
}: Props) => {
  const [search, setSearch] = useState("")
  const [activeId, setActiveId] = useState<number | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const {
    getPublishedRules,
    PublishedRule = [],
    acknowledgment,
    acknowledging,
    getAcknowledgmentStatus,
    acknowledgeRules,
  } = useRules()


  const rules = PublishedRule;

  useEffect(() => {
    getPublishedRules()
    getAcknowledgmentStatus()
  }, [getPublishedRules, getAcknowledgmentStatus])

  const needsAcknowledgment = acknowledgment?.needsAcknowledgment ?? false

  const handleAcknowledge = async () => {
    await acknowledgeRules()
    setAgreed(false)
  }

  const published = useMemo(
    () => rules,
    [rules]
  )
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (q === "") return published

    return published.filter(
      (r) =>
        r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    )
  }, [published, search])

  const lastUpdated = useMemo(
    () =>
      published.reduce<string | null>((latest, rule) => {
        const stamp = rule.updated_at || rule.created_at
        return !latest || new Date(stamp) > new Date(latest) ? stamp : latest
      }, null),
    [published]
  )

  useEffect(() => {
    if (filtered.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length === 0) return
        setActiveId(Number(visible[0].target.id.replace("rule-", "")))
      },
      { rootMargin: "-96px 0px -70% 0px", threshold: 0 }
    )

    filtered.forEach((rule) => {
      const el = document.getElementById(slugify(rule.id))
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [filtered])

  const handleDownload = () => {
    setDownloading(true)
    // Let the print document paint before the dialog opens
    setTimeout(() => {
      window.print()
      setDownloading(false)
    }, 120)
  }

  const scrollTo = (id: number) => {
    document
      .getElementById(slugify(id))
      ?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="min-h-screen bg-slate-50/60 print:bg-white">
      <div className="mx-auto max-w-5xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
        {/* ------------------------------ Header ----------------------------- */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900">
              <ScrollText className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-[18px] font-semibold leading-tight text-slate-900">
                House Rules
              </h1>
              <p className="mt-0.5 text-[12px] text-slate-500">
                {houseName}
                {lastUpdated && (
                  <span className="text-slate-400">
                    {" "}
                    · Last revised {formatDate(lastUpdated)}
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRefresh && (
              <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                aria-label="Refresh rules"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40"
              >
                <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
              </button>
            )}

            <Button
              type="button"
              onClick={handleDownload}
              disabled={loading || published.length === 0 || downloading}
              className="h-9 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800 disabled:opacity-40"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Notice */}
        <div className="flex items-start gap-2.5 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/80">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
          <p className="text-[12px] leading-relaxed text-slate-600">
            These rules apply to everyone staying in the house and form part of your
            contract. Download a copy to keep, or ask the caretaker if anything here is
            unclear.
          </p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search the rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search the rules"
            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-8 pr-3 text-[12.5px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-900 sm:max-w-sm"
          />
        </div>

        {/* ------------------------------- Body ------------------------------ */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm"
              >
                <div className="flex gap-3.5">
                  <div className="h-7 w-7 shrink-0 animate-pulse rounded-lg bg-slate-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-40 animate-pulse rounded bg-slate-100" />
                    <div className="h-2.5 w-full animate-pulse rounded bg-slate-100" />
                    <div className="h-2.5 w-4/5 animate-pulse rounded bg-slate-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-slate-200/80 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              {search ? (
                <SearchX className="h-5 w-5 text-slate-400" />
              ) : (
                <FileText className="h-5 w-5 text-slate-400" />
              )}
            </div>
            <p className="mt-3 text-[13px] font-semibold text-slate-900">
              {search ? "Nothing matches that" : "No rules published yet"}
            </p>
            <p className="mt-1 max-w-xs text-[11.5px] leading-relaxed text-slate-400">
              {search
                ? "Try a different word, or clear the search to see every rule."
                : "House rules will appear here once management publishes them."}
            </p>
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="mt-3 rounded-lg border border-slate-200 px-3 py-1.5 text-[11.5px] font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
            {/* Contents index — desktop only */}
            <nav
              aria-label="Rules index"
              className="hidden self-start lg:sticky lg:top-6 lg:block"
            >
              <p className="mb-2 px-2 text-[10.5px] font-medium uppercase tracking-wider text-slate-400">
                Contents
              </p>
              <ul className="space-y-0.5">
                {filtered.map((rule, index) => {
                  const isActive = activeId === rule.id

                  return (
                    <li key={rule.id}>
                      <button
                        type="button"
                        onClick={() => scrollTo(rule.id)}
                        className={cn(
                          "flex w-full items-start gap-2 rounded-lg px-2 py-1.5 text-left text-[11.5px] transition-colors",
                          isActive
                            ? "bg-slate-900 text-white"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                        )}
                      >
                        <span
                          className={cn(
                            "tabular-nums",
                            isActive ? "text-white/60" : "text-slate-400"
                          )}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="line-clamp-2">{rule.title}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>

            {/* Rules */}
            <div className="space-y-3">
              {filtered.map((rule, index) => (
                <article
                  key={rule.id}
                  id={slugify(rule.id)}
                  className="scroll-mt-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-slate-300"
                >
                  <div className="flex items-start gap-3.5">
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-[11px] font-semibold tabular-nums text-white"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h2 className="text-[13.5px] font-semibold leading-tight text-slate-900">
                        {rule.title}
                      </h2>

                      <p className="mt-1.5 whitespace-pre-wrap wrap-break-words text-[12.5px] leading-relaxed text-slate-600">
                        {rule.description}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-100 pt-2.5 text-[10.5px] text-slate-400">
                        <span className="inline-flex items-center gap-1 font-medium bg-green-200 px-1 py-0.5 rounded-2xl text-emerald-800">
                          <Check className="h-3 w-3" />
                         Active
                        </span>
                        <span>Posted by {authorName(rule)}</span>
                        <span className="tabular-nums">
                          Updated {formatDate(rule.updated_at || rule.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}

              <p className="px-1 pt-1 text-[11px] text-slate-400">
                Showing{" "}
                <span className="font-medium tabular-nums text-slate-600">
                  {filtered.length}
                </span>{" "}
                of {published.length} published rules.
              </p>
            </div>
          </div>
        )}

        {/* ------------------------- Acknowledgment -------------------------- */}
        {!loading && published.length > 0 && (
          needsAcknowledgment ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm print:hidden">
              <label className="flex items-start gap-2.5 text-[12px] leading-relaxed text-amber-900">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded border-amber-300 text-slate-900 focus:ring-slate-900"
                />
                <span>
                  I have read and agree to abide by all of the house rules listed above.
                </span>
              </label>

              <Button
                type="button"
                onClick={handleAcknowledge}
                disabled={!agreed || acknowledging}
                className="mt-3 h-9 rounded-lg bg-slate-900 px-4 text-[12.5px] font-medium text-white transition hover:bg-slate-800 disabled:opacity-40"
              >
                <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                {acknowledging ? "Submitting..." : "Acknowledge rules"}
              </Button>
            </div>
          ) : (
            acknowledgment?.acknowledgedAt && (
              <div className="flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-[12px] text-emerald-800 shadow-sm print:hidden">
                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                <p>
                  You acknowledged these rules on{" "}
                  <span className="font-medium">
                    {formatDateTime(acknowledgment.acknowledgedAt)}
                  </span>
                  .
                </p>
              </div>
            )
          )
        )}
      </div>

      {/* Printable copy — hidden on screen */}
      <HouseRulesPrintDocument
        rules={published}
        houseName={houseName}
        houseAddress={houseAddress}
        boarderName={boarderName}
        roomNumber={roomNumber}
      />
    </div>
  )
}

export default BoarderHouseRulesPage