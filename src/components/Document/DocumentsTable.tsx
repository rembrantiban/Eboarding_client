"use client";

import DocumentRow from "./DocumentRow";
import { Card } from "@/components/ui/card";
import type { Document } from "@/store/useDocumentStore";

type DocumentsTableProps = {
  documents: Document[];
};

const columns = [ "Document Type", "Boarder", "Status", "Actions"];

const DocumentsTable = ({ documents }: DocumentsTableProps) => {
  return (
    <Card className="overflow-hidden rounded border-slate-200 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50/60">
            {columns.map((col, idx) => (
              <th
                key={col}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                  idx === columns.length - 1 ? "text-right" : "text-left"
                }`}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {documents.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-slate-500">
                No documents match your search or filters
              </td>
            </tr>
          ) : (
            documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
              />
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
};

export default DocumentsTable;