import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserMe } from "../../types";
import { loginUser, registerUser, updateUser, fetchMe } from "./authThunks";

type AuthError = string | null;

interface AuthState {
  user: UserMe | null;
  loading: boolean;
  error: AuthError;
}

const USER_STORAGE_KEY = "user";
const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";

function isUserMe(x: any): x is UserMe {
  return (
    x &&
    typeof x === "object" &&
    typeof x.id === "string" &&
    typeof x.name === "string" &&
    typeof x.role === "string" &&
    typeof x.phone === "string" &&
    x.bankAccount &&
    typeof x.bankAccount === "object"
  );
}

function readStoredUser(): UserMe | null {
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    return isUserMe(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function persistUser(user: UserMe | null) {
  if (!user) {
    localStorage.removeItem(USER_STORAGE_KEY);
    return;
  }
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}

function clearAuthStorage() {
  localStorage.removeItem(USER_STORAGE_KEY);
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

const initialState: AuthState = {
  user: readStoredUser(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserMe | null>) => {
      state.user = action.payload;
      persistUser(action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      clearAuthStorage();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: AuthState) => {
      state.loading = true;
      state.error = null;
    };

    const fulfilledUser = (state: AuthState, action: PayloadAction<UserMe>) => {
      state.loading = false;
      state.user = action.payload;
      persistUser(action.payload);
    };

    const rejected = (state: AuthState, action: any) => {
      state.loading = false;
      state.error = (action.payload as string) || action.error?.message || "שגיאה לא ידועה";
    };

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, fulfilledUser)
      .addCase(loginUser.rejected, rejected)

      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, fulfilledUser)
      .addCase(registerUser.rejected, rejected)

      .addCase(fetchMe.pending, pending)
      .addCase(fetchMe.fulfilled, fulfilledUser)
      .addCase(fetchMe.rejected, rejected)

      .addCase(updateUser.pending, pending)
      .addCase(updateUser.fulfilled, fulfilledUser)
      .addCase(updateUser.rejected, rejected);
  },
});

export const { logout, setUser, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
