"use client";

import { useEffect, useState } from "react";
import { useDocumentStore } from "@/store/useDocumentStore";
import DocumentUploadCard from "@/components/BoarderDocuments/DocumentUploadCard";
import DocumentStatusCard from "@/components/BoarderDocuments/DocumentStatusCard";
import DocumentReminderBanner from "@/components/BoarderDocuments/DocumentReminderBanner";
import { Loader2 } from "lucide-react";

const BoarderDocumentPage = () => {
  const { myDocument, loading, getUserSubmittedDocument } = useDocumentStore();
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    getUserSubmittedDocument().finally(() => setHasFetched(true));
  }, [getUserSubmittedDocument]);

  const showUploadFlow =
    !myDocument || myDocument.valid_id_status === "Rejected";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900">
          Valid ID Verification
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Upload a valid government-issued ID to complete your boarder
          verification.
        </p>
      </div>

      {!hasFetched && loading ? (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-200 bg-white">
          <Loader2 className="animate-spin text-slate-400" size={22} />
        </div>
      ) : (
        <>
          <DocumentReminderBanner document={myDocument} />

          <div className="space-y-6">
            {myDocument && <DocumentStatusCard document={myDocument} />}

            {showUploadFlow && (
              <DocumentUploadCard
                mode={myDocument ? "replace" : "upload"}
                defaultIdType={myDocument?.valid_id_type ?? undefined}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BoarderDocumentPage;