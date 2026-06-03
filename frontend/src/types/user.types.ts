import type { Role } from "./enums";

export type AccessLevel = "PUBLIC" | "FULL";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
}

export type UserProfileResponse = {
  accessLevel: AccessLevel;
  data: UserPublicDTO | UserFullDTO;
};

export interface UserPublicDTO {
  id: number;
  name: string;
  role: string;
  joinedAt: string;
}

export interface UserFullDTO {
  id: number;
  name: string;
  role: string;
  joinedAt: string;
  email: string;
  ticketsCreated: number;
  ticketsResolved: number;
  canEdit: boolean;
}
