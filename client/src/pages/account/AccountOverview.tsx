import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Sparkles,
} from "lucide-react";

import {
  Link,
  useNavigate,
} from "react-router";

import {
  motion,
} from "motion/react";

import axios from "axios";

import {
  api,
} from "../../services/api";

import {
  useAuth,
} from "../../context/AuthContext";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";

type Booking = {
  id: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: string;
  status: BookingStatus;
  createdAt: string;

  room: {
    id: number;
    name: string;
    imageUrl: string | null;
  };
};

type BookingsResponse = {
  success: boolean;
  count: number;
  bookings: Booking[];
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
  ).format(
    Number(value),
  );
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(value),
  );
}

function getStatusClasses(
  status: BookingStatus,
) {
  switch (status) {
    case "CONFIRMED":
      return "border-emerald-400/15 bg-emerald-400/10 text-emerald-200";

    case "CHECKED_IN":
      return "border-sky-400/15 bg-sky-400/10 text-sky-200";

    case "CHECKED_OUT":
      return "border-white/10 bg-white/5 text-white/40";

    case "CANCELLED":
      return "border-red-400/15 bg-red-400/10 text-red-200";

    default:
      return "border-[#c9b58d]/15 bg-[#c9b58d]/10 text-[#d8c8a7]";
  }
}

function formatStatus(
  status: BookingStatus,
) {
  return status.replaceAll(
    "_",
    " ",
  );
}

