import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";

import {
  validateBody,
} from "../middleware/validation.middleware.js";

import {
  loginSchema,
  registerSchema,
} from "../schemas/auth.schema.js";
import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

import {
  prisma,
} from "../lib/prisma.js";

const router = Router();

/*
  Strict limiter only for endpoints
  that attackers could repeatedly hit
  to guess credentials or create accounts.
*/
const authLimiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,

    limit: 20,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
      success: false,
      message:
        "Too many authentication attempts. Please try again later.",
    },
  });

router.post(
  "/register",
  authLimiter,
  validateBody(
    registerSchema,
  ),
  register,
);

router.post(
  "/login",
  authLimiter,
  validateBody(
    loginSchema,
  ),
  login,
);

/*
  Logout does not need the strict
  authentication-attempt limiter.
*/
router.post(
  "/logout",
  logout,
);

/*
  Current authenticated user.

  authenticateToken reads the httpOnly
  haven_token cookie, validates the JWT,
  and confirms the user's current role
  from the database.
*/
router.get(
  "/me",
  authenticateToken,
  async (
    req,
    res,
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message:
            "Authentication required.",
        });
      }

      const user =
        await prisma.user.findUnique({
          where: {
            id:
              req.user.userId,
          },

          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
          },
        });

      if (!user) {
        return res.status(404).json({
          success: false,
          message:
            "User not found.",
        });
      }

      return res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.error(
        "Get current user error:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to load current user.",
      });
    }
  },
);

export default router;