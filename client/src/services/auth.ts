import { api } from "./api";

import type {
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

type LoginResponse = {
  success: boolean;
  message: string;
  csrfToken: string;
  user: User;
};

type RegisterResponse = {
  success: boolean;
  message: string;
  user: User;
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
  user: User,
  csrfToken: string,
) {
  localStorage.setItem(
    "haven_user",
    JSON.stringify(user),
  );

  localStorage.setItem(
    "haven_csrf",
    csrfToken,
  );

  /*
    Remove any token left over
    from the old localStorage auth
    architecture.
  */
  localStorage.removeItem(
    "haven_token",
  );
}

export function getStoredUser():
  User | null {
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

export async function logoutUser() {
  try {
    await api.post(
      "/api/auth/logout",
    );
  } finally {
    localStorage.removeItem(
      "haven_user",
    );

    localStorage.removeItem(
      "haven_csrf",
    );

    localStorage.removeItem(
      "haven_token",
    );
  }
}