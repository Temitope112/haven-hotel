import {
  ArrowUpRight,
} from "lucide-react";
import {
  FaInstagram,
} from "react-icons/fa6";
import {
  Link,
  NavLink,
} from "react-router";

const exploreLinks = [
  {
    label: "Home",
    path: "/",
  },
  {
    label: "Rooms",
    path: "/rooms",
  },
  {
    label: "Experience",
    path: "/experience",
  },
  {
    label: "About",
    path: "/about",
  },
];

export default function Footer() {
  const currentYear =
    new Date().getFullYear();

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <footer className="overflow-hidden bg-[#0f100e] text-[#f5f1e8]">
      {/* TOP CTA */}
      <section className="border-b border-white/10 px-5 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#b5aa91] sm:text-[10px]">
              Your next stay
            </p>

            <h2 className="display-font mt-5 max-w-4xl text-[clamp(3.4rem,9vw,7.2rem)] leading-[0.84] tracking-[-0.065em]">
              Somewhere quieter
              <br />

              <span className="text-white/30">
                is waiting.
              </span>
            </h2>
          </div>

          <Link
            to="/rooms"
            className="group flex min-h-14 w-fit items-center gap-4 rounded-full bg-[#f5f1e8] px-6 text-sm font-medium text-[#171714] transition hover:bg-white"
          >
            Book your stay

            <ArrowUpRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>

      {/* MAIN FOOTER */}
      <section className="px-5 py-12 sm:px-6 sm:py-16 lg:px-12 lg:py-20">
        <div className="mx-auto w-full max-w-[1400px]">
          <div className="grid gap-14 border-b border-white/10 pb-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_.7fr_.7fr] lg:gap-20 lg:pb-20">
            {/* BRAND */}
            <div>
              <Link
                to="/"
                className="inline-block text-xl font-semibold tracking-[-0.05em] sm:text-2xl"
              >
                HAVEN
              </Link>

              <p className="mt-6 max-w-sm text-sm leading-7 text-white/40">
                Thoughtful rooms,
                slower mornings and
                spaces made for the
                moments between
                everything else.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <a
                  href="#"
                  aria-label="Haven on Instagram"
                  className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/45 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                >
                  <FaInstagram
                    size={16}
                  />
                </a>
              </div>
            </div>

            {/* EXPLORE */}
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">
                Explore
              </p>

              <nav className="mt-6 flex flex-col items-start gap-4">
                {exploreLinks.map(
                  (item) => (
                    <NavLink
                      key={
                        item.path
                      }
                      to={
                        item.path
                      }
                      end={
                        item.path ===
                        "/"
                      }
                      className={({
                        isActive,
                      }) =>
                        `text-sm transition ${
                          isActive
                            ? "text-white"
                            : "text-white/45 hover:text-white"
                        }`
                      }
                    >
                      {
                        item.label
                      }
                    </NavLink>
                  ),
                )}
              </nav>
            </div>

            {/* GUEST */}
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-white/30">
                Your stay
              </p>

              <div className="mt-6 flex flex-col items-start gap-4">
                <Link
                  to="/account"
                  className="text-sm text-white/45 transition hover:text-white"
                >
                  My account
                </Link>

                <Link
                  to="/login"
                  className="text-sm text-white/45 transition hover:text-white"
                >
                  Sign in
                </Link>

                <Link
                  to="/rooms"
                  className="text-sm text-white/45 transition hover:text-white"
                >
                  Find a room
                </Link>
              </div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="flex flex-col gap-6 pt-7 text-[10px] text-white/25 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {currentYear} Haven.
              All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <span>
                Built for slower stays.
              </span>

              <button
                type="button"
                onClick={
                  scrollToTop
                }
                className="transition hover:text-white"
              >
                Back to top ↑
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* LARGE WORDMARK */}
      <div
        aria-hidden="true"
        className="overflow-hidden px-2 pb-2 text-center"
      >
        <p className="select-none whitespace-nowrap text-[clamp(6rem,22vw,21rem)] font-semibold leading-[0.65] tracking-[-0.085em] text-white/[0.025]">
          HAVEN
        </p>
      </div>
    </footer>
  );
}