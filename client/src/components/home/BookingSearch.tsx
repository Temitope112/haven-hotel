import { useState } from "react";
import type { SubmitEvent } from "react";

import {
  ArrowRight,
  CalendarDays,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

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

export default function BookingSearch() {
  const navigate =
    useNavigate();

  const [
    checkIn,
    setCheckIn,
  ] = useState("");

  const [
    checkOut,
    setCheckOut,
  ] = useState("");

  const [
    guests,
    setGuests,
  ] = useState(2);

  const [
    error,
    setError,
  ] = useState("");

  const formComplete =
    checkIn !== "" &&
    checkOut !== "";

  function handleCheckInChange(
    value: string,
  ) {
    setCheckIn(value);
    setError("");

    if (!value) {
      return;
    }

    if (
      checkOut &&
      new Date(
        `${checkOut}T00:00:00`,
      ) <=
        new Date(
          `${value}T00:00:00`,
        )
    ) {
      setCheckOut("");
    }
  }

  function handleCheckOutChange(
    value: string,
  ) {
    setCheckOut(value);
    setError("");
  }

  function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (
      !checkIn ||
      !checkOut
    ) {
      setError(
        "Choose your check-in and check-out dates.",
      );

      return;
    }

    const start = new Date(
      `${checkIn}T00:00:00`,
    );

    const end = new Date(
      `${checkOut}T00:00:00`,
    );

    if (end <= start) {
      setError(
        "Check-out must be after check-in.",
      );

      return;
    }

    const params =
      new URLSearchParams();

    params.set(
      "checkIn",
      checkIn,
    );

    params.set(
      "checkOut",
      checkOut,
    );

    params.set(
      "guests",
      String(guests),
    );

    navigate(
      `/rooms?${params.toString()}`,
    );
  }

  return (
    <div className="w-full">
      <motion.form
        onSubmit={
          handleSubmit
        }
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.75,
          duration: 0.7,
          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        }}
        className="w-full rounded-[24px] border border-white/15 bg-black/20 p-2 shadow-[0_25px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:rounded-[28px] md:rounded-full"
      >
        <div className="grid min-w-0 gap-1 md:grid-cols-[1fr_1fr_.75fr_auto] md:items-center">
          {/* CHECK IN */}
          <label className="flex min-h-[70px] min-w-0 items-center gap-3 rounded-[20px] px-4 transition hover:bg-white/[0.07] md:rounded-full md:px-5">
            <CalendarDays
              size={18}
              className="shrink-0 text-white/50"
            />

            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 sm:text-[10px]">
                Check in
              </span>

              <input
                type="date"
                name="checkIn"
                value={checkIn}
                min={getToday()}
                onChange={(
                  event,
                ) =>
                  handleCheckInChange(
                    event.target
                      .value,
                  )
                }
                className="mt-1 block w-full min-w-0 max-w-full bg-transparent text-sm text-white outline-none [color-scheme:dark]"
              />
            </span>
          </label>

          {/* CHECK OUT */}
          <label className="flex min-h-[70px] min-w-0 items-center gap-3 rounded-[20px] px-4 transition hover:bg-white/[0.07] md:rounded-full md:px-5">
            <CalendarDays
              size={18}
              className="shrink-0 text-white/50"
            />

            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 sm:text-[10px]">
                Check out
              </span>

              <input
                type="date"
                name="checkOut"
                value={checkOut}
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
                    event.target
                      .value,
                  )
                }
                className="mt-1 block w-full min-w-0 max-w-full bg-transparent text-sm text-white outline-none [color-scheme:dark]"
              />
            </span>
          </label>

          {/* GUESTS */}
          <label className="flex min-h-[70px] min-w-0 items-center gap-3 rounded-[20px] px-4 transition hover:bg-white/[0.07] md:rounded-full md:px-5">
            <Users
              size={18}
              className="shrink-0 text-white/50"
            />

            <span className="flex min-w-0 flex-1 flex-col">
              <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/40 sm:text-[10px]">
                Guests
              </span>

              <select
                name="guests"
                value={guests}
                onChange={(
                  event,
                ) =>
                  setGuests(
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
                className="mt-1 block w-full min-w-0 bg-transparent text-sm text-white outline-none [&>option]:text-black"
              >
                <option value={1}>
                  1 Guest
                </option>

                <option value={2}>
                  2 Guests
                </option>

                <option value={3}>
                  3 Guests
                </option>

                <option value={4}>
                  4 Guests
                </option>
              </select>
            </span>
          </label>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={
              !formComplete
            }
            className="group flex min-h-[58px] min-w-0 items-center justify-between gap-4 rounded-[20px] bg-[#faf9f6] px-5 text-sm font-medium text-[#171714] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-45 md:size-[62px] md:min-h-0 md:justify-center md:rounded-full md:px-0"
          >
            <span className="md:hidden">
              Check availability
            </span>

            <ArrowRight
              size={18}
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </div>
      </motion.form>

      {error && (
        <motion.p
          initial={{
            opacity: 0,
            y: 6,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="mt-3 px-2 text-xs leading-5 text-red-200"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}