import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Check,
  Coffee,
  LoaderCircle,
  Maximize2,
  ShieldCheck,
  Sparkles,
  Tv,
  Users,
  Wifi,
  Wind,
} from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router";
import axios from "axios";

import { api } from "../services/api";
import {
  fallbackRoomGallery,
  roomGallery,
} from "../data/roomGallery";

import type {
  Room,
  RoomResponse,
} from "../types/room";

const amenities = [
  {
    icon: Wifi,
    label: "High-speed Wi-Fi",
  },
  {
    icon: BedDouble,
    label: "Premium king bed",
  },
  {
    icon: Bath,
    label: "Private bathroom",
  },
  {
    icon: Wind,
    label: "Climate control",
  },
  {
    icon: Coffee,
    label: "Coffee & tea",
  },
  {
    icon: Tv,
    label: "Smart TV",
  },
];

type BookingResponse = {
  success: boolean;
  message: string;
  booking?: {
    id: number;
  };
};

function formatPrice(
  price: string | number,
) {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    },
  ).format(Number(price));
}

function formatDateForInput(
  date: Date,
) {
  const year =
    date.getFullYear();

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0");

  const day = String(
    date.getDate(),
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getToday() {
  return formatDateForInput(
    new Date(),
  );
}

function getTomorrow() {
  const date = new Date();

  date.setDate(
    date.getDate() + 1,
  );

  return formatDateForInput(
    date,
  );
}

function getNextDay(
  value: string,
) {
  const date = new Date(
    `${value}T00:00:00`,
  );

  date.setDate(
    date.getDate() + 1,
  );

  return formatDateForInput(
    date,
  );
}

function isValidDateRange(
  checkIn: string,
  checkOut: string,
) {
  if (
    !checkIn ||
    !checkOut
  ) {
    return false;
  }

  const start = new Date(
    `${checkIn}T00:00:00`,
  );

  const end = new Date(
    `${checkOut}T00:00:00`,
  );

  return end > start;
}

export default function RoomDetails() {
  const { id } = useParams();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    searchParams,
    setSearchParams,
  ] = useSearchParams();

  const bookingSectionRef =
    useRef<HTMLDivElement | null>(
      null,
    );

  const [room, setRoom] =
    useState<Room | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [checkIn, setCheckIn] =
    useState("");

  const [checkOut, setCheckOut] =
    useState("");

  const [guests, setGuests] =
    useState(1);

  const [
    bookingLoading,
    setBookingLoading,
  ] = useState(false);

  const [
    bookingError,
    setBookingError,
  ] = useState("");

  const [
    bookingSuccess,
    setBookingSuccess,
  ] = useState("");

  const requestedCheckIn =
    searchParams.get(
      "checkIn",
    ) || "";

  const requestedCheckOut =
    searchParams.get(
      "checkOut",
    ) || "";

  const requestedGuests =
    Number(
      searchParams.get(
        "guests",
      ),
    ) || 0;

  async function fetchRoom() {
    try {
      setLoading(true);
      setError("");

      const response =
        await api.get<RoomResponse>(
          `/api/rooms/${id}`,
        );

      setRoom(
        response.data.room,
      );
    } catch (error) {
      console.error(
        "Failed to fetch room:",
        error,
      );

      setError(
        "We couldn't find this room right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRoom();
  }, [id]);

  /*
    Prefill booking state using the values
    that came from the homepage/rooms page.
  */
  useEffect(() => {
    if (!room) {
      return;
    }

    const today =
      getToday();

    if (
      requestedCheckIn &&
      requestedCheckIn >= today
    ) {
      setCheckIn(
        requestedCheckIn,
      );
    }

    if (
      requestedCheckIn &&
      requestedCheckOut &&
      requestedCheckIn >= today &&
      isValidDateRange(
        requestedCheckIn,
        requestedCheckOut,
      )
    ) {
      setCheckOut(
        requestedCheckOut,
      );
    }

    if (
      requestedGuests >= 1 &&
      requestedGuests <=
        room.capacity
    ) {
      setGuests(
        requestedGuests,
      );
    }
  }, [
    room,
    requestedCheckIn,
    requestedCheckOut,
    requestedGuests,
  ]);

  const numberOfNights =
    useMemo(() => {
      if (
        !checkIn ||
        !checkOut
      ) {
        return 0;
      }

      const start =
        new Date(
          `${checkIn}T00:00:00`,
        );

      const end =
        new Date(
          `${checkOut}T00:00:00`,
        );

      const difference =
        end.getTime() -
        start.getTime();

      if (
        difference <= 0
      ) {
        return 0;
      }

      return Math.ceil(
        difference /
          (1000 *
            60 *
            60 *
            24),
      );
    }, [
      checkIn,
      checkOut,
    ]);

  const estimatedTotal =
    useMemo(() => {
      if (
        !room ||
        numberOfNights === 0
      ) {
        return 0;
      }

      return (
        Number(room.price) *
        numberOfNights
      );
    }, [
      room,
      numberOfNights,
    ]);

  function updateSearch(
    values: {
      checkIn?: string;
      checkOut?: string;
      guests?: number;
    },
  ) {
    const next =
      new URLSearchParams(
        searchParams,
      );

    if (
      values.checkIn !==
      undefined
    ) {
      if (values.checkIn) {
        next.set(
          "checkIn",
          values.checkIn,
        );
      } else {
        next.delete(
          "checkIn",
        );
      }
    }

    if (
      values.checkOut !==
      undefined
    ) {
      if (values.checkOut) {
        next.set(
          "checkOut",
          values.checkOut,
        );
      } else {
        next.delete(
          "checkOut",
        );
      }
    }

    if (
      values.guests !==
      undefined
    ) {
      next.set(
        "guests",
        String(
          values.guests,
        ),
      );
    }

    setSearchParams(next, {
      replace: true,
    });
  }

  function handleCheckInChange(
    value: string,
  ) {
    setCheckIn(value);
    setBookingError("");
    setBookingSuccess("");

    let nextCheckOut =
      checkOut;

    if (
      checkOut &&
      new Date(
        `${checkOut}T00:00:00`,
      ) <=
        new Date(
          `${value}T00:00:00`,
        )
    ) {
      nextCheckOut = "";
      setCheckOut("");
    }

    updateSearch({
      checkIn: value,
      checkOut:
        nextCheckOut,
    });
  }

  function handleCheckOutChange(
    value: string,
  ) {
    setCheckOut(value);
    setBookingError("");
    setBookingSuccess("");

    updateSearch({
      checkOut: value,
    });
  }

  function handleGuestsChange(
    value: number,
  ) {
    setGuests(value);
    setBookingError("");
    setBookingSuccess("");

    updateSearch({
      guests: value,
    });
  }

  async function handleBooking() {
    if (!room) {
      return;
    }

    setBookingError("");
    setBookingSuccess("");

    if (
      !checkIn ||
      !checkOut
    ) {
      setBookingError(
        "Select your check-in and check-out dates.",
      );

      return;
    }

    if (
      numberOfNights <= 0
    ) {
      setBookingError(
        "Check-out must be after check-in.",
      );

      return;
    }

    const token =
      localStorage.getItem(
        "haven_token",
      );

    if (!token) {
      navigate("/login", {
        state: {
          from:
            `${location.pathname}${location.search}`,
        },
      });

      return;
    }

    try {
      setBookingLoading(true);

      const response =
        await api.post<BookingResponse>(
          "/api/bookings",
          {
            roomId: room.id,
            checkIn,
            checkOut,
            guests,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      setBookingSuccess(
        response.data
          .message ||
          "Booking created successfully.",
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Booking failed:",
        error,
      );

      if (
        axios.isAxiosError(
          error,
        )
      ) {
        setBookingError(
          error.response?.data
            ?.message ||
            "We couldn't complete your booking.",
        );
      } else {
        setBookingError(
          "We couldn't complete your booking.",
        );
      }
    } finally {
      setBookingLoading(
        false,
      );
    }
  }

  function scrollToBooking() {
    bookingSectionRef.current
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }

  if (loading) {
    return (
      <RoomDetailsLoading />
    );
  }

  if (
    error ||
    !room
  ) {
    return (
      <RoomDetailsError
        message={error}
        onRetry={fetchRoom}
      />
    );
  }

  const gallery =
    roomGallery[room.id] ||
    fallbackRoomGallery;

  const heroImage =
    gallery[0] ||
    room.imageUrl ||
    fallbackRoomGallery[0];

  const detailImageOne =
    gallery[1] ||
    room.imageUrl ||
    fallbackRoomGallery[1];

  const detailImageTwo =
    gallery[2] ||
    room.imageUrl ||
    fallbackRoomGallery[2];

  const roomsBackLink =
    location.search
      ? `/rooms${location.search}`
      : "/rooms";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#151613] text-[#f5f1e8]">
      {/* HERO */}
      <section className="relative min-h-[560px] w-full overflow-hidden sm:min-h-[640px] lg:min-h-[82svh]">
        <motion.div
          initial={{
            scale: 1.03,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 1.5,
            ease: [
              0.22,
              1,
              0.36,
              1,
            ],
          }}
          className="absolute inset-0"
        >
          <img
            src={heroImage}
            alt={`${room.name} interior`}
            className="h-full w-full object-cover object-center"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/15 to-[#151613]" />

        <div className="relative z-10 flex min-h-[560px] items-end sm:min-h-[640px] lg:min-h-[82svh]">
          <div className="w-full px-5 pb-10 pt-32 sm:px-6 sm:pb-12 md:px-8 lg:px-12 lg:pb-16">
            <Link
              to={
                roomsBackLink
              }
              className="inline-flex min-h-10 items-center gap-2 text-[11px] text-white/60 transition hover:text-white"
            >
              <ArrowLeft
                size={13}
              />

              Rooms & Suites
            </Link>

            <div className="mt-6">
              <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/45">
                Room{" "}
                {String(
                  room.id,
                ).padStart(
                  2,
                  "0",
                )}
              </p>

              <h1 className="display-font mt-3 max-w-[320px] break-words text-[clamp(3rem,13vw,4.4rem)] leading-[0.85] tracking-[-0.055em] sm:max-w-[520px] sm:text-[clamp(4rem,10vw,6rem)] lg:max-w-5xl lg:text-[clamp(5rem,8vw,8rem)]">
                {room.name}
              </h1>

              <div className="mt-6 lg:absolute lg:bottom-16 lg:right-12 lg:mt-0 lg:text-right">
                <p className="text-xl font-medium sm:text-2xl">
                  {formatPrice(
                    room.price,
                  )}
                </p>

                <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-white/35">
                  per night
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="w-full overflow-hidden py-12 sm:py-16 lg:py-24">
        <div className="mx-auto w-full max-w-[1400px] px-5 sm:px-6 md:px-8 lg:px-12">
          <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14 xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-20">
            {/* LEFT */}
            <div className="min-w-0">
              {/* DESCRIPTION */}
              <div className="border-b border-white/10 pb-10">
                <motion.p
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.7,
                  }}
                  className="display-font max-w-3xl break-words text-[clamp(1.9rem,7.5vw,3rem)] leading-[1.03] tracking-[-0.04em] text-white/90"
                >
                  {
                    room.description
                  }
                </motion.p>

                <div className="mt-8 grid grid-cols-2 gap-4 sm:max-w-md">
                  <div className="border-t border-white/10 pt-4">
                    <Users
                      size={17}
                      className="text-[#c9b58d]"
                    />

                    <p className="mt-3 text-xs leading-5 text-white/45">
                      Up to{" "}
                      {
                        room.capacity
                      }{" "}
                      {room.capacity ===
                      1
                        ? "guest"
                        : "guests"}
                    </p>
                  </div>

                  <div className="border-t border-white/10 pt-4">
                    <Maximize2
                      size={17}
                      className="text-[#c9b58d]"
                    />

                    <p className="mt-3 text-xs leading-5 text-white/45">
                      Generous
                      space
                    </p>
                  </div>
                </div>
              </div>

              {/* AMENITIES */}
              <div className="py-10 sm:py-12">
                <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#b5aa91] sm:text-[10px]">
                  In your room
                </p>

                <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-7 sm:grid-cols-3 sm:gap-x-7">
                  {amenities.map(
                    (
                      amenity,
                      index,
                    ) => {
                      const Icon =
                        amenity.icon;

                      return (
                        <motion.div
                          key={
                            amenity.label
                          }
                          initial={{
                            opacity: 0,
                            y: 14,
                          }}
                          whileInView={{
                            opacity: 1,
                            y: 0,
                          }}
                          viewport={{
                            once: true,
                            amount: 0.3,
                          }}
                          transition={{
                            duration:
                              0.45,
                            delay:
                              index *
                              0.04,
                          }}
                          className="min-w-0 border-t border-white/10 pt-4"
                        >
                          <Icon
                            size={
                              18
                            }
                            className="text-[#c9b58d]"
                          />

                          <p className="mt-3 break-words text-xs leading-5 text-white/50 sm:text-sm">
                            {
                              amenity.label
                            }
                          </p>
                        </motion.div>
                      );
                    },
                  )}
                </div>
              </div>

              {/* GALLERY */}
              <section className="border-t border-white/10 pt-10 sm:pt-12">
                <div className="mb-7">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#b5aa91] sm:text-[10px]">
                    Inside the room
                  </p>

                  <h2 className="display-font mt-3 text-3xl tracking-[-0.045em] sm:text-4xl">
                    A closer
                    look.
                  </h2>

                  <p className="mt-4 max-w-md text-xs leading-6 text-white/35">
                    Details selected
                    to make the room
                    feel considered
                    from every angle.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.7,
                    }}
                    className="overflow-hidden rounded-[22px] sm:rounded-[26px]"
                  >
                    <motion.img
                      whileHover={{
                        scale: 1.025,
                      }}
                      transition={{
                        duration: 0.6,
                      }}
                      src={
                        detailImageOne
                      }
                      alt={`${room.name} detail`}
                      className="aspect-[4/3] w-full object-cover md:aspect-[4/5]"
                    />
                  </motion.div>

                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 24,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.2,
                    }}
                    transition={{
                      duration: 0.7,
                      delay: 0.06,
                    }}
                    className="overflow-hidden rounded-[22px] sm:rounded-[26px]"
                  >
                    <motion.img
                      whileHover={{
                        scale: 1.025,
                      }}
                      transition={{
                        duration: 0.6,
                      }}
                      src={
                        detailImageTwo
                      }
                      alt={`${room.name} second detail`}
                      className="aspect-[4/3] w-full object-cover md:aspect-[4/5]"
                    />
                  </motion.div>
                </div>
              </section>

              {/* EXPERIENCE */}
              <section className="mt-12 border-t border-white/10 pt-10 sm:mt-16 sm:pt-12">
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 24,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.25,
                  }}
                  transition={{
                    duration: 0.7,
                  }}
                  className="flex min-h-[300px] flex-col justify-between rounded-[22px] bg-[#4d5545] p-6 sm:min-h-[360px] sm:rounded-[26px] sm:p-8 md:p-10"
                >
                  <Sparkles
                    size={20}
                    className="text-white/60"
                  />

                  <div className="mt-16 sm:mt-20">
                    <h2 className="display-font max-w-xl text-[clamp(2.4rem,8vw,4.2rem)] leading-[0.94] tracking-[-0.05em]">
                      Made for the
                      hours you
                      don't plan.
                    </h2>

                    <p className="mt-6 max-w-lg text-sm leading-7 text-white/55">
                      Morning coffee
                      in bed. An
                      afternoon with
                      the curtains
                      drawn. One more
                      chapter before
                      dinner. This room
                      is designed
                      around the time
                      that belongs only
                      to you.
                    </p>
                  </div>
                </motion.div>
              </section>
            </div>

            {/* BOOKING */}
            <aside
              ref={
                bookingSectionRef
              }
              className="min-w-0 scroll-mt-28 lg:relative"
            >
              <div className="lg:sticky lg:top-28">
                <div className="w-full min-w-0 rounded-[22px] border border-white/10 bg-[#1c1d19] p-4 shadow-[0_25px_80px_rgba(0,0,0,0.18)] sm:rounded-[26px] sm:p-6">
                  <div className="flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
                    <div className="min-w-0">
                      <p className="text-xl font-medium sm:text-2xl">
                        {formatPrice(
                          room.price,
                        )}
                      </p>

                      <p className="mt-1 text-xs text-white/35">
                        per night
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2 text-[11px] text-white/40">
                      <ShieldCheck
                        size={15}
                      />

                      Secure booking
                    </div>
                  </div>

                  {/* SEARCH PREFILL NOTICE */}
                  {requestedCheckIn &&
                    requestedCheckOut && (
                      <div className="mt-5 rounded-[15px] border border-[#c9b58d]/15 bg-[#c9b58d]/5 px-4 py-3 text-xs leading-5 text-[#d8c8a7]">
                        Your selected
                        dates have been
                        carried over.
                        You can adjust
                        them below.
                      </div>
                    )}

                  {/* DATES */}
                  <div className="mt-5 grid gap-3 xl:grid-cols-2">
                    <label className="min-w-0 overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.025] px-4 py-4">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                        Check in
                      </span>

                      <input
                        type="date"
                        value={
                          checkIn
                        }
                        min={
                          getToday()
                        }
                        onChange={(
                          event,
                        ) =>
                          handleCheckInChange(
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-2 block w-full min-w-0 max-w-full bg-transparent text-base text-white outline-none [color-scheme:dark]"
                      />
                    </label>

                    <label className="min-w-0 overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.025] px-4 py-4">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                        Check out
                      </span>

                      <input
                        type="date"
                        value={
                          checkOut
                        }
                        min={
                          checkIn
                            ? getNextDay(
                                checkIn,
                              )
                            : getTomorrow()
                        }
                        onChange={(
                          event,
                        ) =>
                          handleCheckOutChange(
                            event
                              .target
                              .value,
                          )
                        }
                        className="mt-2 block w-full min-w-0 max-w-full bg-transparent text-base text-white outline-none [color-scheme:dark]"
                      />
                    </label>
                  </div>

                  {/* GUESTS */}
                  <label className="mt-3 block min-w-0 overflow-hidden rounded-[16px] border border-white/10 bg-white/[0.025] px-4 py-4">
                    <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      Guests
                    </span>

                    <select
                      value={
                        guests
                      }
                      onChange={(
                        event,
                      ) =>
                        handleGuestsChange(
                          Number(
                            event
                              .target
                              .value,
                          ),
                        )
                      }
                      className="mt-2 block w-full min-w-0 max-w-full bg-transparent text-base text-white outline-none [&>option]:text-black"
                    >
                      {Array.from(
                        {
                          length:
                            room.capacity,
                        },
                        (
                          _,
                          index,
                        ) =>
                          index + 1,
                      ).map(
                        (
                          count,
                        ) => (
                          <option
                            key={
                              count
                            }
                            value={
                              count
                            }
                          >
                            {
                              count
                            }{" "}
                            {count ===
                            1
                              ? "Guest"
                              : "Guests"}
                          </option>
                        ),
                      )}
                    </select>
                  </label>

                  {/* PRICE */}
                  {numberOfNights >
                    0 && (
                    <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
                      <div className="flex flex-wrap justify-between gap-3 text-white/45">
                        <span className="break-words">
                          {formatPrice(
                            room.price,
                          )}{" "}
                          ×{" "}
                          {
                            numberOfNights
                          }{" "}
                          {numberOfNights ===
                          1
                            ? "night"
                            : "nights"}
                        </span>

                        <span className="shrink-0">
                          {formatPrice(
                            estimatedTotal,
                          )}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-4 border-t border-white/10 pt-4">
                        <span className="font-medium">
                          Total
                        </span>

                        <span className="text-base font-medium sm:text-lg">
                          {formatPrice(
                            estimatedTotal,
                          )}
                        </span>
                      </div>
                    </div>
                  )}

                  {bookingError && (
                    <div className="mt-5 break-words rounded-[16px] border border-red-400/15 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200">
                      {
                        bookingError
                      }
                    </div>
                  )}

                  {bookingSuccess && (
                    <div className="mt-5 flex gap-3 rounded-[16px] border border-emerald-400/15 bg-emerald-400/5 px-4 py-3 text-sm leading-6 text-emerald-100">
                      <Check
                        size={17}
                        className="mt-0.5 shrink-0"
                      />

                      <span className="break-words">
                        {
                          bookingSuccess
                        }
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    disabled={
                      bookingLoading
                    }
                    onClick={
                      handleBooking
                    }
                    className="group mt-6 flex min-h-14 w-full items-center justify-between gap-4 rounded-full bg-[#f5f1e8] px-5 text-sm font-medium text-[#171714] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="truncate">
                      {bookingLoading
                        ? "Booking..."
                        : "Reserve this room"}
                    </span>

                    {bookingLoading ? (
                      <LoaderCircle
                        size={17}
                        className="shrink-0 animate-spin"
                      />
                    ) : (
                      <ArrowRight
                        size={17}
                        className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                      />
                    )}
                  </button>

                  <p className="mt-4 px-2 text-center text-[10px] leading-5 text-white/30">
                    Your room is only
                    reserved after the
                    booking has been
                    successfully
                    confirmed.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* MOBILE BOTTOM BAR */}
      <div className="fixed inset-x-0 bottom-0 z-40 w-full border-t border-white/10 bg-[#151613]/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl lg:hidden">
        <div className="mx-auto flex w-full items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              {formatPrice(
                room.price,
              )}
            </p>

            {numberOfNights > 0 ? (
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/30">
                {numberOfNights}{" "}
                {numberOfNights ===
                1
                  ? "night"
                  : "nights"}{" "}
                ·{" "}
                {formatPrice(
                  estimatedTotal,
                )}
              </p>
            ) : (
              <p className="mt-0.5 text-[9px] uppercase tracking-[0.14em] text-white/30">
                per night
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={
              scrollToBooking
            }
            className="min-h-11 shrink-0 rounded-full bg-[#f5f1e8] px-5 text-sm font-medium text-[#171714]"
          >
            {numberOfNights > 0
              ? "Reserve"
              : "Check dates"}
          </button>
        </div>
      </div>

      <div className="h-20 lg:hidden" />
    </div>
  );
}

function RoomDetailsLoading() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#151613] text-white">
      <div className="h-[560px] animate-pulse bg-white/5 sm:h-[640px] lg:h-[78svh]" />

      <div className="mx-auto w-full max-w-[1400px] px-5 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="h-9 w-3/4 max-w-lg animate-pulse rounded-full bg-white/5" />

            <div className="mt-6 h-4 w-full animate-pulse rounded-full bg-white/5" />

            <div className="mt-3 h-4 w-4/5 animate-pulse rounded-full bg-white/5" />

            <div className="mt-10 grid gap-4 md:grid-cols-2">
              <div className="aspect-[4/3] animate-pulse rounded-[22px] bg-white/5" />

              <div className="aspect-[4/3] animate-pulse rounded-[22px] bg-white/5" />
            </div>
          </div>

          <div className="h-[390px] w-full animate-pulse rounded-[22px] bg-white/5" />
        </div>
      </div>
    </div>
  );
}

type RoomDetailsErrorProps = {
  message: string;
  onRetry: () => void;
};

function RoomDetailsError({
  message,
  onRetry,
}: RoomDetailsErrorProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center overflow-x-hidden bg-[#151613] px-5 text-center text-white">
      <div className="max-w-xl">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
          Haven
        </p>

        <h1 className="display-font mt-4 break-words text-[clamp(2.5rem,10vw,4rem)] leading-[0.95] tracking-[-0.05em]">
          This room seems to have disappeared.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-white/40">
          {message}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={onRetry}
            className="min-h-11 rounded-full bg-white px-5 py-3 text-sm text-black"
          >
            Try again
          </button>

          <Link
            to="/rooms"
            className="flex min-h-11 items-center rounded-full border border-white/15 px-5 py-3 text-sm text-white/65"
          >
            View all rooms
          </Link>
        </div>
      </div>
    </div>
  );
}