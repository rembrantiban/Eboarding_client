import { useAuthStore } from "@/store/useAuthStore";

export const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const token = useAuthStore((state) => state.token);
  const isLoading = useAuthStore((state) => state.isLoading);
  const users = useAuthStore((state) => state.users);
  const register = useAuthStore((state) => state.register);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const createUserByAdmin = useAuthStore((state) => state.createUserByAdmin);
  const getUsers = useAuthStore((state) => state.getUsers);
  const deleteUser = useAuthStore((state) => state.deleteUser);
  const forgotPassword = useAuthStore((state) => state.forgotPassword);
  const resetPassword = useAuthStore((state) => state.resetPassword);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const updateUser = useAuthStore((state) => state.updateUser);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const getTotalBoarders = useAuthStore((state) => state.getTotalBoarders);
  const totalBoarders = useAuthStore((state) => state.totalBoarders);
  const updateProfileSettings = useAuthStore((state) => state.updateProfileSettings);
  const createUserByStaff = useAuthStore((state) => state.createUserByStaff);
  const deactivateUser = useAuthStore((state) => state.deactivateUser);
  const activateUser = useAuthStore((state) => state.activateUser);
  const updateUserStatus = useAuthStore((state) => state.updateUserStatus);
  const availableBoarders = useAuthStore((state) => state.availableBoarders);
  const getAvailableBorders = useAuthStore((state) => state.getAvailableBorders);
  const getAllDeletedUsers = useAuthStore((state) => state.getDeletedUsers);
  const recoverDeletedUsers = useAuthStore((state) => state.recoverDeletedUser);
  const deletedUsers = useAuthStore((state) => state.deletedUsers);
  const staff = useAuthStore((state) => state.staff);
  const getAvailableStaff = useAuthStore((state) => state.getAvailableStaff);
  const staffLoading = useAuthStore((state) => state.staffLoading);
  const dashboardStats = useAuthStore((state) => state.dashboardStats);
  const getStaffDashboardStats = useAuthStore((state) => state.getStaffDashboardStats);

  return {
    user,
    token,
    isLoading,
    users,
    createUserByAdmin,
    getUsers,
    register,
    login,
    checkAuth,
    updateProfile,
    updateUser,
    deleteUser,
    logout,
    forgotPassword,
    resetPassword,
    getTotalBoarders,
    totalBoarders,
    updateProfileSettings,
    createUserByStaff,
    isAuthenticated: !!token,
    isAdmin: user?.user_type === "Admin",
    deactivateUser,
    activateUser,
    updateUserStatus,
    availableBoarders,
    getAvailableBorders,
    getAllDeletedUsers,
    recoverDeletedUsers,
    deletedUsers,
    staff,
    getAvailableStaff,
    staffLoading,
    dashboardStats,
    getStaffDashboardStats
  };
};