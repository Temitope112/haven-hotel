import { motion } from "motion/react";
import {
  ArrowUpRight,
  Users,
} from "lucide-react";
import {
  Link,
  useLocation,
} from "react-router";

import type { Room } from "../../types/room";

type RoomCardProps = {
  room: Room;
  index: number;
};

function formatPrice(
  price: string,
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

export default function RoomCard({
  room,
  index,
}: RoomCardProps) {
  const location =
    useLocation();

  const roomLink =
    `/rooms/${room.id}${location.search}`;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 35,
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
        duration: 0.7,
        delay: Math.min(
          index * 0.08,
          0.24,
        ),
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      className="group min-w-0"
    >
      <Link
        to={roomLink}
        className="block min-w-0"
      >
        {/* IMAGE */}
        <div className="relative overflow-hidden rounded-[24px] bg-[#24251f] sm:rounded-[28px]">
          <motion.img
            src={
              room.imageUrl ||
              "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=90"
            }
            alt={room.name}
            whileHover={{
              scale: 1.035,
            }}
            transition={{
              duration: 0.6,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="aspect-[4/5] w-full object-cover sm:aspect-[5/4] lg:aspect-[4/5]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

          {/* ROOM NUMBER */}
          <div className="absolute left-4 top-4 sm:left-5 sm:top-5">
            <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-white/70 backdrop-blur-md sm:text-[10px]">
              Room{" "}
              {String(
                room.id,
              ).padStart(
                2,
                "0",
              )}
            </span>
          </div>

          {/* IMAGE CONTENT */}
          <div className="absolute inset-x-0 bottom-0 p-5 text-white sm:p-6">
            <div className="flex min-w-0 items-end justify-between gap-4 sm:gap-5">
              <div className="min-w-0">
                <h2 className="display-font break-words text-3xl leading-[0.95] tracking-[-0.045em] sm:text-4xl">
                  {
                    room.name
                  }
                </h2>

                <div className="mt-3 flex items-center gap-2 text-xs text-white/55">
                  <Users
                    size={14}
                    className="shrink-0"
                  />

                  <span>
                    Up to{" "}
                    {
                      room.capacity
                    }{" "}
                    {room.capacity ===
                    1
                      ? "guest"
                      : "guests"}
                  </span>
                </div>
              </div>

              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition-transform duration-300 group-hover:-translate-y-1 sm:size-11">
                <ArrowUpRight
                  size={17}
                />
              </span>
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="grid min-w-0 gap-4 px-1 pt-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start">
          <p className="min-w-0 max-w-xl break-words text-sm leading-7 text-white/45">
            {
              room.description
            }
          </p>

          <div className="sm:text-right">
            <p className="text-base font-medium text-[#f5f1e8]">
              {formatPrice(
                room.price,
              )}
            </p>

            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/30 sm:text-[11px]">
              per night
            </p>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}