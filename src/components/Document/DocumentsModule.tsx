"use client";

import { useEffect, useMemo } from "react";
import DocumentStats from "./DocumentStats";
import DocumentInfoBanner from "./DocumentInfoBanner";
import DocumentsTable from "./DocumentsTable";
import { useDocument } from "@/hooks/useDocuments";

const DocumentsModule = () => {
  const { documents, getAllDocuments, loading } = useDocument();

  useEffect(() => {
    getAllDocuments();
  }, [getAllDocuments]);

  const stats = useMemo(() => ({
    total: documents.length,
    approved: documents.filter(doc => doc.valid_id_status === "Approved").length,
    underReview: documents.filter(doc => doc.valid_id_status === "Under Review").length,
    rejected: documents.filter(doc => doc.valid_id_status === "Rejected").length,
  }), [documents]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-xl bg-slate-200" />
          ))}
        </div>

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
    <div className="space-y-4">
      <DocumentStats {...stats} />
      <DocumentInfoBanner />
      <DocumentsTable documents={documents} />
    </div>
  );
};

export default DocumentsModule;