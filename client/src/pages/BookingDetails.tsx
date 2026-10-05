import {
  useEffect,
  useState,
} from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";
import axios from "axios";
import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

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
    description?: string;
    imageUrl: string | null;
  };
};

type BookingResponse = {
  success: boolean;
  booking: Booking;
};

type CancelBookingResponse = {
  success: boolean;
  message: string;
  booking?: Booking;
};

function formatPrice(
  price: string | number,
) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(Number(price));
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date(value));
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

function getStatusIcon(
  status: BookingStatus,
) {
  switch (status) {
    case "CONFIRMED":
      return CheckCircle2;

    case "CANCELLED":
      return XCircle;

    case "CHECKED_IN":
      return ShieldCheck;

    default:
      return Clock3;
  }
}

export default function BookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { logout } = useAuth();

  const [booking, setBooking] =
    useState<Booking | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [
    cancelling,
    setCancelling,
  ] = useState(false);

  const [
    cancelError,
    setCancelError,
  ] = useState("");

  const [
    cancelSuccess,
    setCancelSuccess,
  ] = useState("");

  async function fetchBooking() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "haven_token",
        );

      const response =
        await api.get<BookingResponse>(
          `/api/bookings/${id}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      setBooking(
        response.data.booking,
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Failed to load booking:",
        error,
      );

      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        logout();

        navigate("/login", {
          replace: true,
          state: {
            from: `/bookings/${id}`,
          },
        });

        return;
      }

      setError(
        "We couldn't load this reservation.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBooking();
  }, [id]);

  async function handleCancel() {
    if (!booking) {
      return;
    }

    setCancelError("");
    setCancelSuccess("");

    try {
      setCancelling(true);

      const token =
        localStorage.getItem(
          "haven_token",
        );

      const response =
        await api.patch<CancelBookingResponse>(
          `/api/bookings/${booking.id}/cancel`,
          {},
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      setCancelSuccess(
        response.data.message ||
          "Booking cancelled successfully.",
      );

      setBooking((current) =>
        current
          ? {
              ...current,
              status:
                "CANCELLED",
            }
          : current,
      );
    } catch (
      error: unknown
    ) {
      if (
        axios.isAxiosError(error)
      ) {
        setCancelError(
          error.response?.data
            ?.message ||
            "We couldn't cancel this booking.",
        );
      } else {
        setCancelError(
          "We couldn't cancel this booking.",
        );
      }
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <BookingDetailsLoading />
    );
  }

  if (
    error ||
    !booking
  ) {
    return (
      <BookingDetailsError
        message={error}
      />
    );
  }

  const StatusIcon =
    getStatusIcon(
      booking.status,
    );

  const canCancel =
    booking.status ===
      "PENDING" ||
    booking.status ===
      "CONFIRMED";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#151613] text-[#f5f1e8]">
      {/* HERO */}
      <section className="relative min-h-[470px] overflow-hidden sm:min-h-[540px]">
        <img
          src={
            booking.room
              .imageUrl ||
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1600&q=90"
          }
          alt={
            booking.room.name
          }
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-[#151613]" />

        <div className="relative z-10 flex min-h-[470px] items-end px-5 pb-10 pt-32 sm:min-h-[540px] sm:px-6 sm:pb-14 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <Link
              to="/account"
              className="inline-flex items-center gap-2 text-xs text-white/55 transition hover:text-white"
            >
              <ArrowLeft
                size={14}
              />

              Back to account
            </Link>

            <div className="mt-7 flex flex-wrap items-end justify-between gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
                  Reservation #
                  {
                    booking.id
                  }
                </p>

                <h1 className="display-font mt-3 max-w-3xl text-[clamp(3.2rem,11vw,6.5rem)] leading-[0.88] tracking-[-0.06em]">
                  {
                    booking
                      .room.name
                  }
                </h1>
              </div>

              <div
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.15em] ${getStatusClasses(
                  booking.status,
                )}`}
              >
                <StatusIcon
                  size={14}
                />

                {booking.status.replace(
                  "_",
                  " ",
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-5 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px]">
          {/* LEFT */}
          <div className="min-w-0">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-[24px] border border-white/10 bg-white/[0.02] p-5 sm:p-7"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#b5aa91]">
                Stay details
              </p>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <DetailItem
                  icon={
                    CalendarDays
                  }
                  label="Check in"
                  value={formatDate(
                    booking.checkIn,
                  )}
                />

                <DetailItem
                  icon={
                    CalendarDays
                  }
                  label="Check out"
                  value={formatDate(
                    booking.checkOut,
                  )}
                />

                <DetailItem
                  icon={Users}
                  label="Guests"
                  value={`${booking.guests} ${
                    booking.guests ===
                    1
                      ? "guest"
                      : "guests"
                  }`}
                />

                <DetailItem
                  icon={
                    ShieldCheck
                  }
                  label="Booking status"
                  value={booking.status.replace(
                    "_",
                    " ",
                  )}
                />
              </div>
            </motion.div>

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
                delay: 0.08,
              }}
              className="mt-5 rounded-[24px] bg-[#4d5545] p-6 sm:p-8"
            >
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">
                Before you arrive
              </p>

              <h2 className="display-font mt-4 max-w-2xl text-[clamp(2.6rem,8vw,4rem)] leading-[0.95] tracking-[-0.05em]">
                Everything ready,
                before you step
                through the door.
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-white/55">
                Your reservation is
                attached to your
                account. Keep this page
                handy for your stay
                dates, booking status
                and room information.
              </p>
            </motion.div>
          </div>

          {/* SUMMARY */}
          <aside className="min-w-0">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-[24px] border border-white/10 bg-[#1c1d19] p-5 sm:p-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/35">
                  Reservation summary
                </p>

                <div className="mt-6 border-b border-white/10 pb-6">
                  <p className="text-sm text-white/40">
                    Room
                  </p>

                  <p className="display-font mt-2 text-3xl tracking-[-0.04em]">
                    {
                      booking
                        .room.name
                    }
                  </p>
                </div>

                <div className="space-y-4 py-6 text-sm">
                  <div className="flex justify-between gap-5">
                    <span className="text-white/40">
                      Check in
                    </span>

                    <span className="text-right">
                      {formatDate(
                        booking.checkIn,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-5">
                    <span className="text-white/40">
                      Check out
                    </span>

                    <span className="text-right">
                      {formatDate(
                        booking.checkOut,
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between gap-5">
                    <span className="text-white/40">
                      Guests
                    </span>

                    <span>
                      {
                        booking.guests
                      }
                    </span>
                  </div>
                </div>

                <div className="flex items-end justify-between gap-5 border-t border-white/10 pt-6">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.18em] text-white/30">
                      Total
                    </p>

                    <p className="mt-1 text-xl font-medium">
                      {formatPrice(
                        booking.totalPrice,
                      )}
                    </p>
                  </div>

                  <ShieldCheck
                    size={20}
                    className="text-[#c9b58d]"
                  />
                </div>

                {cancelSuccess && (
                  <div className="mt-5 rounded-[16px] border border-emerald-400/15 bg-emerald-400/5 px-4 py-3 text-sm leading-6 text-emerald-100">
                    {
                      cancelSuccess
                    }
                  </div>
                )}

                {cancelError && (
                  <div className="mt-5 rounded-[16px] border border-red-400/15 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">
                    {
                      cancelError
                    }
                  </div>
                )}

                {canCancel ? (
                  <button
                    type="button"
                    onClick={
                      handleCancel
                    }
                    disabled={
                      cancelling
                    }
                    className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-red-400/20 text-sm text-red-200 transition hover:bg-red-400/5 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {cancelling ? (
                      <>
                        <LoaderCircle
                          size={16}
                          className="animate-spin"
                        />

                        Cancelling...
                      </>
                    ) : (
                      <>
                        <XCircle
                          size={16}
                        />

                        Cancel booking
                      </>
                    )}
                  </button>
                ) : (
                  <div className="mt-6 rounded-[16px] border border-white/10 bg-white/[0.025] px-4 py-3 text-center text-xs leading-6 text-white/35">
                    This reservation
                    can no longer be
                    cancelled.
                  </div>
                )}

                <Link
                  to={`/rooms/${booking.room.id}`}
                  className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full bg-[#f5f1e8] px-5 text-sm font-medium text-[#171714]"
                >
                  View room
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

type DetailItemProps = {
  icon: typeof CalendarDays;
  label: string;
  value: string;
};

function DetailItem({
  icon: Icon,
  label,
  value,
}: DetailItemProps) {
  return (
    <div className="border-t border-white/10 pt-5">
      <Icon
        size={17}
        className="text-[#c9b58d]"
      />

      <p className="mt-4 text-[9px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </p>

      <p className="mt-2 text-sm leading-6 text-white/80">
        {value}
      </p>
    </div>
  );
}

function BookingDetailsLoading() {
  return (
    <div className="min-h-screen bg-[#151613] text-white">
      <div className="h-[470px] animate-pulse bg-white/5 sm:h-[540px]" />

      <div className="mx-auto grid w-full max-w-[1400px] gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:px-12">
        <div className="h-[350px] animate-pulse rounded-[24px] bg-white/5" />

        <div className="h-[420px] animate-pulse rounded-[24px] bg-white/5" />
      </div>
    </div>
  );
}

type BookingDetailsErrorProps = {
  message: string;
};

function BookingDetailsError({
  message,
}: BookingDetailsErrorProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#151613] px-5 text-center text-white">
      <div className="max-w-md">
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
          Haven
        </p>

        <h1 className="display-font mt-4 text-4xl tracking-[-0.05em]">
          Reservation unavailable.
        </h1>

        <p className="mt-4 text-sm leading-7 text-white/40">
          {message}
        </p>

        <Link
          to="/account"
          className="mt-7 inline-flex min-h-11 items-center rounded-full bg-white px-5 text-sm text-black"
        >
          Back to account
        </Link>
      </div>
    </div>
  );
}