import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { ReactNode } from "react";
import type { User } from "../types/auth";

import {
  getStoredUser,
  logoutUser,
} from "../services/auth";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined,
  );

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] =
    useState<User | null>(null);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  useEffect(() => {
    const storedUser =
      getStoredUser();

    const token =
      localStorage.getItem(
        "haven_token",
      );

    if (
      storedUser &&
      token
    ) {
      setUser(storedUser);
    }

    setAuthLoading(false);
  }, []);

  function logout() {
    logoutUser();

    setUser(null);
  }

  const isAuthenticated =
    user !== null;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authLoading,
        setUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider",
    );
  }

  return context;
}