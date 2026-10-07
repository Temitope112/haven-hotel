import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  ReactNode,
} from "react";

import {
  CalendarDays,
  ChevronDown,
  RefreshCw,
  Search,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";

import axios from "axios";
import { useNavigate } from "react-router";

import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

type UserRole =
  | "GUEST"
  | "ADMIN";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  bookingCount: number;
  totalSpent: string;
};

type AdminUsersResponse = {
  success: boolean;
  count: number;
  users: AdminUser[];
};

function formatPrice(
  value: string | number,
) {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    },
  ).format(Number(value));
}

function formatDate(
  value: string,
) {
  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  ).format(new Date(value));
}

function getInitials(
  name: string,
) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0),
    )
    .join("")
    .toUpperCase();
}

export default function AdminUsers() {
  const navigate =
    useNavigate();

  const {
    logout,
  } = useAuth();

  const [
    users,
    setUsers,
  ] = useState<AdminUser[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    roleFilter,
    setRoleFilter,
  ] = useState<
    UserRole | "ALL"
  >("ALL");

  async function fetchUsers() {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem(
          "haven_token",
        );

      const response =
        await api.get<AdminUsersResponse>(
          "/api/admin/users",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        );

      setUsers(
        response.data.users,
      );
    } catch (
      error: unknown
    ) {
      console.error(
        "Failed to load admin users:",
        error,
      );

      if (
        axios.isAxiosError(
          error,
        )
      ) {
        if (
          error.response
            ?.status === 401
        ) {
          logout();

          navigate(
            "/login",
            {
              replace: true,
              state: {
                from:
                  "/admin/users",
              },
            },
          );

          return;
        }

        if (
          error.response
            ?.status === 403
        ) {
          navigate(
            "/account",
            {
              replace: true,
            },
          );

          return;
        }
      }

      setError(
        "We couldn't load the users.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      return users.filter(
        (user) => {
          const matchesRole =
            roleFilter ===
              "ALL" ||
            user.role ===
              roleFilter;

          const matchesSearch =
            !query ||
            user.name
              .toLowerCase()
              .includes(query) ||
            user.email
              .toLowerCase()
              .includes(query) ||
            String(
              user.id,
            ).includes(query);

          return (
            matchesRole &&
            matchesSearch
          );
        },
      );
    }, [
      users,
      search,
      roleFilter,
    ]);

  const guestCount =
    users.filter(
      (user) =>
        user.role ===
        "GUEST",
    ).length;

  const adminCount =
    users.filter(
      (user) =>
        user.role ===
        "ADMIN",
    ).length;

  return (
    <div className="min-h-screen bg-[#11120f]">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 xl:px-8">
        {/* HEADER */}
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b5aa91]">
              Accounts
            </p>

            <h1 className="mt-2 text-2xl font-medium tracking-[-0.04em] text-[#f5f1e8] sm:text-3xl">
              Guests
            </h1>

            <p className="mt-2 text-sm text-white/35">
              View registered users and
              their activity across Haven.
            </p>
          </div>

          <button
            type="button"
            onClick={
              fetchUsers
            }
            disabled={
              loading
            }
            className="flex min-h-10 w-fit items-center gap-2 rounded-full border border-white/10 px-4 text-xs text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-40"
          >
            <RefreshCw
              size={14}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>
        </header>

        <div className="my-7 h-px bg-white/[0.07]" />

        {/* SUMMARY */}
        <section className="grid gap-3 sm:grid-cols-3">
          <SummaryCard
            label="Total users"
            value={
              users.length
            }
            icon={
              Users
            }
          />

          <SummaryCard
            label="Guests"
            value={
              guestCount
            }
            icon={
              UserRound
            }
          />

          <SummaryCard
            label="Admins"
            value={
              adminCount
            }
            icon={
              ShieldCheck
            }
          />
        </section>

        {/* FILTERS */}
        <section className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={15}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
            />

            <input
              type="text"
              value={search}
              onChange={(
                event,
              ) =>
                setSearch(
                  event.target
                    .value,
                )
              }
              placeholder="Search name, email or user ID"
              className="h-11 w-full rounded-full border border-white/[0.08] bg-[#171814] pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/15"
            />
          </div>

          <div className="relative">
            <select
              value={
                roleFilter
              }
              onChange={(
                event,
              ) =>
                setRoleFilter(
                  event.target
                    .value as
                    | UserRole
                    | "ALL",
                )
              }
              className="h-11 appearance-none rounded-full border border-white/[0.08] bg-[#171814] px-4 pr-10 text-xs text-white/60 outline-none"
            >
              <option value="ALL">
                All roles
              </option>

              <option value="GUEST">
                Guests
              </option>

              <option value="ADMIN">
                Admins
              </option>
            </select>

            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/30"
            />
          </div>
        </section>

        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-white/30">
            {
              filteredUsers.length
            }{" "}
            {filteredUsers.length ===
            1
              ? "user"
              : "users"}
          </p>

          <p className="text-[9px] uppercase tracking-[0.18em] text-white/20">
            User directory
          </p>
        </div>

        {/* CONTENT */}
        {loading ? (
          <UsersLoading />
        ) : error ? (
          <UsersError
            message={error}
            onRetry={
              fetchUsers
            }
          />
        ) : filteredUsers.length ===
          0 ? (
          <EmptyUsers />
        ) : (
          <>
            {/* DESKTOP */}
            <div className="mt-5 hidden overflow-hidden rounded-[22px] border border-white/[0.07] bg-[#171814] lg:block">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px] border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-left">
                      <TableHeading>
                        User
                      </TableHeading>

                      <TableHeading>
                        Role
                      </TableHeading>

                      <TableHeading>
                        Bookings
                      </TableHeading>

                      <TableHeading>
                        Total spent
                      </TableHeading>

                      <TableHeading>
                        Joined
                      </TableHeading>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredUsers.map(
                      (user) => (
                        <UserRow
                          key={
                            user.id
                          }
                          user={
                            user
                          }
                        />
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MOBILE */}
            <div className="mt-5 grid gap-3 lg:hidden">
              {filteredUsers.map(
                (user) => (
                  <UserCard
                    key={
                      user.id
                    }
                    user={
                      user
                    }
                  />
                ),
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number;
  icon: typeof Users;
}) {
  return (
    <div className="rounded-[18px] border border-white/[0.07] bg-[#171814] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-white/20">
            {label}
          </p>

          <p className="mt-3 text-3xl font-medium tracking-[-0.05em]">
            {value}
          </p>
        </div>

        <div className="flex size-9 items-center justify-center rounded-[11px] bg-[#c9b58d]/10 text-[#c9b58d]">
          <Icon
            size={16}
          />
        </div>
      </div>
    </div>
  );
}

function TableHeading({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <th className="px-5 py-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-white/20">
      {children}
    </th>
  );
}

function UserRow({
  user,
}: {
  user: AdminUser;
}) {
  return (
    <tr className="border-b border-white/[0.05] last:border-b-0">
      <td className="px-5 py-5">
        <div className="flex items-center gap-3">
          <Avatar
            name={
              user.name
            }
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white/75">
              {user.name}
            </p>

            <p className="mt-1 truncate text-[10px] text-white/25">
              {user.email}
            </p>

            <p className="mt-1 text-[9px] text-white/15">
              ID #{user.id}
            </p>
          </div>
        </div>
      </td>

      <td className="px-5 py-5">
        <RoleBadge
          role={
            user.role
          }
        />
      </td>

      <td className="px-5 py-5">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <CalendarDays
            size={13}
          />

          {
            user.bookingCount
          }
        </div>
      </td>

      <td className="px-5 py-5">
        <p className="text-sm font-medium text-white/65">
          {formatPrice(
            user.totalSpent,
          )}
        </p>
      </td>

      <td className="px-5 py-5">
        <p className="text-xs text-white/45">
          {formatDate(
            user.createdAt,
          )}
        </p>
      </td>
    </tr>
  );
}

function UserCard({
  user,
}: {
  user: AdminUser;
}) {
  return (
    <article className="rounded-[20px] border border-white/[0.07] bg-[#171814] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar
            name={
              user.name
            }
          />

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {user.name}
            </p>

            <p className="mt-1 truncate text-[10px] text-white/25">
              {user.email}
            </p>
          </div>
        </div>

        <RoleBadge
          role={
            user.role
          }
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-4">
        <Detail
          label="Bookings"
          value={String(
            user.bookingCount,
          )}
        />

        <Detail
          label="Spent"
          value={formatPrice(
            user.totalSpent,
          )}
        />

        <Detail
          label="Joined"
          value={formatDate(
            user.createdAt,
          )}
        />
      </div>
    </article>
  );
}

function Avatar({
  name,
}: {
  name: string;
}) {
  return (
    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#4d5545] text-[10px] font-semibold text-white">
      {getInitials(
        name,
      )}
    </div>
  );
}

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  const isAdmin =
    role === "ADMIN";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-medium uppercase tracking-[0.12em] ${
        isAdmin
          ? "border-[#c9b58d]/20 bg-[#c9b58d]/10 text-[#d9c7a3]"
          : "border-white/10 bg-white/[0.03] text-white/40"
      }`}
    >
      {isAdmin && (
        <ShieldCheck
          size={11}
        />
      )}

      {role}
    </span>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[8px] uppercase tracking-[0.15em] text-white/20">
        {label}
      </p>

      <p className="mt-2 truncate text-[11px] text-white/55">
        {value}
      </p>
    </div>
  );
}

function UsersLoading() {
  return (
    <div className="mt-5 space-y-3">
      {[1, 2, 3, 4].map(
        (item) => (
          <div
            key={item}
            className="h-[90px] animate-pulse rounded-[20px] bg-white/[0.04]"
          />
        ),
      )}
    </div>
  );
}

function UsersError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mt-5 flex min-h-[320px] items-center justify-center rounded-[22px] border border-white/[0.07] bg-[#171814] px-5 text-center">
      <div>
        <p className="text-lg font-medium">
          Users unavailable
        </p>

        <p className="mt-2 text-sm text-white/30">
          {message}
        </p>

        <button
          type="button"
          onClick={
            onRetry
          }
          className="mt-6 rounded-full bg-[#f5f1e8] px-5 py-2.5 text-xs font-medium text-[#171714]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function EmptyUsers() {
  return (
    <div className="mt-5 flex min-h-[320px] items-center justify-center rounded-[22px] border border-white/[0.07] bg-[#171814] px-5 text-center">
      <div>
        <Users
          size={24}
          className="mx-auto text-[#c9b58d]"
        />

        <p className="mt-4 text-lg font-medium">
          No users found
        </p>

        <p className="mt-2 text-sm text-white/30">
          Try changing your search
          or role filter.
        </p>
      </div>
    </div>
  );
}