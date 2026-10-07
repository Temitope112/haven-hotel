import {
  useEffect,
  useState,
} from "react";

import { motion } from "motion/react";

import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  CircleDollarSign,
  Clock3,
  RefreshCw,
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

function getGreeting() {
  const hour =
    new Date().getHours();

  if (hour < 12) {
    return "Good morning";
  }

  if (hour < 17) {
    return "Good afternoon";
  }

  return "Good evening";
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

  async function fetchOverview() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<AdminOverviewResponse>(
          "/api/admin/overview",
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
          await logout();

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
        "We couldn't load the dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchOverview();
  }, []);

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ||
    "Admin";

  const greeting =
    getGreeting();

  return (
    <div className="min-h-screen bg-[#11120f]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        {/* PAGE HEADER */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b5aa91]">
              Overview
            </p>

            <h1 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#f5f1e8] sm:text-3xl">
              {greeting},{" "}
              {firstName}.
            </h1>

            <p className="mt-2 text-sm text-white/35">
              Here's what's
              happening across
              Haven.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={
                fetchOverview
              }
              disabled={
                loading
              }
              className="flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-xs text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-40"
            >
              <RefreshCw
                size={14}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />

              Refresh
            </button>

            <Link
              to="/admin/bookings"
              className="flex min-h-10 items-center gap-2 rounded-full bg-[#c9b58d] px-4 text-xs font-medium text-[#171714]"
            >
              View bookings

              <ArrowUpRight
                size={14}
              />
            </Link>
          </div>
        </header>

        {/* DIVIDER */}
        <div className="my-7 h-px bg-white/[0.07]" />

        {loading ? (
          <DashboardLoading />
        ) : error ? (
          <DashboardError
            message={error}
            onRetry={
              fetchOverview
            }
          />
        ) : overview ? (
          <>
            {/* PRIMARY STATS */}
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Total bookings"
                value={
                  overview.totalBookings
                }
                subtitle="All reservations"
                icon={
                  CalendarDays
                }
              />

              <MetricCard
                title="Guests"
                value={
                  overview.totalUsers
                }
                subtitle="Registered accounts"
                icon={Users}
              />

              <MetricCard
                title="Rooms"
                value={
                  overview.totalRooms
                }
                subtitle="Hotel inventory"
                icon={
                  BedDouble
                }
              />

              <MetricCard
                title="Revenue"
                value={formatPrice(
                  overview.totalRevenue,
                )}
                subtitle="Confirmed stays"
                icon={
                  CircleDollarSign
                }
              />
            </section>

            {/* MAIN GRID */}
            <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,.75fr)]">
              {/* BOOKING ACTIVITY */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="rounded-[22px] border border-white/[0.07] bg-[#171814] p-5 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                      Reservations
                    </p>

                    <h2 className="mt-2 text-lg font-medium tracking-[-0.03em]">
                      Booking activity
                    </h2>
                  </div>

                  <Link
                    to="/admin/bookings"
                    className="text-[11px] text-[#c9b58d] transition hover:text-white"
                  >
                    View all
                  </Link>
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-3">
                  <BookingMetric
                    label="Pending"
                    value={
                      overview
                        .bookings
                        .pending
                    }
                    icon={
                      Clock3
                    }
                  />

                  <BookingMetric
                    label="Confirmed"
                    value={
                      overview
                        .bookings
                        .confirmed
                    }
                    icon={
                      ShieldCheck
                    }
                  />

                  <BookingMetric
                    label="Cancelled"
                    value={
                      overview
                        .bookings
                        .cancelled
                    }
                    icon={
                      XCircle
                    }
                  />
                </div>

                <div className="mt-7 border-t border-white/[0.07] pt-5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-white/30">
                      Total bookings
                    </p>

                    <p className="text-sm font-medium">
                      {
                        overview.totalBookings
                      }
                    </p>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                    <BookingProgress
                      overview={
                        overview
                      }
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[9px] text-white/25">
                    <span>
                      Pending{" "}
                      {
                        overview
                          .bookings
                          .pending
                      }
                    </span>

                    <span>
                      Confirmed{" "}
                      {
                        overview
                          .bookings
                          .confirmed
                      }
                    </span>

                    <span>
                      Cancelled{" "}
                      {
                        overview
                          .bookings
                          .cancelled
                      }
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* QUICK ACTIONS */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.05,
                }}
                className="rounded-[22px] border border-white/[0.07] bg-[#171814] p-5 sm:p-6"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                  Quick actions
                </p>

                <h2 className="mt-2 text-lg font-medium tracking-[-0.03em]">
                  Management
                </h2>

                <div className="mt-6 space-y-2">
                  <QuickAction
                    to="/admin/bookings"
                    icon={
                      CalendarDays
                    }
                    title="Bookings"
                    description="Review and update reservations"
                  />

                  <QuickAction
                    to="/admin/rooms"
                    icon={
                      BedDouble
                    }
                    title="Rooms"
                    description="Manage hotel inventory"
                  />

                  <QuickAction
                    to="/admin/users"
                    icon={Users}
                    title="Guests"
                    description="View registered users"
                  />
                </div>
              </motion.div>
            </section>

            {/* SECONDARY PANEL */}
            <section className="mt-5 grid gap-5 lg:grid-cols-2">
              <div className="rounded-[22px] border border-white/[0.07] bg-[#171814] p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/25">
                  Property
                </p>

                <div className="mt-6 flex items-end justify-between">
                  <div>
                    <p className="text-4xl font-medium tracking-[-0.06em]">
                      {
                        overview.totalRooms
                      }
                    </p>

                    <p className="mt-2 text-xs text-white/30">
                      Rooms currently
                      listed
                    </p>
                  </div>

                  <BedDouble
                    size={24}
                    className="text-[#c9b58d]"
                  />
                </div>
              </div>

              <div className="rounded-[22px] bg-[#4d5545] p-5 sm:p-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
                  Revenue
                </p>

                <div className="mt-6">
                  <p className="break-words text-3xl font-medium tracking-[-0.05em] sm:text-4xl">
                    {formatPrice(
                      overview.totalRevenue,
                    )}
                  </p>

                  <p className="mt-2 text-xs text-white/40">
                    Revenue from
                    confirmed and
                    completed stays
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : null}
      </div>
    </div>
  );
}

