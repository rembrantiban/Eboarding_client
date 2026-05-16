import axiosInstance from "@/api/api";
import { create } from "zustand"

export type UserType = "Admin" | "Staff" | "Boarder";
export type UpdateUserType = "Staff" | "Boarder";

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  contact_number: string,
  user_type: UserType;
  address?: string;
  password: string;
  avatar_url?: string;
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


  register: (data: RegisterPayload) => Promise<void>;
  login: (data: LoginPayload) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  createUserByAdmin: (data: RegisterPayload) => Promise<{ user: User }>;
  getUsers: (params?: GetUsersParams) => Promise<GetUsersResponse>;
  updateUser: (id: number, data: UpdateUserPayload) => Promise<UpdateUserResponse>;
  checkAuth: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: FormData) => Promise<UpdateUserResponse>;
  forgotPassword: (data: ForgotPasswordPayload) => Promise<void>;
  resetPassword: (data: ResetPasswordPayload) => Promise<void>;
  getTotalBoarders: () => Promise<number>;
  updateProfileSettings: (  data: UpdateProfileSettingsData) => Promise<UpdateProfileSettingsResponse>;

}
export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  isLoading: false,
  users: [],
  totalBoarders: 0,

  updateProfileSettings: async ( data: UpdateProfileSettingsData ) => {
  try {
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

    return res.data;

  } catch (error: unknown) {
    const err = error as ApiError;

    set({ isLoading: false });

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

      const res = await axiosInstance.post("/auth/register", data);

      set({
        user: res.data.user,
        isLoading: false,
      });

    } catch (error: unknown) {
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
    try {
      set({ isLoading: true });

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

      return res.data;

    } catch (error: unknown) {
      const err = error as ApiError;

      set({ isLoading: false });

      throw err.response?.data?.message || "Profile update failed";
    }
  },

  createUserByAdmin: async (data) => {
    try {
      set({ isLoading: true });

      const res = await axiosInstance.post("/auth/admin/users", data);

      set({ isLoading: false });

      return res.data;

    } catch (error: unknown) {
      const err = error as ApiError;

      set({ isLoading: false });
      throw err.response?.data?.message;
    }
  },

  updateUser: async (id: number, data: UpdateUserPayload) => {
  try {
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

    return res.data;

  } catch (error: unknown) {
    const err = error as ApiError;
    throw err.response?.data?.message || "Update failed";
  }
},

  deleteUser: async (id) => {
    try {
      set({ isLoading: true });

      await axiosInstance.delete(`/auth/deleteUser/${id}`);

      set({ isLoading: false });

    } catch (error: unknown) {
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

      await axiosInstance.post("/auth/forgot-password", data);

      set({ isLoading: false });

    } catch (error: unknown) {
      const err = error as ApiError;

      set({ isLoading: false });
      throw err.response?.data?.message || "Failed to send code";
    }
  },

  resetPassword: async (data) => {
    try {
      set({ isLoading: true });

      await axiosInstance.post("/auth/reset-password", data);

      set({ isLoading: false });

    } catch (error: unknown) {
      const err = error as ApiError;

      set({ isLoading: false });
      throw err.response?.data?.message || "Reset failed";
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null });
  },
}));