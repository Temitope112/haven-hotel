import {
  BedDouble,
  CalendarDays,
  ChevronRight,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import {
  NavLink,
  Outlet,
  useNavigate,
} from "react-router";
import {
  AnimatePresence,
  motion,
} from "motion/react";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

const navigation = [
  {
    label: "Overview",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Bookings",
    path: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    label: "Rooms",
    path: "/admin/rooms",
    icon: BedDouble,
  },
  {
    label: "Guests",
    path: "/admin/users",
    icon: Users,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  const [
    menuOpen,
    setMenuOpen,
  ] = useState(false);

  const firstName =
    user?.name
      ?.trim()
      .split(/\s+/)[0] ||
    "Admin";

  function handleLogout() {
    logout();

    navigate("/", {
      replace: true,
    });
  }

  return (
    <div className="min-h-screen bg-[#11120f] text-[#f5f1e8]">
      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] border-r border-white/[0.07] bg-[#151613] lg:flex lg:flex-col">
        {/* BRAND */}
        <div className="flex h-[88px] items-center border-b border-white/[0.07] px-7">
          <NavLink
            to="/admin"
            className="flex items-center gap-3"
          >
            <div className="flex size-9 items-center justify-center rounded-[11px] bg-[#c9b58d] text-[#171714]">
              <ShieldCheck
                size={17}
                strokeWidth={2}
              />
            </div>

            <div>
              <p className="text-[15px] font-semibold tracking-[-0.04em]">
                HAVEN
              </p>

              <p className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.2em] text-white/30">
                Administration
              </p>
            </div>
          </NavLink>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 px-4 py-6">
          <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/20">
            Management
          </p>

          <nav className="mt-4 space-y-1">
            {navigation.map(
              ({
                label,
                path,
                icon: Icon,
                end,
              }) => (
                <NavLink
                  key={path}
                  to={path}
                  end={end}
                  className={({
                    isActive,
                  }) =>
                    `group flex min-h-12 items-center gap-3 rounded-[14px] px-3.5 text-sm transition ${
                      isActive
                        ? "bg-[#c9b58d] text-[#171714]"
                        : "text-white/45 hover:bg-white/[0.04] hover:text-white"
                    }`
                  }
                >
                  {({
                    isActive,
                  }) => (
                    <>
                      <Icon
                        size={17}
                        strokeWidth={
                          1.8
                        }
                      />

                      <span className="flex-1">
                        {label}
                      </span>

                      {isActive && (
                        <ChevronRight
                          size={14}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              ),
            )}
          </nav>
        </div>

        {/* SIDEBAR BOTTOM */}
        <div className="border-t border-white/[0.07] p-4">
          <NavLink
            to="/"
            className="flex min-h-11 items-center gap-3 rounded-[13px] px-3 text-sm text-white/40 transition hover:bg-white/[0.04] hover:text-white"
          >
            <House
              size={16}
            />

            View hotel website
          </NavLink>

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="mt-1 flex min-h-11 w-full items-center gap-3 rounded-[13px] px-3 text-left text-sm text-white/40 transition hover:bg-red-400/[0.06] hover:text-red-200"
          >
            <LogOut
              size={16}
            />

            Sign out
          </button>

          <div className="mt-4 flex items-center gap-3 rounded-[15px] border border-white/[0.07] bg-white/[0.025] p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#4d5545] text-xs font-semibold text-white">
              {firstName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white/75">
                {user?.name}
              </p>

              <p className="mt-0.5 truncate text-[9px] text-white/25">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-[72px] items-center justify-between border-b border-white/[0.07] bg-[#151613]/95 px-5 backdrop-blur-xl lg:hidden">
        <NavLink
          to="/admin"
          className="flex items-center gap-2.5"
        >
          <div className="flex size-8 items-center justify-center rounded-[10px] bg-[#c9b58d] text-[#171714]">
            <ShieldCheck
              size={15}
            />
          </div>

          <div>
            <p className="text-sm font-semibold tracking-[-0.04em]">
              HAVEN
            </p>

            <p className="text-[7px] uppercase tracking-[0.18em] text-white/30">
              Admin
            </p>
          </div>
        </NavLink>

        <button
          type="button"
          onClick={() =>
            setMenuOpen(true)
          }
          className="flex size-10 items-center justify-center rounded-full border border-white/10 text-white/70"
          aria-label="Open admin menu"
        >
          <Menu
            size={18}
          />
        </button>
      </header>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.button
              type="button"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={() =>
                setMenuOpen(
                  false,
                )
              }
              className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm lg:hidden"
              aria-label="Close admin menu"
            />

            <motion.aside
              initial={{
                x: "-100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-100%",
              }}
              transition={{
                duration: 0.3,
                ease: [
                  0.22,
                  1,
                  0.36,
                  1,
                ],
              }}
              className="fixed inset-y-0 left-0 z-[60] flex w-[min(86vw,320px)] flex-col bg-[#171814] p-5 shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold">
                    HAVEN
                  </p>

                  <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/30">
                    Administration
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setMenuOpen(
                      false,
                    )
                  }
                  className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/60"
                >
                  <X
                    size={17}
                  />
                </button>
              </div>

              <nav className="mt-10 space-y-1">
                {navigation.map(
                  ({
                    label,
                    path,
                    icon: Icon,
                    end,
                  }) => (
                    <NavLink
                      key={
                        path
                      }
                      to={path}
                      end={end}
                      onClick={() =>
                        setMenuOpen(
                          false,
                        )
                      }
                      className={({
                        isActive,
                      }) =>
                        `flex min-h-12 items-center gap-3 rounded-[14px] px-4 text-sm ${
                          isActive
                            ? "bg-[#c9b58d] text-[#171714]"
                            : "text-white/45"
                        }`
                      }
                    >
                      <Icon
                        size={
                          17
                        }
                      />

                      {label}
                    </NavLink>
                  ),
                )}
              </nav>

              <div className="mt-auto border-t border-white/10 pt-5">
                <NavLink
                  to="/"
                  onClick={() =>
                    setMenuOpen(
                      false,
                    )
                  }
                  className="flex min-h-11 items-center gap-3 text-sm text-white/45"
                >
                  <House
                    size={16}
                  />

                  View website
                </NavLink>

                <button
                  type="button"
                  onClick={
                    handleLogout
                  }
                  className="mt-2 flex min-h-11 w-full items-center gap-3 text-left text-sm text-red-200/70"
                >
                  <LogOut
                    size={16}
                  />

                  Sign out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* MAIN ADMIN AREA */}
      <main className="min-h-screen pt-[72px] lg:ml-[270px] lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}