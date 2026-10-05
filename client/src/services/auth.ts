import { api } from "./api";
import type {
  LoginResponse,
  RegisterResponse,
  User,
} from "../types/auth";

type LoginPayload = {
  email: string;
  password: string;
};

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export async function loginUser(
  payload: LoginPayload,
) {
  const response =
    await api.post<LoginResponse>(
      "/api/auth/login",
      payload,
    );

  return response.data;
}

export async function registerUser(
  payload: RegisterPayload,
) {
  const response =
    await api.post<RegisterResponse>(
      "/api/auth/register",
      payload,
    );

  return response.data;
}

export function saveAuth(
  token: string,
  user: User,
) {
  localStorage.setItem(
    "haven_token",
    token,
  );

  localStorage.setItem(
    "haven_user",
    JSON.stringify(user),
  );
}

export function getStoredUser():
  | User
  | null {
  const stored =
    localStorage.getItem(
      "haven_user",
    );

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(
      stored,
    ) as User;
  } catch {
    return null;
  }
}

export function logoutUser() {
  localStorage.removeItem(
    "haven_token",
  );

  localStorage.removeItem(
    "haven_user",
  );
}