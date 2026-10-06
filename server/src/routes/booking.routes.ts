import { Router } from "express";
import {
  cancelBooking,
  createBooking,
  getBookingById,
  getMyBookings,
} from "../controllers/booking.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", authenticateToken, createBooking);

router.get("/me", authenticateToken, getMyBookings);

router.get("/:id", authenticateToken, getBookingById);

router.patch("/:id/cancel", authenticateToken, cancelBooking);

export default router;