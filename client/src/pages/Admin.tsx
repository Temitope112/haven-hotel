import {
  useEffect,
  useState,
} from "react";
import { motion } from "motion/react";
import {
  BedDouble,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  LogOut,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import axios from "axios";
import {
  Link,
  useNavigate,
} from "react-router";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

type AdminOverview = {
  totalUsers: number;
  totalRooms: number;
  totalBookings: number;

  bookings: {
    pending: number;
    confirmed: number;
    cancelled: number;
  };

  totalRevenue: string;
};

type AdminOverviewResponse = {
  success: boolean;
  overview: AdminOverview;
};

function formatPrice(
  value: string | number,
) {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    },
  ).format(Number(value));
}

export default function Admin() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [
    overview,
    setOverview,
  ] =
    useState<AdminOverview | null>(
      null,
    );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    async function fetchOverview() {
      try {
        setLoading(true);
        setError("");

        const token =
          localStorage.getItem(
            "haven_token",
          );

        const response =
          await api.get<AdminOverviewResponse>(
            "/api/admin/overview",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            },
          );

        setOverview(
          response.data
            .overview,
        );
      } catch (
        error: unknown
      ) {
        console.error(
          "Failed to load admin overview:",
          error,
        );

        if (
          axios.isAxiosError(
            error,
          )
        ) {
          if (
            error.response
              ?.status === 401
          ) {
            logout();

            navigate(
              "/login",
              {
                replace: true,
                state: {
                  from:
                    "/admin",
                },
              },
            );

            return;
          }

          if (
            error.response
              ?.status === 403
          ) {
            navigate(
              "/account",
              {
                replace: true,
              },
            );

            return;
          }
        }

        setError(
          "We couldn't load the admin dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, [
    logout,
    navigate,
  ]);

  function handleLogout() {
    logout();

    navigate("/", {
      replace: true,
    });
  }

  return (
    <div className="min-h-screen bg-[#151613] text-[#f5f1e8]">
      <section className="px-5 pb-20 pt-32 sm:px-6 lg:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          {/* HEADER */}
          <div className="flex flex-col gap-8 border-b border-white/10 pb-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={15}
                  className="text-[#c9b58d]"
                />

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b5aa91]">
                  Haven Administration
                </p>
              </div>

              <h1 className="display-font mt-5 text-[clamp(3.4rem,9vw,7rem)] leading-[0.85] tracking-[-0.06em]">
                Good morning,
                <br />

                <span className="text-white/30">
                  {user?.name}.
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/40">
                Manage bookings,
                rooms and guest
                activity from one
                place.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="flex min-h-11 w-fit items-center gap-2 rounded-full border border-white/10 px-5 text-sm text-white/50 transition hover:border-white/20 hover:text-white"
            >
              <LogOut
                size={15}
              />

              Sign out
            </button>
          </div>

          {loading ? (
            <AdminLoading />
          ) : error ? (
            <AdminError
              message={
                error
              }
            />
          ) : overview ? (
            <>
              {/* STATS */}
              <section className="grid gap-4 py-8 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  label="Total bookings"
                  value={
                    overview.totalBookings
                  }
                  icon={
                    CalendarDays
                  }
                />

                <StatCard
                  label="Guests"
                  value={
                    overview.totalUsers
                  }
                  icon={
                    Users
                  }
                />

                <StatCard
                  label="Rooms"
                  value={
                    overview.totalRooms
                  }
                  icon={
                    BedDouble
                  }
                />

                <StatCard
                  label="Revenue"
                  value={formatPrice(
                    overview.totalRevenue,
                  )}
                  icon={
                    CircleDollarSign
                  }
                />
              </section>

              {/* BOOKING STATUS */}
              <section className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="rounded-[26px] border border-white/10 bg-[#1c1d19] p-6 sm:p-8"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b5aa91]">
                        Booking status
                      </p>

                      <h2 className="display-font mt-3 text-3xl tracking-[-0.04em] sm:text-4xl">
                        Current activity
                      </h2>
                    </div>
                  </div>

                  <div className="mt-8 grid gap-3 sm:grid-cols-3">
                    <StatusCard
                      label="Pending"
                      value={
                        overview.bookings
                          .pending
                      }
                      icon={
                        Clock3
                      }
                    />

                    <StatusCard
                      label="Confirmed"
                      value={
                        overview.bookings
                          .confirmed
                      }
                      icon={
                        ShieldCheck
                      }
                    />

                    <StatusCard
                      label="Cancelled"
                      value={
                        overview.bookings
                          .cancelled
                      }
                      icon={
                        XCircle
                      }
                    />
                  </div>
                </motion.div>

                {/* QUICK ACTIONS */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.06,
                  }}
                  className="rounded-[26px] bg-[#4d5545] p-6 sm:p-8"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">
                    Management
                  </p>

                  <h2 className="display-font mt-3 text-3xl tracking-[-0.04em] sm:text-4xl">
                    Hotel controls.
                  </h2>

                  <div className="mt-8 space-y-2">
                    <Link
                      to="/admin/bookings"
                      className="flex min-h-14 items-center justify-between rounded-[18px] border border-white/15 px-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                    >
                      Manage bookings

                      <span>
                        →
                      </span>
                    </Link>

                    <Link
                      to="/admin/rooms"
                      className="flex min-h-14 items-center justify-between rounded-[18px] border border-white/15 px-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                    >
                      Manage rooms

                      <span>
                        →
                      </span>
                    </Link>

                    <Link
                      to="/admin/users"
                      className="flex min-h-14 items-center justify-between rounded-[18px] border border-white/15 px-4 text-sm text-white/75 transition hover:bg-white/5 hover:text-white"
                    >
                      View guests

                      <span>
                        →
                      </span>
                    </Link>
                  </div>
                </motion.div>
              </section>

              {/* NOTE */}
              <section className="mt-5 rounded-[24px] border border-white/10 p-6 sm:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
                  Admin access
                </p>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-white/40">
                  This dashboard is
                  protected both in
                  the frontend and by
                  server-side role
                  authorization. Guest
                  accounts cannot
                  access admin API
                  routes.
                </p>
              </section>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string | number;
  icon: typeof Users;
};

