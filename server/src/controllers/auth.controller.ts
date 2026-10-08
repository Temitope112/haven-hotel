import type {
  Request,
  Response,
} from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { prisma } from "../lib/prisma.js";

import {
  sendPasswordResetEmail,
} from "../lib/email.js";

function getCookieOptions() {
  const isProduction =
    process.env.NODE_ENV ===
    "production";

  return {
    httpOnly: true,
    secure: isProduction,

    sameSite:
      isProduction
        ? ("none" as const)
        : ("lax" as const),

    maxAge:
      7 *
      24 *
      60 *
      60 *
      1000,

    path: "/",
  };
}

function getClearCookieOptions() {
  const isProduction =
    process.env.NODE_ENV ===
    "production";

  return {
    httpOnly: true,
    secure: isProduction,

    sameSite:
      isProduction
        ? ("none" as const)
        : ("lax" as const),

    path: "/",
  };
}

/*
 * ==========================================
 * REGISTER
 * ==========================================
 */

export async function register(
  req: Request,
  res: Response,
) {
  try {
    /*
      The body has already been validated
      and normalized by Zod.

      name is trimmed.
      email is trimmed + lowercased.
      password satisfies our rules.
    */
    const {
      name,
      email,
      password,
    } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email,
        },

        select: {
          id: true,
        },
      });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message:
          "An account with this email already exists.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        12,
      );

    const user =
      await prisma.user.create({
        data: {
          name,
          email,
          password:
            hashedPassword,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

    return res.status(201).json({
      success: true,
      message:
        "Account created successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "Registration failed:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create account.",
    });
  }
}

/*
 * ==========================================
 * LOGIN
 * ==========================================
 */

export async function login(
  req: Request,
  res: Response,
) {
  try {
    /*
      loginSchema already guarantees
      email/password are valid strings.

      The email is already normalized.
    */
    const {
      email,
      password,
    } = req.body as {
      email: string;
      password: string;
    };

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },
      });

    /*
      Keep the error identical whether
      the email or password is wrong.
    */
    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password.",
      });
    }

    const jwtSecret =
      process.env.JWT_SECRET;

    if (!jwtSecret) {
      console.error(
        "JWT_SECRET is not configured.",
      );

      return res.status(500).json({
        success: false,
        message:
          "Server authentication configuration error.",
      });
    }

    const csrfToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    /*
      The JWT contains identity and
      the CSRF value only.

      The user's current role is always
      retrieved from the database by
      authenticateToken.
    */
    const token =
      jwt.sign(
        {
          userId:
            user.id,

          csrfToken,
        },
        jwtSecret,
        {
          expiresIn: "7d",
        },
      );

    res.cookie(
      "haven_token",
      token,
      getCookieOptions(),
    );

    return res.status(200).json({
      success: true,
      message:
        "Login successful.",

      /*
        CSRF is intentionally accessible
        to the frontend. The JWT is not.
      */
      csrfToken,

      user: {
        id:
          user.id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        createdAt:
          user.createdAt,
      },
    });
  } catch (error) {
    console.error(
      "Login failed:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to log in.",
    });
  }
}

/*
 * ==========================================
 * LOGOUT
 * ==========================================
 */

export async function logout(
  req: Request,
  res: Response,
) {
  res.clearCookie(
    "haven_token",
    getClearCookieOptions(),
  );

  return res.status(200).json({
    success: true,
    message:
      "Logged out successfully.",
  });
}

/*
 * ==========================================
 * FORGOT PASSWORD
 * ==========================================
 */

export async function forgotPassword(
  req: Request,
  res: Response,
) {
  try {
    const {
      email,
    } = req.body as {
      email: string;
    };

    /*
      Always return the same response whether
      the account exists or not.

      This prevents email enumeration.
    */
    const publicResponse = {
      success: true,
      message:
        "If an account exists for that email, a password reset link has been sent.",
    };

    const user =
      await prisma.user.findUnique({
        where: {
          email,
        },

        select: {
          id: true,
          name: true,
          email: true,
        },
      });

    /*
      Do not reveal whether the email exists.
    */
    if (!user) {
      return res
        .status(200)
        .json(
          publicResponse,
        );
    }

    /*
      Remove any previous reset tokens
      belonging to this user.

      This means only the newest reset link
      remains valid.
    */
    await prisma.passwordResetToken.deleteMany({
      where: {
        userId:
          user.id,
      },
    });

    /*
      Generate a cryptographically secure
      random reset token.

      This raw token is ONLY sent to the user.
      It is never stored directly in the DB.
    */
    const resetToken =
      crypto
        .randomBytes(32)
        .toString("hex");

    /*
      Hash the token before storing it.

      If the database is compromised,
      attackers still cannot directly use
      the stored value as a reset link.
    */
    const tokenHash =
      crypto
        .createHash(
          "sha256",
        )
        .update(
          resetToken,
        )
        .digest("hex");

    /*
      Reset links are valid for 30 minutes.
    */
    const expiresAt =
      new Date(
        Date.now() +
          30 *
            60 *
            1000,
      );

    await prisma.passwordResetToken.create({
      data: {
        userId:
          user.id,

        tokenHash,

        expiresAt,
      },
    });

    const clientUrl =
      process.env.CLIENT_URL;

    if (!clientUrl) {
      console.error(
        "CLIENT_URL is not configured.",
      );

      /*
        Clean up the token because we cannot
        produce a valid reset link.
      */
      await prisma.passwordResetToken.deleteMany({
        where: {
          userId:
            user.id,
        },
      });

      return res.status(500).json({
        success: false,
        message:
          "Password reset is temporarily unavailable.",
      });
    }

    const normalizedClientUrl =
      clientUrl.replace(
        /\/$/,
        "",
      );

    const resetUrl =
      `${normalizedClientUrl}/reset-password?token=${encodeURIComponent(
        resetToken,
      )}`;

    try {
      await sendPasswordResetEmail({
        to:
          user.email,

        name:
          user.name,

        resetUrl,
      });
    } catch (emailError) {
      console.error(
        "Failed to send password reset email:",
        emailError,
      );

      /*
        If email delivery fails, invalidate
        the token so there is no unused
        valid token sitting in the database.
      */
      await prisma.passwordResetToken.deleteMany({
        where: {
          userId:
            user.id,
        },
      });

      return res.status(500).json({
        success: false,
        message:
          "Password reset email could not be sent. Please try again later.",
      });
    }

    return res
      .status(200)
      .json(
        publicResponse,
      );
  } catch (error) {
    console.error(
      "Forgot password failed:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to process password reset request.",
    });
  }
}

