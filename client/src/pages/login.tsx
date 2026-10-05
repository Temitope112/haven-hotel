import { useState } from "react";
import type { SubmitEvent } from "react";

import { motion } from "motion/react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import axios from "axios";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import {
  loginUser,
  saveAuth,
} from "../services/auth";

import { useAuth } from "../context/AuthContext";

type LocationState = {
  from?: string;
};

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const { setUser } = useAuth();

  const state =
    location.state as
      | LocationState
      | null;

  const redirectTo =
    state?.from || "/account";

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const formComplete =
    email.trim() !== "" &&
    password.trim() !== "";

  async function handleSubmit(
    event: SubmitEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !formComplete ||
      loading
    ) {
      return;
    }

    setError("");

    try {
      setLoading(true);

      const data =
        await loginUser({
          email:
            email.trim(),
          password,
        });

      saveAuth(
        data.token,
        data.user,
      );

      /*
        saveAuth() keeps the session
        available after a page refresh.

        setUser() updates React immediately,
        so the Navbar and protected pages
        know the user has signed in.
      */
      setUser(data.user);

      navigate(
        redirectTo,
        {
          replace: true,
        },
      );
    } catch (
      error: unknown
    ) {
      if (
        axios.isAxiosError(
          error,
        )
      ) {
        setError(
          error.response?.data
            ?.message ||
            "Unable to sign in.",
        );
      } else {
        setError(
          "Unable to sign in.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#151613] text-[#f5f1e8]">
      <div className="grid min-h-screen w-full lg:grid-cols-[1.05fr_.95fr]">
        {/* IMAGE SIDE */}
        <section className="relative hidden min-w-0 overflow-hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=90"
            alt="Haven interior"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          <div className="relative z-10 flex h-full flex-col justify-end p-12 xl:p-16">
            <p className="text-[10px] uppercase tracking-[0.26em] text-white/50">
              Welcome back
            </p>

            <h1 className="display-font mt-4 max-w-2xl text-6xl leading-[0.9] tracking-[-0.055em] xl:text-7xl">
              Return to
              <br />
              somewhere quiet.
            </h1>
          </div>
        </section>

        {/* FORM SIDE */}
        <section className="flex min-h-screen min-w-0 items-center px-5 py-28 sm:px-8 lg:px-12 xl:px-20">
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            className="mx-auto w-full max-w-md min-w-0"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b5aa91]">
              Sign in
            </p>

            <h2 className="display-font mt-4 text-[clamp(3rem,10vw,4.5rem)] leading-[0.9] tracking-[-0.055em]">
              Welcome back.
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-white/45">
              Sign in to manage your
              bookings and continue
              where you left off.
            </p>

            {state?.from && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-6 rounded-[16px] border border-[#c9b58d]/15 bg-[#c9b58d]/5 px-4 py-3 text-sm leading-6 text-[#d8cab0]"
              >
                Sign in to continue
                your reservation.
              </motion.div>
            )}

            <form
              onSubmit={
                handleSubmit
              }
              className="mt-9 space-y-4"
            >
              {/* EMAIL */}
              <label className="block min-w-0">
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                  Email
                </span>

                <input
                  type="email"
                  value={email}
                  onChange={(
                    event,
                  ) => {
                    setEmail(
                      event.target
                        .value,
                    );

                    if (error) {
                      setError("");
                    }
                  }}
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="mt-2 h-14 w-full min-w-0 rounded-[16px] border border-white/10 bg-white/[0.025] px-4 text-base text-white outline-none transition placeholder:text-white/20 focus:border-white/25 sm:text-sm"
                />
              </label>

              {/* PASSWORD */}
              <label className="block min-w-0">
                <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                  Password
                </span>

                <div className="relative mt-2 min-w-0">
                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={
                      password
                    }
                    onChange={(
                      event,
                    ) => {
                      setPassword(
                        event.target
                          .value,
                      );

                      if (
                        error
                      ) {
                        setError(
                          "",
                        );
                      }
                    }}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-14 w-full min-w-0 rounded-[16px] border border-white/10 bg-white/[0.025] px-4 pr-12 text-base text-white outline-none transition placeholder:text-white/20 focus:border-white/25 sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (
                          current,
                        ) =>
                          !current,
                      )
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-white/35 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff
                        size={17}
                      />
                    ) : (
                      <Eye
                        size={17}
                      />
                    )}
                  </button>
                </div>
              </label>

              {/* ERROR */}
              {error && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 8,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  className="break-words rounded-[16px] border border-red-400/15 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200"
                >
                  {error}
                </motion.div>
              )}

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={
                  !formComplete ||
                  loading
                }
                className="group flex min-h-14 w-full min-w-0 items-center justify-between gap-4 rounded-full bg-[#f5f1e8] px-5 text-sm font-medium text-[#171714] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <span className="truncate">
                  {loading
                    ? "Signing in..."
                    : "Sign in"}
                </span>

                {loading ? (
                  <LoaderCircle
                    size={17}
                    className="shrink-0 animate-spin"
                  />
                ) : (
                  <ArrowRight
                    size={17}
                    className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* REGISTER */}
            <p className="mt-7 text-center text-sm leading-6 text-white/40">
              New to Haven?{" "}
              <Link
                to="/register"
                state={{
                  from:
                    state?.from,
                }}
                className="text-white transition hover:text-white/70"
              >
                Create an account
              </Link>
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}