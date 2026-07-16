import { useStatusStore } from "@/store/useStatusStore";

export const useStatus = () => {
  const {
    open,
    status,
    title,
    description,

    showLoading,
    showSuccess,
    showError,
    close,
  } = useStatusStore();

  return {
    open,
    status,
    title,
    description,

    showLoading,
    showSuccess,
    showError,
    close,
  };
};