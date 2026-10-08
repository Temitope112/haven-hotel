import {
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LoaderCircle,
} from "lucide-react";

import axios from "axios";

import {
  Link,
  useSearchParams,
} from "react-router";

import {
  motion,
} from "motion/react";

import {
  api,
} from "../services/api";

type ResetPasswordResponse = {
  success: boolean;
  message: string;
};

export default function ResetPassword() {
  const [
    searchParams,
  ] = useSearchParams();

  const token =
    searchParams.get("token") ??
    "";

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const passwordRules =
    useMemo(
      () => {
        return {
          minLength:
            password.length >=
            8,

          uppercase:
            /[A-Z]/.test(
              password,
            ),

          lowercase:
            /[a-z]/.test(
              password,
            ),

          number:
            /\d/.test(
              password,
            ),
        };
      },
      [password],
    );

  const passwordValid =
    Object.values(
      passwordRules,
    ).every(Boolean);

  const passwordsMatch =
    password !== "" &&
    password ===
      confirmPassword;

  const formComplete =
    token !== "" &&
    passwordValid &&
    passwordsMatch;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !formComplete ||
      loading
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response =
        await api.post<ResetPasswordResponse>(
          "/api/auth/reset-password",
          {
            token,
            password,
          },
        );

      setSuccessMessage(
        response.data
          .message,
      );

      setPassword("");
      setConfirmPassword("");
    } catch (
      requestError: unknown
    ) {
      console.error(
        "Reset password error:",
        requestError,
      );

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
            "We couldn't reset your password.",
        );

        return;
      }

      setError(
        "We couldn't reset your password.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <main className="min-h-screen bg-[#151613] px-5 py-10 text-[#f5f1e8] sm:px-6 lg:px-12">
        <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1400px] items-center justify-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="w-full max-w-[520px] rounded-[30px] border border-white/10 bg-[#1c1d19] p-7 sm:p-9"
          >
            <KeyRound
              size={24}
              className="text-[#c9b58d]"
            />

            <h1 className="display-font mt-5 text-4xl tracking-[-0.045em]">
              Invalid reset link.
            </h1>

            <p className="mt-4 text-sm leading-7 text-white/45">
              This password reset link is missing its security token.
              Request a new reset email and try again.
            </p>

            <Link
              to="/forgot-password"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#f5f1e8] px-5 py-3 text-sm font-medium text-[#171714]"
            >
              Request new link

              <ArrowRight
                size={14}
              />
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#151613] px-5 py-10 text-[#f5f1e8] sm:px-6 lg:px-12">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-[1400px] items-center justify-center">
        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
          }}
          className="w-full max-w-[540px]"
        >
          <Link
            to="/login"
            className="group mb-8 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
          >
            <ArrowLeft
              size={15}
              className="transition-transform group-hover:-translate-x-1"
            />

            Back to sign in
          </Link>

          <div className="rounded-[30px] border border-white/10 bg-[#1c1d19] p-6 sm:p-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#b5aa91]">
              Password reset
            </p>

            <h1 className="display-font mt-4 text-[clamp(3rem,10vw,4.8rem)] leading-[0.9] tracking-[-0.055em]">
              Choose a new
              <br />

              <span className="text-white/30">
                password.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/45">
              Create a strong password for your Haven account.
            </p>

            {successMessage ? (
              <div className="mt-8">
                <div className="rounded-[22px] border border-emerald-400/15 bg-emerald-400/[0.06] p-5">
                  <CheckCircle2
                    size={21}
                    className="text-emerald-300"
                  />

                  <p className="mt-4 text-sm leading-7 text-white/70">
                    {
                      successMessage
                    }
                  </p>
                </div>

                <Link
                  to="/login"
                  className="group mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#f5f1e8] px-5 py-3.5 text-sm font-medium text-[#171714] transition hover:bg-white"
                >
                  Sign in

                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </Link>
              </div>
            ) : (
              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-8 space-y-5"
              >
                <label className="block">
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                    New password
                  </span>

                  <div className="relative mt-2">
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

                        if (error) {
                          setError("");
                        }
                      }}
                      autoComplete="new-password"
                      placeholder="Create a new password"
                      className="h-14 w-full rounded-[16px] border border-white/10 bg-white/[0.025] px-4 pr-12 text-base text-white outline-none transition placeholder:text-white/20 focus:border-white/25 sm:text-sm"
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

                <div className="grid gap-2 sm:grid-cols-2">
                  <PasswordRule
                    valid={
                      passwordRules.minLength
                    }
                    text="At least 8 characters"
                  />

                  <PasswordRule
                    valid={
                      passwordRules.uppercase
                    }
                    text="One uppercase letter"
                  />

                  <PasswordRule
                    valid={
                      passwordRules.lowercase
                    }
                    text="One lowercase letter"
                  />

                  <PasswordRule
                    valid={
                      passwordRules.number
                    }
                    text="One number"
                  />
                </div>

                <label className="block">
                  <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
                    Confirm password
                  </span>

                  <div className="relative mt-2">
                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={
                        confirmPassword
                      }
                      onChange={(
                        event,
                      ) => {
                        setConfirmPassword(
                          event.target
                            .value,
                        );

                        if (error) {
                          setError("");
                        }
                      }}
                      autoComplete="new-password"
                      placeholder="Repeat your new password"
                      className="h-14 w-full rounded-[16px] border border-white/10 bg-white/[0.025] px-4 pr-12 text-base text-white outline-none transition placeholder:text-white/20 focus:border-white/25 sm:text-sm"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (
                            current,
                          ) =>
                            !current,
                        )
                      }
                      aria-label={
                        showConfirmPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      className="absolute right-3 top-1/2 flex size-10 -translate-y-1/2 items-center justify-center text-white/35 transition hover:text-white"
                    >
                      {showConfirmPassword ? (
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

                  {confirmPassword &&
                    !passwordsMatch && (
                      <p className="mt-2 text-xs text-red-300">
                        Passwords do not match.
                      </p>
                    )}
                </label>

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
                    className="rounded-[16px] border border-red-400/15 bg-red-400/5 px-4 py-3 text-sm leading-6 text-red-200"
                  >
                    {error}
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={
                    !formComplete ||
                    loading
                  }
                  className="group flex min-h-14 w-full items-center justify-between gap-4 rounded-full bg-[#f5f1e8] px-5 text-sm font-medium text-[#171714] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>
                    {loading
                      ? "Resetting..."
                      : "Reset password"}
                  </span>

                  {loading ? (
                    <LoaderCircle
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <ArrowRight
                      size={17}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}

function PasswordRule({
  valid,
  text,
}: {
  valid: boolean;
  text: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          valid
            ? "bg-emerald-300"
            : "bg-white/15"
        }`}
      />

      <span
        className={
          valid
            ? "text-emerald-200/80"
            : "text-white/30"
        }
      >
        {text}
      </span>
    </div>
  );
}