"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DocumentStats from "./DocumentStats";
import DocumentsTable from "./DocumentsTable";
import { useDocument } from "@/hooks/useDocuments";
import type { Document } from "@/store/useDocumentStore";

const statusFilters = ["All", "Under Review", "Approved", "Rejected"] as const;
type StatusFilter = (typeof statusFilters)[number];

const StatCardSkeleton = () => (
  <Card className="rounded-2xl border-slate-200/70 p-4 shadow-sm">
    <div className="h-3 w-20 animate-pulse rounded-full bg-slate-200/80" />
    <div className="mt-3 h-6 w-12 animate-pulse rounded-full bg-slate-200/80" />
  </Card>
);

const DocumentsModule = () => {
  const { documents, getAllDocuments, loading } = useDocument();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  useEffect(() => {
    getAllDocuments();
  }, [getAllDocuments]);

  const stats = useMemo(
    () => ({
      total: documents.length,
      approved: documents.filter((doc) => doc.valid_id_status === "Approved").length,
      underReview: documents.filter((doc) => doc.valid_id_status === "Under Review").length,
      rejected: documents.filter((doc) => doc.valid_id_status === "Rejected").length,
    }),
    [documents]
  );

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc: Document) => {
      const matchesStatus = statusFilter === "All" || doc.valid_id_status === statusFilter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        q === "" ||
        `${doc.first_name} ${doc.last_name}`.toLowerCase().includes(q) ||
        doc.valid_id_type?.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [documents, search, statusFilter]);

  return (
    <div className="space-y-2">
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <DocumentStats {...stats} />
      )}

      {/* Toolbar: search + status filter */}
      <Card className="flex flex-col gap-3 rounded border-slate-200/70 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search boarder or document type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border-slate-200 bg-slate-50/50 pl-9 focus-visible:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <SlidersHorizontal className="mr-1 hidden h-3.5 w-3.5 text-slate-400 sm:block" />
          <div className="flex flex-wrap gap-1.5">
            {statusFilters.map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === s
                    ? "border-slate-900 bg-slate-900 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <DocumentsTable documents={filteredDocuments} loading={loading} />
    </div>
  );
};

export default DocumentsModule;