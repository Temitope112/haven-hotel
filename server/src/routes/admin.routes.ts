import { Router } from "express";

import {
  createRoom,
  getAdminOverview,
  getAllBookings,
  getAllRooms,
  getAllUsers,
  updateBookingStatus,
  updateRoom,
  uploadRoomImage,
} from "../controllers/admin.controller.js";

import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

import {
  csrfProtection,
} from "../middleware/csrf.middleware.js";

import {
  requireAdmin,
} from "../middleware/admin.middleware.js";

import {
  uploadRoomImage as roomImageUpload,
} from "../middleware/upload.middleware.js";

const router = Router();

/*
  Everything below requires:
  1. A valid authenticated session
  2. Valid CSRF protection for unsafe methods
  3. ADMIN role
*/

router.use(
  authenticateToken,
);

router.use(
  csrfProtection,
);

router.use(
  requireAdmin,
);

router.get(
  "/overview",
  getAdminOverview,
);

router.get(
  "/bookings",
  getAllBookings,
);

router.patch(
  "/bookings/:id/status",
  updateBookingStatus,
);

router.get(
  "/users",
  getAllUsers,
);

router.get(
  "/rooms",
  getAllRooms,
);

router.post(
  "/rooms",
  createRoom,
);

router.patch(
  "/rooms/:id",
  updateRoom,
);

router.post(
  "/rooms/upload-image",
  roomImageUpload.single(
    "image",
  ),
  uploadRoomImage,
);

export default router;