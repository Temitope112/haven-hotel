import { motion } from "motion/react";
import {
  ArrowUpRight,
  Feather,
  HeartHandshake,
  Layers3,
} from "lucide-react";
import { Link } from "react-router";

const values = [
  {
    icon: Feather,
    title: "Less, but better",
    text: "We remove what does not need to be there and pay more attention to what remains.",
  },
  {
    icon: Layers3,
    title: "Built to feel timeless",
    text: "Natural textures, quiet materials, useful spaces, and design choices that do not depend on trends.",
  },
  {
    icon: HeartHandshake,
    title: "Hospitality with instinct",
    text: "Thoughtful service should feel attentive without feeling intrusive.",
  },
];

export default function About() {
  return (
    <div className="overflow-hidden bg-[#151613] text-[#f5f1e8]">
      {/* HERO */}
      <section className="relative min-h-[92svh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1.8,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=2200&q=90"
            alt="Haven architecture"
            className="h-full w-full object-cover"
          />
        </motion.div>

        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-[#151613]" />

        <div className="relative z-10 flex min-h-[92svh] items-end">
          <div className="container-haven pb-14 pt-36 md:pb-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="h-px w-8 bg-white/40" />

              <p className="text-[10px] font-medium uppercase tracking-[0.27em] text-white/60 md:text-xs">
                About Haven
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
              className="display-font mt-7 max-w-6xl text-[clamp(4.5rem,11vw,9.5rem)] leading-[0.82] tracking-[-0.075em]"
            >
              Built for people
              <br />
              who value
              <span className="italic text-white/70"> stillness.</span>
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ORIGIN */}
      <section className="py-24 md:py-32 lg:py-40">
        <div className="container-haven">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-[#b5aa91]">
                Our beginning
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="display-font max-w-5xl text-[clamp(3rem,6vw,6.2rem)] leading-[0.93] tracking-[-0.06em]">
                Haven began with one question:
                <span className="text-white/25">
                  {" "}
                  what if a hotel gave you less to think about?
                </span>
              </h2>

              <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 sm:grid-cols-2">
                <p className="text-sm leading-7 text-white/50 md:text-base">
                  We had stayed in beautiful places that somehow still felt
                  busy. Too much styling. Too much noise. Too much trying to
                  impress.
                </p>

                <p className="text-sm leading-7 text-white/50 md:text-base">
                  Haven grew from the opposite idea: create fewer distractions,
                  make every detail useful, and let comfort speak before design
                  ever needs to explain itself.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STORY IMAGE */}
      <section className="pb-24 md:pb-36">
        <div className="container-haven">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative overflow-hidden rounded-[32px]"
          >
            <img
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2200&q=90"
              alt="Haven interior design"
              className="aspect-[4/5] w-full object-cover sm:aspect-[16/10] lg:aspect-[16/8]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

            <div className="absolute bottom-0 left-0 max-w-4xl p-6 md:p-10 lg:p-12">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">
                The idea
              </p>

              <h3 className="display-font mt-4 text-3xl leading-[1] tracking-[-0.045em] sm:text-4xl md:text-5xl">
                Not a hotel trying to feel luxurious.
                <br />
                A place that simply feels right.
              </h3>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STORY */}
      <section className="border-y border-white/10 bg-[#1b1d18] py-24 md:py-32">
        <div className="container-haven">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-[#b5aa91]">
                The story
              </p>
            </div>

            <div>
              <motion.h2
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.75 }}
                className="display-font max-w-4xl text-[clamp(3rem,6vw,5.8rem)] leading-[0.94] tracking-[-0.06em]"
              >
                We wanted less noise.
                <span className="text-white/25">
                  {" "}
                  More intention.
                </span>
              </motion.h2>

              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <p className="text-sm leading-7 text-white/45 md:text-base">
                  Instead of filling every wall, we leave room for light.
                  Instead of decorating every corner, we choose materials
                  carefully and allow them to age naturally.
                </p>

                <p className="text-sm leading-7 text-white/45 md:text-base">
                  Instead of making service feel formal, we make it intuitive.
                  Present when it matters, invisible when it does not.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-24 md:py-32 lg:py-40">
        <div className="container-haven">
          <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
            <motion.div
              initial={{ opacity: 0, scale: 0.985 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.85 }}
              className="overflow-hidden rounded-[32px]"
            >
              <img
                src="https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1800&q=90"
                alt="Natural materials inside Haven"
                className="aspect-[4/5] h-full w-full object-cover sm:aspect-[16/11] lg:aspect-auto"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.8,
                delay: 0.08,
              }}
              className="flex flex-col justify-between rounded-[32px] bg-[#4d5545] p-7 md:p-10 lg:p-12"
            >
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">
                Our philosophy
              </p>

              <div className="mt-20 lg:mt-0">
                <h2 className="display-font text-4xl leading-[0.95] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
                  Hospitality should feel natural.
                </h2>

                <p className="mt-7 max-w-md text-sm leading-7 text-white/60 md:text-base">
                  The best stay should never feel like a performance.
                  It should simply work beautifully around you.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="pb-24 md:pb-36">
        <div className="container-haven">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.27em] text-[#b5aa91]">
                What guides us
              </p>
            </div>

            <div>
              <h2 className="display-font max-w-4xl text-[clamp(3rem,6vw,5.8rem)] leading-[0.94] tracking-[-0.06em]">
                Good design matters.
                <span className="text-white/25">
                  {" "}
                  How it makes you feel matters more.
                </span>
              </h2>

              <div className="mt-12 border-t border-white/10">
                {values.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{
                        duration: 0.6,
                        delay: index * 0.06,
                      }}
                      className="grid gap-5 border-b border-white/10 py-8 sm:grid-cols-[60px_1fr] md:grid-cols-[60px_1fr_1fr]"
                    >
                      <Icon size={21} className="text-[#c9b58d]" />

                      <h3 className="display-font text-2xl tracking-[-0.04em] md:text-3xl">
                        {item.title}
                      </h3>

                      <p className="max-w-md text-sm leading-7 text-white/45 sm:col-start-2 md:col-start-auto">
                        {item.text}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 md:pb-32">
        <div className="container-haven">
          <div className="rounded-[32px] bg-[#c8b895] px-6 py-12 text-[#171714] sm:px-9 md:px-12 md:py-16">
            <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-black/45">
                  Come stay
                </p>

                <h2 className="display-font mt-4 max-w-3xl text-4xl leading-[0.95] tracking-[-0.05em] sm:text-5xl md:text-6xl">
                  The best way to understand Haven is to experience it.
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