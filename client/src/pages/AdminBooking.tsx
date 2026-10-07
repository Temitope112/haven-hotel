import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import { motion } from "motion/react";
import {
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  RefreshCw,
  Search,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CHECKED_IN"
  | "CHECKED_OUT"
  | "CANCELLED";

type AdminBooking = {
  id: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: string;
  status: BookingStatus;
  createdAt: string;

  user: {
    id: number;
    name: string;
    email: string;
  };

  room: {
    id: number;
    name: string;
    imageUrl: string | null;
    price: string;
  };
};

type BookingsResponse = {
  success: boolean;
  count: number;
  bookings: AdminBooking[];
};

type UpdateStatusResponse = {
  success: boolean;
  message: string;
  booking: AdminBooking;
};

const statusOptions: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
];

const statusTransitions: Record<
  BookingStatus,
  BookingStatus[]
> = {
  PENDING: [
    "CONFIRMED",
    "CANCELLED",
  ],

  CONFIRMED: [
    "CHECKED_IN",
    "CANCELLED",
  ],

  CHECKED_IN: [
    "CHECKED_OUT",
  ],

  CHECKED_OUT: [],

  CANCELLED: [],
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
  ).format(new Date(value));
}

function formatStatus(
  status: BookingStatus,
) {
  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
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
      return "border-white/10 bg-white/[0.04] text-white/45";

    case "CANCELLED":
      return "border-red-400/15 bg-red-400/10 text-red-200";

    default:
      return "border-[#c9b58d]/15 bg-[#c9b58d]/10 text-[#d8c8a7]";
  }
}

function getStatusIcon(
  status: BookingStatus,
) {
  switch (status) {
    case "CONFIRMED":
      return CheckCircle2;

    case "CHECKED_IN":
      return ShieldCheck;

    case "CHECKED_OUT":
      return CheckCircle2;

    case "CANCELLED":
      return XCircle;

    default:
      return Clock3;
  }
}

