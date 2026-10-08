import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import axios from "axios";

import {
  Link,
  useNavigate,
} from "react-router";

import {
  motion,
} from "motion/react";

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

type Filter =
  | "ALL"
  | "UPCOMING"
  | "COMPLETED"
  | "CANCELLED";

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
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(
    new Date(value),
  );
}

function formatStatus(
  status: BookingStatus,
) {
  return status.replaceAll(
    "_",
    " ",
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

export default function AccountBookings() {
  const navigate =
    useNavigate();

  const {
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

  const [
    filter,
    setFilter,
  ] =
    useState<Filter>(
      "ALL",
    );

  const [
    search,
    setSearch,
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
          "We couldn't load your reservations right now.",
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

  const counts =
    useMemo(() => {
      return {
        all:
          bookings.length,

        upcoming:
          bookings.filter(
            (booking) =>
              booking.status ===
                "PENDING" ||
              booking.status ===
                "CONFIRMED" ||
              booking.status ===
                "CHECKED_IN",
          ).length,

        completed:
          bookings.filter(
            (booking) =>
              booking.status ===
              "CHECKED_OUT",
          ).length,

        cancelled:
          bookings.filter(
            (booking) =>
              booking.status ===
              "CANCELLED",
          ).length,
      };
    }, [
      bookings,
    ]);

  const filteredBookings =
    useMemo(() => {
      const cleanSearch =
        search
          .trim()
          .toLowerCase();

      return bookings
        .filter(
          (booking) => {
            if (
              filter ===
              "UPCOMING"
            ) {
              return (
                booking.status ===
                  "PENDING" ||
                booking.status ===
                  "CONFIRMED" ||
                booking.status ===
                  "CHECKED_IN"
              );
            }

            if (
              filter ===
              "COMPLETED"
            ) {
              return (
                booking.status ===
                "CHECKED_OUT"
              );
            }

            if (
              filter ===
              "CANCELLED"
            ) {
              return (
                booking.status ===
                "CANCELLED"
              );
            }

            return true;
          },
        )
        .filter(
          (booking) => {
            if (
              !cleanSearch
            ) {
              return true;
            }

            return (
              booking.room.name
                .toLowerCase()
                .includes(
                  cleanSearch,
                ) ||
              String(
                booking.id,
              ).includes(
                cleanSearch,
              ) ||
              booking.status
                .toLowerCase()
                .includes(
                  cleanSearch,
                )
            );
          },
        )
        .sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        );
    }, [
      bookings,
      filter,
      search,
    ]);

  return (
    <div>
      {/* HEADER */}

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
          duration: 0.55,
        }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b5aa91]">
          Reservations
        </p>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="display-font text-[clamp(3rem,7vw,5.7rem)] leading-[0.88] tracking-[-0.06em]">
              My stays.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/40">
              Review upcoming reservations, completed stays,
              and previous bookings from one place.
            </p>
          </div>

          <Link
            to="/rooms"
            className="rounded-full bg-[#f5f1e8] px-5 py-3 text-sm font-medium text-[#171714] transition hover:bg-white"
          >
            Book another stay
          </Link>
        </div>
      </motion.div>

      {/* SUMMARY */}

      <div className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={
            CalendarDays
          }
          label="All"
          value={
            counts.all
          }
        />

        <SummaryCard
          icon={
            Clock3
          }
          label="Upcoming"
          value={
            counts.upcoming
          }
        />

        <SummaryCard
          icon={
            CheckCircle2
          }
          label="Completed"
          value={
            counts.completed
          }
        />

        <SummaryCard
          icon={
            XCircle
          }
          label="Cancelled"
          value={
            counts.cancelled
          }
        />
      </div>

      {/* FILTERS */}

      <div className="mt-10 flex flex-col gap-4 border-y border-white/10 py-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterButton
            active={
              filter ===
              "ALL"
            }
            label="All"
            count={
              counts.all
            }
            onClick={() =>
              setFilter(
                "ALL",
              )
            }
          />

          <FilterButton
            active={
              filter ===
              "UPCOMING"
            }
            label="Upcoming"
            count={
              counts.upcoming
            }
            onClick={() =>
              setFilter(
                "UPCOMING",
              )
            }
          />

          <FilterButton
            active={
              filter ===
              "COMPLETED"
            }
            label="Completed"
            count={
              counts.completed
            }
            onClick={() =>
              setFilter(
                "COMPLETED",
              )
            }
          />

          <FilterButton
            active={
              filter ===
              "CANCELLED"
            }
            label="Cancelled"
            count={
              counts.cancelled
            }
            onClick={() =>
              setFilter(
                "CANCELLED",
              )
            }
          />
        </div>

        <div className="relative w-full xl:max-w-[300px]">
          <Search
            size={15}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
          />

          <input
            type="search"
            value={
              search
            }
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            placeholder="Search stays"
            className="h-12 w-full rounded-full border border-white/10 bg-white/[0.02] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-white/20"
          />
        </div>
      </div>

      {/* CONTENT */}

      {loading && (
        <BookingsLoading />
      )}

      {!loading &&
        error && (
          <div className="mt-8 rounded-[24px] border border-red-400/15 bg-red-400/[0.04] p-6">
            <p className="text-sm leading-7 text-red-200">
              {error}
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        filteredBookings.length >
          0 && (
          <div className="mt-8 grid gap-5 xl:grid-cols-2">
            {filteredBookings.map(
              (
                booking,
                index,
              ) => (
                <BookingCard
                  key={
                    booking.id
                  }
                  booking={
                    booking
                  }
                  index={
                    index
                  }
                />
              ),
            )}
          </div>
        )}

      {!loading &&
        !error &&
        filteredBookings.length ===
          0 && (
          <EmptyState
            filter={
              filter
            }
            search={
              search
            }
          />
        )}
    </div>
  );
}

function SummaryCard({
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

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-[#c9b58d]">
          <Icon
            size={15}
          />
        </div>
      </div>
    </div>
  );
}

function FilterButton({
  active,
  label,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={
        onClick
      }
      className={`
        shrink-0 rounded-full border px-4 py-2 text-xs transition
        ${
          active
            ? "border-[#c9b58d]/30 bg-[#c9b58d]/10 text-[#e0d4bc]"
            : "border-white/10 text-white/35 hover:border-white/20 hover:text-white/65"
        }
      `}
    >
      {label}

      <span className="ml-2 text-[10px] opacity-60">
        {String(
          count,
        ).padStart(
          2,
          "0",
        )}
      </span>
    </button>
  );
}

function BookingCard({
  booking,
  index,
}: {
  booking: Booking;
  index: number;
}) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 18,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay:
          Math.min(
            index * 0.05,
            0.2,
          ),
      }}
      className="overflow-hidden rounded-[24px] border border-white/10 bg-[#1c1d19]"
    >
      <Link
        to={`/bookings/${booking.id}`}
        className="group block"
      >
        <div className="relative overflow-hidden">
          <img
            src={
              booking.room
                .imageUrl ||
              "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=90"
            }
            alt={
              booking.room
                .name
            }
            className="aspect-[16/9] w-full object-cover transition duration-700 group-hover:scale-[1.025]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent" />

          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/25 px-3 py-1.5 text-[9px] uppercase tracking-[0.14em] text-white/55 backdrop-blur-md">
            Booking #
            {booking.id}
          </div>

          <span
            className={`absolute right-4 top-4 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${getStatusClasses(
              booking.status,
            )}`}
          >
            {formatStatus(
              booking.status,
            )}
          </span>

          <h2 className="display-font absolute bottom-5 left-5 right-5 text-3xl leading-[0.95] tracking-[-0.045em] sm:text-4xl">
            {
              booking.room
                .name
            }
          </h2>
        </div>

        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <DateDetail
              label="Check in"
              value={formatDate(
                booking.checkIn,
              )}
            />

            <DateDetail
              label="Check out"
              value={formatDate(
                booking.checkOut,
              )}
            />
          </div>

          <div className="mt-5 flex items-end justify-between gap-5 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 text-xs text-white/35">
              <Users
                size={14}
              />

              {
                booking.guests
              }{" "}
              {booking.guests ===
              1
                ? "guest"
                : "guests"}
            </div>

            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">
                Total
              </p>

              <p className="mt-1 text-sm font-medium">
                {formatPrice(
                  booking.totalPrice,
                )}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

function DateDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <CalendarDays
        size={16}
        className="mt-0.5 shrink-0 text-[#c9b58d]"
      />

      <div>
        <p className="text-sm">
          {value}
        </p>

        <p className="mt-1 text-xs text-white/25">
          {label}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  filter,
  search,
}: {
  filter: Filter;
  search: string;
}) {
  const hasSearch =
    search.trim() !== "";

  return (
    <div className="mt-8 flex min-h-[340px] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.015] px-6 text-center">
      <CalendarDays
        size={26}
        className="text-[#c9b58d]"
      />

      <h2 className="display-font mt-5 text-3xl tracking-[-0.04em]">
        {hasSearch
          ? "No matching stays."
          : filter ===
              "UPCOMING"
            ? "Nothing upcoming."
            : filter ===
                "COMPLETED"
              ? "No completed stays."
              : filter ===
                  "CANCELLED"
                ? "No cancelled stays."
                : "No stays yet."}
      </h2>

      <p className="mt-3 max-w-md text-sm leading-7 text-white/40">
        {hasSearch
          ? "Try another room name, booking number, or status."
          : "Your Haven reservations will appear here as you make them."}
      </p>

      {!hasSearch &&
        filter ===
          "ALL" && (
          <Link
            to="/rooms"
            className="mt-7 rounded-full bg-[#f5f1e8] px-5 py-3 text-sm font-medium text-[#171714]"
          >
            Find a room
          </Link>
        )}
    </div>
  );
}

function BookingsLoading() {
  return (
    <div className="mt-8 grid gap-5 xl:grid-cols-2">
      {[1, 2].map(
        (item) => (
          <div
            key={
              item
            }
            className="overflow-hidden rounded-[24px] border border-white/10"
          >
            <div className="aspect-[16/9] animate-pulse bg-white/5" />

            <div className="space-y-4 p-5">
              <div className="h-4 w-2/5 animate-pulse rounded-full bg-white/5" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/5" />
            </div>
          </div>
        ),
      )}
    </div>
  );
}