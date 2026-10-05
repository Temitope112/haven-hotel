import { motion } from "motion/react";
import {
  ArrowUpRight,
  Coffee,
  MoonStar,
  Sparkles,
  Waves,
} from "lucide-react";
import { Link } from "react-router";

const experiences = [
  {
    icon: Coffee,
    number: "01",
    title: "Slow mornings",
    description:
      "Natural light, fresh coffee, soft linen, and mornings that begin without an alarm dictating the pace.",
  },
  {
    icon: Waves,
    number: "02",
    title: "Space to disappear",
    description:
      "Quiet corners, considered rooms, and enough breathing space to read, rest, think, or simply switch off.",
  },
  {
    icon: MoonStar,
    number: "03",
    title: "Longer evenings",
    description:
      "Warm lighting, late dinners, slower conversations, and nights that do not feel like they need to end early.",
  },
];

const timeline = [
  {
    time: "07:10",
    title: "Wake naturally",
    text: "Soft daylight, still rooms, and nowhere you need to be immediately.",
  },
  {
    time: "09:30",
    title: "Breakfast, properly",
    text: "Good coffee, thoughtful food, and enough time to stay for another cup.",
  },
  {
    time: "14:00",
    title: "Lose track of time",
    text: "Read, swim, work, sleep, explore, or do absolutely nothing.",
  },
  {
    time: "19:45",
    title: "Let the evening stretch",
    text: "Dinner, conversation, warm light, and the luxury of not rushing back anywhere.",
  },
];

export default function Experience() {
  return (
    <div className="overflow-hidden bg-[#151613] text-[#f5f1e8]">
      {/* HERO */}
      <section className="relative min-h-[100svh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2200&q=90"
            alt="Haven hotel experience"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-[#151613]" />

        <div className="relative z-10 flex min-h-[100svh] items-end">
          <div className="container-haven pb-14 pt-36 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-8 bg-white/40" />

              <p className="text-[10px] font-medium uppercase tracking-[0.27em] text-white/60 md:text-xs">
                The Haven experience
              </p>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.12,
                duration: 0.9,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="display-font mt-7 max-w-6xl text-[clamp(4.6rem,12vw,10rem)] leading-[0.8] tracking-[-0.075em]"
            >
              A stay built
              <br />

              <span className="italic text-white/70">
                around feeling.
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.38,
                duration: 0.7,
              }}
              className="mt-10 grid gap-8 border-t border-white/15 pt-7 md:grid-cols-[1fr_420px]"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                Stay slowly
              </p>

              <p className="max-w-md text-sm leading-7 text-white/65 md:text-base">
                Haven is not designed to fill every moment. It is designed
                to leave enough room for the moments you usually miss.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-24 md:py-32 lg:py-40">
        <div className="container-haven">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-[#b5aa91]">
                More than accommodation
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.85,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h2 className="display-font max-w-5xl text-[clamp(3rem,6.4vw,6.6rem)] leading-[0.92] tracking-[-0.06em]">
                We designed Haven around
                <span className="text-white/30">
                  {" "}
                  the moments hotels usually overlook.
                </span>
              </h2>

              <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
                <p className="text-sm leading-7 text-white/50 md:text-base">
                  The first quiet coffee. Light coming through linen curtains.
                  The sound of a room before the day begins. The feeling of
                  returning somewhere that already feels familiar.
                </p>

                <p className="text-sm leading-7 text-white/50 md:text-base">
                  Our idea of luxury is simple: fewer interruptions, more
                  comfort, better materials, thoughtful service, and enough
                  space to find your own rhythm.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CINEMATIC EXPERIENCE GRID */}
      <section className="pb-24 md:pb-36">
        <div className="container-haven">
          <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.9 }}
              className="relative overflow-hidden rounded-[30px]"
            >
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1800&q=90"
                alt="Morning inside Haven"
                className="aspect-[4/5] h-full w-full object-cover sm:aspect-[16/10]"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 md:p-10">
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">
                  07:42 AM
                </p>

                <h3 className="display-font mt-4 max-w-2xl text-4xl leading-[0.95] tracking-[-0.05em] md:text-6xl">
                  Morning begins when you are ready.
                </h3>
              </div>
            </motion.div>

            <div className="grid gap-5">
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.8,
                  delay: 0.08,
                }}
                className="overflow-hidden rounded-[30px]"
              >
                <img
                  src="https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1400&q=90"
                  alt="Haven guest room"
                  className="aspect-[4/3] h-full w-full object-cover lg:aspect-auto"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.8,
                  delay: 0.14,
                }}
                className="flex min-h-[300px] flex-col justify-between rounded-[30px] bg-[#4d5545] p-7 md:p-9"
              >
                <Sparkles size={20} className="text-white/55" />

                <div>
                  <p className="display-font text-4xl leading-[0.95] tracking-[-0.05em]">
                    Nothing rushed.
                    <br />
                    Nothing excessive.
                  </p>

                  <p className="mt-5 max-w-sm text-sm leading-7 text-white/60">
                    Service when you need it. Privacy when you do not.
                    Every detail is there to make the stay feel easy.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE PRINCIPLES */}
      <section className="border-y border-white/10 bg-[#1b1d18]">
        <div className="container-haven">
          {experiences.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.06,
                }}
                className="grid gap-6 border-b border-white/10 py-10 last:border-b-0 md:grid-cols-[90px_80px_1fr_1fr] md:items-start md:py-14"
              >
                <span className="text-xs text-white/25">
                  {item.number}
                </span>

                <Icon size={22} className="text-[#c9b58d]" />

                <h3 className="display-font text-3xl tracking-[-0.04em] md:text-4xl">
                  {item.title}
                </h3>

                <p className="max-w-md text-sm leading-7 text-white/45">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* A DAY AT HAVEN */}
      <section className="py-24 md:py-32 lg:py-40">
        <div className="container-haven">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-[#b5aa91]">
                A day at Haven
              </p>
            </div>

            <div>
              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.75 }}
                className="display-font max-w-4xl text-[clamp(3rem,6vw,6rem)] leading-[0.93] tracking-[-0.06em]"
              >
                There is no itinerary.
                <span className="text-white/25">
                  {" "}
                  Only a better rhythm.
                </span>
              </motion.h2>

              <div className="mt-12 border-t border-white/10">
                {timeline.map((item, index) => (
                  <motion.div
                    key={item.time}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.05,
                    }}
                    className="grid gap-4 border-b border-white/10 py-8 md:grid-cols-[100px_1fr_1fr] md:py-10"
                  >
                    <span className="text-xs text-white/25">
                      {item.time}
                    </span>

                    <h3 className="display-font text-2xl tracking-[-0.035em] md:text-3xl">
                      {item.title}
                    </h3>

                    <p className="max-w-md text-sm leading-7 text-white/45">
                      {item.text}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 md:pb-32">
        <div className="container-haven">
          <div className="relative overflow-hidden rounded-[32px] bg-[#c8b895] px-6 py-12 text-[#171714] sm:px-9 md:px-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
                  Your stay
                </p>

                <h2 className="display-font mt-4 max-w-3xl text-4xl leading-[0.95] tracking-[-0.05em] sm:text-5xl md:text-6xl">
                  Experience Haven for yourself.
                </h2>
              </div>

              <Link
                to="/rooms"
                className="group inline-flex w-fit items-center gap-3 rounded-full bg-[#171714] px-6 py-3.5 text-sm font-medium text-white"
              >
                Explore rooms

                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}