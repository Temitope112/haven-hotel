import type {
  Request,
  Response,
} from "express";

import { prisma } from "../lib/prisma.js";
import { cloudinary } from "../lib/cloudinary.js";
const allowedBookingStatuses = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
  "CANCELLED",
] as const;

type BookingStatus =
  (typeof allowedBookingStatuses)[number];

const validTransitions: Record<
  BookingStatus,
  BookingStatus[]
> = {
  PENDING: [
    "CONFIRMED",
    "CANCELLED",
  ],

  CONFIRMED: [
    "CHECKED_IN",
    "CANCELLED",
  ],

  CHECKED_IN: [
    "CHECKED_OUT",
  ],

  CHECKED_OUT: [],

  CANCELLED: [],
};

function isBookingStatus(
  value: unknown,
): value is BookingStatus {
  return (
    typeof value === "string" &&
    allowedBookingStatuses.includes(
      value as BookingStatus,
    )
  );
}

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

    res.status(200).json({
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

    res.status(500).json({
      success: false,
      message:
        "Unable to load admin overview.",
    });
  }
}

export async function getAllBookings(
  req: Request,
  res: Response,
) {
  try {
    const bookings =
      await prisma.booking.findMany({
        include: {
          room: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              price: true,
            },
          },

          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    res.status(200).json({
      success: true,
      count:
        bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Admin bookings error:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load bookings.",
    });
  }
}

export async function updateBookingStatus(
  req: Request,
  res: Response,
) {
  try {
    const bookingId =
      Number(req.params.id);

    const {
      status,
    } = req.body;

    if (
      Number.isNaN(
        bookingId,
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid booking ID.",
      });

      return;
    }

    if (
      !isBookingStatus(
        status,
      )
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid booking status.",
      });

      return;
    }

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
      });

    if (!booking) {
      res.status(404).json({
        success: false,
        message:
          "Booking not found.",
      });

      return;
    }

    const currentStatus =
      booking.status as BookingStatus;

    const allowedNextStatuses =
      validTransitions[
        currentStatus
      ];

    if (
      !allowedNextStatuses.includes(
        status,
      )
    ) {
      res.status(400).json({
        success: false,
        message: `Cannot change booking from ${currentStatus} to ${status}.`,
      });

      return;
    }

    const updatedBooking =
      await prisma.booking.update({
        where: {
          id: bookingId,
        },

        data: {
          status,
        },

        include: {
          room: {
            select: {
              id: true,
              name: true,
              imageUrl: true,
              price: true,
            },
          },

          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

    res.status(200).json({
      success: true,
      message:
        "Booking status updated successfully.",
      booking:
        updatedBooking,
    });
  } catch (error) {
    console.error(
      "Update booking status error:",
      error,
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update booking status.",
    });
  }
}
export async function getAllRooms(
  req: Request,
  res: Response,
) {
  try {
    const rooms =
      await prisma.room.findMany({
        orderBy: {
          id: "asc",
        },

        include: {
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms: rooms.map(
        (room) => ({
          ...room,

          price:
            room.price.toString(),

          bookingCount:
            room._count
              .bookings,
        }),
      ),
    });
  } catch (error) {
    console.error(
      "Admin rooms error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load rooms.",
    });
  }
}

export async function createRoom(
  req: Request,
  res: Response,
) {
  try {
    const {
      name,
      description,
      price,
      capacity,
      imageUrl,
    } = req.body;

    if (
      !name?.trim() ||
      !description?.trim() ||
      price === undefined ||
      capacity === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, description, price and capacity are required.",
      });
    }

    const parsedPrice =
      Number(price);

    const parsedCapacity =
      Number(capacity);

    if (
      !Number.isFinite(
        parsedPrice,
      ) ||
      parsedPrice <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Price must be greater than zero.",
      });
    }

    if (
      !Number.isInteger(
        parsedCapacity,
      ) ||
      parsedCapacity <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Capacity must be a positive whole number.",
      });
    }

    const room =
      await prisma.room.create({
        data: {
          name:
            name.trim(),

          description:
            description.trim(),

          price:
            parsedPrice,

          capacity:
            parsedCapacity,

          imageUrl:
            imageUrl?.trim() ||
            "",
        },
      });

    return res.status(201).json({
      success: true,

      message:
        "Room created successfully.",

      room: {
        ...room,

        price:
          room.price.toString(),

        bookingCount: 0,
      },
    });
  } catch (error) {
    console.error(
      "Create room error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to create room.",
    });
  }
}

