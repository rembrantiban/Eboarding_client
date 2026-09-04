import { useDocumentStore } from "@/store/useDocumentStore";

export const useDocument = ( ) => {
  const {
    loading,
    documents,
    myDocument,
    getAllDocuments,
    getUserSubmittedDocument,
    approveDocument,
    rejectDocument,
    verifyDocument,
    uploadDocument,
    uploading,
  } = useDocumentStore();

  return {
    loading,
    documents,
    myDocument,
    getAllDocuments,
    getUserSubmittedDocument,
    approveDocument,
    rejectDocument,
    verifyDocument,
    uploadDocument,
    uploading,
  };
};