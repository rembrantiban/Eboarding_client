import axiosInstance from "@/api/api";
import { create } from "zustand"
import { useStatusStore } from "./useStatusStore";
import axios from "axios";

export type UserType = "Admin" | "Staff" | "Boarder";
export type UpdateUserType = "Staff" | "Boarder";

export type UserStatus = "Pending" | "Approved" | "Rejected";
export type AccountStatus = "Active" | "Deactivate";
type ValidIdStatus =
  | "Under Review"
  | "Approved"
  | "Rejected";

export interface User {
  id: number;
  user_id_no: string;

  first_name: string;
  last_name: string;

  email: string;
  username: string;

  contact_number: string;
  address?: string;

  avatar_url?: string;

  gender?: string;
  age?: number;

  valid_id_type?: string;
  valid_id_image?: string;

  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;

  user_type: UserType;
  status: UserStatus;
  account_status: AccountStatus;
  valid_id_status: ValidIdStatus;

  // NEW
  is_deleted: boolean;
  deleted_at?: string | null;
  deleted_by?: number | null;
  deleted_by_name?: string;
  deleted_by_avatar: string;

  created_at: string;
  updated_at: string;

  is_assigned: boolean;
  room_number?: string;
  bed_number?: string;
}

type LoginPayload = {
  identifier: string;
  password: string;
};

type RegisterPayload = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  contact_number: string;
  address: string;
  password: string;
  user_type: UserType;

  gender?: string;
  age?: number;
  valid_id_type?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;

  avatar?: File | null;
  valid_id_image?: File | null;
};

type CreateUserByAdminPayload = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  contact_number: string;
  address: string;
  password: string;
  user_type: UserType;

  gender?: string;
  age?: number;
  valid_id_type?: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;

  avatar?: File | null;
  valid_id_image?: File | null;
};

type CreateUserByStaffPayload = {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  contact_number: string;
  address: string;
  password: string;
  user_type: UserType;

  gender?: string;
  age?: string;
  valid_id_type?: string;

  emergency_contact_name?: string;
  emergency_contact_number?: string;
  emergency_contact_relationship?: string;

  avatar?: File | null;
  valid_id_image?: File | null;
};

type UpdateUserResponse = {
  message: string;
  user: User;
};

type UpdateUserPayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  address?: string;
  password?: string;
  user_type: UserType;
  contact_number?: string;
  is_assigned?: boolean;
  status?: UserStatus;
  valid_id_type?: string;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};


type UpdateProfileSettingsData = {
  first_name?: string;
  last_name?: string;
  email?: string;
  contact_number: string;
  password?: string;
  avatar?: File | null;
};

type UpdateProfileSettingsResponse = {
  message: string;
  user: User;
};



type GetUsersResponse = {
  users: User[];
  total: number;
};

type GetUsersParams = {
  search?: string;
  user_type?: UserType;
};

type ForgotPasswordPayload = {
  email: string;
};

type ResetPasswordPayload = {
  email: string;
  code: string;
  newPassword: string;
};