export default function AdminBookings() {
  const navigate =
    useNavigate();

  const {
    logout,
  } = useAuth();

  const [
    bookings,
    setBookings,
  ] = useState<AdminBooking[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    BookingStatus | "ALL"
  >("ALL");

  const [
    updatingId,
    setUpdatingId,
  ] = useState<number | null>(
    null,
  );

  async function fetchBookings() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "haven_token",
        );

      const response =
        await api.get<BookingsResponse>(
          "/api/admin/bookings",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      setBookings(
        response.data.bookings,
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Failed to load admin bookings:",
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
                  "/admin/bookings",
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
        "We couldn't load the bookings.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return bookings.filter(
        (booking) => {
          const matchesStatus =
            statusFilter ===
              "ALL" ||
            booking.status ===
              statusFilter;

          const matchesSearch =
            !query ||
            booking.user.name
              .toLowerCase()
              .includes(query) ||
            booking.user.email
              .toLowerCase()
              .includes(query) ||
            booking.room.name
              .toLowerCase()
              .includes(query) ||
            String(
              booking.id,
            ).includes(query);

          return (
            matchesStatus &&
            matchesSearch
          );
        },
      );
    }, [
      bookings,
      search,
      statusFilter,
    ]);

  async function handleStatusChange(
    bookingId: number,
    status: BookingStatus,
  ) {
    try {
      setUpdatingId(
        bookingId,
      );

      const token =
        localStorage.getItem(
          "haven_token",
        );

      const response =
        await api.patch<UpdateStatusResponse>(
          `/api/admin/bookings/${bookingId}/status`,
          {
            status,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      setBookings(
        (current) =>
          current.map(
            (booking) =>
              booking.id ===
              bookingId
                ? response
                    .data
                    .booking
                : booking,
          ),
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Failed to update booking status:",
        error,
      );

      if (
        axios.isAxiosError(
          error,
        )
      ) {
        window.alert(
          error.response?.data
            ?.message ||
            "Unable to update booking status.",
        );

        return;
      }

      window.alert(
        "Unable to update booking status.",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="min-h-screen bg-[#11120f]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        {/* HEADER */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b5aa91]">
              Reservations
            </p>

            <h1 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#f5f1e8] sm:text-3xl">
              Bookings
            </h1>

            <p className="mt-2 text-sm text-white/35">
              Review and manage
              guest reservations.
            </p>
          </div>

          <button
            type="button"
            onClick={
              fetchBookings
            }
            disabled={
              loading
            }
            className="flex min-h-10 w-fit items-center gap-2 rounded-full border border-white/10 px-4 text-xs text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-40"
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
        </header>

        <div className="my-7 h-px bg-white/[0.07]" />

        {/* CONTROLS */}
        <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
            />

            <input
              type="text"
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Search guest, email, room or booking ID"
              className="h-11 w-full rounded-full border border-white/[0.08] bg-[#171814] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/15"
            />
          </div>

          <div className="relative">
            <select
              value={
                statusFilter
              }
              onChange={(
                event,
              ) =>
                setStatusFilter(
                  event.target
                    .value as
                    | BookingStatus
                    | "ALL",
                )
              }
              className="h-11 appearance-none rounded-full border border-white/[0.08] bg-[#171814] px-4 pr-10 text-xs text-white/60 outline-none"
            >
              <option value="ALL">
                All statuses
              </option>

              {statusOptions.map(
                (status) => (
                  <option
                    key={
                      status
                    }
                    value={
                      status
                    }
                  >
                    {formatStatus(
                      status,
                    )}
                  </option>
                ),
              )}
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
            />
          </div>
        </section>

        {/* RESULTS HEADER */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-white/30">
            {
              filteredBookings.length
            }{" "}
            {filteredBookings.length ===
            1
              ? "booking"
              : "bookings"}
          </p>

          <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
            Admin management
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <BookingsLoading />
        ) : error ? (
          <BookingsError
            message={error}
            onRetry={
              fetchBookings
            }
          />
        ) : filteredBookings.length ===
          0 ? (
          <div className="mt-5 flex min-h-[320px] items-center justify-center rounded-[22px] border border-white/[0.07] bg-[#171814] px-5 text-center">
            <div>
              <CalendarDays
                size={22}
                className="mx-auto text-[#c9b58d]"
              />

              <p className="mt-4 text-lg font-medium">
                No bookings found
              </p>

              <p className="mt-2 text-sm text-white/30">
                Try changing the
                filters or search.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="mt-5 hidden overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#171814] lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-left">
                      <TableHeading>
                        Booking
                      </TableHeading>

                      <TableHeading>
                        Guest
                      </TableHeading>

                      <TableHeading>
                        Room
                      </TableHeading>

                      <TableHeading>
                        Stay
                      </TableHeading>

                      <TableHeading>
                        Guests
                      </TableHeading>

                      <TableHeading>
                        Total
                      </TableHeading>

                      <TableHeading>
                        Status
                      </TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.map(
                      (
                        booking,
                      ) => (
                        <BookingRow
                          key={
                            booking.id
                          }
                          booking={
                            booking
                          }
                          updating={
                            updatingId ===
                            booking.id
                          }
                          onStatusChange={
                            handleStatusChange
                          }
                        />
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE / TABLET */}
            <div className="mt-5 grid gap-3 lg:hidden">
              {filteredBookings.map(
                (
                  booking,
                ) => (
                  <BookingCard
                    key={
                      booking.id
                    }
                    booking={
                      booking
                    }
                    updating={
                      updatingId ===
                      booking.id
                    }
                    onStatusChange={
                      handleStatusChange
                    }
                  />
                ),
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/20">
      {children}
    </th>
  );
}

type BookingRowProps = {
  booking: AdminBooking;
  updating: boolean;
  onStatusChange: (
    id: number,
    status: BookingStatus,
  ) => void;
};

function BookingRow({
  booking,
  updating,
  onStatusChange,
}: BookingRowProps) {
  const StatusIcon =
    getStatusIcon(
      booking.status,
    );

  const canUpdate =
    statusTransitions[
      booking.status
    ].length > 0;

  return (
    <tr className="border-b border-white/[0.05] last:border-b-0">
      <td className="px-5 py-5">
        <div>
          <p className="text-sm font-medium">
            #{booking.id}
          </p>

          <p className="mt-1 text-[10px] text-white/20">
            {formatDate(
              booking.createdAt,
            )}
          </p>
        </div>
      </td>

      <td className="px-5 py-5">
        <p className="text-sm text-white/75">
          {
            booking.user
              .name
          }
        </p>

        <p className="mt-1 text-[10px] text-white/25">
          {
            booking.user
              .email
          }
        </p>
      </td>

      <td className="px-5 py-5">
        <p className="text-sm text-white/65">
          {
            booking.room
              .name
          }
        </p>
      </td>

      <td className="px-5 py-5">
        <p className="text-xs text-white/55">
          {formatDate(
            booking.checkIn,
          )}
        </p>

        <p className="mt-1 text-[10px] text-white/20">
          to{" "}
          {formatDate(
            booking.checkOut,
          )}
        </p>
      </td>

      <td className="px-5 py-5">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Users
            size={13}
          />

          {
            booking.guests
          }
        </div>
      </td>

      <td className="px-5 py-5">
        <p className="text-sm font-medium">
          {formatPrice(
            booking.totalPrice,
          )}
        </p>
      </td>

      <td className="px-5 py-5">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${getStatusClasses(
              booking.status,
            )}`}
          >
            <StatusIcon
              size={11}
            />

            {formatStatus(
              booking.status,
            )}
          </span>

          {canUpdate && (
            <StatusSelect
              value={
                booking.status
              }
              disabled={
                updating
              }
              onChange={(
                status,
              ) =>
                onStatusChange(
                  booking.id,
                  status,
                )
              }
            />
          )}
        </div>
      </td>
    </tr>
  );
}

function BookingCard({
  booking,
  updating,
  onStatusChange,
}: BookingRowProps) {
  const StatusIcon =
    getStatusIcon(
      booking.status,
    );

  const canUpdate =
    statusTransitions[
      booking.status
    ].length > 0;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="rounded-[20px] border border-white/[0.07] bg-[#171814] p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] text-white/25">
            Booking #
            {
              booking.id
            }
          </p>

          <h2 className="mt-1 text-base font-medium">
            {
              booking.user
                .name
            }
          </h2>

          <p className="mt-1 text-[10px] text-white/25">
            {
              booking.user
                .email
            }
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${getStatusClasses(
            booking.status,
          )}`}
        >
          <StatusIcon
            size={11}
          />

          {formatStatus(
            booking.status,
          )}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-white/[0.07] pt-4">
        <Detail
          label="Room"
          value={
            booking.room
              .name
          }
        />

        <Detail
          label="Guests"
          value={String(
            booking.guests,
          )}
        />

        <Detail
          label="Check in"
          value={formatDate(
            booking.checkIn,
          )}
        />

        <Detail
          label="Check out"
          value={formatDate(
            booking.checkOut,
          )}
        />
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/[0.07] pt-4">
        <div>
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/20">
            Total
          </p>

          <p className="mt-1 text-sm font-medium">
            {formatPrice(
              booking.totalPrice,
            )}
          </p>
        </div>

        {canUpdate && (
          <StatusSelect
            value={
              booking.status
            }
            disabled={
              updating
            }
            onChange={(
              status,
            ) =>
              onStatusChange(
                booking.id,
                status,
              )
            }
          />
        )}
      </div>
    </motion.article>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.14em] text-white/20">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-white/55">
        {value}
      </p>
    </div>
  );
}

function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: BookingStatus;
  disabled: boolean;
  onChange: (
    value: BookingStatus,
  ) => void;
}) {
  const options =
    statusTransitions[value];

  const isLocked =
    options.length === 0;

  return (
    <div className="relative">
      <select
        value=""
        disabled={
          disabled ||
          isLocked
        }
        onChange={(
          event,
        ) => {
          const nextStatus =
            event.target
              .value as BookingStatus;

          if (!nextStatus) {
            return;
          }

          onChange(
            nextStatus,
          );
        }}
        className="h-9 appearance-none rounded-full border border-white/10 bg-[#11120f] pl-3 pr-8 text-[10px] text-white/55 outline-none transition hover:border-white/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <option value="">
          {disabled
            ? "Updating..."
            : "Update status"}
        </option>

        {options.map(
          (status) => (
            <option
              key={
                status
              }
              value={
                status
              }
            >
              {formatStatus(
                status,
              )}
            </option>
          ),
        )}
      </select>

      <ChevronDown
        size={12}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/25"
      />
    </div>
  );
}

function BookingsLoading() {
  return (
    <div className="mt-5 space-y-3">
      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="h-[92px] animate-pulse rounded-[20px] bg-white/[0.04]"
          />
        ),
      )}
    </div>
  );
}

function BookingsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mt-5 flex min-h-[320px] items-center justify-center rounded-[22px] border border-white/[0.07] bg-[#171814] px-5 text-center">
      <div>
        <p className="text-lg font-medium">
          Bookings unavailable
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