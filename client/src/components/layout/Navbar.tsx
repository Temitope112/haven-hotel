import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import {
  ArrowUpRight,
  CircleUserRound,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router";

import { useAuth } from "../../context/AuthContext";

const navigation = [
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

export default function Navbar() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const location =
    useLocation();

  const navigate =
    useNavigate();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();

    navigate("/", {
      replace: true,
    });
  }

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) {
      document.body.style.overflow =
        "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [menuOpen]);

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ||
    "Account";

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full overflow-x-hidden">
        <div className="mx-auto w-full max-w-[1400px] px-4 pt-3 sm:px-6 sm:pt-4 lg:px-12 lg:pt-5">
          <div className="flex h-14 min-w-0 items-center justify-between gap-3 rounded-full border border-white/15 bg-black/25 px-4 text-white shadow-[0_10px_40px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:h-16 md:h-[68px] md:px-5 lg:h-[72px] lg:px-6">
            {/* LOGO */}
            <Link
              to="/"
              className="relative z-10 shrink-0 text-base font-semibold tracking-[-0.05em] sm:text-lg md:text-xl"
            >
              HAVEN
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden min-w-0 items-center gap-6 lg:flex xl:gap-8">
              {navigation.map(
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
                    className="group relative shrink-0 text-[13px]"
                  >
                    {({
                      isActive,
                    }) => (
                      <>
                        <span
                          className={`transition-colors duration-300 ${
                            isActive
                              ? "text-white"
                              : "text-white/55 group-hover:text-white"
                          }`}
                        >
                          {
                            item.label
                          }
                        </span>

                        <span
                          className={`absolute -bottom-2 left-0 h-px bg-white transition-all duration-300 ${
                            isActive
                              ? "w-full"
                              : "w-0 group-hover:w-full"
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                ),
              )}
            </nav>

            {/* DESKTOP ACTIONS */}
            <div className="hidden shrink-0 items-center gap-4 lg:flex xl:gap-5">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    className="group flex items-center gap-2 text-[13px] text-white/65 transition-colors duration-300 hover:text-white"
                  >
                    <CircleUserRound
                      size={15}
                      className="shrink-0"
                    />

                    <span className="max-w-[100px] truncate">
                      {
                        firstName
                      }
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={
                      handleLogout
                    }
                    aria-label="Sign out"
                    className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-white/45 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                  >
                    <LogOut
                      size={14}
                    />
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-[13px] text-white/60 transition-colors duration-300 hover:text-white"
                >
                  Sign in
                </Link>
              )}

              <Link
                to="/rooms"
                className="group flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-2.5 text-[13px] font-medium text-[#171714] transition-transform duration-300 hover:scale-[1.02] xl:px-5"
              >
                <span>
                  Book a stay
                </span>

                <ArrowUpRight
                  size={14}
                  className="shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            {/* MOBILE MENU */}
            <button
              type="button"
              onClick={() =>
                setMenuOpen(
                  true,
                )
              }
              aria-label="Open navigation menu"
              aria-expanded={
                menuOpen
              }
              aria-controls="mobile-navigation"
              className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/10 transition-colors hover:bg-white/15 sm:size-10 lg:hidden"
            >
              <Menu
                size={18}
              />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.22,
            }}
            className="fixed inset-0 z-[100] w-full overflow-x-hidden overflow-y-auto bg-[#151613] text-white lg:hidden"
          >
            <div className="mx-auto flex min-h-[100dvh] w-full max-w-full flex-col px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 sm:px-6 sm:pt-5">
              {/* TOP */}
              <div className="flex min-w-0 items-center justify-between gap-4">
                <Link
                  to="/"
                  className="shrink-0 text-lg font-semibold tracking-[-0.05em] sm:text-xl"
                >
                  HAVEN
                </Link>

                <button
                  type="button"
                  onClick={
                    closeMenu
                  }
                  aria-label="Close navigation menu"
                  className="flex size-10 shrink-0 items-center justify-center rounded-full border border-white/15 transition-colors hover:bg-white/10 sm:size-11"
                >
                  <X
                    size={18}
                  />
                </button>
              </div>

              {/* USER */}
              {isAuthenticated && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 12,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.08,
                  }}
                  className="mt-10 flex items-center gap-3 border-b border-white/10 pb-6"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <CircleUserRound
                      size={18}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {
                        user?.name
                      }
                    </p>

                    <p className="mt-1 truncate text-xs text-white/35">
                      {
                        user?.email
                      }
                    </p>
                  </div>
                </motion.div>
              )}

              {/* LINKS */}
              <nav className="my-auto w-full min-w-0 py-10 sm:py-12">
                {navigation.map(
                  (
                    item,
                    index,
                  ) => (
                    <motion.div
                      key={
                        item.path
                      }
                      initial={{
                        opacity: 0,
                        y: 22,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration:
                          0.45,
                        delay:
                          0.08 +
                          index *
                            0.07,
                        ease: [
                          0.22,
                          1,
                          0.36,
                          1,
                        ],
                      }}
                      className="w-full min-w-0"
                    >
                      <NavLink
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
                          `block w-full min-w-0 border-b border-white/10 py-4 transition-colors sm:py-5 ${
                            isActive
                              ? "text-white"
                              : "text-white/65 hover:text-white"
                          }`
                        }
                      >
                        <span className="display-font block max-w-full break-words text-[clamp(2.5rem,12vw,3.8rem)] leading-[0.9] tracking-[-0.045em]">
                          {
                            item.label
                          }
                        </span>
                      </NavLink>
                    </motion.div>
                  ),
                )}
              </nav>

              {/* MOBILE ACTIONS */}
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
                  delay: 0.4,
                  duration: 0.45,
                }}
                className="grid w-full min-w-0 grid-cols-1 gap-3 min-[360px]:grid-cols-2"
              >
                {isAuthenticated ? (
                  <Link
                    to="/account"
                    className="flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-full border border-white/15 px-4 text-sm transition-colors hover:bg-white/10"
                  >
                    <CircleUserRound
                      size={15}
                      className="shrink-0"
                    />

                    <span className="truncate">
                      My account
                    </span>
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="flex min-h-12 min-w-0 items-center justify-center rounded-full border border-white/15 px-4 text-sm transition-colors hover:bg-white/10"
                  >
                    Sign in
                  </Link>
                )}

                <Link
                  to="/rooms"
                  className="flex min-h-12 min-w-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-black"
                >
                  <span className="truncate">
                    Book a stay
                  </span>

                  <ArrowUpRight
                    size={14}
                    className="shrink-0"
                  />
                </Link>
              </motion.div>

              {/* MOBILE LOGOUT */}
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-white/10 text-sm text-white/45 transition hover:border-white/20 hover:text-white"
                >
                  <LogOut
                    size={15}
                  />

                  Sign out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}