type totalBoardersResponse = {
  total: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  users: User[];
  totalBoarders: number;
  availableBoarders: User[];
  deletedUsers: User[];

  register: (data: RegisterPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  createUserByAdmin: (data: CreateUserByAdminPayload) => Promise<{ user: User }>;
  createUserByStaff: (data: CreateUserByStaffPayload) => Promise<{ user: User }>;
  getUsers: (params?: GetUsersParams) => Promise<GetUsersResponse>;
  updateUser: (id: number, data: UpdateUserPayload) => Promise<UpdateUserResponse>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<boolean>;
  updateProfile: (data: FormData) => Promise<UpdateUserResponse>;
  forgotPassword: (data: ForgotPasswordPayload) => Promise<void>;
  resetPassword: (data: ResetPasswordPayload) => Promise<void>;
  getTotalBoarders: () => Promise<number>;
  updateProfileSettings: (data: UpdateProfileSettingsData) => Promise<UpdateProfileSettingsResponse>;
  deactivateUser: (id: number) => Promise<User>;
  activateUser: (id: number) => Promise<User>;
  updateUserStatus: (id: number, status: UserStatus) => Promise<User>;
  getAvailableBorders: () => Promise<User[]>;

  getDeletedUsers: () => Promise<GetUsersResponse>;

  recoverDeletedUser: (id: number) => Promise<User>;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  isLoading: false,
  users: [],
  totalBoarders: 0,
  availableBoarders: [],

  deletedUsers: [],


  getDeletedUsers: async () => {
  try {
    const res = await axiosInstance.get<GetUsersResponse>(
      "/auth/deleted-users"
    );

    set({
      deletedUsers: res.data.users,
    });

    return res.data;

  } catch (error) {
    const err = error as ApiError;
    throw (
      err.response?.data?.message ||
      "Failed to fetch deleted users"
    );
  }
},

recoverDeletedUser: async (id: number) => {
  const {
    showLoading,
    showSuccess,
    showError,
  } = useStatusStore.getState();

  try {

    showLoading(
      "Recovering User",
      "Please wait while we recover the user account..."
    );

    const res = await axiosInstance.put(
      `/auth/recover-deleted-user/${id}`
    );

    const recoveredUser = res.data.user;

    set((state) => ({
      deletedUsers: state.deletedUsers.filter(
        (u) => u.id !== id
      ),

      users: [recoveredUser, ...state.users],
    }));

    showSuccess(
      "User Recovered",
      "The user account has been recovered successfully."
    );

    return recoveredUser;

  } catch (error) {
    const err = error as ApiError;

    showError(
      "Recovery Failed",
      err.response?.data?.message ||
      "Failed to recover user."
    );

    throw (
      err.response?.data?.message ||
      "Failed to recover user."
    );
  }
},

  getAvailableBorders: async () => {
    try {
      const res = await axiosInstance.get("/auth/available-boarders");
      set({ availableBoarders: res.data });
      return res.data;
    } catch (error) {
      console.error("Error fetching available boarders:", error);
      throw error;
    }
  },

  updateUserStatus: async (id, status) => {
    const { showLoading, showSuccess, showError } = useStatusStore.getState();
    try {
      showLoading("Updating Status", "Please wait while we update the user's status...")
      const res = await axiosInstance.put(
        `/auth/update-user-status/${id}`,
        { status }
      );

      const updatedUser = res.data.user;


      set((state) => ({
        users: state.users.map((user) =>
          user.id === id
            ? updatedUser
            : user
        ),
      }));

      showSuccess("Status Updated", "The user's status has been updated successfully.");
      return updatedUser;

    } catch (error) {
      const err = error as ApiError;
      showError("Update Failed", err.response?.data?.message || "Failed to update status");
      throw err.response?.data?.message || "Failed to update status";
    }
  },

  activateUser: async (id: number) => {
    const { showLoading, showSuccess, showError } = useStatusStore.getState();
    try {

      showLoading("Activating User", "Please wait while we activate the user...")

      const res = await axiosInstance.put(
        `/auth/activate-user/${id}`
      );

      const updatedUser = res.data.user;

      set((state) => ({
        users: state.users.map((u) =>
          u.id === updatedUser.id
            ? { ...u, ...updatedUser }
            : u
        ),
      }));

      showSuccess(
        "User Activated",
        "The user account has been activated successfully."
      );
      return updatedUser;

    } catch (error: unknown) {
      const err = error as ApiError;
      showError(
        "Activation Failed",
        err.response?.data?.message || "Failed to activate account"
      );
      throw (
        err.response?.data?.message ||
        "Failed to activate account"
      );
    }
  },

  deactivateUser: async (id: number) => {
    const { showLoading, showSuccess, showError } = useStatusStore.getState();
    try {

      showLoading(
        "Deactivating User",
        "Please wait while we deactivate the user..."
      );

      const res = await axiosInstance.put(
        `/auth/deactivate-user/${id}`
      );

      const updatedUser = res.data.user;

      set((state) => ({
        users: state.users.map((u) =>
          u.id === updatedUser.id
            ? { ...u, ...updatedUser }
            : u
        ),
      }));

      showSuccess(
        "User Deactivated",
        "The user account has been deactivated successfully."
      );
      return updatedUser;

    } catch (error: unknown) {
      const err = error as ApiError;
      showError(
        "Deactivation Failed",
        err.response?.data?.message || "Failed to deactivate account"
      );
      throw (
        err.response?.data?.message ||
        "Failed to deactivate account"
      );
    }
  },

  createUserByStaff: async (data) => {
    const { showLoading, showSuccess, showError } = useStatusStore.getState();
    try {
      showLoading(
        "Creating User",
        "Please wait while we create the user account..."
      );

      const formData = new FormData();

      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("username", data.username);
      formData.append("contact_number", data.contact_number);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("password", data.password);
      formData.append("user_type", data.user_type);

      if (data.gender) {
        formData.append("gender", data.gender);
      }

      if (data.valid_id_type) {
        formData.append("valid_id_type", data.valid_id_type);
      }

      if (data.age !== undefined) {
        formData.append("age", data.age.toString());
      }

      if (data.emergency_contact_name) {
        formData.append(
          "emergency_contact_name",
          data.emergency_contact_name
        );
      }

      if (data.emergency_contact_number) {
        formData.append(
          "emergency_contact_number",
          data.emergency_contact_number
        );
      }

      if (data.emergency_contact_relationship) {
        formData.append(
          "emergency_contact_relationship",
          data.emergency_contact_relationship
        );
      }

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      if (data.valid_id_image) {
        formData.append(
          "valid_id_image",
          data.valid_id_image
        );
      }

      const res = await axiosInstance.post(
        "/auth/staff/users",
        formData
      );

      const newUser = res.data.user;

      set((state) => ({
        isLoading: false,
        users: [newUser, ...state.users],
      }));

      showSuccess(
        "User Created",
        "The user account has been created successfully."
      );

      return res.data;

    } catch (error) {
      const err = error as ApiError;

      set({
        isLoading: false,
      });

      showError(
        "Create Failed",
        typeof error === "string"
          ? error
          : "Failed to create user."
      );
      throw (
        err.response?.data?.message ||
        "Failed to create user"
      );
    }
  },

  updateProfileSettings: async (data: UpdateProfileSettingsData) => {
    const { showLoading, showSuccess, showError } = useStatusStore.getState();
    try {
      showLoading("Updating Profile", "Please wait while we update your profile...");
      set({ isLoading: true });

      const formData = new FormData();

      if (data.first_name) {
        formData.append(
          "first_name",
          data.first_name
        );
      }

      if (data.last_name) {
        formData.append(
          "last_name",
          data.last_name
        );
      }

      if (data.email) {
        formData.append(
          "email",
          data.email
        );
      }

      if (data.contact_number) {
        formData.append(
          "contact_number",
          data.contact_number
        );
      }

      if (data.password) {
        formData.append(
          "password",
          data.password
        );
      }

      if (data.avatar) {
        console.log("📤 Appending avatar:", data.avatar.name, data.avatar.size, data.avatar.type);
        formData.append(
          "avatar",
          data.avatar
        );
      }

      console.log("📤 Sending formData to /auth/profile-settings");

      const res = await axiosInstance.put<UpdateProfileSettingsResponse>(
        "/auth/profile-settings",
        formData
        // Let axios handle the Content-Type header automatically for multipart/form-data
      );

      const updatedUser = res.data.user;

      console.log("✅ Profile updated:", updatedUser);

      set({
        user: updatedUser,
        isLoading: false,
      });

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      showSuccess(
        "Profile Updated",
        "Your profile has been updated successfully."
      );
      return res.data;

    } catch (error: unknown) {
      const err = error as ApiError;

      set({ isLoading: false });
      showError(
        "Update Failed",
        err.response?.data?.message || "Failed to update profile"
      );
      throw (
        err.response?.data?.message ||
        "Failed to update profile"
      );
    }
  },
  getTotalBoarders: async () => {
    try {
      const res = await axiosInstance.get<totalBoardersResponse>("/auth/total-boarders");
      set({ totalBoarders: Number(res.data.total) });
      return Number(res.data.total);
    } catch (error: unknown) {
      const err = error as ApiError;
      throw err.response?.data?.message || "Failed to fetch total boarders";
    }
  },

  getUsers: async (params?: GetUsersParams): Promise<GetUsersResponse> => {
    try {
      const res = await axiosInstance.get<GetUsersResponse>("/auth/users", {
        params,
      });

      set({ users: res.data.users });
      return res.data;

    } catch (error: unknown) {
      const err = error as ApiError;
      throw err.response?.data?.message || "Failed to fetch users";
    }
  },


  register: async (data) => {
    try {
      set({ isLoading: true });

      const formData = new FormData();

      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("email", data.email);
      formData.append("username", data.username);
      formData.append("contact_number", data.contact_number);
      formData.append("address", data.address);
      formData.append("password", data.password);
      formData.append("user_type", data.user_type);

      if (data.gender) {
        formData.append("gender", data.gender);
      }

      if (data.age !== undefined) {
        formData.append("age", data.age.toString());
      }

      if (data.valid_id_type) {
        formData.append("valid_id_type", data.valid_id_type);
      }

      if (data.emergency_contact_name) {
        formData.append(
          "emergency_contact_name",
          data.emergency_contact_name
        );
      }

      if (data.emergency_contact_number) {
        formData.append(
          "emergency_contact_number",
          data.emergency_contact_number
        );
      }

      if (data.emergency_contact_relationship) {
        formData.append(
          "emergency_contact_relationship",
          data.emergency_contact_relationship
        );
      }

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      if (data.valid_id_image) {
        formData.append(
          "valid_id_image",
          data.valid_id_image
        );
      }

      await axiosInstance.post(
        "/auth/register",
        formData
      );

      set({
        isLoading: false,
      });

    } catch (error) {
      const err = error as ApiError;

      set({ isLoading: false });

      throw err.response?.data?.message || "Register failed";
    }
  },
  login: async (data) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post("/auth/login", data);

      const { token, user } = res.data;

      localStorage.setItem("token", token);

      set({
        user,
        token,
        isLoading: false,
      });
      localStorage.setItem("user", JSON.stringify(user));

      return user

    } catch (error: unknown) {
      const err = error as ApiError;

      set({ isLoading: false });
      throw err.response?.data?.message;
    }
  },

  updateProfile: async (data: FormData) => {
    const { showLoading, showSuccess, showError } = useStatusStore.getState();
    try {
      set({ isLoading: true });
      showLoading("Updating Profile", "Please wait while we update your profile...");

      const res = await axiosInstance.put("/auth/updateProfile", data);

      const updatedUser = {
        ...res.data.user,
        avatar: res.data.user.avatar_url,
      };

      set({
        user: updatedUser,
        isLoading: false,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      showSuccess("Profile Updated", "Your profile has been updated successfully.");
      return res.data;

    } catch (error: unknown) {
      const err = error as ApiError;

      set({ isLoading: false });
      showError("Update Failed", err.response?.data?.message || "Failed to update profile");

      throw err.response?.data?.message || "Profile update failed";
    }
  },

  createUserByAdmin: async (data) => {
    const {
      showLoading,
      showSuccess,
      showError,
    } = useStatusStore.getState();

    try {
      set({ isLoading: true });

      showLoading(
        "Creating User",
        "Please wait while we create the account..."
      );

      const formData = new FormData();

      formData.append("first_name", data.first_name);
      formData.append("last_name", data.last_name);
      formData.append("username", data.username);
      formData.append("contact_number", data.contact_number);
      formData.append("email", data.email);
      formData.append("address", data.address);
      formData.append("password", data.password);
      formData.append("user_type", data.user_type);

      if (data.gender) {
        formData.append("gender", data.gender);
      }

      if (data.age !== undefined) {
        formData.append("age", data.age.toString());
      }

      if (data.emergency_contact_name) {
        formData.append(
          "emergency_contact_name",
          data.emergency_contact_name
        );
      }

      if (data.emergency_contact_number) {
        formData.append(
          "emergency_contact_number",
          data.emergency_contact_number
        );
      }

      if (data.emergency_contact_relationship) {
        formData.append(
          "emergency_contact_relationship",
          data.emergency_contact_relationship
        );
      }

      if (data.avatar) {
        formData.append("avatar", data.avatar);
      }

      if (data.valid_id_image) {
        formData.append(
          "valid_id_image",
          data.valid_id_image
        );
      }

      if (data.valid_id_type) {
        formData.append("valid_id_type", data.valid_id_type);
      }

      const res = await axiosInstance.post(
        "/auth/admin/users",
        formData
      );

      const newUser = res.data.user;

      set((state) => ({
        isLoading: false,
        users: [newUser, ...state.users],
      }));

      showSuccess(
        "User Created",
        "The user account has been created successfully."
      );

      return res.data;

    } catch (error) {
      const err = error as ApiError;

      set({
        isLoading: false,
      });

      showError(
        "Creation Failed",
        err.response?.data?.message ||
        "Failed to create user."
      );

      throw err.response?.data?.message || "Failed to create user";
    }
  },
  updateUser: async (id: number, data: UpdateUserPayload) => {
    const { showSuccess, showError, showLoading } = useStatusStore.getState();
    try {
      showLoading("Updating User", "Please wait while we update the user...");
      const res = await axiosInstance.put<UpdateUserResponse>(
        `/auth/updateUser/${id}`,
        data
      );

      const updatedUser = res.data.user;

      set((state) => ({
        users: state.users.map((u) =>
          u.id === updatedUser.id
            ? { ...u, ...updatedUser }
            : u
        ),
      }));

      showSuccess(
        "User Updated",
        "The user account has been updated successfully."
      );

      return res.data;

    } catch (error: unknown) {
      const err = error as ApiError;
      showError(
        "Update Failed",
        err.response?.data?.message || "Failed to update user"
      );
      throw err.response?.data?.message || "Update failed";
    }
  },

  deleteUser: async (id) => {
    try {
      set({ isLoading: true });

      await axiosInstance.delete(`/auth/deleteUser/${id}`);

      set((state) => ({
        isLoading: false,
        users: state.users.filter((user) => user.id !== id),
      }));

    } catch (error) {
      const err = error as ApiError;

      set({ isLoading: false });

      throw err.response?.data?.message || "Failed to delete user";
    }
  },

  checkAuth: async () => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.get("/auth/check");

      const user = res.data.user;

      set({
        user,
        isLoading: false,
      });

      localStorage.setItem("user", JSON.stringify(user));

    } catch {
      // ❌ token invalid or expired
      set({
        user: null,
        token: null,
        isLoading: false,
      });

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  },

  forgotPassword: async (data) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post(
        "/auth/forgot-password",
        data
      );

      set({ isLoading: false });

      return res.data;

    } catch (error: unknown) {

      set({ isLoading: false });

      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ??
          "Failed to send verification code."
        );
      }

      throw new Error("Unexpected server error.");
    }
  },

  resetPassword: async (data) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post(
        "/auth/reset-password",
        data
      );

      set({ isLoading: false });

      return res.data;

    } catch (error: unknown) {

      set({ isLoading: false });

      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message ??
          "Unable to reset password."
        );
      }

      throw new Error("Unexpected server error.");
    }
  },
  logout: async () => {
    try {
      set({ isLoading: true });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      set({
        user: null,
        token: null,
      });

      return true;
    } catch (error) {
      console.error("Error occurred while logging out:", error);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));