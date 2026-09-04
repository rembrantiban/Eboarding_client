"use client";

import { useState } from "react";
import {
  Eye,
  MoreVertical,
  CircleCheck,
  FileText,
  User,
  CircleXIcon,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import ApproveDocumentModal from "./ApproveDocumentModal";
import RejectDocumentModal from "./RejectDocumentModal";
import VerifyDocumentModal from "./VerifyDocumentModal";

interface DocumentRowProps {
  document: Document;
}

const CELL = "px-3 py-2 align-middle";

const DocumentRow = ({ document }: DocumentRowProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [verifyOpen, setVerifyOpen] = useState(false);

  const { approveDocument, rejectDocument, verifyDocument } = useDocument();
  const { user } = useAuth();
  const isStaff = user?.user_type === "Staff";
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const isUnderReview = document.valid_id_status === "Under Review";
  const isApproved = document.valid_id_status === "Approved";

  const timeline = isUnderReview
    ? `Submitted ${formatDate(document.created_at)}`
    : `${isApproved ? "Approved" : "Rejected"} ${formatDate(document.updated_at)}`;

  return (
    <>
      <tr className="border-b border-slate-100 transition-colors hover:bg-slate-50/70">
        <td className={CELL}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100">
              <FileText size={14} className="text-slate-500" />
            </div>
            <p className="text-[13px] font-medium text-slate-900">
              {document.valid_id_type}
            </p>
          </div>
        </td>

        <td className={CELL}>
          <div className="flex items-center gap-2.5">
            {document.avatar_url ? (
              <img
                src={document.avatar_url}
                alt={`${document.first_name} ${document.last_name}`}
                className="h-7 w-7 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
                <User size={13} className="text-slate-400" />
              </div>
            )}
            <p className="text-[13px] text-slate-700">
              {document.first_name} {document.last_name}
            </p>
          </div>
        </td>

        <td className={CELL}>
          <DocumentStatusBadge status={document.valid_id_status} />
          <p className="mt-1 text-[11px] text-slate-400">{timeline}</p>
        </td>

        <td className={CELL}>
          <div className="flex items-center justify-end gap-1">
            {!isUnderReview ? (
              <span
                title={timeline}
                className="flex h-7 w-7 items-center justify-center"
              >
                {isApproved ? (
                  <CircleCheck size={14} className="text-emerald-500" />
                ) : (
                  <CircleXIcon size={14} className="text-rose-500" />
                )}
              </span>
            ) : isStaff ? (
              document.is_verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-1 text-[11px] font-medium text-indigo-600">
                  <BadgeCheck size={12} />
                  Verified
                </span>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setVerifyOpen(true)}
                  className="h-7 gap-1.5 rounded-md border-indigo-200 px-2.5 text-[12px] font-medium text-indigo-600 shadow-none hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <ShieldCheck size={13} />
                  Verify
                </Button>
              )
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    aria-label="Open document actions"
                    className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  >
                    <MoreVertical size={14} />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-40 rounded-lg p-1 text-[13px]"
                >
                  <DropdownMenuItem
                    onClick={() => setApproveOpen(true)}
                    className="gap-2 rounded-md py-1.5 text-[13px]"
                  >
                    <CircleCheck size={14} className="text-emerald-600" />
                    Approve
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => setRejectOpen(true)}
                    className="gap-2 rounded-md py-1.5 text-[13px] text-rose-600 focus:bg-rose-50 focus:text-rose-600"
                  >
                    <CircleXIcon size={14} />
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="h-7 gap-1.5 rounded-md border-slate-200 px-2.5 text-[12px] font-medium text-slate-600 shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <Eye size={13} />
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

      <VerifyDocumentModal
        open={verifyOpen}
        onClose={() => setVerifyOpen(false)}
        document={document}
        onVerify={(id) => verifyDocument(id)}
      />
    </>
  );
};

export default DocumentRow;