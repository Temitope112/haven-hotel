import type {
  Request,
  Response,
} from "express";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { prisma } from "../lib/prisma.js";

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

export async function logout(
  req: Request,
  res: Response,
) {
  const isProduction =
    process.env.NODE_ENV ===
    "production";

  res.clearCookie(
    "haven_token",
    {
      httpOnly: true,
      secure:
        isProduction,

      sameSite:
        isProduction
          ? "none"
          : "lax",

      path: "/",
    },
  );

  return res.status(200).json({
    success: true,
    message:
      "Logged out successfully.",
  });
}