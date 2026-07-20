"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  page: number;
  pageCount: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
};

const getPageList = (page: number, pageCount: number) => {
  const pages: (number | "ellipsis")[] = [];
  const add = (p: number) => pages.push(p);

  if (pageCount <= 7) {
    for (let i = 1; i <= pageCount; i++) add(i);
    return pages;
  }

  add(1);
  if (page > 3) pages.push("ellipsis");

  const start = Math.max(2, page - 1);
  const end = Math.min(pageCount - 1, page + 1);
  for (let i = start; i <= end; i++) add(i);

  if (page < pageCount - 2) pages.push("ellipsis");
  add(pageCount);

  return pages;
};

const Pagination = ({ page, pageCount, pageSize, totalItems, onPageChange }: PaginationProps) => {
  if (totalItems === 0) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);
  const pages = getPageList(page, pageCount);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-4 py-3 sm:flex-row">
      <p className="text-xs text-slate-500">
        Showing <span className="font-medium text-slate-700">{start}</span>–
        <span className="font-medium text-slate-700">{end}</span> of{" "}
        <span className="font-medium text-slate-700">{totalItems}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-slate-400">
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`inline-flex h-8 min-w-8 items-center justify-center rounded-lg px-2.5 text-xs font-medium transition-colors ${
                p === page
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;