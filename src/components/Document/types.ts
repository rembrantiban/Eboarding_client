export type DocumentStatus = "Approved" | "Under Review" | "Rejected";

export interface DocumentItem {
  id: string;
  name: string;
  fileName: string;
  fileSize: string;
  thumbnailUrl?: string;
  typeLabel: string;
  typeColor: "blue" | "green" | "purple";
  uploadedDate: string;
  uploadedTime: string;
  status: DocumentStatus;
  statusNote: string;
}