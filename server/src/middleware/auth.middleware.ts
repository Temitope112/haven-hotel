import type {
  NextFunction,
  Request,
  Response,
} from "express";

import jwt from "jsonwebtoken";

import { prisma } from "../lib/prisma.js";

type JwtPayload = {
  userId: number;
  csrfToken?: string;
};

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token =
    req.cookies
      ?.haven_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message:
        "Authentication required.",
    });
  }

  const secret =
    process.env.JWT_SECRET;

  if (!secret) {
    console.error(
      "JWT_SECRET is not configured.",
    );

    return res.status(500).json({
      success: false,
      message:
        "Server authentication configuration error.",
    });
  }

  try {
    const decoded =
      jwt.verify(
        token,
        secret,
      ) as JwtPayload;

    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid authentication token.",
      });
    }

    const user =
      await prisma.user.findUnique({
        where: {
          id:
            decoded.userId,
        },

        select: {
          id: true,
          role: true,
        },
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "User account no longer exists.",
      });
    }

    req.user = {
      userId:
        user.id,

      role:
        user.role,
    };

    /*
      Make the CSRF value available
      for the CSRF middleware.
    */
    res.locals.csrfToken =
      decoded.csrfToken;

    next();
  } catch (error) {
    if (
      error instanceof
      jwt.TokenExpiredError
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Session expired. Please sign in again.",
      });
    }

    return res.status(401).json({
      success: false,
      message:
        "Invalid authentication token.",
    });
  }
}