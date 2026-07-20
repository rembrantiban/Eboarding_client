"use client";

import { useMemo, useState } from "react";
import { FileX2 } from "lucide-react";
import DocumentRow from "./DocumentRow";
import Pagination from "./Pagination";
import { Card } from "@/components/ui/card";
import type { Document } from "@/store/useDocumentStore";

type DocumentsTableProps = {
  documents: Document[];
  loading?: boolean;
  pageSize?: number;
};

const columns = ["Document Type", "Boarder", "Status", "Actions"];

const SkeletonRow = ({ last }: { last?: boolean }) => (
  <tr className={last ? "" : "border-b border-slate-100"}>
    <td className="px-4 py-3.5">
      <div className="h-3.5 w-28 animate-pulse rounded-full bg-slate-200/80" />
    </td>
    <td className="px-4 py-3.5">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-slate-200/80" />
        <div className="h-3.5 w-32 animate-pulse rounded-full bg-slate-200/80" />
      </div>
    </td>
    <td className="px-4 py-3.5">
      <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200/80" />
    </td>
    <td className="px-4 py-3.5">
      <div className="ml-auto h-7 w-16 animate-pulse rounded-lg bg-slate-200/80" />
    </td>
  </tr>
);

const DocumentsTable = ({ documents, loading = false, pageSize = 8 }: DocumentsTableProps) => {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(documents.length / pageSize));

  const safePage = Math.min(page, pageCount);

  const paginatedDocuments = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return documents.slice(startIdx, startIdx + pageSize);
  }, [documents, safePage, pageSize]);

  return (
    <Card className="overflow-hidden rounded border-slate-200/70 shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70">
              {columns.map((col, idx) => (
                <th
                  key={col}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${idx === columns.length - 1 ? "text-right" : "text-left"
                    }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, idx) => (
                <SkeletonRow key={idx} last={idx === pageSize - 1} />
              ))
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16">
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                      <FileX2 className="h-5 w-5 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">No documents found</p>
                    <p className="text-xs text-slate-400">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedDocuments.map((doc) => (
                <DocumentRow key={doc.id} document={doc} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {!loading && documents.length > 0 && (
        <Pagination
          page={safePage}
          pageCount={pageCount}
          pageSize={pageSize}
          totalItems={documents.length}
          onPageChange={setPage}
        />
      )}
    </Card>
  );
};

export default DocumentsTable;