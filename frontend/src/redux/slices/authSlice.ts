import { createSlice } from "@reduxjs/toolkit";
import type { Role } from "../../types/types";

interface AuthState {
  user: {
    email: string;
    id: number;
    name: string;
    role: Role;
  } | null;
  token: string | null;
}

const getUser = () => {
  const local = localStorage.getItem("user");
  const session = sessionStorage.getItem("user");

  return JSON.parse(local || session || "null");
};

const getToken = () => {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
};

const initialState: AuthState = {
  user: getUser(),
  token: getToken(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
