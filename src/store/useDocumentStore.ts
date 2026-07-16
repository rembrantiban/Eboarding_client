import { create } from "zustand";
import axiosInstance from "@/api/api";
import axios from "axios";
import { useStatusStore } from "./useStatusStore";

export interface Document {
  id: number;
  user_id_no: string;

  first_name: string;
  last_name: string;
  email: string;

  avatar_url: string | null;

  valid_id_type: string | null;
  valid_id_image: string | null;

  valid_id_status:
    | "Under Review"
    | "Approved"
    | "Rejected";

  valid_id_rejection_reason: string | null;

  verified_by: string | null;

  created_at: string;
  updated_at: string;
}

interface DocumentStore {
  loading: boolean;
  uploading: boolean;
  documents: Document[];
  myDocument: Document | null;

  getAllDocuments: () => Promise<void>;
  getUserSubmittedDocument: () => Promise<void>;
  approveDocument: (id: number) => Promise<boolean>;
  rejectDocument: (
    id: number,
    rejection_reason: string
  ) => Promise<boolean>;
  uploadDocument: (idType: string, file: File) => Promise<boolean>;
}

export const useDocumentStore = create<DocumentStore>((set) => ({

  loading: false,
  uploading: false, 
  documents: [],
  myDocument: null,

  uploadDocument: async (idType, file) => {
  const {
    showLoading,
    showSuccess,
    showError,
  } = useStatusStore.getState();

  try {
    set({ uploading: true });

    showLoading(
      "Uploading Document",
      "Please wait while we upload your document..."
    );

    const formData = new FormData();

    formData.append("valid_id_type", idType);
    formData.append("valid_id_image", file);

    const res = await axiosInstance.put(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    set({
      myDocument: res.data.document,
    });

    showSuccess(
      "Upload Successful",
      "Your document has been submitted for review."
    );

    return true;

  } catch (error) {

    if (axios.isAxiosError(error)) {
      showError(
        "Upload Failed",
        error.response?.data?.message ||
          "Failed to upload document."
      );
    } else {
      showError(
        "Upload Failed",
        "Something went wrong."
      );
    }

    return false;

  } finally {
    set({
      uploading: false,
    });
  }
},
  getAllDocuments: async () => {
    const { showError } = useStatusStore.getState();

    try {

      set({ loading: true });

      const res = await axiosInstance.get("/documents/get-all");

      set({
        documents: res.data,
      });

    } catch (error) {

      if (axios.isAxiosError(error)) {
        showError(
          "Failed",
          error.response?.data?.message
        );
      }

    } finally {

      set({
        loading: false,
      });

    }
  },

  getUserSubmittedDocument: async () => {
    const { showError } = useStatusStore.getState();

    try {

      set({ loading: true });

      const res = await axiosInstance.get(
        "/documents/get-my-document"
      );

      set({
        myDocument: res.data,
      });

    } catch (error) {

      if (axios.isAxiosError(error)) {
        showError(
          "Failed",
          error.response?.data?.message
        );
      }

    } finally {

      set({
        loading: false,
      });

    }
  },

  approveDocument: async (id) => {
    const {
      showLoading,
      showSuccess,
      showError,
    } = useStatusStore.getState();

    try {

      showLoading(
        "Approving Document",
        "Please wait..."
      );

      await axiosInstance.put(
        `/documents/approve/${id}`
      );

      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                valid_id_status: "Approved",
                valid_id_rejection_reason: null,
              }
            : doc
        ),
      }));

      showSuccess(
        "Success",
        "Document approved successfully."
      );

      return true;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        showError(
          "Failed",
          error.response?.data?.message
        );
      }

      return false;
    }
  },

  rejectDocument: async (
    id,
    rejection_reason
  ) => {
    const {
      showLoading,
      showSuccess,
      showError,
    } = useStatusStore.getState();

    try {

      showLoading(
        "Rejecting Document",
        "Please wait..."
      );

      await axiosInstance.put(
        `/documents/reject/${id}`,
        {
          rejection_reason,
        }
      );

      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === id
            ? {
                ...doc,
                valid_id_status: "Rejected",
                valid_id_rejection_reason:
                  rejection_reason,
              }
            : doc
        ),
      }));

      showSuccess(
        "Success",
        "Document rejected successfully."
      );

      return true;

    } catch (error) {

      if (axios.isAxiosError(error)) {
        showError(
          "Failed",
          error.response?.data?.message
        );
      }

      return false;
    }
  },

}));