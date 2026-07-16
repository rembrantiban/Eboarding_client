"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
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

  const stats = useMemo(() => ({
    total: documents.length,
    approved: documents.filter(doc => doc.valid_id_status === "Approved").length,
    underReview: documents.filter(doc => doc.valid_id_status === "Under Review").length,
    rejected: documents.filter(doc => doc.valid_id_status === "Rejected").length,
  }), [documents]);

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

  if (loading) {
    return (
      <div className="space-y-2 animate-pulse">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200" />
          ))}
        </div>

        {/* Toolbar */}
        <div className="h-16 rounded-xl bg-slate-200" />

        {/* Banner */}
        <div className="h-16 rounded-xl bg-slate-200" />

        {/* Table */}
        <div className="rounded-xl border">
          <div className="h-12 border-b bg-slate-100" />

          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 border-b bg-slate-50 last:border-b-0"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <DocumentStats {...stats} />

      {/* Toolbar: search + status filter */}
      <Card className="flex flex-col gap-3 rounded border-slate-200 p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search boarder or document type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === s
                  ? "border-slate-900 bg-slate-900 text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </Card>

      <DocumentsTable documents={filteredDocuments} />
    </div>
  );
};

export default DocumentsModule;