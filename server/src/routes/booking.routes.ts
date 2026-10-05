import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getMyBookings,
} from "../controllers/booking.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticate, createBooking);

router.get("/me", authenticate, getMyBookings);

router.get("/:id", authenticate, getBookingById);

router.patch("/:id/cancel", authenticate, cancelBooking);

export default router;