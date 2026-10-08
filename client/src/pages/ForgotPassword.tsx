import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Mail,
} from "lucide-react";

import {
  Link,
} from "react-router";

import axios from "axios";

import {
  motion,
} from "motion/react";

import {
  api,
} from "../services/api";

type ForgotPasswordResponse = {
  success: boolean;
  message: string;
};

export default function ForgotPassword() {
  const [
    email,
    setEmail,
  ] = useState("");

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanEmail =
      email.trim();

    if (!cleanEmail) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccessMessage("");

      const response =
        await api.post<ForgotPasswordResponse>(
          "/api/auth/forgot-password",
          {
            email:
              cleanEmail,
          },
        );

      setSuccessMessage(
        response.data
          .message,
      );
    } catch (
      requestError: unknown
    ) {
      console.error(
        "Forgot password error:",
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
            "We couldn't process your request right now.",
        );

        return;
      }

      setError(
        "We couldn't process your request right now.",
      );
    } finally {
      setLoading(false);
    }
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
          className="w-full max-w-[520px]"
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
              Account recovery
            </p>

            <h1 className="display-font mt-4 text-[clamp(3rem,10vw,4.8rem)] leading-[0.9] tracking-[-0.055em]">
              Forgot your
              <br />

              <span className="text-white/30">
                password?
              </span>
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-white/45">
              Enter the email
              connected to your
              Haven account. We'll
              send you a secure
              link to create a new
              password.
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

                <p className="mt-5 text-xs leading-6 text-white/30">
                  Didn't receive
                  anything? Check
                  your spam folder
                  or try again in a
                  few minutes.
                </p>
              </div>
            ) : (
              <form
                onSubmit={
                  handleSubmit
                }
                className="mt-8"
              >
                <label
                  htmlFor="email"
                  className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40"
                >
                  Email address
                </label>

                <div className="relative mt-3">
                  <Mail
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30"
                  />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={
                      email
                    }
                    onChange={(
                      event,
                    ) =>
                      setEmail(
                        event
                          .target
                          .value,
                      )
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.025] py-4 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#c9b58d]/50 focus:bg-white/[0.04]"
                  />
                </div>

                {error && (
                  <p className="mt-3 text-sm leading-6 text-red-300">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    !email.trim()
                  }
                  className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#f5f1e8] px-5 py-3.5 text-sm font-medium text-[#171714] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {loading
                    ? "Sending..."
                    : "Send reset link"}

                  {!loading && (
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  )}
                </button>
              </form>
            )}
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-white/25">
            For security, Haven
            won't confirm whether
            an email address is
            registered.
          </p>
        </motion.div>
      </div>
    </main>
  );
}