"use client";

import { useMemo, useState } from "react";
import { FileX2 } from "lucide-react";
import DocumentRow from "./DocumentRow";
import Pagination from "./Pagination";
import type { Document } from "@/store/useDocumentStore";

type DocumentsTableProps = {
  documents: Document[];
  loading?: boolean;
  pageSize?: number;
  toolbar?: React.ReactNode;
};

const columns = ["Document Type", "Boarder", "Status", "Actions"];

const HEAD =
  "h-9 px-3 text-[11px] font-semibold uppercase tracking-wide text-slate-500";

const SkeletonRow = () => (
  <tr className="border-b border-slate-100">
    <td className="px-3 py-2">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 shrink-0 animate-pulse rounded-md bg-slate-100" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
      </div>
    </td>
    <td className="px-3 py-2">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-slate-100" />
        <div className="h-3 w-28 animate-pulse rounded bg-slate-100" />
      </div>
    </td>
    <td className="px-3 py-2">
      <div className="h-4 w-20 animate-pulse rounded-full bg-slate-100" />
      <div className="mt-1.5 h-2.5 w-24 animate-pulse rounded bg-slate-100" />
    </td>
    <td className="px-3 py-2">
      <div className="ml-auto h-7 w-20 animate-pulse rounded-md bg-slate-100" />
    </td>
  </tr>
);

const DocumentsTable = ({
  documents,
  loading = false,
  pageSize = 8,
  toolbar,
}: DocumentsTableProps) => {
  const [page, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(documents.length / pageSize));

  const safePage = Math.min(page, pageCount);

  const paginatedDocuments = useMemo(() => {
    const startIdx = (safePage - 1) * pageSize;
    return documents.slice(startIdx, startIdx + pageSize);
  }, [documents, safePage, pageSize]);

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      {toolbar && (
        <div className="border-b border-slate-100 px-3 py-2.5">{toolbar}</div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              {columns.map((col, idx) => (
                <th
                  key={col}
                  className={`${HEAD} ${
                    idx === columns.length - 1 ? "text-right" : "text-left"
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
                <SkeletonRow key={idx} />
              ))
            ) : documents.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-14">
                  <div className="flex flex-col items-center justify-center gap-1.5 text-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                      <FileX2 className="h-4 w-4 text-slate-400" />
                    </div>
                    <p className="mt-0.5 text-[13px] font-medium text-slate-600">
                      No documents found
                    </p>
                    <p className="text-[12px] text-slate-400">
                      Adjust your search or filters to see results.
                    </p>
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
    </div>
  );
};

export default DocumentsTable;