export default function AccountOverview() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [
    bookings,
    setBookings,
  ] =
    useState<Booking[]>(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] = useState("");

  useEffect(() => {
    let active = true;

    async function loadBookings() {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.get<BookingsResponse>(
            "/api/bookings/me",
          );

        if (!active) {
          return;
        }

        setBookings(
          response.data
            .bookings ??
            [],
        );
      } catch (
        requestError: unknown
      ) {
        if (!active) {
          return;
        }

        if (
          axios.isAxiosError(
            requestError,
          ) &&
          requestError
            .response
            ?.status === 401
        ) {
          await logout();

          navigate(
            "/login",
            {
              replace: true,
            },
          );

          return;
        }

        setError(
          "We couldn't load your stays right now.",
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      active = false;
    };
  }, [
    logout,
    navigate,
  ]);

  const upcoming =
    useMemo(
      () =>
        bookings
          .filter(
            (
              booking,
            ) =>
              booking.status ===
                "PENDING" ||
              booking.status ===
                "CONFIRMED" ||
              booking.status ===
                "CHECKED_IN",
          )
          .sort(
            (a, b) =>
              new Date(
                a.checkIn,
              ).getTime() -
              new Date(
                b.checkIn,
              ).getTime(),
          ),
      [bookings],
    );

  const completed =
    useMemo(
      () =>
        bookings.filter(
          (
            booking,
          ) =>
            booking.status ===
            "CHECKED_OUT",
        ),
      [bookings],
    );

  const nextStay =
    upcoming[0] ??
    null;

  const recentBookings =
    bookings.slice(0, 3);

  return (
    <div>
      {/* TOP */}

      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="flex flex-wrap items-end justify-between gap-6"
      >
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b5aa91]">
            Guest overview
          </p>

          <h1 className="display-font mt-3 text-[clamp(3rem,7vw,5.8rem)] leading-[0.88] tracking-[-0.06em]">
            Welcome back,
            <br />

            <span className="text-white/30">
              {user?.name ||
                "Guest"}
              .
            </span>
          </h1>
        </div>

        <Link
          to="/rooms"
          className="group flex items-center gap-2 rounded-full bg-[#f5f1e8] px-5 py-3 text-sm font-medium text-[#171714] transition hover:bg-white"
        >
          Book a stay

          <ArrowUpRight
            size={15}
            className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </motion.div>

      {/* STATS */}

      <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={
            BedDouble
          }
          label="Reservations"
          value={
            bookings.length
          }
        />

        <StatCard
          icon={
            CalendarCheck2
          }
          label="Upcoming"
          value={
            upcoming.length
          }
        />

        <StatCard
          icon={
            CheckCircle2
          }
          label="Completed"
          value={
            completed.length
          }
        />

        <StatCard
          icon={
            Clock3
          }
          label="Active"
          value={
            bookings.filter(
              (booking) =>
                booking.status ===
                "CHECKED_IN",
            ).length
          }
        />
      </div>

      {/* NEXT STAY */}

      <div className="mt-10 grid gap-5 xl:grid-cols-[1.6fr_.75fr]">
        <section>
          <div className="mb-5 flex items-center justify-between gap-5">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                Next reservation
              </p>

              <h2 className="display-font mt-2 text-3xl tracking-[-0.04em] sm:text-4xl">
                Your next stay.
              </h2>
            </div>
          </div>

          {loading ? (
            <div className="min-h-[380px] animate-pulse rounded-[28px] border border-white/10 bg-white/[0.03]" />
          ) : error ? (
            <div className="flex min-h-[380px] items-center rounded-[28px] border border-white/10 bg-white/[0.02] p-7">
              <p className="text-sm leading-7 text-white/45">
                {error}
              </p>
            </div>
          ) : nextStay ? (
            <NextStay
              booking={
                nextStay
              }
            />
          ) : (
            <EmptyNextStay />
          )}
        </section>

        <QuickActions />
      </div>

      {/* RECENT */}

      <section className="mt-12 border-t border-white/10 pt-10">
        <div className="flex items-end justify-between gap-5">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
              Reservations
            </p>

            <h2 className="display-font mt-2 text-3xl tracking-[-0.04em] sm:text-4xl">
              Recent stays.
            </h2>
          </div>

          <Link
            to="/account/bookings"
            className="group flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            View all

            <ArrowRight
              size={15}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {!loading &&
          !error &&
          recentBookings.length >
            0 && (
            <div className="mt-6 grid gap-4 xl:grid-cols-3">
              {recentBookings.map(
                (
                  booking,
                ) => (
                  <RecentBookingCard
                    key={
                      booking.id
                    }
                    booking={
                      booking
                    }
                  />
                ),
              )}
            </div>
          )}

        {!loading &&
          !error &&
          recentBookings.length ===
            0 && (
            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.02] p-7">
              <p className="text-sm text-white/40">
                No reservations
                yet.
              </p>
            </div>
          )}
      </section>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    size?: number;
  }>;

  label: string;
  value: number;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">
            {label}
          </p>

          <p className="display-font mt-5 text-4xl tracking-[-0.05em]">
            {String(
              value,
            ).padStart(
              2,
              "0",
            )}
          </p>
        </div>

        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#c9b58d]">
          <Icon
            size={15}
          />
        </span>
      </div>
    </div>
  );
}

function NextStay({
  booking,
}: {
  booking: Booking;
}) {
  return (
    <article className="group relative min-h-[380px] overflow-hidden rounded-[28px] border border-white/10">
      <img
        src={
          booking.room
            .imageUrl ||
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=90"
        }
        alt={
          booking.room
            .name
        }
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/15" />

      <div className="relative flex min-h-[380px] flex-col justify-between p-6 sm:p-8">
        <span
          className={`w-fit rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${getStatusClasses(
            booking.status,
          )}`}
        >
          {formatStatus(
            booking.status,
          )}
        </span>

        <div>
          <h3 className="display-font max-w-2xl text-4xl leading-[0.95] tracking-[-0.05em] sm:text-5xl">
            {
              booking.room
                .name
            }
          </h3>

          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/35">
                Check in
              </p>

              <p className="mt-1 text-sm">
                {formatDate(
                  booking.checkIn,
                )}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/35">
                Check out
              </p>

              <p className="mt-1 text-sm">
                {formatDate(
                  booking.checkOut,
                )}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/35">
                Guests
              </p>

              <p className="mt-1 text-sm">
                {
                  booking.guests
                }
              </p>
            </div>
          </div>

          <Link
            to={`/bookings/${booking.id}`}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f5f1e8] px-5 py-3 text-sm font-medium text-[#171714]"
          >
            View reservation

            <ArrowUpRight
              size={14}
            />
          </Link>
        </div>
      </div>
    </article>
  );
}

