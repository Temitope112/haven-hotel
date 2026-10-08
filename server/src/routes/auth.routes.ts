import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  changePassword,
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  updateProfile,
} from "../controllers/auth.controller.js";

import {
  validateBody,
} from "../middleware/validation.middleware.js";

import {
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "../schemas/auth.schema.js";

import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

import {
  csrfProtection,
} from "../middleware/csrf.middleware.js";

import {
  prisma,
} from "../lib/prisma.js";

const router = Router();

/*
  Strict limiter for authentication-related
  endpoints that attackers could repeatedly hit.
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

/*
 * ==========================================
 * REGISTER
 * ==========================================
 */

router.post(
  "/register",
  authLimiter,
  validateBody(
    registerSchema,
  ),
  register,
);

/*
 * ==========================================
 * LOGIN
 * ==========================================
 */

router.post(
  "/login",
  authLimiter,
  validateBody(
    loginSchema,
  ),
  login,
);

/*
 * ==========================================
 * FORGOT PASSWORD
 * ==========================================
 */

router.post(
  "/forgot-password",
  authLimiter,
  validateBody(
    forgotPasswordSchema,
  ),
  forgotPassword,
);

/*
 * ==========================================
 * RESET PASSWORD
 * ==========================================
 */

router.post(
  "/reset-password",
  authLimiter,
  validateBody(
    resetPasswordSchema,
  ),
  resetPassword,
);

/*
 * ==========================================
 * LOGOUT
 * ==========================================
 */

router.post(
  "/logout",
  logout,
);

/*
 * ==========================================
 * UPDATE PROFILE
 * ==========================================
 */

router.patch(
  "/profile",
  authenticateToken,
  csrfProtection,
  validateBody(
    updateProfileSchema,
  ),
  updateProfile,
);

/*
 * ==========================================
 * CHANGE PASSWORD
 * ==========================================
 */

router.patch(
  "/change-password",
  authenticateToken,
  csrfProtection,
  validateBody(
    changePasswordSchema,
  ),
  changePassword,
);

/*
 * ==========================================
 * CURRENT USER
 * ==========================================
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