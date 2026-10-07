import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import axios from "axios";

import { api } from "../services/api";

import {
  getStoredUser,
  logoutUser,
} from "../services/auth";

import type {
  CurrentUserResponse,
  User,
} from "../types/auth";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;

  setUser: (
    user: User | null,
  ) => void;

  logout: () => Promise<void>;

  refreshUser: () => Promise<
    User | null
  >;
};

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [
    user,
    setUser,
  ] = useState<User | null>(
    null,
  );

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const logout =
    useCallback(async () => {
      try {
        await logoutUser();
      } finally {
        setUser(null);
      }
    }, []);

  const refreshUser =
    useCallback(async () => {
      try {
        /*
          The browser automatically sends
          the httpOnly haven_token cookie
          because api.ts uses:

          withCredentials: true
        */

        const response =
          await api.get<CurrentUserResponse>(
            "/api/auth/me",
          );

        const currentUser =
          response.data.user;

        localStorage.setItem(
          "haven_user",
          JSON.stringify(
            currentUser,
          ),
        );

        setUser(
          currentUser,
        );

        return currentUser;
      } catch (
        error: unknown
      ) {
        console.error(
          "Session validation failed:",
          error,
        );

        /*
          401 / 403 / 404 means the
          server no longer accepts the
          current session.
        */
        if (
          axios.isAxiosError(
            error,
          ) &&
          (
            error.response
              ?.status ===
              401 ||
            error.response
              ?.status ===
              403 ||
            error.response
              ?.status ===
              404
          )
        ) {
          localStorage.removeItem(
            "haven_user",
          );

          localStorage.removeItem(
            "haven_csrf",
          );

          localStorage.removeItem(
            "haven_token",
          );

          setUser(null);

          return null;
        }

        /*
          If the backend is temporarily
          unavailable because of network
          or database issues, keep the last
          known user locally.

          This does NOT bypass backend
          authorization. Protected API
          routes still require the valid
          httpOnly cookie.
        */
        const storedUser =
          getStoredUser();

        if (storedUser) {
          setUser(
            storedUser,
          );

          return storedUser;
        }

        setUser(null);

        return null;
      }
    }, []);

  useEffect(() => {
    let active = true;

    async function initializeAuth() {
      try {
        /*
          We no longer check for haven_token
          in localStorage.

          The JWT is now stored in an
          httpOnly cookie, which JavaScript
          intentionally cannot read.
        */

        const currentUser =
          await refreshUser();

        if (
          active &&
          currentUser
        ) {
          setUser(
            currentUser,
          );
        }
      } finally {
        if (active) {
          setAuthLoading(
            false,
          );
        }
      }
    }

    initializeAuth();

    return () => {
      active = false;
    };
  }, [
    refreshUser,
  ]);

  const isAuthenticated =
    user !== null;

  const value =
    useMemo(
      () => ({
        user,
        isAuthenticated,
        authLoading,
        setUser,
        logout,
        refreshUser,
      }),
      [
        user,
        isAuthenticated,
        authLoading,
        logout,
        refreshUser,
      ],
    );

  return (
    <AuthContext.Provider
      value={value}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(
      AuthContext,
    );

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}