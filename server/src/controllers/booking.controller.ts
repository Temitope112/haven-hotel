import type { Response } from "express";
import type { AuthenticatedRequest } from "../middleware/auth.middleware.js";
import { prisma } from "../lib/prisma.js";

export async function createBooking(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const {
      roomId,
      checkIn,
      checkOut,
      guests,
    } = req.body;

    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    if (!roomId || !checkIn || !checkOut || !guests) {
      res.status(400).json({
        success: false,
        message: "Room, check-in, check-out, and guests are required",
      });

      return;
    }

    const room = await prisma.room.findUnique({
      where: {
        id: Number(roomId),
      },
    });

    if (!room) {
      res.status(404).json({
        success: false,
        message: "Room not found",
      });

      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid check-in or check-out date",
      });

      return;
    }

    if (checkInDate >= checkOutDate) {
      res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date",
      });

      return;
    }

    if (Number(guests) < 1) {
      res.status(400).json({
        success: false,
        message: "Guest count must be at least 1",
      });

      return;
    }

    if (Number(guests) > room.capacity) {
      res.status(400).json({
        success: false,
        message: "Guest count exceeds room capacity",
      });

      return;
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        roomId: room.id,

        status: {
          in: ["PENDING", "CONFIRMED", "CHECKED_IN"],
        },

        checkIn: {
          lt: checkOutDate,
        },

        checkOut: {
          gt: checkInDate,
        },
      },
    });

    if (overlappingBooking) {
      res.status(409).json({
        success: false,
        message: "Room is not available for the selected dates",
      });

      return;
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const numberOfNights = Math.ceil(
      (checkOutDate.getTime() - checkInDate.getTime()) /
        millisecondsPerDay,
    );

    const totalPrice =
      Number(room.price) * numberOfNights;

    const booking = await prisma.booking.create({
      data: {
        userId,
        roomId: Number(roomId),
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: Number(guests),
        totalPrice,
      },

      include: {
        room: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Failed to create booking:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create booking",
    });
  }
}
export async function getMyBookings(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    const bookings = await prisma.booking.findMany({
      where: {
        userId,
      },

      include: {
        room: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Failed to fetch bookings:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
}
export async function getBookingById(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.userId;
    const bookingId = Number(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    if (Number.isNaN(bookingId)) {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });

      return;
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },

      include: {
        room: true,

        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });

      return;
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Failed to fetch booking:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
    });
  }
}
export async function cancelBooking(
  req: AuthenticatedRequest,
  res: Response,
) {
  try {
    const userId = req.user?.userId;
    const bookingId = Number(req.params.id);

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    if (Number.isNaN(bookingId)) {
      res.status(400).json({
        success: false,
        message: "Invalid booking ID",
      });

      return;
    }

    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        userId,
      },
    });

    if (!booking) {
      res.status(404).json({
        success: false,
        message: "Booking not found",
      });

      return;
    }

    if (booking.status === "CANCELLED") {
      res.status(400).json({
        success: false,
        message: "Booking is already cancelled",
      });

      return;
    }

    if (
      booking.status === "CHECKED_IN" ||
      booking.status === "CHECKED_OUT"
    ) {
      res.status(400).json({
        success: false,
        message: "This booking can no longer be cancelled",
      });

      return;
    }

    const cancelledBooking = await prisma.booking.update({
      where: {
        id: booking.id,
      },

      data: {
        status: "CANCELLED",
      },

      include: {
        room: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking: cancelledBooking,
    });
  } catch (error) {
    console.error("Failed to cancel booking:", error);

    res.status(500).json({
      success: false,
      message: "Failed to cancel booking",
    });
  }
}