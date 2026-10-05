import type { ReactNode } from "react";

import {
  Navigate,
  useLocation,
} from "react-router";

import { useAuth } from "../../context/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({
  children,
}: ProtectedRouteProps) {
  const {
    isAuthenticated,
    authLoading,
  } = useAuth();

  const location = useLocation();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#151613] text-white">
        <div className="text-center">
          <div className="mx-auto size-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />

          <p className="mt-4 text-[10px] uppercase tracking-[0.22em] text-white/35">
            Haven
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  return children;
}