type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle: string;
  icon: typeof Users;
};

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: MetricCardProps) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-[20px] border border-white/[0.07] bg-[#171814] p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium text-white/30">
            {title}
          </p>

          <p className="mt-5 break-words text-3xl font-medium tracking-[-0.055em] sm:text-[2rem]">
            {value}
          </p>

          <p className="mt-2 text-[10px] text-white/20">
            {subtitle}
          </p>
        </div>

        <div className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-[#c9b58d]/10 text-[#c9b58d]">
          <Icon
            size={16}
          />
        </div>
      </div>
    </motion.article>
  );
}

type BookingMetricProps = {
  label: string;
  value: number;
  icon: typeof Clock3;
};

function BookingMetric({
  label,
  value,
  icon: Icon,
}: BookingMetricProps) {
  return (
    <div className="rounded-[17px] border border-white/[0.06] bg-white/[0.02] p-4">
      <Icon
        size={15}
        className="text-[#c9b58d]"
      />

      <p className="mt-5 text-3xl font-medium tracking-[-0.05em]">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-white/30">
        {label}
      </p>
    </div>
  );
}

type QuickActionProps = {
  to: string;
  icon: typeof Users;
  title: string;
  description: string;
};

function QuickAction({
  to,
  icon: Icon,
  title,
  description,
}: QuickActionProps) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-[15px] border border-white/[0.06] p-3.5 transition hover:border-white/10 hover:bg-white/[0.025]"
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-[11px] bg-white/[0.04] text-white/45 transition group-hover:text-[#c9b58d]">
        <Icon
          size={16}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-white/75">
          {title}
        </p>

        <p className="mt-1 truncate text-[10px] text-white/25">
          {description}
        </p>
      </div>

      <ArrowUpRight
        size={14}
        className="text-white/20 transition group-hover:text-white/60"
      />
    </Link>
  );
}

function BookingProgress({
  overview,
}: {
  overview: AdminOverview;
}) {
  const total =
    overview.totalBookings;

  if (total === 0) {
    return null;
  }

  const confirmed =
    (overview.bookings
      .confirmed /
      total) *
    100;

  return (
    <div
      className="h-full rounded-full bg-[#c9b58d]"
      style={{
        width: `${Math.min(
          confirmed,
          100,
        )}%`,
      }}
    />
  );
}

function DashboardLoading() {
  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map(
          (item) => (
            <div
              key={item}
              className="h-[145px] animate-pulse rounded-[20px] bg-white/[0.04]"
            />
          ),
        )}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.45fr_.75fr]">
        <div className="h-[340px] animate-pulse rounded-[22px] bg-white/[0.04]" />

        <div className="h-[340px] animate-pulse rounded-[22px] bg-white/[0.04]" />
      </div>
    </>
  );
}

function DashboardError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center rounded-[22px] border border-white/[0.07] bg-[#171814] px-5 text-center">
      <div>
        <p className="text-lg font-medium">
          Dashboard unavailable
        </p>

        <p className="mt-2 text-sm text-white/30">
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="mt-6 rounded-full bg-[#f5f1e8] px-5 py-2.5 text-xs font-medium text-[#171714]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}