export async function updateRoom(
  req: Request,
  res: Response,
) {
  try {
    const roomId =
      Number(req.params.id);

    if (
      Number.isNaN(roomId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid room ID.",
      });
    }

    const existingRoom =
      await prisma.room.findUnique({
        where: {
          id: roomId,
        },
      });

    if (!existingRoom) {
      return res.status(404).json({
        success: false,
        message:
          "Room not found.",
      });
    }

    const {
      name,
      description,
      price,
      capacity,
      imageUrl,
    } = req.body;

    const parsedPrice =
      price !== undefined
        ? Number(price)
        : undefined;

    const parsedCapacity =
      capacity !== undefined
        ? Number(capacity)
        : undefined;

    if (
      parsedPrice !==
        undefined &&
      (!Number.isFinite(
        parsedPrice,
      ) ||
        parsedPrice <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Price must be greater than zero.",
      });
    }

    if (
      parsedCapacity !==
        undefined &&
      (!Number.isInteger(
        parsedCapacity,
      ) ||
        parsedCapacity <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Capacity must be a positive whole number.",
      });
    }

    const room =
      await prisma.room.update({
        where: {
          id: roomId,
        },

        data: {
          ...(name !== undefined && {
            name:
              name.trim(),
          }),

          ...(description !==
            undefined && {
            description:
              description.trim(),
          }),

          ...(parsedPrice !==
            undefined && {
            price:
              parsedPrice,
          }),

          ...(parsedCapacity !==
            undefined && {
            capacity:
              parsedCapacity,
          }),

          ...(imageUrl !==
            undefined && {
            imageUrl:
              imageUrl.trim(),
          }),
        },

        include: {
          _count: {
            select: {
              bookings: true,
            },
          },
        },
      });

    return res.status(200).json({
      success: true,

      message:
        "Room updated successfully.",

      room: {
        ...room,

        price:
          room.price.toString(),

        bookingCount:
          room._count
            .bookings,
      },
    });
  } catch (error) {
    console.error(
      "Update room error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update room.",
    });
  }
}
export async function uploadRoomImage(
  req: Request,
  res: Response,
) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "No image file provided.",
      });
    }

    const base64Image =
      `data:${req.file.mimetype};base64,${req.file.buffer.toString(
        "base64",
      )}`;

    const result =
      await cloudinary.uploader.upload(
        base64Image,
        {
          folder:
            "haven-hotel/rooms",

          transformation: [
            {
              width: 1600,
              height: 1100,
              crop: "fill",
              gravity: "auto",
              quality: "auto",
              fetch_format: "auto",
            },
          ],
        },
      );

    return res.status(201).json({
      success: true,
      imageUrl:
        result.secure_url,
      publicId:
        result.public_id,
    });
  } catch (error) {
    console.error(
      "Room image upload error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to upload room image.",
    });
  }
}
export async function getAllUsers(
  req: Request,
  res: Response,
) {
  try {
    const users =
      await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,

          _count: {
            select: {
              bookings: true,
            },
          },

          bookings: {
            select: {
              status: true,
              totalPrice: true,
            },
          },
        },

        orderBy: {
          createdAt: "desc",
        },
      });

    const formattedUsers =
      users.map((user) => {
        const totalSpent =
          user.bookings.reduce(
            (
              total,
              booking,
            ) => {
              const counted =
                [
                  "CONFIRMED",
                  "CHECKED_IN",
                  "CHECKED_OUT",
                ].includes(
                  booking.status,
                );

              if (!counted) {
                return total;
              }

              return (
                total +
                Number(
                  booking.totalPrice,
                )
              );
            },
            0,
          );

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt:
            user.createdAt,

          bookingCount:
            user._count
              .bookings,

          totalSpent:
            totalSpent.toString(),
        };
      });

    return res.status(200).json({
      success: true,
      count:
        formattedUsers.length,
      users:
        formattedUsers,
    });
  } catch (error) {
    console.error(
      "Admin users error:",
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load users.",
    });
  }
}