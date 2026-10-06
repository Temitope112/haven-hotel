import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Coffee,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";

import BookingSearch from "../components/home/BookingSearch";
import RoomCard from "../components/rooms/Roomcard";
import { api } from "../services/api";

import type { Room, RoomsResponse } from "../../../server/src/types/room";

const experienceItems = [
  {
    number: "01",
    title: "Slow mornings",
    text: "Wake without an alarm. Stay in bed a little longer. Let breakfast take its time.",
  },
  {
    number: "02",
    title: "Space to disappear",
    text: "Quiet rooms, considered interiors and enough space to temporarily forget the outside world.",
  },
  {
    number: "03",
    title: "Longer evenings",
    text: "Dinner without a deadline. A drink downstairs. Another chapter before sleep.",
  },
];

export default function Home() {
  const [rooms, setRooms] = useState<Room[]>([]);

  const [roomsLoading, setRoomsLoading] = useState(true);

  useEffect(() => {
    async function fetchRooms() {
      try {
        setRoomsLoading(true);

        const response = await api.get<RoomsResponse>("/api/rooms");

        setRooms(response.data.rooms.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch featured rooms:", error);
      } finally {
        setRoomsLoading(false);
      }
    }

    fetchRooms();
  }, []);

  return (
    <div className="w-full overflow-x-hidden bg-[#151613] text-[#f5f1e8]">
      {/* HERO */}
      <section className="relative min-h-[760px] overflow-hidden sm:min-h-[820px] lg:min-h-screen">
        <motion.div
          initial={{
            scale: 1.05,
          }}
          animate={{
            scale: 1,
          }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=2200&q=90"
            alt="Haven hotel interior"
            className="h-full w-full object-cover object-center"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-[#151613]" />

        <div className="relative z-10 flex min-h-[760px] flex-col justify-end px-5 pb-8 pt-32 sm:min-h-[820px] sm:px-6 sm:pb-10 lg:min-h-screen lg:px-12 lg:pb-12">
          <div className="mx-auto w-full max-w-[1400px]">
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
                delay: 0.15,
                duration: 0.7,
              }}
            >
              <p className="text-[9px] font-semibold uppercase tracking-[0.28em] text-white/55 sm:text-[10px]">
                A quieter way to stay
              </p>

              <h1 className="display-font mt-5 max-w-[340px] text-[clamp(4rem,15vw,6rem)] leading-[0.8] tracking-[-0.065em] sm:max-w-[650px] sm:text-[clamp(5rem,12vw,8rem)] lg:max-w-5xl lg:text-[clamp(6rem,9vw,9rem)]">
                Find your way
                <br />
                back to stillness.
              </h1>

              <div className="mt-7 flex flex-col gap-6 sm:mt-8 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-md text-sm leading-7 text-white/55 sm:text-base sm:leading-8">
                  Thoughtful rooms, unhurried mornings and enough quiet to hear
                  yourself again.
                </p>

                <Link
                  to="/rooms"
                  className="group inline-flex w-fit items-center gap-3 text-sm text-white/75 transition hover:text-white"
                >
                  Explore rooms
                  <ArrowUpRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </motion.div>

            {/* BOOKING SEARCH */}
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
                delay: 0.38,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-10 sm:mt-12"
            >
              <BookingSearch />
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="px-5 py-20 sm:px-6 sm:py-28 lg:px-12 lg:py-36">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:gap-20">
            <motion.div
              initial={{
                opacity: 0,
                y: 18,
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
                duration: 0.7,
              }}
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#b5aa91]">
                The Haven feeling
              </p>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                y: 22,
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
                duration: 0.75,
              }}
            >
              <h2 className="display-font max-w-5xl text-[clamp(2.8rem,7vw,5.6rem)] leading-[0.92] tracking-[-0.055em]">
                We made Haven for the moments between everything else.
              </h2>

              <div className="mt-8 grid gap-6 border-t border-white/10 pt-7 sm:grid-cols-2">
                <p className="max-w-md text-sm leading-7 text-white/45">
                  No rushing from check-in to checkout. No unnecessary noise.
                  Just considered spaces that let you settle into your own pace.
                </p>

                <div className="sm:text-right">
                  <Link
                    to="/about"
                    className="group inline-flex items-center gap-2 text-sm text-white/65 transition hover:text-white"
                  >
                    Our story
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CINEMATIC IMAGE */}
      <section className="px-5 sm:px-6 lg:px-12">
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.15,
          }}
          transition={{
            duration: 0.85,
          }}
          className="mx-auto w-full max-w-[1400px] overflow-hidden rounded-[24px] sm:rounded-[30px]"
        >
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2200&q=90"
            alt="Quiet Haven interior"
            className="aspect-[4/5] w-full object-cover sm:aspect-[16/10] lg:aspect-[16/8]"
          />
        </motion.div>
      </section>

      {/* FEATURED ROOMS */}
      <section className="px-5 py-20 sm:px-6 sm:py-28 lg:px-12 lg:py-36">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="flex flex-col gap-7 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#b5aa91]">
                Rooms & suites
              </p>

              <h2 className="display-font mt-4 text-[clamp(3rem,8vw,5.8rem)] leading-[0.9] tracking-[-0.055em]">
                Choose your quiet.
              </h2>
            </div>

            <Link
              to="/rooms"
              className="group inline-flex w-fit items-center gap-2 text-sm text-white/50 transition hover:text-white"
            >
              View all rooms
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>

          {roomsLoading ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-[24px] border border-white/10"
                >
                  <div className="aspect-[4/5] animate-pulse bg-white/5" />

                  <div className="space-y-3 p-5">
                    <div className="h-4 w-2/3 animate-pulse rounded-full bg-white/5" />
                    <div className="h-4 w-1/3 animate-pulse rounded-full bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : rooms.length > 0 ? (
            <div className="mt-8 grid gap-5 lg:grid-cols-3">
              {rooms.map((room, index) => (
                <RoomCard key={room.id} room={room} index={index} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[24px] border border-white/10 p-7 text-sm text-white/40">
              Rooms are currently unavailable.
            </div>
          )}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="bg-[#4d5545] px-5 py-20 sm:px-6 sm:py-28 lg:px-12 lg:py-36">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <Sparkles size={20} className="text-white/55" />

              <h2 className="display-font mt-7 max-w-xl text-[clamp(3rem,8vw,5.5rem)] leading-[0.9] tracking-[-0.055em]">
                Stay without watching the clock.
              </h2>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/55">
                Haven is less about filling your itinerary and more about
                leaving enough room for the day to become whatever it wants to
                be.
              </p>

              <Link
                to="/experience"
                className="group mt-8 inline-flex items-center gap-2 text-sm text-white/75 transition hover:text-white"
              >
                Discover the experience
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div className="border-t border-white/20">
              {experienceItems.map((item, index) => (
                <motion.div
                  key={item.number}
                  initial={{
                    opacity: 0,
                    y: 18,
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
                    duration: 0.6,
                    delay: index * 0.06,
                  }}
                  className="grid gap-4 border-b border-white/20 py-7 sm:grid-cols-[60px_1fr_1fr] sm:items-start"
                >
                  <p className="text-[10px] tracking-[0.18em] text-white/35">
                    {item.number}
                  </p>

                  <h3 className="display-font text-3xl tracking-[-0.04em] sm:text-4xl">
                    {item.title}
                  </h3>

                  <p className="max-w-md text-sm leading-7 text-white/50">
                    {item.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SPLIT STORY */}
      <section className="px-5 py-20 sm:px-6 sm:py-28 lg:px-12 lg:py-36">
        <div className="mx-auto grid w-full max-w-[1400px] gap-5 lg:grid-cols-2">
          <motion.div
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.75,
            }}
            className="overflow-hidden rounded-[24px] sm:rounded-[28px]"
          >
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=90"
              alt="Haven lounge"
              className="aspect-[4/5] h-full w-full object-cover"
            />
          </motion.div>

          <motion.div
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
              amount: 0.2,
            }}
            transition={{
              duration: 0.75,
              delay: 0.05,
            }}
            className="flex min-h-[520px] flex-col justify-between rounded-[24px] bg-[#1c1d19] p-6 sm:min-h-[620px] sm:rounded-[28px] sm:p-10 lg:p-12"
          >
            <div className="flex items-center gap-2 text-white/35">
              <BedDouble size={17} />

              <Coffee size={17} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b5aa91]">
                Our philosophy
              </p>

              <h2 className="display-font mt-5 max-w-xl text-[clamp(3rem,7vw,5rem)] leading-[0.92] tracking-[-0.055em]">
                Less to notice.
                <br />
                More to feel.
              </h2>

              <p className="mt-7 max-w-lg text-sm leading-7 text-white/45">
                From the light in the room to the texture of the sheets,
                everything at Haven is intended to feel natural rather than
                impressive.
              </p>

              <Link
                to="/about"
                className="group mt-8 inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
              >
                Why Haven exists
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-20 sm:px-6 sm:pb-28 lg:px-12 lg:pb-36">
        <div className="mx-auto w-full max-w-[1400px] overflow-hidden rounded-[26px] bg-[#c9b58d] text-[#171714] sm:rounded-[32px]">
          <div className="grid gap-12 px-6 py-12 sm:px-10 sm:py-16 lg:grid-cols-[1fr_auto] lg:items-end lg:px-14 lg:py-20">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
                Your room is waiting
              </p>

              <h2 className="display-font mt-5 max-w-4xl text-[clamp(3.4rem,9vw,7rem)] leading-[0.84] tracking-[-0.065em]">
                Stay a little longer.
              </h2>

              <p className="mt-7 max-w-lg text-sm leading-7 text-black/55">
                Choose your room, pick your dates and leave the rest to us.
              </p>
            </div>

            <Link
              to="/rooms"
              className="group flex min-h-14 w-fit items-center gap-4 rounded-full bg-[#171714] px-6 text-sm font-medium text-white transition hover:bg-black"
            >
              Book your stay
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