function StatCard({
  label,
  value,
  icon: Icon,
}: StatCardProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 16,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-[22px] border border-white/10 bg-white/[0.025] p-5 sm:p-6"
    >
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
          {label}
        </p>

        <Icon
          size={17}
          className="text-[#c9b58d]"
        />
      </div>

      <p className="display-font mt-7 break-words text-4xl tracking-[-0.05em]">
        {value}
      </p>
    </motion.div>
  );
}

type StatusCardProps = {
  label: string;
  value: number;
  icon: typeof Clock3;
};

function StatusCard({
  label,
  value,
  icon: Icon,
}: StatusCardProps) {
  return (
    <div className="rounded-[18px] border border-white/10 bg-white/[0.025] p-5">
      <Icon
        size={16}
        className="text-[#c9b58d]"
      />

      <p className="display-font mt-6 text-4xl tracking-[-0.05em]">
        {value}
      </p>

      <p className="mt-2 text-xs text-white/35">
        {label}
      </p>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="grid gap-4 py-8 sm:grid-cols-2 xl:grid-cols-4">
      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="h-[150px] animate-pulse rounded-[22px] bg-white/5"
          />
        ),
      )}
    </div>
  );
}

type AdminErrorProps = {
  message: string;
};

function AdminError({
  message,
}: AdminErrorProps) {
  return (
    <div className="mt-8 flex min-h-[300px] items-center justify-center rounded-[24px] border border-white/10 text-center">
      <div>
        <p className="display-font text-3xl">
          Dashboard unavailable.
        </p>

        <p className="mt-3 text-sm text-white/40">
          {message}
        </p>
      </div>
    </div>
  );
}