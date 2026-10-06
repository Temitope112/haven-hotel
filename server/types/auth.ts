import type { Request } from "express";

export type AuthUser = {
  userId: number;
  role: "GUEST" | "ADMIN";
};

export type AuthenticatedRequest = Request & {
  user?: AuthUser;
};