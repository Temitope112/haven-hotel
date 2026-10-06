import type {
  Request,
  Response,
} from "express";

import { prisma } from "../lib/prisma.js";

export async function getAdminOverview(
  req: Request,
  res: Response,
) {
  try {
    const [
      totalUsers,
      totalRooms,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      revenue,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.room.count(),

      prisma.booking.count(),

      prisma.booking.count({
        where: {
          status: "PENDING",
        },
      }),

      prisma.booking.count({
        where: {
          status: "CONFIRMED",
        },
      }),

      prisma.booking.count({
        where: {
          status: "CANCELLED",
        },
      }),

      prisma.booking.aggregate({
        where: {
          status: {
            in: [
              "CONFIRMED",
              "CHECKED_IN",
              "CHECKED_OUT",
            ],
          },
        },
        _sum: {
          totalPrice: true,
        },
      }),
    ]);

    return res.status(200).json({
      success: true,

      overview: {
        totalUsers,
        totalRooms,
        totalBookings,

        bookings: {
          pending:
            pendingBookings,
          confirmed:
            confirmedBookings,
          cancelled:
            cancelledBookings,
        },

        totalRevenue:
          revenue._sum
            .totalPrice
            ?.toString() ??
          "0",
      },
    });
  } catch (error) {
    console.error(
      "Admin overview error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load admin overview.",
    });
  }
}