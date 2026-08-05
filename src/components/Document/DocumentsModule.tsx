"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import DocumentStats from "./DocumentStats";
import DocumentsTable from "./DocumentsTable";
import { useDocument } from "@/hooks/useDocuments";
import type { Document } from "@/store/useDocumentStore";

const statusFilters = ["All", "Under Review", "Approved", "Rejected"] as const;
type StatusFilter = (typeof statusFilters)[number];

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

  const toolbar = (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative w-full max-w-65">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search boarder or document type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 rounded-lg border-slate-200 pl-8 text-[13px] shadow-none placeholder:text-slate-400"
          />
        </div>

        {!loading && (
          <span className="hidden text-[12px] text-slate-400 md:inline">
            {filteredDocuments.length} record
            {filteredDocuments.length === 1 ? "" : "s"}
          </span>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <SlidersHorizontal className="hidden h-3.5 w-3.5 text-slate-400 sm:block" />
        <div className="flex flex-wrap gap-1">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-7 rounded-full border px-2.5 text-[12px] font-medium transition-colors ${
                statusFilter === s
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3">
      <DocumentStats {...stats} loading={loading} />

      <DocumentsTable
        documents={filteredDocuments}
        loading={loading}
        toolbar={toolbar}
      />
    </div>
  );
};

export default DocumentsModule;