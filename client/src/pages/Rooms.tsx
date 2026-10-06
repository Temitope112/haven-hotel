import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowDown,
  CalendarDays,
  RefreshCw,
  RotateCcw,
  Users,
} from "lucide-react";
import { useSearchParams } from "react-router";

import RoomCard from "../components/rooms/Roomcard";
import { api } from "../services/api";

import type { Room, RoomsResponse } from "../../../server/src/types/room";

function formatSearchDate(value: string) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function Rooms() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [rooms, setRooms] = useState<Room[]>([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const checkIn = searchParams.get("checkIn") || "";

  const checkOut = searchParams.get("checkOut") || "";

  const guestsFromQuery = Number(searchParams.get("guests")) || 0;

  const hasSearch = Boolean(checkIn && checkOut && guestsFromQuery);

  async function fetchRooms() {
    try {
      setLoading(true);
      setError("");

      const response = await api.get<RoomsResponse>("/api/rooms");

      setRooms(response.data.rooms);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);

      setError("We couldn't load the rooms right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRooms();
  }, []);

  const filteredRooms = useMemo(() => {
    if (!guestsFromQuery) {
      return rooms;
    }

    return rooms.filter((room) => room.capacity >= guestsFromQuery);
  }, [rooms, guestsFromQuery]);

  function clearSearch() {
    setSearchParams({});
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#151613] text-[#f5f1e8]">
      {/* HERO */}
      <section className="relative flex min-h-[620px] items-end overflow-hidden sm:min-h-[680px] lg:min-h-[72svh]">
        <motion.div
          initial={{
            scale: 1.06,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 1.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2200&q=90"
            alt="Haven room interior"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#151613]" />

        <div className="relative z-10 w-full">
          <div className="mx-auto w-full max-w-[1400px] px-5 pb-12 pt-36 sm:px-6 md:pb-16 lg:px-12">
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
              }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-8 bg-white/40" />

              <p className="text-[10px] font-medium uppercase tracking-[0.27em] text-white/55 md:text-xs">
                Rooms & Suites
              </p>
            </motion.div>

            <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-end">
              <motion.h1
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.12,
                  duration: 0.85,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="display-font max-w-5xl text-[clamp(4rem,11vw,9rem)] leading-[0.82] tracking-[-0.075em]"
              >
                Make yourself
                <br />
                <span className="italic text-white/65">at home.</span>
              </motion.h1>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: 0.35,
                  duration: 0.7,
                }}
              >
                <p className="max-w-md text-sm leading-7 text-white/60 md:text-base">
                  Four distinct ways to stay, each built around comfort, calm,
                  and the simple luxury of having enough room.
                </p>

                <a
                  href="#rooms"
                  className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
                >
                  View rooms
                  <ArrowDown size={13} />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-5 py-16 sm:px-6 sm:py-20 md:py-28 lg:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid gap-10 border-b border-white/10 pb-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24 lg:pb-16">
            <p className="text-[10px] font-semibold uppercase tracking-[0.27em] text-[#b5aa91] sm:text-[11px]">
              Find your room
            </p>

            <motion.h2
              initial={{
                opacity: 0,
                y: 25,
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
                duration: 0.75,
              }}
              className="display-font max-w-4xl text-[clamp(2.7rem,5vw,5.3rem)] leading-[0.95] tracking-[-0.055em]"
            >
              Different spaces.
              <span className="text-white/25">
                {" "}
                The same feeling of arriving somewhere considered.
              </span>
            </motion.h2>
          </div>
        </div>
      </section>

      {/* SEARCH SUMMARY */}
      {hasSearch && (
        <section className="px-5 pb-10 sm:px-6 lg:px-12">
          <div className="mx-auto w-full max-w-[1400px]">
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-[22px] border border-white/10 bg-[#1c1d19] p-5 sm:rounded-[26px] sm:p-6"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#b5aa91]">
                    Your search
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/45">
                    Showing rooms that can accommodate your selected number of
                    guests.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                  <div className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-3">
                    <CalendarDays
                      size={15}
                      className="shrink-0 text-[#c9b58d]"
                    />

                    <span className="text-xs text-white/70">
                      {formatSearchDate(checkIn)}
                      {" — "}
                      {formatSearchDate(checkOut)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 rounded-full border border-white/10 px-4 py-3">
                    <Users size={15} className="shrink-0 text-[#c9b58d]" />

                    <span className="text-xs text-white/70">
                      {guestsFromQuery}{" "}
                      {guestsFromQuery === 1 ? "guest" : "guests"}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={clearSearch}
                    className="flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/10 px-4 text-xs text-white/45 transition hover:border-white/20 hover:text-white"
                  >
                    <RotateCcw size={14} />
                    Clear search
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ROOMS */}
      <section id="rooms" className="px-5 pb-24 sm:px-6 md:pb-36 lg:px-12">
        <div className="mx-auto w-full max-w-[1400px]">
          {loading && <RoomsLoadingState />}

          {!loading && error && (
            <RoomsErrorState message={error} onRetry={fetchRooms} />
          )}

          {!loading && !error && filteredRooms.length === 0 && (
            <div className="flex min-h-[360px] flex-col items-center justify-center rounded-[26px] border border-white/10 px-5 text-center">
              <Users size={23} className="text-[#c9b58d]" />

              <h3 className="display-font mt-5 text-3xl tracking-[-0.04em] sm:text-4xl">
                We need a little more room.
              </h3>

              <p className="mt-4 max-w-md text-sm leading-7 text-white/40">
                None of our current rooms can accommodate {guestsFromQuery}{" "}
                {guestsFromQuery === 1 ? "guest" : "guests"} in one room.
              </p>

              <button
                type="button"
                onClick={clearSearch}
                className="mt-7 rounded-full bg-[#f5f1e8] px-5 py-3 text-sm font-medium text-[#171714]"
              >
                View all rooms
              </button>
            </div>
          )}

          {!loading && !error && filteredRooms.length > 0 && (
            <>
              <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs text-white/35">
                    {filteredRooms.length}{" "}
                    {filteredRooms.length === 1 ? "room" : "rooms"}
                  </p>

                  {hasSearch && (
                    <p className="mt-1 text-[10px] text-white/25">
                      Suitable for {guestsFromQuery}{" "}
                      {guestsFromQuery === 1 ? "guest" : "guests"}
                    </p>
                  )}
                </div>

                <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
                  Rates per night
                </p>
              </div>

              <div className="grid gap-x-5 gap-y-16 md:grid-cols-2 lg:gap-x-7 lg:gap-y-20">
                {filteredRooms.map((room, index) => (
                  <RoomCard key={room.id} room={room} index={index} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function RoomsLoadingState() {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      {[1, 2, 3, 4].map((item) => (
        <div key={item}>
          <div className="aspect-[4/5] animate-pulse rounded-[28px] bg-white/5 sm:aspect-[5/4] lg:aspect-[4/5]" />

          <div className="mt-5 space-y-3">
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/5" />

            <div className="h-3 w-full animate-pulse rounded-full bg-white/5" />

            <div className="h-3 w-3/4 animate-pulse rounded-full bg-white/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

type RoomsErrorStateProps = {
  message: string;
  onRetry: () => void;
};

function RoomsErrorState({ message, onRetry }: RoomsErrorStateProps) {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center text-center">
      <p className="display-font text-3xl text-white/80">
        Something went quiet.
      </p>

      <p className="mt-3 max-w-sm text-sm leading-6 text-white/40">{message}</p>

      <button
        type="button"
        onClick={onRetry}
        className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm text-white/70 transition hover:bg-white hover:text-black"
      >
        <RefreshCw size={15} />
        Try again
      </button>
    </div>
  );
}
