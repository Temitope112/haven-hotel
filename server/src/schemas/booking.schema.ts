import { z } from "zod";

const dateSchema =
  z
    .string()
    .min(
      1,
      "Date is required.",
    )
    .refine(
      (value) =>
        !Number.isNaN(
          Date.parse(value),
        ),
      {
        message:
          "Invalid date.",
      },
    );

export const createBookingSchema =
  z
    .object({
      roomId:
        z
          .number()
          .int()
          .positive(),

      checkIn:
        dateSchema,

      checkOut:
        dateSchema,

      guests:
        z
          .number()
          .int()
          .min(1)
          .max(20),
    })
    .refine(
      (data) =>
        new Date(
          data.checkOut,
        ) >
        new Date(
          data.checkIn,
        ),
      {
        message:
          "Check-out must be after check-in.",
        path: [
          "checkOut",
        ],
      },
    );