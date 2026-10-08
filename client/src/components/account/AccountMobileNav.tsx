import {
  CalendarDays,
  Home,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  NavLink,
} from "react-router";

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

export default function AccountMobileNav() {
  const [
    open,
    setOpen,
  ] = useState(false);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex h-[76px] items-center justify-between border-b border-white/10 bg-[#11120f]/95 px-5 backdrop-blur-xl lg:hidden">
        <NavLink
          to="/"
          className="display-font text-2xl tracking-[-0.04em]"
        >
          HAVEN
        </NavLink>

        <button
          type="button"
          onClick={() =>
            setOpen(
              (current) =>
                !current,
            )
          }
          aria-label="Toggle account navigation"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/70"
        >
          {open ? (
            <X
              size={18}
            />
          ) : (
            <Menu
              size={18}
            />
          )}
        </button>
      </header>

      {open && (
        <div className="fixed inset-x-0 top-[76px] z-40 border-b border-white/10 bg-[#11120f] p-4 shadow-2xl lg:hidden">
          <nav className="space-y-1">
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
                  onClick={() =>
                    setOpen(
                      false,
                    )
                  }
                  className={({
                    isActive,
                  }) =>
                    `
                      flex items-center gap-3 rounded-[14px]
                      px-4 py-3 text-sm transition
                      ${
                        isActive
                          ? "bg-white/[0.07] text-white"
                          : "text-white/45"
                      }
                    `
                  }
                >
                  <Icon
                    size={16}
                    className="text-[#c9b58d]"
                  />

                  {label}
                </NavLink>
              ),
            )}
          </nav>
        </div>
      )}
    </>
  );
}