/*
 * ==========================================
 * RESET PASSWORD
 * ==========================================
 */

export async function resetPassword(
  req: Request,
  res: Response,
) {
  try {
    const {
      token,
      password,
    } = req.body as {
      token: string;
      password: string;
    };

    /*
      The browser sends the RAW reset token.

      We hash it using the same algorithm
      before querying the database.
    */
    const tokenHash =
      crypto
        .createHash(
          "sha256",
        )
        .update(token)
        .digest("hex");

    const resetToken =
      await prisma.passwordResetToken.findUnique({
        where: {
          tokenHash,
        },
      });

    /*
      Token does not exist.

      It may be:
      - invalid
      - already used
      - replaced by a newer reset request
    */
    if (!resetToken) {
      return res.status(400).json({
        success: false,
        message:
          "This password reset link is invalid or has already been used.",
      });
    }

    /*
      Check expiration.
    */
    if (
      resetToken.expiresAt <
      new Date()
    ) {
      await prisma.passwordResetToken.delete({
        where: {
          id:
            resetToken.id,
        },
      });

      return res.status(400).json({
        success: false,
        message:
          "This password reset link has expired. Please request a new one.",
      });
    }

    /*
      Make sure the associated account
      still exists.
    */
    const user =
      await prisma.user.findUnique({
        where: {
          id:
            resetToken.userId,
        },

        select: {
          id: true,
        },
      });

    if (!user) {
      await prisma.passwordResetToken.delete({
        where: {
          id:
            resetToken.id,
        },
      });

      return res.status(400).json({
        success: false,
        message:
          "This password reset link is no longer valid.",
      });
    }

    /*
      Use the same bcrypt cost as registration.
    */
    const hashedPassword =
      await bcrypt.hash(
        password,
        12,
      );

    /*
      Update the password and remove all reset
      tokens for this account atomically.

      Once this succeeds, the reset link
      cannot be reused.
    */
    await prisma.$transaction([
      prisma.user.update({
        where: {
          id:
            user.id,
        },

        data: {
          password:
            hashedPassword,
        },
      }),

      prisma.passwordResetToken.deleteMany({
        where: {
          userId:
            user.id,
        },
      }),
    ]);

    /*
      If the user happens to have an active
      Haven session in this browser, remove it.

      They should authenticate again using
      their new password.
    */
    res.clearCookie(
      "haven_token",
      getClearCookieOptions(),
    );

    return res.status(200).json({
      success: true,
      message:
        "Your password has been reset successfully. You can now sign in.",
    });
  } catch (error) {
    console.error(
      "Reset password failed:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to reset password.",
    });
  }
}

export async function updateProfile(
  req: Request,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const {
      name,
    } = req.body as {
      name: string;
    };

    const user =
      await prisma.user.update({
        where: {
          id:
            req.user.userId,
        },

        data: {
          name,
        },

        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "Update profile error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update profile.",
    });
  }
}
export async function changePassword(
  req: Request,
  res: Response,
) {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required.",
      });
    }

    const {
      currentPassword,
      newPassword,
    } = req.body as {
      currentPassword: string;
      newPassword: string;
    };

    const user =
      await prisma.user.findUnique({
        where: {
          id:
            req.user.userId,
        },

        select: {
          id: true,
          password: true,
        },
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "User not found.",
      });
    }

    const passwordMatches =
      await bcrypt.compare(
        currentPassword,
        user.password,
      );

    if (!passwordMatches) {
      return res.status(400).json({
        success: false,
        message:
          "Your current password is incorrect.",
      });
    }

    const sameAsCurrent =
      await bcrypt.compare(
        newPassword,
        user.password,
      );

    if (sameAsCurrent) {
      return res.status(400).json({
        success: false,
        message:
          "Your new password must be different from your current password.",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        12,
      );

    await prisma.user.update({
      where: {
        id:
          user.id,
      },

      data: {
        password:
          hashedPassword,
      },
    });

    await prisma.passwordResetToken.deleteMany({
      where: {
        userId:
          user.id,
      },
    });

    return res.status(200).json({
      success: true,
      message:
        "Password changed successfully.",
    });
  } catch (error) {
    console.error(
      "Change password error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to change password.",
    });
  }
}