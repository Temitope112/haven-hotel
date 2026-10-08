import {
  useState,
} from "react";

import type {
  User,
} from "../../types/auth";

import type {
  FormEvent,
} from "react";

import {
  CalendarDays,
  CheckCircle2,
  Mail,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import axios from "axios";

import {
  motion,
} from "motion/react";

import {
  api,
} from "../../services/api";

import {
  useAuth,
} from "../../context/AuthContext";

type UpdateProfileResponse = {
  success: boolean;
  message: string;
  user: User;
};

function formatDate(
  value?: string,
) {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(
    new Date(value),
  );
}

export default function AccountProfile() {
  const {
    user,
    setUser,
  } = useAuth();

  const [
    name,
    setName,
  ] = useState(
    user?.name ?? "",
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const cleanName =
    name.trim();

  const hasChanged =
    cleanName !==
      (user?.name ?? "") &&
    cleanName.length >= 2;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !hasChanged ||
      loading
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response =
        await api.patch<UpdateProfileResponse>(
          "/api/auth/profile",
          {
            name:
              cleanName,
          },
        );

      setUser(
        response.data.user,
      );

      localStorage.setItem(
        "haven_user",
        JSON.stringify(
          response.data.user,
        ),
      );

      setSuccess(
        response.data
          .message,
      );
    } catch (
      requestError: unknown
    ) {
      if (
        axios.isAxiosError(
          requestError,
        )
      ) {
        setError(
          requestError
            .response
            ?.data
            ?.message ||
            "Unable to update your profile.",
        );

        return;
      }

      setError(
        "Unable to update your profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <motion.div
        initial={{
          opacity: 0,
          y: 16,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.55,
        }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b5aa91]">
          Guest profile
        </p>

        <h1 className="display-font mt-3 text-[clamp(3rem,7vw,5.7rem)] leading-[0.88] tracking-[-0.06em]">
          Your profile.
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-white/40">
          Keep your guest details accurate so your Haven experience stays personal.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-[28px] border border-white/10 bg-[#1c1d19] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9b58d]/20 bg-[#c9b58d]/10 text-[#d8c8a7]">
              <UserRound
                size={17}
              />
            </span>

            <div>
              <p className="text-sm font-medium">
                Personal details
              </p>

              <p className="mt-1 text-xs text-white/30">
                Information connected to your Haven account.
              </p>
            </div>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8 space-y-6"
          >
            <label className="block">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                Full name
              </span>

              <input
                type="text"
                value={
                  name
                }
                onChange={(
                  event,
                ) => {
                  setName(
                    event.target
                      .value,
                  );

                  if (error) {
                    setError("");
                  }

                  if (success) {
                    setSuccess("");
                  }
                }}
                autoComplete="name"
                className="mt-2 h-14 w-full rounded-[16px] border border-white/10 bg-white/[0.025] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
              />
            </label>

            <label className="block">
              <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                Email address
              </span>

              <div className="relative mt-2">
                <Mail
                  size={15}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
                />

                <input
                  type="email"
                  value={
                    user?.email ??
                    ""
                  }
                  readOnly
                  className="h-14 w-full rounded-[16px] border border-white/10 bg-white/[0.015] py-3 pl-11 pr-4 text-sm text-white/40 outline-none"
                />
              </div>

              <p className="mt-2 text-xs leading-5 text-white/25">
                Email changes will require verification and are not available here yet.
              </p>
            </label>

            {error && (
              <div className="rounded-[16px] border border-red-400/15 bg-red-400/[0.05] px-4 py-3 text-sm leading-6 text-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 rounded-[16px] border border-emerald-400/15 bg-emerald-400/[0.05] px-4 py-3">
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-300"
                />

                <p className="text-sm leading-6 text-emerald-100/80">
                  {success}
                </p>
              </div>
            )}

            <div className="flex justify-end border-t border-white/10 pt-6">
              <button
                type="submit"
                disabled={
                  !hasChanged ||
                  loading
                }
                className="flex items-center gap-2 rounded-full bg-[#f5f1e8] px-5 py-3 text-sm font-medium text-[#171714] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save
                  size={15}
                />

                {loading
                  ? "Saving..."
                  : "Save changes"}
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#1c1d19] p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b5aa91]">
              Account
            </p>

            <div className="mt-6 space-y-5">
              <ProfileDetail
                icon={
                  UserRound
                }
                label="Guest name"
                value={
                  user?.name ||
                  "Not available"
                }
              />

              <ProfileDetail
                icon={
                  Mail
                }
                label="Email"
                value={
                  user?.email ||
                  "Not available"
                }
              />

              <ProfileDetail
                icon={
                  ShieldCheck
                }
                label="Account type"
                value={
                  user?.role ===
                  "ADMIN"
                    ? "Administrator"
                    : "Guest"
                }
              />

              <ProfileDetail
                icon={
                  CalendarDays
                }
                label="Member since"
                value={formatDate(
                  user?.createdAt,
                )}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ProfileDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{
    size?: number;
  }>;

  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 text-[#c9b58d]">
        <Icon
          size={15}
        />
      </span>

      <div className="min-w-0">
        <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">
          {label}
        </p>

        <p className="mt-1 break-words text-sm text-white/70">
          {value}
        </p>
      </div>
    </div>
  );
}