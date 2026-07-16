import { create } from "zustand";

export type StatusType =
  | "idle"
  | "loading"
  | "success"
  | "error";

interface StatusState {
  open: boolean;
  status: StatusType;

  title: string;
  description: string;

  showLoading: (
    title: string,
    description?: string
  ) => void;

  showSuccess: (
    title: string,
    description?: string
  ) => void;

  showError: (
    title: string,
    description?: string
  ) => void;

  close: () => void;
}

export const useStatusStore = create<StatusState>((set) => ({
  open: false,

  status: "idle",

  title: "",
  description: "",

  showLoading: (title, description = "") =>
    set({
      open: true,
      status: "loading",
      title,
      description,
    }),

  showSuccess: (title, description = "") =>
    set({
      open: true,
      status: "success",
      title,
      description,
    }),

  showError: (title, description = "") =>
    set({
      open: true,
      status: "error",
      title,
      description,
    }),

  close: () =>
    set({
      open: false,
      status: "idle",
      title: "",
      description: "",
    }),
}));