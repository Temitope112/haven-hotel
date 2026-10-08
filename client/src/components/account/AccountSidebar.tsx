import {
  CalendarDays,
  Home,
  LogOut,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  NavLink,
  useNavigate,
} from "react-router";

import {
  useAuth,
} from "../../context/AuthContext";

const navigation = [
  {
    label: "Overview",
    to: "/account",
    icon: Home,
    end: true,
  },
  {
    label: "My stays",
    to: "/account/bookings",
    icon: CalendarDays,
  },
  {
    label: "Profile",
    to: "/account/profile",
    icon: UserRound,
  },
  {
    label: "Security",
    to: "/account/security",
    icon: ShieldCheck,
  },
];

export default function AccountSidebar() {
  const navigate =
    useNavigate();

  const {
    user,
    logout,
  } = useAuth();

  async function handleLogout() {
    await logout();

    navigate("/", {
      replace: true,
    });
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] border-r border-white/10 bg-[#11120f] lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-7 py-7">
        <NavLink
          to="/"
          className="display-font text-[1.65rem] tracking-[-0.04em] text-white"
        >
          HAVEN
        </NavLink>

        <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-white/25">
          Guest residence
        </p>
      </div>

      <div className="flex flex-1 flex-col px-4 py-6">
        <div className="px-3">
          <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#b5aa91]">
            Guest dashboard
          </p>

          <p className="mt-3 truncate text-sm text-white/70">
            {user?.name}
          </p>

          <p className="mt-1 truncate text-xs text-white/30">
            {user?.email}
          </p>
        </div>

        <nav className="mt-8 space-y-1.5">
          {navigation.map(
            ({
              label,
              to,
              icon: Icon,
              end,
            }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({
                  isActive,
                }) =>
                  `
                    group flex items-center gap-3 rounded-[14px]
                    px-3 py-3 text-sm transition duration-300
                    ${
                      isActive
                        ? "bg-white/[0.07] text-white"
                        : "text-white/40 hover:bg-white/[0.035] hover:text-white/75"
                    }
                  `
                }
              >
                {({
                  isActive,
                }) => (
                  <>
                    <span
                      className={`
                        flex h-8 w-8 items-center justify-center rounded-full
                        border transition
                        ${
                          isActive
                            ? "border-[#c9b58d]/30 bg-[#c9b58d]/10 text-[#d8c8a7]"
                            : "border-white/10 text-white/35 group-hover:text-white/60"
                        }
                      `}
                    >
                      <Icon
                        size={14}
                      />
                    </span>

                    {label}
                  </>
                )}
              </NavLink>
            ),
          )}
        </nav>

        <div className="mt-auto">
          <div className="mb-4 border-t border-white/10" />

          <button
            type="button"
            onClick={
              handleLogout
            }
            className="flex w-full items-center gap-3 rounded-[14px] px-3 py-3 text-sm text-white/35 transition hover:bg-red-400/[0.05] hover:text-red-200"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10">
              <LogOut
                size={14}
              />
            </span>

            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}