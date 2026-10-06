import type { ReactNode } from "react";
import {
  Navigate,
  useLocation,
} from "react-router";

import { useAuth } from "../../context/AuthContext";

type AdminRouteProps = {
  children: ReactNode;
};

export default function AdminRoute({
  children,
}: AdminRouteProps) {
  const {
    user,
    isAuthenticated,
    authLoading,
  } = useAuth();

  const location =
    useLocation();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#151613] text-white">
        <div className="text-center">
          <div className="mx-auto size-6 animate-spin rounded-full border-2 border-white/15 border-t-white" />

          <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-white/35">
            Haven Admin
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

  if (
    user?.role !==
    "ADMIN"
  ) {
    return (
      <Navigate
        to="/account"
        replace
      />
    );
  }

  return children;
}