import { Router } from "express";

import {
  cancelBooking,
  createBooking,
  getBookingById,
  getMyBookings,
} from "../controllers/booking.controller.js";

import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

import {
  csrfProtection,
} from "../middleware/csrf.middleware.js";

import {
  validateBody,
} from "../middleware/validation.middleware.js";

import {
  createBookingSchema,
} from "../schemas/booking.schema.js";

const router = Router();

router.post(
  "/",
  authenticateToken,
  csrfProtection,
  validateBody(
    createBookingSchema,
  ),
  createBooking,
);

router.get(
  "/me",
  authenticateToken,
  getMyBookings,
);

router.get(
  "/:id",
  authenticateToken,
  getBookingById,
);

router.patch(
  "/:id/cancel",
  authenticateToken,
  csrfProtection,
  cancelBooking,
);

export default router;