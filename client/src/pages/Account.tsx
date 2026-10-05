import {
  useEffect,
  useState,
} from "react";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Clock3,
  LogOut,
  Users,
} from "lucide-react";
import axios from "axios";
import {
  Link,
  useNavigate,
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
    imageUrl: string | null;
  };
};

type BookingsResponse = {
  success: boolean;
  count: number;
  bookings: Booking[];
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
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}

function getStatusClasses(
  status: BookingStatus,
) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-400/10 text-emerald-200 border-emerald-400/15";

    case "CHECKED_IN":
      return "bg-sky-400/10 text-sky-200 border-sky-400/15";

    case "CHECKED_OUT":
      return "bg-white/5 text-white/40 border-white/10";

    case "CANCELLED":
      return "bg-red-400/10 text-red-200 border-red-400/15";

    default:
      return "bg-[#c9b58d]/10 text-[#d8c8a7] border-[#c9b58d]/15";
  }
}

export default function Account() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [
    bookings,
    setBookings,
  ] = useState<Booking[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
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
            "/api/bookings/me",
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
          "Failed to load bookings:",
          error,
        );

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          logout();

          navigate(
            "/login",
            {
              replace: true,
            },
          );

          return;
        }

        setError(
          "We couldn't load your bookings right now.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, [logout, navigate]);

  function handleLogout() {
    logout();

    navigate("/", {
      replace: true,
    });
  }

  const upcomingBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
          "PENDING" ||
        booking.status ===
          "CONFIRMED" ||
        booking.status ===
          "CHECKED_IN",
    );

  const pastBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
          "CHECKED_OUT" ||
        booking.status ===
          "CANCELLED",
    );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#151613] text-[#f5f1e8]">
      {/* HERO */}
      <section className="border-b border-white/10 px-5 pb-12 pt-32 sm:px-6 sm:pb-16 sm:pt-36 lg:px-12 lg:pb-20 lg:pt-44">
        <div className="mx-auto w-full max-w-[1400px]">
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
              duration: 0.7,
            }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#b5aa91]">
              Your Haven
            </p>

            <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h1 className="display-font max-w-4xl text-[clamp(3.6rem,10vw,7.5rem)] leading-[0.84] tracking-[-0.065em]">
                  Welcome back,
                  <br />

                  <span className="text-white/30">
                    {user?.name}.
                  </span>
                </h1>

                <p className="mt-6 text-sm text-white/40">
                  {user?.email}
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="flex w-fit items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/55 transition hover:border-white/20 hover:text-white"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="px-5 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto grid w-full max-w-[1400px] gap-3 sm:grid-cols-3">
          <StatCard
            label="Total stays"
            value={bookings.length}
          />

          <StatCard
            label="Upcoming"
            value={
              upcomingBookings.length
            }
          />

          <StatCard
            label="Past stays"
            value={pastBookings.length}
          />
        </div>
      </section>

      {/* BOOKINGS */}
      <section className="px-5 pb-20 pt-6 sm:px-6 sm:pb-24 lg:px-12 lg:pb-32">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#b5aa91]">
                Reservations
              </p>

              <h2 className="display-font mt-3 text-4xl tracking-[-0.045em] sm:text-5xl">
                Your stays.
              </h2>
            </div>

            <Link
              to="/rooms"
              className="group inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              Explore rooms

              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {loading && (
            <BookingsLoading />
          )}

          {!loading && error && (
            <div className="mt-10 rounded-[24px] border border-white/10 bg-white/[0.02] p-6 sm:p-7">
              <p className="text-sm leading-7 text-white/45">
                {error}
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            bookings.length ===
              0 && (
              <EmptyBookings />
            )}

          {!loading &&
            !error &&
            upcomingBookings.length >
              0 && (
              <div className="mt-12">
                <div className="mb-6 flex items-center gap-3">
                  <Clock3
                    size={16}
                    className="text-[#c9b58d]"
                  />

                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                    Upcoming stays
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  {upcomingBookings.map(
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
              </div>
            )}

          {!loading &&
            !error &&
            pastBookings.length >
              0 && (
              <div className="mt-16 border-t border-white/10 pt-12">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  Previous stays
                </p>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  {pastBookings.map(
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
              </div>
            )}
        </div>
      </section>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <div className="rounded-[20px] border border-white/10 bg-white/[0.02] p-5 sm:p-6">
      <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/30">
        {label}
      </p>

      <p className="display-font mt-5 text-4xl tracking-[-0.05em]">
        {String(value).padStart(
          2,
          "0",
        )}
      </p>
    </div>
  );
}

type BookingCardProps = {
  booking: Booking;
  index: number;
};

function BookingCard({
  booking,
  index,
}: BookingCardProps) {
  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.6,
        delay:
          Math.min(
            index * 0.06,
            0.2,
          ),
      }}
      className="overflow-hidden rounded-[24px] border border-white/10 bg-[#1c1d19]"
    >
      <Link
        to={`/bookings/${booking.id}`}
        className="block"
      >
        <div className="relative overflow-hidden">
          <motion.img
            whileHover={{
              scale: 1.025,
            }}
            transition={{
              duration: 0.6,
            }}
            src={
              booking.room.imageUrl ||
              "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=90"
            }
            alt={booking.room.name}
            className="aspect-[16/10] w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

          <span
            className={`absolute right-4 top-4 rounded-full border px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${getStatusClasses(
              booking.status,
            )}`}
          >
            {booking.status.replace(
              "_",
              " ",
            )}
          </span>

          <h3 className="display-font absolute bottom-5 left-5 right-5 text-3xl leading-[0.95] tracking-[-0.04em] sm:text-4xl">
            {booking.room.name}
          </h3>
        </div>

        <div className="p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="flex gap-3">
              <CalendarDays
                size={17}
                className="mt-0.5 shrink-0 text-[#c9b58d]"
              />

              <div>
                <p className="text-sm leading-6">
                  {formatDate(
                    booking.checkIn,
                  )}
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Check in
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <CalendarDays
                size={17}
                className="mt-0.5 shrink-0 text-[#c9b58d]"
              />

              <div>
                <p className="text-sm leading-6">
                  {formatDate(
                    booking.checkOut,
                  )}
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Check out
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-5 border-t border-white/10 pt-5">
            <div className="flex items-center gap-2 text-xs text-white/40">
              <Users size={14} />

              {booking.guests}{" "}
              {booking.guests === 1
                ? "guest"
                : "guests"}
            </div>

            <div className="text-right">
              <p className="text-[9px] uppercase tracking-[0.16em] text-white/30">
                Total
              </p>

              <p className="mt-1 font-medium">
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

function BookingsLoading() {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2">
      {[1, 2].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-[24px] border border-white/10"
        >
          <div className="aspect-[16/10] animate-pulse bg-white/5" />

          <div className="space-y-4 p-5">
            <div className="h-4 w-1/2 animate-pulse rounded-full bg-white/5" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyBookings() {
  return (
    <div className="mt-10 flex min-h-[340px] flex-col items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.015] px-6 text-center">
      <BedDouble
        size={25}
        className="text-[#c9b58d]"
      />

      <h3 className="display-font mt-5 text-3xl tracking-[-0.04em]">
        No stays yet.
      </h3>

      <p className="mt-3 max-w-sm text-sm leading-7 text-white/40">
        Your reservations will appear
        here once you book a room.
      </p>

      <Link
        to="/rooms"
        className="mt-7 rounded-full bg-[#f5f1e8] px-5 py-3 text-sm font-medium text-[#171714]"
      >
        Find a room
      </Link>
    </div>
  );
}