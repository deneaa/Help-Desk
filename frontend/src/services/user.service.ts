import type { IUser } from "../types";
import { apiRequest } from "./api";

/*
DELETE, UPDATE, PROMOTE & DEMOTE USER
*/
export const deleteUser = async (
  userId: number,
  token: string,
): Promise<void> => {
  return apiRequest(`/users/${userId}`, { method: "DELETE", token });
};

export const updateUser = async (
  userId: number,
  data: { name?: string; email?: string },
  token: string,
): Promise<IUser> => {
  return apiRequest(`/users/${userId}`, { method: "PATCH", body: data, token });
};

export const demoteUser = async (
  userId: number,
  token: string,
): Promise<IUser> => {
  return apiRequest(`/users/${userId}/role/demote`, { method: "PATCH", token });
};

export const promoteUser = async (
  userId: number,
  token: string,
): Promise<IUser> => {
  return apiRequest(`/users/${userId}/role/promote`, {
    method: "PATCH",
    token,
  });
};
