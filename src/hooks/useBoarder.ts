import { useBoarderStore } from "@/store/useBoarderStore";
import { useAuthStore } from "@/store/useAuthStore";

export const useBoarder = () => {
  const boarders = useBoarderStore((state) => state.boarders);
  const loading = useBoarderStore((state) => state.loading);
  const getBoarders = useBoarderStore((state) => state.getBoarders);
  const assignBoarder = useBoarderStore((state) => state.assignBoarder);
  const notifyBoarder = useBoarderStore((state) => state.notifyBoarder);
  const removeBoarder = useBoarderStore((state) => state.removeBoarder);
  const getMyBoarding = useBoarderStore((state) => state.getMyBoarding);
  const myBoarding = useBoarderStore((state) => state.myBoarding);

  const users = useAuthStore((state) => state.users); 

  return {
    boarders,
    users,
    loading,
    getBoarders,
    assignBoarder,
    notifyBoarder,
    removeBoarder,
    getMyBoarding,
    myBoarding,
  };
};