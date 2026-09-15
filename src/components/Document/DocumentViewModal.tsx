"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {  User, FileText, ShieldCheck } from "lucide-react";
import DocumentStatusBadge from "./DocumentStatusBadge";
import type { Document } from "@/store/useDocumentStore";
import { useAuth } from "@/hooks/useAuth";

interface DocumentViewModalProps {
  document: Document | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const DocumentViewModal = ({
  document,
  open,
  onOpenChange,

}: DocumentViewModalProps) => {
  const { isAdmin } = useAuth();

  if (!document) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100%-1.5rem)] max-w-6xl flex-col gap-0 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl sm:max-w-5xl">
        <DialogHeader className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start pr-15 sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                <FileText size={18} />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-slate-900">
                  {document.valid_id_type}
                </DialogTitle>
                <p className="text-xs text-slate-500">User ID: {document.user_id_no}</p>
              </div>
            </div>
            <DocumentStatusBadge status={document.valid_id_status} />
          </div>
        </DialogHeader>

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="group relative flex h-80 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 sm:h-96">
            {document.valid_id_image ? (
              <img
                src={document.valid_id_image}
                alt={document.valid_id_type ?? "Document preview"}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <FileText size={30} />
                <span className="text-sm">No preview available</span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-linear-to-t from-slate-950/60 to-transparent px-4 py-3 text-white">
              <span className="text-sm font-medium">{document.valid_id_type}</span>
              <span className="rounded-full bg-white/15 px-2.5 py-1 text-xs backdrop-blur-sm">
                Preview
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                {document.avatar_url ? (
                  <img
                    src={document.avatar_url}
                    alt={`${document.first_name} ${document.last_name}`}
                    className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                  />
                ) : (
                  <>
                  {document.avatar_url ? (
                    <img
                      src={document.avatar_url}
                      alt={`${document.first_name} ${document.last_name}`}
                      className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <User size={18} className="text-slate-500" />
                    </div>
                  )}
                  </>
                )}
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {document.first_name} {document.last_name}
                  </p>
                  <p className="text-xs text-slate-500">Boarder submission</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Document details
              </h3>
              <dl className="grid gap-3 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Submitted</dt>
                  <dd className="font-medium text-slate-700">
                    {formatDate(document.created_at)}
                  </dd>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Last updated</dt>
                  <dd className="font-medium text-slate-700">
                    {formatDate(document.updated_at)}
                  </dd>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <dt className="text-slate-500">Status</dt>
                  <dd className="font-medium text-slate-700">
                    {document.valid_id_status}
                  </dd>
                </div>

                {isAdmin && (
                  <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                    <dt className="flex items-center gap-1.5 text-slate-500">
                      <ShieldCheck size={13} className="text-slate-400" />
                      Verified by
                    </dt>
                    <dd className="font-medium text-slate-700">
                      {document.verified_by ?? "Not verified yet"}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewModal;