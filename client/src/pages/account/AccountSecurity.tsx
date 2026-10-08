import {
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  LockKeyhole,
  Save,
  ShieldCheck,
} from "lucide-react";

import axios from "axios";

import {
  motion,
} from "motion/react";

import {
  api,
} from "../../services/api";

type ChangePasswordResponse = {
  success: boolean;
  message: string;
};

export default function AccountSecurity() {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [
    showCurrent,
    setShowCurrent,
  ] = useState(false);

  const [
    showNew,
    setShowNew,
  ] = useState(false);

  const [
    showConfirm,
    setShowConfirm,
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
    success,
    setSuccess,
  ] = useState("");

  const passwordRules =
    useMemo(
      () => ({
        minLength:
          newPassword.length >= 8,

        uppercase:
          /[A-Z]/.test(
            newPassword,
          ),

        lowercase:
          /[a-z]/.test(
            newPassword,
          ),

        number:
          /\d/.test(
            newPassword,
          ),
      }),
      [newPassword],
    );

  const passwordValid =
    Object.values(
      passwordRules,
    ).every(Boolean);

  const passwordsMatch =
    newPassword !== "" &&
    newPassword ===
      confirmPassword;

  const formValid =
    currentPassword.length >
      0 &&
    passwordValid &&
    passwordsMatch;

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !formValid ||
      loading
    ) {
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response =
        await api.patch<ChangePasswordResponse>(
          "/api/auth/change-password",
          {
            currentPassword,
            newPassword,
          },
        );

      setSuccess(
        response.data
          .message,
      );

      setCurrentPassword(
        "",
      );

      setNewPassword("");

      setConfirmPassword(
        "",
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
            "Unable to change password.",
        );

        return;
      }

      setError(
        "Unable to change password.",
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
          Account security
        </p>

        <h1 className="display-font mt-3 text-[clamp(3rem,7vw,5.7rem)] leading-[0.88] tracking-[-0.06em]">
          Security.
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-7 text-white/40">
          Manage your password and keep your Haven account secure.
        </p>
      </motion.div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <section className="rounded-[28px] border border-white/10 bg-[#1c1d19] p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#c9b58d]/20 bg-[#c9b58d]/10 text-[#d8c8a7]">
              <KeyRound
                size={17}
              />
            </span>

            <div>
              <p className="text-sm font-medium">
                Change password
              </p>

              <p className="mt-1 text-xs text-white/30">
                Use a strong password you do not reuse elsewhere.
              </p>
            </div>
          </div>

          <form
            onSubmit={
              handleSubmit
            }
            className="mt-8 space-y-6"
          >
            <PasswordField
              label="Current password"
              value={
                currentPassword
              }
              onChange={
                setCurrentPassword
              }
              show={
                showCurrent
              }
              onToggle={() =>
                setShowCurrent(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
            />

            <PasswordField
              label="New password"
              value={
                newPassword
              }
              onChange={
                setNewPassword
              }
              show={
                showNew
              }
              onToggle={() =>
                setShowNew(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
            />

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

            <PasswordField
              label="Confirm new password"
              value={
                confirmPassword
              }
              onChange={
                setConfirmPassword
              }
              show={
                showConfirm
              }
              onToggle={() =>
                setShowConfirm(
                  (
                    current,
                  ) =>
                    !current,
                )
              }
            />

            {confirmPassword &&
              !passwordsMatch && (
                <p className="text-xs text-red-300">
                  Passwords do not match.
                </p>
              )}

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
                  !formValid ||
                  loading
                }
                className="flex items-center gap-2 rounded-full bg-[#f5f1e8] px-5 py-3 text-sm font-medium text-[#171714] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save
                  size={15}
                />

                {loading
                  ? "Updating..."
                  : "Update password"}
              </button>
            </div>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-[28px] border border-white/10 bg-[#1c1d19] p-6">
            <ShieldCheck
              size={22}
              className="text-[#c9b58d]"
            />

            <h2 className="display-font mt-5 text-3xl tracking-[-0.04em]">
              Account protection.
            </h2>

            <p className="mt-4 text-sm leading-7 text-white/40">
              Your password is stored securely as a one-way hash.
              Haven never stores your original password.
            </p>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-white/[0.02] p-6">
            <LockKeyhole
              size={20}
              className="text-[#c9b58d]"
            />

            <p className="mt-4 text-sm font-medium">
              Forgot your password?
            </p>

            <p className="mt-2 text-xs leading-6 text-white/30">
              You can always use the secure password-reset flow from the sign-in page.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/35">
        {label}
      </span>

      <div className="relative mt-2">
        <input
          type={
            show
              ? "text"
              : "password"
          }
          value={
            value
          }
          onChange={(
            event,
          ) =>
            onChange(
              event.target
                .value,
            )
          }
          autoComplete="new-password"
          className="h-14 w-full rounded-[16px] border border-white/10 bg-white/[0.025] px-4 pr-12 text-sm text-white outline-none transition focus:border-white/25"
        />

        <button
          type="button"
          onClick={
            onToggle
          }
          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center text-white/30 transition hover:text-white"
        >
          {show ? (
            <EyeOff
              size={16}
            />
          ) : (
            <Eye
              size={16}
            />
          )}
        </button>
      </div>
    </label>
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