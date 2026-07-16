"use client";

import { useState } from "react";
import { Eye, MoreVertical, CircleCheck, FileText, User, CircleXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DocumentStatusBadge from "./DocumentStatusBadge";
import DocumentViewModal from "./DocumentViewModal";
import type { Document } from "@/store/useDocumentStore";
import { useDocument } from "@/hooks/useDocuments";
import ApproveDocumentModal from "./ApproveDocumentModal";
import RejectDocumentModal from "./RejectDocumentModal";

interface DocumentRowProps {
  document: Document;
}

const DocumentRow = ({ document }: DocumentRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);

  const { approveDocument, rejectDocument } = useDocument();
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });





  return (
    <>
      <tr className="border-t border-slate-100 transition hover:bg-slate-50">
        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
              <FileText size={18} className="text-slate-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              {document.valid_id_type}
            </p>
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="flex items-center gap-3">
            {document.avatar_url ? (
              <img
                src={document.avatar_url}
                alt={`${document.first_name} ${document.last_name}`}
                className="h-9 w-9 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                <User size={16} className="text-slate-500" />
              </div>
            )}
            <p className="text-sm text-slate-700">
              {document.first_name} {document.last_name}
            </p>
          </div>
        </td>

        <td className="px-4 py-4">
          <DocumentStatusBadge status={document.valid_id_status} />
          <p className="mt-1 text-xs text-slate-500">
            {document.valid_id_status === "Under Review" && (
              <>Submitted on {formatDate(document.created_at)}</>
            )}
            {document.valid_id_status === "Approved" && (
              <>Approved on {formatDate(document.updated_at)}</>
            )}
            {document.valid_id_status === "Rejected" && (
              <>Rejected on {formatDate(document.updated_at)}</>
            )}
          </p>
        </td>

        <td className="px-4 py-4">
          <div className="flex items-center justify-end gap-2">
            {document.valid_id_status === "Under Review" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open document actions"
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  >
                    <MoreVertical size={16} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem onClick={() => setApproveOpen(true)}>
                    <CircleCheck size={14} className="mr-2 text-green-600" />
                    Approve
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setRejectOpen(true)}
                    className="text-red-500 focus:bg-red-50 focus:text-red-500"
                  >
                    <CircleXIcon size={14} className="mr-2" />
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex justify-center">
                {document.valid_id_status === "Approved" ? (
                  <CircleCheck
                    size={15}
                    className="text-green-600"
                  />
                ) : (
                  <CircleXIcon
                    size={15}
                    className="text-red-600"
                  />
                )}
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="gap-1.5 rounded-lg border-slate-200 text-sm text-slate-600 hover:bg-slate-50"
            >
              <Eye size={14} />
              View
            </Button>
          </div>
        </td>
      </tr>

      <DocumentViewModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        document={document}
      />

      <ApproveDocumentModal
        open={approveOpen}
        onClose={() => setApproveOpen(false)}
        document={document}
        onApprove={async (id) => {
          await approveDocument(id);
        }}
      />

      <RejectDocumentModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        document={document}
        onReject={async (id, reason) => {
          await rejectDocument(id, reason);
        }}
      />
    </>
  );
};

export default DocumentRow;