function QuickActions() {
  return (
    <aside className="rounded-[28px] border border-white/10 bg-[#1c1d19] p-6">
      <p className="text-[10px] uppercase tracking-[0.2em] text-[#b5aa91]">
        Quick actions
      </p>

      <h3 className="display-font mt-3 text-3xl tracking-[-0.04em]">
        Where next?
      </h3>

      <div className="mt-8 divide-y divide-white/10">
        <Action
          icon={
            BedDouble
          }
          title="Book another stay"
          text="Explore Haven rooms and suites."
          to="/rooms"
        />

        <Action
          icon={
            Sparkles
          }
          title="Explore experiences"
          text="Discover more than accommodation."
          to="/experience"
        />

        <Action
          icon={
            CalendarDays
          }
          title="Manage stays"
          text="Review your reservation history."
          to="/account/bookings"
        />
      </div>
    </aside>
  );
}

function Action({
  icon: Icon,
  title,
  text,
  to,
}: {
  icon: React.ComponentType<{
    size?: number;
  }>;
  title: string;
  text: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group flex items-center justify-between gap-5 py-5 first:pt-0 last:pb-0"
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#c9b58d]">
          <Icon
            size={15}
          />
        </span>

        <div>
          <p className="text-sm">
            {title}
          </p>

          <p className="mt-1 text-xs leading-5 text-white/30">
            {text}
          </p>
        </div>
      </div>

      <ArrowRight
        size={15}
        className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white"
      />
    </Link>
  );
}

function RecentBookingCard({
  booking,
}: {
  booking: Booking;
}) {
  return (
    <Link
      to={`/bookings/${booking.id}`}
      className="group overflow-hidden rounded-[22px] border border-white/10 bg-[#1c1d19]"
    >
      <div className="relative overflow-hidden">
        <img
          src={
            booking.room
              .imageUrl ||
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=85"
          }
          alt={
            booking.room
              .name
          }
          className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />

        <span
          className={`absolute right-3 top-3 rounded-full border px-2.5 py-1 text-[8px] uppercase tracking-[0.12em] ${getStatusClasses(
            booking.status,
          )}`}
        >
          {formatStatus(
            booking.status,
          )}
        </span>
      </div>

      <div className="p-5">
        <h3 className="display-font text-2xl tracking-[-0.04em]">
          {
            booking.room
              .name
          }
        </h3>

        <div className="mt-4 flex items-center justify-between gap-4 text-xs text-white/35">
          <span>
            {formatDate(
              booking.checkIn,
            )}
          </span>

          <span>
            {formatPrice(
              booking.totalPrice,
            )}
          </span>
        </div>
      </div>
    </Link>
  );
}

function EmptyNextStay() {
  return (
    <div className="flex min-h-[380px] flex-col justify-end rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(201,181,141,0.12),transparent_35%),#1c1d19] p-7">
      <BedDouble
        size={25}
        className="text-[#c9b58d]"
      />

      <h3 className="display-font mt-5 text-4xl tracking-[-0.05em]">
        No upcoming stay.
      </h3>

      <p className="mt-3 max-w-md text-sm leading-7 text-white/40">
        Whenever you're ready,
        your next Haven stay is
        waiting.
      </p>

      <Link
        to="/rooms"
        className="mt-6 w-fit rounded-full bg-[#f5f1e8] px-5 py-3 text-sm font-medium text-[#171714]"
      >
        Find a room
      </Link>
    </div>
  );
}